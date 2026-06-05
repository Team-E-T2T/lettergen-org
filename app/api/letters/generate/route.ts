import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.BACKEND_URL ??
  'https://lettergen-513500384322.us-central1.run.app';

export async function POST(request: NextRequest) {
  const requestId = `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  try {
    const body = await request.json();

    const {
      templateId,
      senderFullName,
      senderEmail,
      senderMailingAddress,
      recipientName,
      recipientOrganization,
      recipientAddress,
      subjectLine,
      letterTone,
      preferredClosing,
      mainPoints,
    } = body;

    console.info(`[${requestId}] POST /api/letters/generate request`, {
      templateId,
      senderFullName: senderFullName ? '[provided]' : '[missing]',
      recipientName: recipientName ? '[provided]' : '[missing]',
      subjectLine: subjectLine ? '[provided]' : '[missing]',
      mainPointsLength: typeof mainPoints === 'string' ? mainPoints.length : 0,
    });

    // Validate required fields
    if (
      !templateId ||
      !senderFullName ||
      !recipientName ||
      !subjectLine
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Proxy to backend
    const backendUrl = `${BACKEND_URL}/letters/generate`;
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId,
        senderFullName,
        senderEmail,
        senderMailingAddress,
        recipientName,
        recipientOrganization,
        recipientAddress,
        subjectLine,
        letterTone,
        preferredClosing,
        mainPoints,
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      console.error(`[${requestId}] Backend error: ${backendResponse.status}`, errorData);
      return NextResponse.json(
        {
          success: false,
          error: errorData.error ?? `Backend error: ${backendResponse.statusText}`,
          missingFields: Array.isArray(errorData.missingFields) ? errorData.missingFields : undefined,
        },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    console.info(`[${requestId}] Draft generated via backend`, {
      draftId: backendData.draftId,
      templateId,
    });

    return NextResponse.json(
      {
        success: true,
        draftId: backendData.draftId,
        documentName: backendData.documentName,
        contentHtml: backendData.contentHtml,
        contentText: backendData.contentText,
        template: backendData.template,
        wordCount: backendData.wordCount,
        createdAt: backendData.createdAt,
        updatedAt: backendData.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`[${requestId}] POST /api/letters/generate error:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate letter' },
      { status: 500 }
    );
  }
}
