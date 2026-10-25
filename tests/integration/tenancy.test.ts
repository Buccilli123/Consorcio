import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { ForbiddenError, NotFoundError } from "@/server/errors";
import { assertCan, can, resolveTenantContext } from "@/server/tenancy";
import { createConsortium, createUser, disconnectAll, resetDatabase } from "./helpers";

describe("resolveTenantContext", () => {
  beforeEach(resetDatabase);
  afterAll(disconnectAll);

  it("devuelve los roles activos del usuario en el consorcio", async () => {
    const user = await createUser();
    const consortium = await createConsortium();
    await db().membership.createMany({
      data: [
        { userId: user.id, consortiumId: consortium.id, role: "STAFF" },
        { userId: user.id, consortiumId: consortium.id, role: "OWNER" },
      ],
    });

    const ctx = await resolveTenantContext(db(), user.id, consortium.id);

    expect(ctx).toEqual({ userId: user.id, consortiumId: consortium.id, roles: ["OWNER", "STAFF"] });
  });

  it("no da acceso a un consorcio del que el usuario no es miembro", async () => {
    const user = await createUser();
    const own = await createConsortium("Propio");
    const other = await createConsortium("Ajeno");
    await db().membership.create({ data: { userId: user.id, consortiumId: own.id, role: "ADMIN" } });

    await expect(resolveTenantContext(db(), user.id, other.id)).rejects.toThrow(NotFoundError);
  });

  it("responde igual si el consorcio no existe, para no revelar cuáles existen", async () => {
    const user = await createUser();
    const missingId = "019a0000-0000-7000-8000-000000000000";

    await expect(resolveTenantContext(db(), user.id, missingId)).rejects.toThrow(NotFoundError);
  });

  it("ignora membresías suspendidas", async () => {
    const user = await createUser();
    const consortium = await createConsortium();
    await db().membership.create({
      data: { userId: user.id, consortiumId: consortium.id, role: "ADMIN", status: "SUSPENDED" },
    });

    await expect(resolveTenantContext(db(), user.id, consortium.id)).rejects.toThrow(NotFoundError);
  });

  it("el rol de administrador en un consorcio no da permisos en otro", async () => {
    const user = await createUser();
    const a = await createConsortium("A");
    const b = await createConsortium("B");
    await db().membership.createMany({
      data: [
        { userId: user.id, consortiumId: a.id, role: "ADMIN" },
        { userId: user.id, consortiumId: b.id, role: "TENANT" },
      ],
    });

    const ctxA = await resolveTenantContext(db(), user.id, a.id);
    const ctxB = await resolveTenantContext(db(), user.id, b.id);

    expect(can(ctxA, "member.manage")).toBe(true);
    expect(can(ctxB, "member.manage")).toBe(false);
    expect(() => assertCan(ctxB, "member.manage")).toThrow(ForbiddenError);
  });
});
