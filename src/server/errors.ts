/**
 * Errores de dominio con su código HTTP. Los mensajes son genéricos a propósito:
 * no revelan si un recurso de otro consorcio existe.
 */
export class DomainError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/** No hay sesión válida. */
export class AuthenticationError extends DomainError {
  constructor(message = "Autenticación requerida") {
    super(message, 401);
  }
}

/** Hay sesión, pero el rol no permite la acción dentro de un consorcio al que pertenece. */
export class ForbiddenError extends DomainError {
  constructor(message = "No tenés permiso para realizar esta acción") {
    super(message, 403);
  }
}

/**
 * El recurso no existe o pertenece a un consorcio sin acceso. Ambos casos
 * responden igual para no filtrar la existencia de datos de otros consorcios.
 */
export class NotFoundError extends DomainError {
  constructor(message = "Recurso no encontrado") {
    super(message, 404);
  }
}
