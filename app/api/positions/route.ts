import { getAuthenticatedClient, sessionExpiredResponse, errorResponse } from "@/lib/session";
import { KiteSessionExpiredError } from "@/lib/kite";

export async function GET() {
  try {
    const client = await getAuthenticatedClient();
    const data = await client.getPositions();
    return Response.json(data);
  } catch (error) {
    if (error instanceof KiteSessionExpiredError) return sessionExpiredResponse();
    return errorResponse("Failed to fetch positions");
  }
}
