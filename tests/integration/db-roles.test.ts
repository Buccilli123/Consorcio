import { afterAll, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { disconnectAll } from "./helpers";

// La app se conecta con un rol de mínimo privilegio (ADR-005): solo lee y escribe filas.
describe("rol de base de datos de la aplicación", () => {
  afterAll(disconnectAll);

  it("no es superusuario ni puede crear bases o roles", async () => {
    const [role] = await db().$queryRaw<{ name: string; superuser: boolean; createdb: boolean; createrole: boolean }[]>`
      SELECT rolname AS name, rolsuper AS superuser, rolcreatedb AS createdb, rolcreaterole AS createrole
      FROM pg_roles WHERE rolname = current_user`;
    expect(role.name).not.toBe("postgres");
    expect(role).toMatchObject({ superuser: false, createdb: false, createrole: false });
  });

  it("no puede crear tablas (sin DDL)", async () => {
    await expect(db().$executeRawUnsafe(`CREATE TABLE "intruso" (id int)`)).rejects.toThrow(/permiso|permission/i);
  });

  it("no puede vaciar tablas con TRUNCATE (evitaría el trigger de auditoría)", async () => {
    await expect(db().$executeRawUnsafe(`TRUNCATE "AuditEvent"`)).rejects.toThrow(/permiso|permission/i);
  });

  it("no puede leer ni alterar el historial de migraciones", async () => {
    await expect(db().$queryRawUnsafe(`SELECT count(*) FROM "_prisma_migrations"`)).rejects.toThrow(
      /permiso|permission/i,
    );
  });

  it("no puede desactivar el trigger de auditoría", async () => {
    await expect(
      db().$executeRawUnsafe(`ALTER TABLE "AuditEvent" DISABLE TRIGGER "AuditEvent_immutable"`),
    ).rejects.toThrow(/dueño|owner|permiso|permission/i);
  });
});
