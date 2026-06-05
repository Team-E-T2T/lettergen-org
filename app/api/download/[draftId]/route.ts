import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.BACKEND_URL ??
  'https://lettergen-513500384322.us-central1.run.app';

/**
 * Download endpoint for exported drafts.
 * 
 * GET /api/download/{draftId}?format=pdf&name=fileName
 * 
 * Proxies the download request to the backend service which serves pre-generated files.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  try {
    const { draftId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'pdf';
    const fileName = searchParams.get('name') || draftId;

    // Validate format
    if (!['pdf', 'docx'].includes(format)) {
      return NextResponse.json(
        { error: "'format' must be either 'pdf' or 'docx'." },
        { status: 400 }
      );
    }

    // Proxy to backend
    const backendUrl = `${BACKEND_URL}/api/download/${encodeURIComponent(draftId)}?format=${encodeURIComponent(format)}&name=${encodeURIComponent(fileName)}`;
    const backendResponse = await fetch(backendUrl);

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error ?? 'Export file not found.' },
        { status: backendResponse.status }
      );
    }

    // Get binary content from backend
    const buffer = await backendResponse.arrayBuffer();
    const contentType = backendResponse.headers.get('Content-Type') || 'application/octet-stream';
    const contentDisposition = backendResponse.headers.get('Content-Disposition') || `attachment; filename="${fileName}.${format}"`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('GET /api/download/:draftId error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}
