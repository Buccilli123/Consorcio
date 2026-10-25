import { describe, expect, it } from "vitest";
import { MembershipRole } from "@/generated/prisma/enums";
import { PERMISSIONS, roleCan, rolesCan, type Permission } from "./permissions";

const ALL_ROLES = Object.values(MembershipRole);

describe("matriz de permisos", () => {
  it("el administrador tiene todos los permisos", () => {
    for (const permission of PERMISSIONS) {
      expect(roleCan("ADMIN", permission), permission).toBe(true);
    }
  });

  it.each<[Permission, MembershipRole[]]>([
    ["consortium.manage", ["ADMIN"]],
    ["unit.manage", ["ADMIN"]],
    ["member.manage", ["ADMIN"]],
    ["member.read", ["ADMIN"]],
    ["notice.publish", ["ADMIN"]],
    ["claim.read.all", ["ADMIN"]],
    ["claim.manage", ["ADMIN"]],
    ["booking.manage", ["ADMIN"]],
    ["document.manage", ["ADMIN"]],
    ["expense.manage", ["ADMIN"]],
    ["audit.read", ["ADMIN"]],
    ["expense.read.own", ["ADMIN", "OWNER", "TENANT"]],
    ["claim.create", ["ADMIN", "OWNER", "TENANT"]],
    ["booking.create", ["ADMIN", "OWNER", "TENANT"]],
    ["claim.update.assigned", ["ADMIN", "STAFF"]],
    ["notice.read", ["ADMIN", "OWNER", "TENANT", "STAFF"]],
  ])("%s solo lo tienen %j", (permission, allowed) => {
    const actual = ALL_ROLES.filter((role) => roleCan(role, permission));
    expect(actual.sort()).toEqual([...allowed].sort());
  });

  it("propietario e inquilino ven sus expensas pero no las gestionan", () => {
    for (const role of ["OWNER", "TENANT"] as const) {
      expect(roleCan(role, "expense.read.own"), role).toBe(true);
      expect(roleCan(role, "expense.manage"), role).toBe(false);
    }
  });

  it("propietario e inquilino tienen exactamente los mismos permisos", () => {
    const of = (role: MembershipRole) => PERMISSIONS.filter((p) => roleCan(role, p));
    expect(of("TENANT")).toEqual(of("OWNER"));
  });

  it("el personal operativo no crea reclamos ni ve documentos", () => {
    expect(roleCan("STAFF", "claim.create")).toBe(false);
    expect(roleCan("STAFF", "document.read")).toBe(false);
  });
});

describe("rolesCan con varios roles", () => {
  it("alcanza con que un rol otorgue el permiso", () => {
    expect(rolesCan(["STAFF", "OWNER"], "expense.read.own")).toBe(true);
    expect(rolesCan(["STAFF", "OWNER"], "claim.update.assigned")).toBe(true);
  });

  it("sin roles no hay ningún permiso", () => {
    for (const permission of PERMISSIONS) {
      expect(rolesCan([], permission)).toBe(false);
    }
  });
});
