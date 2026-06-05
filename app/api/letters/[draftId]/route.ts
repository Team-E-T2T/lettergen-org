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
    console.log(`[GET /api/letters/${draftId}] Request started`);

    // First try backend for generated drafts persisted outside local memory.
    const backendUrl = `${BACKEND_URL}/letters/${encodeURIComponent(draftId)}`;
    console.log(`[GET /api/letters/${draftId}] Fetching from backend:`, backendUrl);

    const backendResponse = await fetch(backendUrl, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    console.log(`[GET /api/letters/${draftId}] Backend response status:`, backendResponse.status);

    if (backendResponse.ok) {
      const backendDraft = await backendResponse.json();
      console.log(`[GET /api/letters/${draftId}] Backend draft received:`, {
        draftId: backendDraft.draftId,
        hasContentHtml: !!backendDraft.contentHtml,
        contentHtmlLength: backendDraft.contentHtml?.length || 0,
        keys: Object.keys(backendDraft),
      });

      if (!backendDraft.contentHtml) {
        console.warn(`[GET /api/letters/${draftId}] WARNING: Backend draft missing contentHtml`);
      }

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

    console.log(`[GET /api/letters/${draftId}] Backend returned ${backendResponse.status}, trying local fallback`);

    // Fallback for local dev drafts that may exist only in-memory.
    const draft = getDraftById(draftId);

    if (!draft) {
      console.log(`[GET /api/letters/${draftId}] Draft not found in backend or local DB`);
      return NextResponse.json(
        { success: false, error: 'Draft not found' },
        { status: 404 }
      );
    }

    console.log(`[GET /api/letters/${draftId}] Found in local DB:`, {
      draftId: draft.draftId,
      contentHtmlLength: draft.contentHtml?.length || 0,
    });

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
