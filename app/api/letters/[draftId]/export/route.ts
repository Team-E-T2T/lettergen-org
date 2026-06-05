import { NextRequest, NextResponse } from 'next/server';
import { getDraftById } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  try {
    const { draftId } = await params;
    const body = await request.json();
    const { format } = body;

    if (!format || !['pdf', 'docx'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    const draft = getDraftById(draftId);
    if (!draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    return NextResponse.json({ contentHtml: draft.contentHtml, documentName: draft.documentName });
  } catch (error) {
    console.error('POST /letters/:draftId/export error:', error);
    return NextResponse.json({ error: 'Failed to export draft' }, { status: 500 });
  }
}
