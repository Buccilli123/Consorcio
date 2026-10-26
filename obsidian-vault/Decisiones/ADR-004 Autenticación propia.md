---
tipo: adr
estado: aceptada
fecha: 2026-10-25
tags: [adr, seguridad, autenticacion]
---
# ADR-004 — Autenticación propia con email y contraseña

> **Resumen.** Login con email y contraseña, sin librerías de auth.
> - **Contraseñas:** `scrypt` N=2^17, r=8, p=1, con `maxmem` de 256 MiB (sin eso Node lo rechaza) y como máximo 2 hashes simultáneos.
> - **Sesiones en la base:** se guarda el SHA-256 del token; vencen a los 7 días de inactividad (deslizante) y a los 30 días como máximo, y se revocan en logout o cambio de contraseña.
> - **Cookie y CSRF:** cookie `__Host-` `HttpOnly` `SameSite=Lax`; chequeo de Origin propio en Route Handlers (las Server Actions ya lo traen).
> - **Rate limiting:** 5 fallos por email y 20 por IP, cada 15 minutos.
> - **Logs:** nunca contraseñas ni tokens.
> - **Esquema:** requiere las tablas `LoginAttempt` y `PasswordResetToken`.

## Contexto
Decisión de producto (2026-10-25): el MVP usa login con email y contraseña, y la autenticación es el primer módulo de la Etapa 3. No hay proveedor de correo definido. Este ADR fija el diseño; pasa a "implementada" cuando el módulo cumpla sus criterios en [[Criterios de aceptación MVP]].

## 1. Almacenamiento de contraseñas: scrypt
- `crypto.scrypt` (asíncrono) de Node: sin dependencias nativas. Parámetros base de OWASP: **N=2^17, r=8, p=1**, con sal aleatoria de 16 bytes y clave derivada de 64 bytes.
- **Medido en esta máquina:** ~241 ms y 128 MiB por hash. Node rechaza esos parámetros con el `maxmem` por defecto (32 MiB, error `ERR_CRYPTO_INVALID_SCRYPT_PARAMS`), así que se fija `maxmem: 256 MiB`.
- **Límite de concurrencia:** como máximo 2 hashes simultáneos (un semáforo en el proceso), para acotar la memoria en ~256 MiB y evitar que un pico de logins agote la RAM. Se ajusta cuando se conozcan los recursos del servidor ([[Infraestructura pendiente]]).
- **Formato autodescriptivo:** `scrypt$N$r$p$salBase64$hashBase64`. Si al verificar los parámetros son viejos, se re-hashea tras un login exitoso.
- La comparación se hace con `crypto.timingSafeEqual`.
- **Anti-enumeración:** si el email no existe, igual se verifica contra un hash ficticio, para que el tiempo de respuesta no revele qué cuentas existen.
- **Política:** mínimo 10 caracteres y máximo 128 (el máximo evita abusos de CPU). Normalización Unicode NFC y sin reglas de composición forzadas. La lista de contraseñas filtradas queda para más adelante, porque no se llaman servicios externos.

## 2. Sesiones
- **Token:** 32 bytes de `crypto.randomBytes` (256 bits) en base64url. En la base solo se guarda su **SHA-256** (`Session.tokenHash`). No hace falta sal ni un hash lento porque el token tiene entropía completa. Quien lea la base no puede reconstruir la cookie.
- **Por qué no se usa JWT ni una cookie cifrada:** la sesión en la base permite revocarla al instante, y la cookie no lleva datos, así que no hace falta una clave de cifrado que custodiar.
- **Duración:** expiración por inactividad de **7 días**, deslizante. `expiresAt` se renueva cuando queda menos de la mitad del plazo, para no escribir en cada request. Además hay un máximo absoluto de **30 días** desde `createdAt`, sin renovación.
- **Revocación:** el logout marca `revokedAt`. Al cambiar o restablecer la contraseña se revocan todas las sesiones del usuario. Suspender una membresía no necesita revocar sesiones, porque `resolveTenantContext` ya ignora las membresías suspendidas.
- **Fijación de sesión:** siempre se crea un token nuevo al hacer login; nunca se reutiliza uno que haya llegado del cliente.
- **Limpieza:** las sesiones vencidas o revocadas hace más de 30 días se borran con una tarea periódica (se define en operación).

## 3. Cookie
- Nombre `__Host-consorcio_session` en producción, que obliga a `Secure` y `Path=/` y prohíbe `Domain`. En desarrollo (http://localhost) el nombre es `consorcio_session`.
- `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` fuera de desarrollo. Vence junto con la sesión.

## 4. CSRF
- **Server Actions:** Next 16 solo las acepta por POST y compara `Origin` con `Host` (o `X-Forwarded-Host`). Eso, sumado a `SameSite=Lax`, cubre el caso. Si en producción hay un proxy, se configura `serverActions.allowedOrigins` en la etapa de infraestructura.
- **Route Handlers** que cambian estado (POST, PUT, PATCH, DELETE): Next no los protege solos. Se agrega un **chequeo propio de `Origin`** contra los orígenes permitidos, que rechaza con 403 si no coincide, y los handlers GET no cambian estado.
- Login y logout se implementan como Server Actions.

## 5. Rate limiting
- Tabla `LoginAttempt` (email normalizado, IP, resultado, fecha). Antes de verificar la contraseña:
  - **Por email:** 5 fallos en 15 minutos bloquean ese email durante 15 minutos.
  - **Por IP:** 20 fallos en 15 minutos bloquean esa IP.
  - Ante un bloqueo se responde "demasiados intentos, probá más tarde", sin revelar si la cuenta existe.
- Se guarda la IP porque hace falta para el límite. Es un dato personal, así que **se conserva 24 horas** y después se borra.
- `X-Forwarded-For` se usa solo si se configura un proxy de confianza. Hasta entonces se usa la IP de la conexión.
- Se evalúa un limitador externo, como el del proxy, en la etapa de infraestructura.

## 6. Recuperación de contraseña (sin correo)
- El ADMIN genera un enlace de **un solo uso** para un miembro de su consorcio: un token de 32 bytes guardado como SHA-256, que vence en 1 hora. Al usarlo se revocan todas las sesiones.

## 7. Logs y auditoría
- **Nunca** se registran contraseñas, hashes, tokens, cookies ni el `tokenHash`. Los errores de validación nombran el campo, no su valor (igual que `env.ts`).
- Se registran como `AuditEvent`: `auth.login.success`, `auth.login.failure` (solo con el email normalizado y sin contraseña), `auth.logout`, `auth.password.change` y `auth.password.reset.issue/use`.

## 8. Next 16
- `proxy.ts` hace solo un chequeo optimista (si la cookie existe) para redirigir a /login. **La verificación real se hace en el DAL** en cada operación, como indica la guía de autenticación de Next.

## Cambios de esquema que requiere
- Nuevas tablas `LoginAttempt` y `PasswordResetToken`. No hace falta tocar `Session` (alcanzan `expiresAt`, `revokedAt` y `createdAt`).

## Alternativas descartadas
- **Auth.js / Better Auth:** agregan dependencias y abstracciones que no hacen falta para un solo método de login. Se reconsideran si aparecen OAuth o el login con un enlace por email.
- **Argon2id:** es preferible en teoría, pero requiere un módulo nativo; scrypt con los parámetros de OWASP es aceptado.
- **JWT sin estado:** no se puede revocar al instante.

Enlaces: [[ADR-003 Aislamiento multi-tenant]], [[Seguridad y privacidad]], [[Criterios de aceptación MVP]]
