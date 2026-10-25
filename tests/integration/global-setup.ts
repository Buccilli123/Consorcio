import { execFileSync } from "node:child_process";
import { testDatabaseUrl, testMigrateDatabaseUrl } from "./test-database";

/** Aplica las migraciones pendientes a la base de pruebas (migrate deploy no borra datos). */
export default function setup(): void {
  let migrateUrl: string;
  try {
    testDatabaseUrl();
    migrateUrl = testMigrateDatabaseUrl();
  } catch (error) {
    // Vitest puede fallar al formatear errores de globalSetup: se imprime el motivo antes de cortar.
    console.error(`\n[tests de integración] ${(error as Error).message}\n`);
    throw error;
  }
  execFileSync(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"], {
    env: { ...process.env, MIGRATE_DATABASE_URL: migrateUrl },
    stdio: "pipe",
  });
}
