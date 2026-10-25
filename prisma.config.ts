import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 no carga .env automáticamente: lo hace dotenv arriba.
// La CLI (migraciones) usa el rol migrador; la app usa DATABASE_URL con un rol
// sin permisos de DDL (src/lib/env.ts). Ver .env.example y ADR-005.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["MIGRATE_DATABASE_URL"],
    shadowDatabaseUrl: process.env["SHADOW_DATABASE_URL"],
  },
});
