import { NextResponse } from "next/server";
import BACKEND_BASE_URL from "@/lib/backend";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${BACKEND_BASE_URL}/letters/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseBody = await response.text();
  const parsed = responseBody ? JSON.parse(responseBody) : {};

  return new NextResponse(JSON.stringify(parsed), {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
