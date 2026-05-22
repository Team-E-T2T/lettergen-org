import { NextRequest, NextResponse } from 'next/server';
import { getDraftById, updateDraft } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  try {
    const { draftId } = await params;

    const draft = getDraftById(draftId);

    if (!draft) {
      return NextResponse.json(
        { success: false, error: 'Draft not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        draftId: draft.draftId,
        documentName: draft.documentName,
        contentHtml: draft.contentHtml,
        templateName: draft.template.title,
        category: draft.template.category,
        lastEditedAt: draft.updatedAt,
        wordCount: draft.wordCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /letters/:draftId error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch draft' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  try {
    const { draftId } = await params;
    const body = await request.json();

    const { documentName, contentHtml } = body;

    const draft = getDraftById(draftId);
    if (!draft) {
      return NextResponse.json(
        { success: false, error: 'Draft not found' },
        { status: 404 }
      );
    }

    const updated = updateDraft(draftId, {
      documentName: documentName || draft.documentName,
      contentHtml: contentHtml || draft.contentHtml,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to update draft' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        draftId: updated.draftId,
        updatedAt: updated.updatedAt,
        wordCount: updated.wordCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH /letters/:draftId error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update draft' },
      { status: 500 }
    );
  }
}
