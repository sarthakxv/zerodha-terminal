import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "./types";
import { KiteClient, KiteSessionExpiredError } from "./kite";

const SESSION_OPTIONS = {
  password: process.env.COOKIE_SECRET!,
  cookieName: "zt-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

export async function getAuthenticatedClient(): Promise<KiteClient> {
  const session = await getSession();

  if (!session.accessToken) {
    throw new KiteSessionExpiredError();
  }

  if (session.expiresAt && Date.now() > session.expiresAt) {
    session.destroy();
    throw new KiteSessionExpiredError();
  }

  return new KiteClient(session.accessToken);
}

export function apiResponse(data: unknown, status: number = 200) {
  return Response.json(data, { status });
}

export function sessionExpiredResponse() {
  return Response.json({ error: "session_expired" }, { status: 401 });
}

export function errorResponse(message: string, status: number = 500) {
  return Response.json({ error: message }, { status });
}
