import type { Sql } from "postgres";

export async function migrateAdminSchema(sql: Sql) {
  await sql`
    create table if not exists admin_users (
      id text primary key,
      name text not null,
      username text not null unique,
      email text not null,
      password_hash text not null,
      role text not null,
      is_active boolean not null default true,
      created_at timestamptz not null,
      updated_at timestamptz not null,
      last_login_at timestamptz,
      password_changed_at timestamptz,
      session_version integer not null default 1
    )
  `;
  await sql`create unique index if not exists admin_users_username_idx on admin_users (username)`;

  await sql`
    create table if not exists admin_sessions (
      id text primary key,
      user_id text not null references admin_users(id) on delete cascade,
      session_version integer not null,
      csrf_token text not null,
      expires_at timestamptz not null,
      created_at timestamptz not null
    )
  `;
  await sql`create index if not exists admin_sessions_user_id_idx on admin_sessions (user_id)`;
  await sql`create index if not exists admin_sessions_expires_at_idx on admin_sessions (expires_at)`;

  await sql`
    create table if not exists admin_work_cases (
      id text primary key,
      data jsonb not null,
      status text not null,
      slug text not null unique,
      created_at timestamptz not null,
      updated_at timestamptz not null
    )
  `;
  await sql`create unique index if not exists admin_work_cases_slug_idx on admin_work_cases (slug)`;
  await sql`create index if not exists admin_work_cases_status_updated_idx on admin_work_cases (status, updated_at desc)`;

  await sql`
    create table if not exists admin_media_assets (
      id text primary key,
      data jsonb not null,
      work_case_id text,
      blog_post_id text,
      created_at timestamptz not null
    )
  `;
  await sql`alter table admin_media_assets add column if not exists blog_post_id text`;
  await sql`create index if not exists admin_media_assets_work_case_id_idx on admin_media_assets (work_case_id)`;
  await sql`create index if not exists admin_media_assets_blog_post_id_idx on admin_media_assets (blog_post_id)`;

  await sql`
    create table if not exists admin_blog_posts (
      id text primary key,
      data jsonb not null,
      status text not null,
      slug text not null unique,
      featured boolean not null default false,
      created_at timestamptz not null,
      updated_at timestamptz not null,
      published_at timestamptz
    )
  `;
  await sql`create unique index if not exists admin_blog_posts_slug_idx on admin_blog_posts (slug)`;
  await sql`create index if not exists admin_blog_posts_status_updated_idx on admin_blog_posts (status, updated_at desc)`;
  await sql`create index if not exists admin_blog_posts_featured_idx on admin_blog_posts (featured, status, updated_at desc)`;

  await sql`
    create table if not exists admin_audit_events (
      id text primary key,
      user_id text,
      action text not null,
      created_at timestamptz not null,
      metadata jsonb
    )
  `;
  await sql`create index if not exists admin_audit_events_created_at_idx on admin_audit_events (created_at desc)`;
  await sql`create index if not exists admin_audit_events_user_id_idx on admin_audit_events (user_id)`;

  await sql`
    create table if not exists admin_login_attempts (
      id text primary key,
      username text not null,
      ip_hash text not null,
      success boolean not null,
      created_at timestamptz not null
    )
  `;
  await sql`create index if not exists admin_login_attempts_window_idx on admin_login_attempts (username, ip_hash, success, created_at desc)`;
}
