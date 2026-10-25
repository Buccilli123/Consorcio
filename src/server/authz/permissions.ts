import type { MembershipRole } from "@/generated/prisma/enums";

/**
 * Permisos por rol dentro de un consorcio.
 *
 * Esta matriz responde "qué tipo de acción puede hacer un rol". Las reglas que
 * dependen del recurso (por ejemplo, "solo los reclamos de mi unidad" o "solo los
 * reclamos asignados a mí") se verifican además en cada módulo.
 * Documentación: obsidian-vault/01 Producto/Roles y permisos.md
 */
export const PERMISSIONS = [
  "consortium.read",
  "consortium.manage",
  "unit.read",
  "unit.manage",
  "member.read",
  "member.manage",
  "notice.read",
  "notice.publish",
  "claim.create",
  "claim.read.own",
  "claim.read.assigned",
  "claim.read.all",
  "claim.update.assigned",
  "claim.manage",
  "booking.create",
  "booking.manage",
  "document.read",
  "document.manage",
  "expense.read.own",
  "expense.manage",
  "audit.read",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

// Propietarios e inquilinos: "own" significa "de las unidades asignadas a su
// membresía". El módulo correspondiente verifica esa asignación.
const RESIDENT: readonly Permission[] = [
  "consortium.read",
  "notice.read",
  "claim.create",
  "claim.read.own",
  "booking.create",
  "document.read",
  "expense.read.own",
];

const ROLE_PERMISSIONS: Record<MembershipRole, ReadonlySet<Permission>> = {
  // El administrador gestiona todo su consorcio.
  ADMIN: new Set(PERMISSIONS),
  OWNER: new Set(RESIDENT),
  // Decisión 2026-10-25: el inquilino ve las expensas de su unidad (importes,
  // vencimientos y estado de pago), igual que el propietario.
  TENANT: new Set(RESIDENT),
  STAFF: new Set<Permission>([
    "consortium.read",
    "notice.read",
    "claim.read.assigned",
    "claim.update.assigned",
  ]),
};

export function roleCan(role: MembershipRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].has(permission);
}

/** Un usuario puede tener varios roles en un consorcio: alcanza con que uno lo permita. */
export function rolesCan(roles: readonly MembershipRole[], permission: Permission): boolean {
  return roles.some((role) => roleCan(role, permission));
}
