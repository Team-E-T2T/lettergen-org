import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  let body: any;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const backendResponse = await fetch(`${BACKEND_URL}/letters/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const responseData = await backendResponse.json().catch(() => ({}));

  if (!backendResponse.ok) {
    return NextResponse.json(responseData, { status: backendResponse.status });
  }

  return NextResponse.json(responseData, { status: backendResponse.status });
}
