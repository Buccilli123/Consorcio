import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { createConsortium, createUser, disconnectAll, resetDatabase } from "./helpers";

// Reglas que la base garantiza aunque falle la lógica de la aplicación.
describe("restricciones del esquema", () => {
  beforeEach(resetDatabase);
  afterAll(disconnectAll);

  describe("aislamiento entre consorcios", () => {
    it("rechaza asignar una unidad de un consorcio a una membresía de otro", async () => {
      const user = await createUser();
      const a = await createConsortium("A");
      const b = await createConsortium("B");
      const unitA = await db().unit.create({ data: { consortiumId: a.id, code: "1A", coefficient: "10" } });
      const membershipB = await db().membership.create({
        data: { userId: user.id, consortiumId: b.id, role: "OWNER" },
      });

      // Con el consorcio A falla la FK hacia la membresía; con el B, la FK hacia la unidad.
      await expect(
        db().unitAssignment.create({ data: { consortiumId: a.id, unitId: unitA.id, membershipId: membershipB.id } }),
      ).rejects.toThrow(/UnitAssignment_consortiumId_membershipId_fkey/);
      await expect(
        db().unitAssignment.create({ data: { consortiumId: b.id, unitId: unitA.id, membershipId: membershipB.id } }),
      ).rejects.toThrow(/UnitAssignment_consortiumId_unitId_fkey/);
      expect(await db().unitAssignment.count()).toBe(0);
    });

    it("permite asignar dentro del mismo consorcio", async () => {
      const user = await createUser();
      const a = await createConsortium();
      const unit = await db().unit.create({ data: { consortiumId: a.id, code: "1A", coefficient: "10" } });
      const membership = await db().membership.create({
        data: { userId: user.id, consortiumId: a.id, role: "OWNER" },
      });

      await db().unitAssignment.create({ data: { consortiumId: a.id, unitId: unit.id, membershipId: membership.id } });

      expect(await db().unitAssignment.count()).toBe(1);
    });

    it("el código de unidad es único por consorcio, no globalmente", async () => {
      const a = await createConsortium("A");
      const b = await createConsortium("B");
      await db().unit.create({ data: { consortiumId: a.id, code: "3B", coefficient: "5" } });

      await expect(
        db().unit.create({ data: { consortiumId: a.id, code: "3B", coefficient: "5" } }),
      ).rejects.toThrow();
      await expect(
        db().unit.create({ data: { consortiumId: b.id, code: "3B", coefficient: "5" } }),
      ).resolves.toBeDefined();
    });
  });

  describe("unidades", () => {
    it.each(["0", "-1", "100.0001"])("rechaza el coeficiente %s", async (coefficient) => {
      const a = await createConsortium();
      await expect(db().unit.create({ data: { consortiumId: a.id, code: "X", coefficient } })).rejects.toThrow(
        /Unit_coefficient_range_check/,
      );
    });

    it.each(["0.0001", "100"])("acepta el coeficiente límite %s", async (coefficient) => {
      const a = await createConsortium();
      const unit = await db().unit.create({ data: { consortiumId: a.id, code: "X", coefficient } });
      expect(unit.coefficient.toString()).toBe(coefficient);
    });

    it("rechaza un código vacío", async () => {
      const a = await createConsortium();
      await expect(db().unit.create({ data: { consortiumId: a.id, code: "  ", coefficient: "1" } })).rejects.toThrow(
        /Unit_code_not_blank_check/,
      );
    });
  });

  describe("usuarios y membresías", () => {
    it("rechaza emails con mayúsculas (deben normalizarse antes)", async () => {
      await expect(
        db().user.create({ data: { email: "Ana@Ejemplo.test", name: "Ana", passwordHash: "x" } }),
      ).rejects.toThrow(/User_email_lowercase_check/);
    });

    it("no permite repetir el mismo rol en el mismo consorcio", async () => {
      const user = await createUser();
      const a = await createConsortium();
      await db().membership.create({ data: { userId: user.id, consortiumId: a.id, role: "OWNER" } });

      await expect(
        db().membership.create({ data: { userId: user.id, consortiumId: a.id, role: "OWNER" } }),
      ).rejects.toThrow();
    });

    it("no permite borrar un consorcio con unidades", async () => {
      const a = await createConsortium();
      await db().unit.create({ data: { consortiumId: a.id, code: "1", coefficient: "1" } });

      await expect(db().consortium.delete({ where: { id: a.id } })).rejects.toThrow();
    });
  });

  describe("auditoría", () => {
    it("es de solo inserción: rechaza modificar y borrar", async () => {
      const event = await db().auditEvent.create({ data: { action: "test.create", entityType: "Test" } });

      await expect(
        db().auditEvent.update({ where: { id: event.id }, data: { action: "test.tampered" } }),
      ).rejects.toThrow(/solo inserción/);
      await expect(db().auditEvent.delete({ where: { id: event.id } })).rejects.toThrow(/solo inserción/);
      expect((await db().auditEvent.findUniqueOrThrow({ where: { id: event.id } })).action).toBe("test.create");
    });
  });
});
