import { NextRequest, NextResponse } from 'next/server';
import { getDraftById, updateDraft } from '@/lib/db';

const BACKEND_URL =
  process.env.BACKEND_URL ??
  'https://lettergen-513500384322.us-central1.run.app';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  try {
    const { draftId } = await params;

    // First try backend for generated drafts persisted outside local memory.
    const backendUrl = `${BACKEND_URL}/letters/${encodeURIComponent(draftId)}`;
    const backendResponse = await fetch(backendUrl, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (backendResponse.ok) {
      const backendDraft = await backendResponse.json();
      return NextResponse.json(
        {
          success: true,
          draftId: backendDraft.draftId,
          documentName: backendDraft.documentName,
          contentHtml: backendDraft.contentHtml,
          templateName: backendDraft.templateName,
          category: backendDraft.category,
          lastEditedAt: backendDraft.lastEditedAt,
          wordCount: backendDraft.wordCount,
        },
        { status: 200 }
      );
    }

    // Fallback for local dev drafts that may exist only in-memory.
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

    // First try backend for generated drafts persisted outside local memory.
    const backendUrl = `${BACKEND_URL}/letters/${encodeURIComponent(draftId)}`;
    const backendResponse = await fetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentName, contentHtml }),
    });

    if (backendResponse.ok) {
      const backendDraft = await backendResponse.json();
      return NextResponse.json(
        {
          success: true,
          draftId: backendDraft.draftId,
          updatedAt: backendDraft.updatedAt,
          wordCount: backendDraft.wordCount,
        },
        { status: 200 }
      );
    }

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
