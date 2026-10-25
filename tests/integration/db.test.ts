import { afterAll, describe, expect, it } from "vitest";
import { db } from "@/lib/db";

describe("conexión a PostgreSQL", () => {
  afterAll(async () => {
    await db().$disconnect();
  });

  it("se conecta a la base de pruebas", async () => {
    const [row] = await db().$queryRaw<{ name: string }[]>`SELECT current_database() AS name`;
    expect(row.name).toMatch(/_test$/);
  });

  it("usa codificación UTF8", async () => {
    const [row] = await db().$queryRaw<{ encoding: string }[]>`
      SELECT pg_encoding_to_char(encoding) AS encoding
      FROM pg_database WHERE datname = current_database()`;
    expect(row.encoding).toBe("UTF8");
  });
});
