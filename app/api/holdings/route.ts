import { NextRequest } from "next/server";
import { getAuthenticatedContext, sessionExpiredResponse, errorResponse } from "@/lib/session";
import { KiteSessionExpiredError } from "@/lib/kite";
import { rateLimitRequest, RATE_LIMITS } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    const { client, session } = await getAuthenticatedContext();
    const rateLimited = await rateLimitRequest(request, RATE_LIMITS.standard, session.userId);
    if (rateLimited) return rateLimited;

    const data = await client.getHoldings();
    return Response.json(data);
  } catch (error) {
    if (error instanceof KiteSessionExpiredError) return sessionExpiredResponse();
    return errorResponse("Failed to fetch holdings");
  }
}
