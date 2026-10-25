import "server-only";

import type { PrismaClient } from "@/generated/prisma/client";
import type { MembershipRole } from "@/generated/prisma/enums";
import { rolesCan, type Permission } from "@/server/authz/permissions";
import { ForbiddenError, NotFoundError } from "@/server/errors";

/**
 * Contexto de una operación dentro de un consorcio. Se obtiene solo en el
 * servidor a partir del usuario autenticado; nunca se arma con datos del cliente.
 * Toda función del DAL que lee o escribe datos de un consorcio lo recibe y filtra
 * por `consortiumId`.
 */
export type TenantContext = Readonly<{
  userId: string;
  consortiumId: string;
  roles: readonly MembershipRole[];
}>;

/**
 * Resuelve el contexto de un usuario en un consorcio a partir de sus membresías
 * activas. Si no tiene ninguna (o el consorcio no existe), responde NotFound:
 * así no se revela la existencia de consorcios ajenos.
 */
export async function resolveTenantContext(
  prisma: PrismaClient,
  userId: string,
  consortiumId: string,
): Promise<TenantContext> {
  const memberships = await prisma.membership.findMany({
    where: { userId, consortiumId, status: "ACTIVE" },
    select: { role: true },
  });
  if (memberships.length === 0) {
    throw new NotFoundError();
  }
  return {
    userId,
    consortiumId,
    roles: memberships.map((membership) => membership.role).sort(),
  };
}

export function can(ctx: TenantContext, permission: Permission): boolean {
  return rolesCan(ctx.roles, permission);
}

export function assertCan(ctx: TenantContext, permission: Permission): void {
  if (!can(ctx, permission)) {
    throw new ForbiddenError();
  }
}
