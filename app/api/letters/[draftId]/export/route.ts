import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.BACKEND_URL ??
  'https://lettergen-513500384322.us-central1.run.app';

/**
 * Export a draft as PDF or DOCX.
 * 
 * Proxies the export request to the backend service which handles actual PDF/DOCX generation.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  try {
    const { draftId } = await params;
    const body = await request.json();

    const { format, fileName } = body;

    if (!format || !['pdf', 'docx'].includes(format)) {
      return NextResponse.json(
        { success: false, error: "'format' must be either 'pdf' or 'docx'." },
        { status: 400 }
      );
    }

    // Proxy to backend
    const backendUrl = `${BACKEND_URL}/letters/${encodeURIComponent(draftId)}/export`;
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ format, fileName }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errorData.error ?? `Backend error: ${backendResponse.statusText}` },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();

    return NextResponse.json(
      {
        success: true,
        downloadUrl: backendData.downloadUrl,
        fileName: backendData.fileName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /letters/:draftId/export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export draft' },
      { status: 500 }
    );
  }
}
