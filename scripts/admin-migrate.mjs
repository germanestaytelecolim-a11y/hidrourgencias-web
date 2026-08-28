import postgres from "postgres";
import { migrateAdminSchema } from "../lib/admin/schema.ts";

async function main() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Falta POSTGRES_URL o DATABASE_URL. Configura una base de datos Preview antes de migrar.");
  }

  const sql = postgres(connectionString, { ssl: "require", max: 1 });

  try {
    await migrateAdminSchema(sql);

    console.log("Migración admin completada.");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
