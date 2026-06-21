export type SessionRole = "admin" | "user";

export type SessionUser = {
  sub: string;
  email: string;
  role: SessionRole;
  exp: number;
  iat: number;
};

export const SESSION_COOKIE = "gofarm_session";
export const TOKEN_SECRET = process.env.GOFARM_AUTH_SECRET ?? "gofarm-dev-secret";

if (!process.env.GOFARM_AUTH_SECRET && process.env.NODE_ENV === "production") {
  throw new Error(
    "Missing required environment variable GOFARM_AUTH_SECRET in production. Set a strong secret to secure session tokens."
  );
}
