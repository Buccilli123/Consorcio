-- Permisos dentro de cada base del proyecto. Ejecutar como superusuario en consorcio_dev y consorcio_test:
--   psql -U postgres -d consorcio_dev -f scripts/db/02-schema-grants.sql
-- Es idempotente. Volver a correrlo después de la primera migración en una base nueva.

-- El migrador es dueño del esquema y de sus objetos: puede crear y alterar tablas.
ALTER SCHEMA public OWNER TO consorcio_migrator;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO consorcio_app;

-- Transfiere al migrador los objetos creados antes por otro rol (por ejemplo, postgres).
DO $$
DECLARE
  obj record;
BEGIN
  FOR obj IN
    SELECT c.relname,
           CASE c.relkind WHEN 'S' THEN 'SEQUENCE' WHEN 'v' THEN 'VIEW' WHEN 'm' THEN 'MATERIALIZED VIEW' ELSE 'TABLE' END AS kind
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p', 'S', 'v', 'm')
      AND pg_get_userbyid(c.relowner) <> 'consorcio_migrator'
  LOOP
    EXECUTE format('ALTER %s public.%I OWNER TO consorcio_migrator', obj.kind, obj.relname);
  END LOOP;

  FOR obj IN
    SELECT t.typname FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typtype = 'e' AND pg_get_userbyid(t.typowner) <> 'consorcio_migrator'
  LOOP
    EXECUTE format('ALTER TYPE public.%I OWNER TO consorcio_migrator', obj.typname);
  END LOOP;

  FOR obj IN
    SELECT p.oid::regprocedure::text AS signature FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND pg_get_userbyid(p.proowner) <> 'consorcio_migrator'
  LOOP
    EXECUTE format('ALTER FUNCTION %s OWNER TO consorcio_migrator', obj.signature);
  END LOOP;
END
$$;

-- La app solo lee y escribe filas: sin TRUNCATE, sin DDL, sin REFERENCES ni TRIGGER.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO consorcio_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO consorcio_app;

-- Las tablas que cree el migrador en el futuro reciben los mismos permisos.
ALTER DEFAULT PRIVILEGES FOR ROLE consorcio_migrator IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO consorcio_app;
ALTER DEFAULT PRIVILEGES FOR ROLE consorcio_migrator IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO consorcio_app;

-- El historial de migraciones no es asunto de la app.
DO $$
BEGIN
  IF to_regclass('public."_prisma_migrations"') IS NOT NULL THEN
    REVOKE ALL ON TABLE public."_prisma_migrations" FROM consorcio_app;
  END IF;
END
$$;
