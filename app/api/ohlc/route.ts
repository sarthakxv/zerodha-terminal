import { NextRequest } from "next/server";
import { getAuthenticatedClient, sessionExpiredResponse, errorResponse } from "@/lib/session";
import { KiteSessionExpiredError } from "@/lib/kite";

const MAX_INSTRUMENTS = 50;

export async function GET(request: NextRequest) {
  const instruments = request.nextUrl.searchParams.getAll("i");

  if (instruments.length === 0) {
    return errorResponse("Missing instruments parameter", 400);
  }

  if (instruments.length > MAX_INSTRUMENTS) {
    return errorResponse(`Maximum ${MAX_INSTRUMENTS} instruments allowed`, 400);
  }

  try {
    const client = await getAuthenticatedClient();
    const data = await client.getOHLC(instruments);
    return Response.json(data);
  } catch (error) {
    if (error instanceof KiteSessionExpiredError) return sessionExpiredResponse();
    return errorResponse("Failed to fetch OHLC");
  }
}
