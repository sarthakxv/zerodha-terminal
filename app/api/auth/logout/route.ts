import { NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { KiteClient } from "@/lib/kite";
import { isSameOriginRequest } from "@/lib/security";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const session = await getSession();

  if (session.accessToken) {
    try {
      const client = new KiteClient(session.accessToken);
      await client.invalidateSession();
    } catch {
      // Best effort
    }
  }

  session.destroy();

  return Response.json({ ok: true });
}
