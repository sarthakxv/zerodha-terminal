import { NextRequest } from "next/server";
import { KiteClient } from "@/lib/kite";
import { getSession } from "@/lib/session";
import { getNextSixAMIST } from "@/lib/market-hours";

export async function GET(request: NextRequest) {
  const requestToken = request.nextUrl.searchParams.get("request_token");

  if (!requestToken) {
    return Response.redirect(
      new URL("/login?error=missing_token", request.url)
    );
  }

  try {
    const sessionData = await KiteClient.createSession(requestToken);
    const session = await getSession();

    session.accessToken = sessionData.access_token;
    session.userId = sessionData.user_id;
    session.userName = sessionData.user_name;
    session.userShortname = sessionData.user_shortname;
    session.expiresAt = getNextSixAMIST();

    await session.save();

    return Response.redirect(new URL("/portfolio", request.url));
  } catch (error) {
    console.error("Auth callback error:", error);
    return Response.redirect(
      new URL("/login?error=auth_failed", request.url)
    );
  }
}
