/** Consistent, user-safe error surface for server functions. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function fail(message: string, status = 400): never {
  throw new ApiError(message, status);
}

/** Never leak raw driver/SQL errors to the client. */
export function dbFail(context: string, error: unknown): never {
  console.error(`[db:${context}]`, error);
  throw new ApiError("Something went wrong. Please try again.", 500);
}

export function errorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof Error && error.message) {
    const msg = error.message.replace(/^Error:\s*/, "");
    if (/unauthorized/i.test(msg)) return "Please sign in to continue.";
    return msg.length > 200 ? fallback : msg;
  }
  return fallback;
}
