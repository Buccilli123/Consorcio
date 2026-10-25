import "dotenv/config";

function requireTestUrl(name: string): string {
  const url = process.env[name];
  if (!url) {
    throw new Error(`Falta ${name} en .env: los tests de integración necesitan una base de pruebas.`);
  }
  const databaseName = new URL(url).pathname.replace(/^\//, "");
  if (!databaseName.endsWith("_test")) {
    throw new Error(
      `${name} apunta a "${databaseName}". Por seguridad, la base de pruebas debe terminar en "_test".`,
    );
  }
  return url;
}

/**
 * URL con el rol de la app (consorcio_app): los tests corren con los mismos
 * permisos que la aplicación. Corta si la base no termina en "_test".
 */
export function testDatabaseUrl(): string {
  return requireTestUrl("TEST_DATABASE_URL");
}

/** URL con el rol migrador, solo para aplicar migraciones y limpiar tablas. */
export function testMigrateDatabaseUrl(): string {
  return requireTestUrl("TEST_MIGRATE_DATABASE_URL");
}
