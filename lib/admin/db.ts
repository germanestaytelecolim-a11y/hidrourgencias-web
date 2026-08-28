import fs from "node:fs/promises";
import path from "node:path";
import { createHash, randomBytes, randomUUID } from "node:crypto";

import { migrateAdminSchema } from "@/lib/admin/schema";
import type { AdminBlogPost, AdminSession, AdminUser, AuditEvent, LoginAttempt, MediaAsset, WorkCase } from "@/lib/admin/types";

type AdminData = {
  users: AdminUser[];
  sessions: AdminSession[];
  workCases: WorkCase[];
  blogPosts: AdminBlogPost[];
  media: MediaAsset[];
  audit: AuditEvent[];
  loginAttempts: LoginAttempt[];
};

const emptyData = (): AdminData => ({
  users: [],
  sessions: [],
  workCases: [],
  blogPosts: [],
  media: [],
  audit: [],
  loginAttempts: [],
});

const localDataPath = path.join(process.cwd(), ".admin-data", "admin-db.json");

async function readLocalData(): Promise<AdminData> {
  await fs.mkdir(path.dirname(localDataPath), { recursive: true });

  try {
    const raw = await fs.readFile(localDataPath, "utf8");
    return { ...emptyData(), ...JSON.parse(raw) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const initial = emptyData();
    await writeLocalData(initial);
    return initial;
  }
}

async function writeLocalData(data: AdminData) {
  await fs.mkdir(path.dirname(localDataPath), { recursive: true });
  await fs.writeFile(localDataPath, JSON.stringify(data, null, 2));
}

export async function getAdminSql() {
  const postgres = (await import("postgres")).default;
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Falta POSTGRES_URL o DATABASE_URL para usar el panel admin en producción.");
  }

  return postgres(connectionString, { ssl: "require", max: 1 });
}

export async function runAdminMigrations() {
  const sql = await getAdminSql();
  await migrateAdminSchema(sql);
  await sql.end();
}

function rowToUser(row: Record<string, unknown>): AdminUser {
  return {
    id: String(row.id),
    name: String(row.name),
    username: String(row.username),
    email: String(row.email),
    passwordHash: String(row.password_hash),
    role: row.role as AdminUser["role"],
    isActive: Boolean(row.is_active),
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
    lastLoginAt: row.last_login_at ? new Date(String(row.last_login_at)).toISOString() : undefined,
    passwordChangedAt: row.password_changed_at ? new Date(String(row.password_changed_at)).toISOString() : undefined,
    sessionVersion: Number(row.session_version),
  };
}

function shouldUseLocalDriver() {
  return process.env.NODE_ENV !== "production" || process.env.ADMIN_STORAGE_DRIVER === "local";
}

export async function ensureAdminDataStore() {
  if (shouldUseLocalDriver()) {
    await readLocalData();
    return;
  }
}

export async function listUsers() {
  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    const rows = await sql`select * from admin_users order by created_at asc`;
    return rows.map(rowToUser);
  }

  return (await readLocalData()).users;
}

export async function getUserByUsername(username: string) {
  const normalized = username.trim().toLowerCase();

  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    const rows = await sql`select * from admin_users where username = ${normalized} limit 1`;
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  return (await readLocalData()).users.find((user) => user.username === normalized) ?? null;
}

export async function getUserById(id: string) {
  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    const rows = await sql`select * from admin_users where id = ${id} limit 1`;
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  return (await readLocalData()).users.find((user) => user.id === id) ?? null;
}

export async function createAdminUser(input: Pick<AdminUser, "name" | "username" | "email" | "passwordHash" | "role">) {
  const now = new Date().toISOString();
  const user: AdminUser = {
    id: randomUUID(),
    name: input.name.trim(),
    username: input.username.trim().toLowerCase(),
    email: input.email.trim().toLowerCase(),
    passwordHash: input.passwordHash,
    role: input.role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    passwordChangedAt: now,
    sessionVersion: 1,
  };

  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    await sql`
      insert into admin_users (id, name, username, email, password_hash, role, is_active, created_at, updated_at, password_changed_at, session_version)
      values (${user.id}, ${user.name}, ${user.username}, ${user.email}, ${user.passwordHash}, ${user.role}, ${user.isActive}, ${user.createdAt}, ${user.updatedAt}, ${user.passwordChangedAt ?? null}, ${user.sessionVersion})
    `;
    return user;
  }

  const data = await readLocalData();
  if (data.users.some((existing) => existing.username === user.username)) {
    throw new Error("Ya existe un usuario con ese username.");
  }
  data.users.push(user);
  await writeLocalData(data);
  return user;
}

export async function updateUserLogin(userId: string) {
  const now = new Date().toISOString();

  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    await sql`update admin_users set last_login_at = ${now}, updated_at = ${now} where id = ${userId}`;
    return;
  }

  const data = await readLocalData();
  const user = data.users.find((item) => item.id === userId);
  if (user) {
    user.lastLoginAt = now;
    user.updatedAt = now;
    await writeLocalData(data);
  }
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  const now = new Date().toISOString();

  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    await sql`
      update admin_users
      set password_hash = ${passwordHash}, password_changed_at = ${now}, updated_at = ${now}, session_version = session_version + 1
      where id = ${userId}
    `;
    await sql`delete from admin_sessions where user_id = ${userId}`;
    return;
  }

  const data = await readLocalData();
  const user = data.users.find((item) => item.id === userId);
  if (user) {
    user.passwordHash = passwordHash;
    user.passwordChangedAt = now;
    user.updatedAt = now;
    user.sessionVersion += 1;
    data.sessions = data.sessions.filter((session) => session.userId !== userId);
    await writeLocalData(data);
  }
}

export async function createSession(user: AdminUser) {
  const now = new Date();
  const session: AdminSession = {
    id: randomBytes(32).toString("base64url"),
    userId: user.id,
    sessionVersion: user.sessionVersion,
    csrfToken: randomBytes(32).toString("base64url"),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 12).toISOString(),
  };

  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    await sql`
      insert into admin_sessions (id, user_id, session_version, csrf_token, expires_at, created_at)
      values (${session.id}, ${session.userId}, ${session.sessionVersion}, ${session.csrfToken}, ${session.expiresAt}, ${session.createdAt})
    `;
    return session;
  }

  const data = await readLocalData();
  data.sessions.push(session);
  await writeLocalData(data);
  return session;
}

export async function getSession(sessionId: string) {
  const now = Date.now();

  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    const rows = await sql`
      select s.id, s.user_id, s.session_version, s.csrf_token, s.expires_at, s.created_at
      from admin_sessions s
      where s.id = ${sessionId} and s.expires_at > now()
      limit 1
    `;
    if (!rows[0]) return null;
    return {
      id: String(rows[0].id),
      userId: String(rows[0].user_id),
      sessionVersion: Number(rows[0].session_version),
      csrfToken: String(rows[0].csrf_token),
      expiresAt: new Date(String(rows[0].expires_at)).toISOString(),
      createdAt: new Date(String(rows[0].created_at)).toISOString(),
    } satisfies AdminSession;
  }

  const data = await readLocalData();
  data.sessions = data.sessions.filter((session) => new Date(session.expiresAt).getTime() > now);
  await writeLocalData(data);
  const session = data.sessions.find((item) => item.id === sessionId) ?? null;
  if (session && !session.csrfToken) {
    session.csrfToken = randomBytes(32).toString("base64url");
    await writeLocalData(data);
  }
  return session;
}

export async function deleteSession(sessionId: string) {
  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    await sql`delete from admin_sessions where id = ${sessionId}`;
    return;
  }

  const data = await readLocalData();
  data.sessions = data.sessions.filter((session) => session.id !== sessionId);
  await writeLocalData(data);
}

export async function listWorkCases() {
  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    try {
      const rows = await sql`select data from admin_work_cases order by updated_at desc`;
      return rows.map((row) => row.data as WorkCase);
    } finally {
      await sql.end();
    }
  }

  return (await readLocalData()).workCases.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getWorkCase(id: string) {
  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    try {
      const rows = await sql`select data from admin_work_cases where id = ${id} limit 1`;
      return rows[0] ? (rows[0].data as WorkCase) : null;
    } finally {
      await sql.end();
    }
  }

  return (await readLocalData()).workCases.find((item) => item.id === id) ?? null;
}

export async function saveWorkCase(workCase: WorkCase) {
  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    try {
      await sql`
        insert into admin_work_cases (id, data, status, slug, created_at, updated_at)
        values (${workCase.id}, ${sql.json(workCase)}, ${workCase.status}, ${workCase.slug}, ${workCase.createdAt}, ${workCase.updatedAt})
        on conflict (id) do update set data = excluded.data, status = excluded.status, slug = excluded.slug, updated_at = excluded.updated_at
      `;
    } finally {
      await sql.end();
    }
    return workCase;
  }

  const data = await readLocalData();
  const index = data.workCases.findIndex((item) => item.id === workCase.id);
  if (index >= 0) data.workCases[index] = workCase;
  else data.workCases.push(workCase);
  await writeLocalData(data);
  return workCase;
}

export async function createMediaAsset(asset: MediaAsset) {
  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    try {
      await sql`
        insert into admin_media_assets (id, data, work_case_id, blog_post_id, created_at)
        values (${asset.id}, ${sql.json(asset)}, ${asset.workCaseId ?? null}, ${asset.blogPostId ?? null}, ${asset.createdAt})
        on conflict (id) do update set data = excluded.data, work_case_id = excluded.work_case_id, blog_post_id = excluded.blog_post_id
      `;
    } finally {
      await sql.end();
    }
    return asset;
  }

  const data = await readLocalData();
  data.media.push(asset);
  await writeLocalData(data);
  return asset;
}

export async function writeAudit(action: string, userId?: string, metadata?: AuditEvent["metadata"]) {
  const event: AuditEvent = { id: randomUUID(), action, userId, metadata, createdAt: new Date().toISOString() };

  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    await sql`
      insert into admin_audit_events (id, user_id, action, created_at, metadata)
      values (${event.id}, ${event.userId ?? null}, ${event.action}, ${event.createdAt}, ${metadata ? sql.json(metadata) : null})
    `;
    return;
  }

  const data = await readLocalData();
  data.audit.push(event);
  await writeLocalData(data);
}

export async function getRecentFailedLoginAttempts(username: string, ip: string) {
  const cutoff = Date.now() - 15 * 60 * 1000;
  const ipHash = hashRateLimitIdentifier(ip);

  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    const rows = await sql`
      select count(*)::int as count
      from admin_login_attempts
      where username = ${username.toLowerCase()} and ip_hash = ${ipHash} and success = false and created_at > ${new Date(cutoff).toISOString()}
    `;
    return Number(rows[0]?.count ?? 0);
  }

  return (await readLocalData()).loginAttempts.filter(
    (attempt) =>
      attempt.username === username.toLowerCase() &&
      attempt.ip === ipHash &&
      !attempt.success &&
      new Date(attempt.createdAt).getTime() > cutoff,
  ).length;
}

export async function recordLoginAttempt(username: string, ip: string, success: boolean) {
  const attempt: LoginAttempt = {
    id: randomUUID(),
    username: username.toLowerCase(),
    ip: hashRateLimitIdentifier(ip),
    success,
    createdAt: new Date().toISOString(),
  };

  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    await sql`
      insert into admin_login_attempts (id, username, ip_hash, success, created_at)
      values (${attempt.id}, ${attempt.username}, ${attempt.ip}, ${attempt.success}, ${attempt.createdAt})
    `;
    return;
  }

  const data = await readLocalData();
  data.loginAttempts.push(attempt);
  await writeLocalData(data);
}

export async function listBlogPosts() {
  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    try {
      const rows = await sql`select data from admin_blog_posts order by updated_at desc`;
      return rows.map((row) => row.data as AdminBlogPost);
    } finally {
      await sql.end();
    }
  }

  return (await readLocalData()).blogPosts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getBlogPost(id: string) {
  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    try {
      const rows = await sql`select data from admin_blog_posts where id = ${id} limit 1`;
      return rows[0] ? (rows[0].data as AdminBlogPost) : null;
    } finally {
      await sql.end();
    }
  }

  return (await readLocalData()).blogPosts.find((item) => item.id === id) ?? null;
}

export async function getBlogPostBySlugAdmin(slug: string) {
  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    try {
      const rows = await sql`select data from admin_blog_posts where slug = ${slug} limit 1`;
      return rows[0] ? (rows[0].data as AdminBlogPost) : null;
    } finally {
      await sql.end();
    }
  }

  return (await readLocalData()).blogPosts.find((item) => item.slug === slug) ?? null;
}

export async function saveBlogPost(blogPost: AdminBlogPost) {
  if (!shouldUseLocalDriver()) {
    const sql = await getAdminSql();
    try {
      await sql`
        insert into admin_blog_posts (id, data, status, slug, featured, created_at, updated_at, published_at)
        values (${blogPost.id}, ${sql.json(blogPost)}, ${blogPost.status}, ${blogPost.slug}, ${blogPost.featured}, ${blogPost.createdAt}, ${blogPost.updatedAt}, ${blogPost.publishedAt ?? null})
        on conflict (id) do update set data = excluded.data, status = excluded.status, slug = excluded.slug, featured = excluded.featured, updated_at = excluded.updated_at, published_at = excluded.published_at
      `;
    } finally {
      await sql.end();
    }
    return blogPost;
  }

  const data = await readLocalData();
  const index = data.blogPosts.findIndex((item) => item.id === blogPost.id || item.slug === blogPost.slug);
  if (index >= 0) data.blogPosts[index] = blogPost;
  else data.blogPosts.push(blogPost);
  await writeLocalData(data);
  return blogPost;
}

function hashRateLimitIdentifier(value: string) {
  const salt = process.env.ADMIN_RATE_LIMIT_SALT || "hidrourgencias-admin-rate-limit";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

export { randomUUID as createAdminId };
