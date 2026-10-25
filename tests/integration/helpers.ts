import type { PrismaClient } from "@/generated/prisma/client";
import { createPrismaClient, db } from "@/lib/db";
import { testMigrateDatabaseUrl } from "./test-database";

const TABLES = ["AuditEvent", "UnitAssignment", "Membership", "Unit", "Session", "Consortium", "User"];

let adminClient: PrismaClient | undefined;

/**
 * Cliente con el rol migrador. La app no tiene permiso de TRUNCATE, así que la
 * limpieza entre tests se hace con este rol.
 */
export function migratorDb(): PrismaClient {
  adminClient ??= createPrismaClient(testMigrateDatabaseUrl());
  return adminClient;
}

/** Vacía las tablas de la base de pruebas. Antes reconfirma, contra la propia base, que es una "_test". */
export async function resetDatabase(): Promise<void> {
  const [row] = await migratorDb().$queryRaw<{ name: string }[]>`SELECT current_database() AS name`;
  if (!row.name.endsWith("_test")) {
    throw new Error(`Se negó a limpiar "${row.name}": no es una base de pruebas.`);
  }
  const list = TABLES.map((table) => `"${table}"`).join(", ");
  await migratorDb().$executeRawUnsafe(`TRUNCATE ${list} RESTART IDENTITY CASCADE`);
}

export async function disconnectAll(): Promise<void> {
  await Promise.all([db().$disconnect(), adminClient?.$disconnect()]);
}

let sequence = 0;

export async function createUser(name = "Usuario") {
  sequence += 1;
  return db().user.create({
    data: { email: `usuario${sequence}@ejemplo.test`, name, passwordHash: "hash-ficticio" },
  });
}

export async function createConsortium(name = "Consorcio de prueba") {
  return db().consortium.create({ data: { name } });
}
