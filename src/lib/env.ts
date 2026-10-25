import { z } from "zod";

const postgresUrl = z
  .string({ error: "falta definirla" })
  .refine((value) => /^postgres(ql)?:\/\//.test(value), {
    error: "debe ser una URL postgresql://",
  });

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: postgresUrl,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Valida las variables de entorno del servidor.
 * Los mensajes de error nombran la variable pero nunca incluyen su valor,
 * para no filtrar credenciales en logs.
 */
export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverEnvSchema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Variables de entorno inválidas: ${problems}`);
  }
  return result.data;
}

let cached: ServerEnv | undefined;

export function serverEnv(): ServerEnv {
  cached ??= parseServerEnv(process.env);
  return cached;
}
