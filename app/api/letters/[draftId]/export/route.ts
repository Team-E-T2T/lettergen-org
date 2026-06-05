import { NextRequest, NextResponse } from 'next/server';
import { getDraftById } from '@/lib/db';

const BACKEND_URL =
  process.env.BACKEND_URL ??
  'http://127.0.0.1:8000';

/**
 * Export a draft as PDF or DOCX.
 * 
 * For local drafts (in-memory DB): Returns a mock download URL.
 * For multi-instance/production: Should proxy to a backend that persists drafts.
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

    // Check if draft exists in local in-memory database
    const draft = getDraftById(draftId);
    if (!draft) {
      return NextResponse.json(
        { success: false, error: 'Draft not found' },
        { status: 404 }
      );
    }

    // For local development: generate a mock download URL.
    // In production with a real backend, this should proxy to the backend.
    // Using the draftId itself as the export filename stem (backend will sanitize).
    const fileNameStem = fileName || draft.documentName || draftId;
    const mockFileName = `${fileNameStem}.${format === 'docx' ? 'docx' : 'pdf'}`;
    
    // Return URL in the format expected by pdf_download.md:
    // /api/download/{draft_id}?format=pdf&name=letterName
    const downloadUrl = `/api/download/${draftId}?format=${format}&name=${encodeURIComponent(fileNameStem)}`;

    return NextResponse.json(
      {
        success: true,
        downloadUrl,
        fileName: fileNameStem,
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
