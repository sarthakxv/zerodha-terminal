import { NextRequest } from "next/server";
import { getAuthenticatedContext, sessionExpiredResponse, errorResponse } from "@/lib/session";
import { KiteSessionExpiredError } from "@/lib/kite";
import { isValidInstrumentId, rateLimitRequest, RATE_LIMITS } from "@/lib/security";

const MAX_INSTRUMENTS = 50;

export async function GET(request: NextRequest) {
  const instruments = request.nextUrl.searchParams.getAll("i");

  if (instruments.length === 0) {
    return errorResponse("Missing instruments parameter", 400);
  }

  if (instruments.length > MAX_INSTRUMENTS) {
    return errorResponse(`Maximum ${MAX_INSTRUMENTS} instruments allowed`, 400);
  }

  if (instruments.some((instrument) => !isValidInstrumentId(instrument))) {
    return errorResponse("Invalid instrument parameter", 400);
  }

  try {
    const { client, session } = await getAuthenticatedContext();
    const rateLimited = await rateLimitRequest(request, RATE_LIMITS.quote, session.userId);
    if (rateLimited) return rateLimited;

    const data = await client.getLTP(instruments);
    return Response.json(data);
  } catch (error) {
    if (error instanceof KiteSessionExpiredError) return sessionExpiredResponse();
    return errorResponse("Failed to fetch LTP");
  }
}
