import { NextRequest, NextResponse } from 'next/server';
import { getDraftById } from '@/lib/db';

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
        { success: false, error: 'Invalid format. Expected "pdf" or "docx"' },
        { status: 400 }
      );
    }

    const draft = getDraftById(draftId);
    if (!draft) {
      return NextResponse.json(
        { success: false, error: 'Draft not found' },
        { status: 404 }
      );
    }

    // In production, you'd use a library like:
    // - html2pdf or pdfkit for PDF generation
    // - docx or mammoth for DOCX generation
    // For now, we'll return a mock download URL

    const mockFileName = fileName || `${draft.documentName}.${format}`;
    const mockDownloadUrl = `/api/download/${draftId}?format=${format}&name=${encodeURIComponent(mockFileName)}`;

    return NextResponse.json(
      {
        success: true,
        downloadUrl: mockDownloadUrl,
        fileName: mockFileName,
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
