import { describe, expect, it } from "vitest";
import { parseServerEnv } from "./env";

const validUrl = "postgresql://usuario:clave-ficticia@localhost:5432/consorcio_dev";

describe("parseServerEnv", () => {
  it("acepta una configuración válida", () => {
    const env = parseServerEnv({ NODE_ENV: "test", DATABASE_URL: validUrl });
    expect(env).toEqual({ NODE_ENV: "test", DATABASE_URL: validUrl });
  });

  it("usa development si NODE_ENV no está definida", () => {
    expect(parseServerEnv({ DATABASE_URL: validUrl }).NODE_ENV).toBe("development");
  });

  it("acepta el prefijo postgres://", () => {
    const url = "postgres://u:p@localhost/db";
    expect(parseServerEnv({ DATABASE_URL: url }).DATABASE_URL).toBe(url);
  });

  it("rechaza si falta DATABASE_URL", () => {
    expect(() => parseServerEnv({})).toThrow(/DATABASE_URL: falta definirla/);
  });

  it("rechaza URLs que no son de PostgreSQL", () => {
    expect(() => parseServerEnv({ DATABASE_URL: "mysql://u:p@localhost/db" })).toThrow(
      /DATABASE_URL: debe ser una URL postgresql/,
    );
  });

  it("rechaza un NODE_ENV desconocido", () => {
    expect(() => parseServerEnv({ NODE_ENV: "staging", DATABASE_URL: validUrl })).toThrow(
      /NODE_ENV/,
    );
  });

  it("no incluye el valor de la variable en el mensaje de error", () => {
    const secret = "mysql://u:CLAVE-QUE-NO-DEBE-APARECER@localhost/db";
    expect(() => parseServerEnv({ DATABASE_URL: secret })).toThrow(
      expect.objectContaining({ message: expect.not.stringContaining("CLAVE-QUE-NO-DEBE-APARECER") }),
    );
  });
});
