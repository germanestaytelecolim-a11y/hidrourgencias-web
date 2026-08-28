import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import bcrypt from "bcryptjs";
import postgres from "postgres";

const roles = new Set(["admin", "editor", "collaborator"]);

async function main() {
  if (process.argv.some((arg) => arg.startsWith("--password"))) {
    throw new Error("No pases contraseñas por argumentos. Usa el prompt interactivo.");
  }

  const rl = readline.createInterface({ input, output });

  try {
    const name = (await rl.question("Nombre: ")).trim();
    const username = (await rl.question("Usuario: ")).trim().toLowerCase();
    const email = (await rl.question("Email (opcional): ")).trim().toLowerCase();
    const roleInput = (await rl.question("Rol [admin/editor/collaborator] (admin): ")).trim().toLowerCase();
    const password = await askHidden("Contraseña (10+ caracteres): ");
    const confirmPassword = await askHidden("Confirmar contraseña: ");

    if (!name || !username) throw new Error("Nombre y usuario son obligatorios.");
    if (password !== confirmPassword) throw new Error("La confirmación de contraseña no coincide.");
    if (password.trim().length < 10) throw new Error("La contraseña debe tener al menos 10 caracteres.");

    const role = roles.has(roleInput) ? roleInput : "admin";
    const now = new Date().toISOString();
    const user = {
      id: randomUUID(),
      name,
      username,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      passwordChangedAt: now,
      sessionVersion: 1,
    };

    if (process.env.POSTGRES_URL || process.env.DATABASE_URL) {
      await createPostgresUser(user);
    } else {
      await createLocalUser(user);
    }

    console.log(`Usuario creado: ${username}`);
  } finally {
    rl.close();
  }
}

async function askHidden(prompt) {
  if (!input.isTTY) {
    const rl = readline.createInterface({ input, output });
    try {
      return await rl.question(prompt);
    } finally {
      rl.close();
    }
  }

  output.write(prompt);
  input.setRawMode(true);
  input.resume();

  return await new Promise((resolve) => {
    let value = "";
    const onData = (buffer) => {
      const char = buffer.toString("utf8");
      if (char === "\r" || char === "\n") {
        input.setRawMode(false);
        input.off("data", onData);
        output.write("\n");
        resolve(value);
        return;
      }
      if (char === "\u0003") {
        process.exit(130);
      }
      if (char === "\b" || char === "\u007f") {
        value = value.slice(0, -1);
        return;
      }
      value += char;
    };
    input.on("data", onData);
  });
}

async function createLocalUser(user) {
  const filePath = path.join(process.cwd(), ".admin-data", "admin-db.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  let data = { users: [], sessions: [], workCases: [], media: [], audit: [], loginAttempts: [] };

  try {
    data = { ...data, ...JSON.parse(await fs.readFile(filePath, "utf8")) };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  if (data.users.some((existing) => existing.username === user.username)) {
    throw new Error("Ya existe un usuario con ese username.");
  }

  data.users.push(user);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function createPostgresUser(user) {
  const sql = postgres(process.env.POSTGRES_URL || process.env.DATABASE_URL, { ssl: "require", max: 1 });
  try {
    await sql`
      insert into admin_users (id, name, username, email, password_hash, role, is_active, created_at, updated_at, password_changed_at, session_version)
      values (${user.id}, ${user.name}, ${user.username}, ${user.email}, ${user.passwordHash}, ${user.role}, ${user.isActive}, ${user.createdAt}, ${user.updatedAt}, ${user.passwordChangedAt}, ${user.sessionVersion})
    `;
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
