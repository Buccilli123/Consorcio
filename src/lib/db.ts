import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { serverEnv } from "@/lib/env";

export function createPrismaClient(connectionString: string): PrismaClient {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

// En desarrollo, el hot reload reevalúa módulos: se reutiliza una sola
// instancia para no abrir conexiones nuevas en cada recarga.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function db(): PrismaClient {
  globalForPrisma.prisma ??= createPrismaClient(serverEnv().DATABASE_URL);
  return globalForPrisma.prisma;
}
