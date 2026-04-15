import { NextRequest } from "next/server";
import { getSession, sessionExpiredResponse, errorResponse } from "@/lib/session";
import { searchInstruments } from "@/lib/instruments";
import { KiteSessionExpiredError } from "@/lib/kite";

const MAX_QUERY_LENGTH = 100;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return errorResponse("Missing search query", 400);
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return errorResponse(`Query too long (max ${MAX_QUERY_LENGTH} chars)`, 400);
  }

  try {
    const session = await getSession();
    if (!session.accessToken) return sessionExpiredResponse();

    const results = await searchInstruments(query.trim(), session.accessToken);
    return Response.json(results);
  } catch (error) {
    if (error instanceof KiteSessionExpiredError) return sessionExpiredResponse();
    return errorResponse("Failed to search instruments");
  }
}
