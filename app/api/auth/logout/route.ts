import { getSession } from "@/lib/session";
import { KiteClient } from "@/lib/kite";

export async function POST() {
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
