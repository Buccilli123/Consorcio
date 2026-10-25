-- Roles y bases del proyecto. Ejecutar como superusuario sobre la base "postgres":
--   psql -U postgres -d postgres -f scripts/db/01-roles.sql
-- Es idempotente. NO asigna contraseñas: se fijan aparte, sin pasar por archivos versionados.
-- Documentación: obsidian-vault/Decisiones/ADR-005 Roles de base de datos.md

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'consorcio_migrator') THEN
    CREATE ROLE consorcio_migrator LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'consorcio_app') THEN
    CREATE ROLE consorcio_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
  END IF;
END
$$;

-- Base auxiliar que Prisma usa en "migrate dev" para detectar desvíos. Prisma la vacía en cada uso.
SELECT 'CREATE DATABASE consorcio_shadow OWNER consorcio_migrator ENCODING ''UTF8'''
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'consorcio_shadow') \gexec

-- Solo los roles del proyecto se conectan a sus bases. El superusuario no se ve afectado.
REVOKE CONNECT, TEMPORARY ON DATABASE consorcio_dev, consorcio_test, consorcio_shadow FROM PUBLIC;
GRANT CONNECT ON DATABASE consorcio_dev, consorcio_test TO consorcio_migrator, consorcio_app;
GRANT CONNECT ON DATABASE consorcio_shadow TO consorcio_migrator;
