import { testDatabaseUrl } from "./test-database";

// Antes de importar cualquier módulo de la app, el cliente apunta a la base de pruebas.
process.env.DATABASE_URL = testDatabaseUrl();
