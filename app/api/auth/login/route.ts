import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.KITE_API_KEY!;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const redirectUrl = `https://kite.zerodha.com/connect/login?v=3&api_key=${apiKey}&redirect_url=${encodeURIComponent(baseUrl + "/api/auth/callback")}`;

  return Response.redirect(redirectUrl);
}
