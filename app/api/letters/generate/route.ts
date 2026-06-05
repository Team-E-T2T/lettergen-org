import { NextRequest, NextResponse } from 'next/server';
import { createDraft } from '@/lib/db';
import { getTemplate } from '@/lib/api';

export async function POST(request: NextRequest) {
  const requestId = `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  try {
    const body = await request.json();

    const {
      templateId,
      senderFullName,

      senderMailingAddress,
      recipientName,
      recipientOrganization,

      subjectLine,

      preferredClosing,
      mainPoints,
      useTemplateBody,
    } = body;

    console.info(`[${requestId}] POST /api/letters/generate request`, {
      templateId,
      senderFullName: senderFullName ? '[provided]' : '[missing]',
      recipientName: recipientName ? '[provided]' : '[missing]',
      subjectLine: subjectLine ? '[provided]' : '[missing]',
      mainPointsLength: typeof mainPoints === 'string' ? mainPoints.length : 0,
      useTemplateBody: Boolean(useTemplateBody),
    });

    // Validate required fields (templateId is optional for blank letters)
    if (!senderFullName || !recipientName || !subjectLine) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Resolve template only if a templateId was provided
    let template = null;
    if (templateId) {
      template = await getTemplate(templateId);
      if (!template) {
        console.warn(`[${requestId}] Template not found`, { templateId });
        return NextResponse.json(
          { success: false, error: 'Template not found' },
          { status: 404 }
        );
      }
    }

    const requestText = mainPoints?.trim()
      || 'Please let me know how we can move forward on the items described in the subject line.';

    const rawClosing = typeof preferredClosing === 'string' ? preferredClosing.trim() : '';
    const normalizedClosing = rawClosing.toLowerCase().replace(/,+$/, '');
    const closingWord =
      normalizedClosing === 'best' || normalizedClosing === 'best regards' ? 'Best Regards'
      : normalizedClosing === 'respectfully' ? 'Respectfully'
      : normalizedClosing === 'sincerely' ? 'Sincerely'
      : rawClosing.replace(/,+$/, '') || 'Sincerely';
    const closing = `${closingWord},`;

    const letterDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const toLine = recipientOrganization
      ? `${recipientOrganization}`
      : recipientName;

    const senderBlock = [senderFullName, senderMailingAddress].filter(Boolean).join('<br/>');

    const contentHtml = useTemplateBody
      ? `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; white-space: pre-wrap;">${requestText}</div>`
      : `<div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; max-width: 680px; padding: 32px;">
<p style="text-align: left; margin: 0 0 24px 0;">Date: ${letterDate}</p>
<p style="margin: 0 0 16px 0;">To: ${toLine}</p>
<p style="margin: 0 0 24px 0;"><strong>Subject: ${subjectLine}</strong></p>
<p style="margin: 0 0 16px 0;">Dear ${recipientName},</p>
<p style="margin: 0 0 16px 0;">${requestText}</p>
<p style="margin: 0 0 24px 0;">Thank you.</p>
<p style="margin: 0 0 8px 0;">${closing}</p>
<p style="margin: 0;">${senderBlock}</p>
</div>`;

    const contentText = contentHtml.replace(/<[^>]*>/g, '').trim();

    // Create draft
    const draft = createDraft(
      templateId || 'blank',
      `Letter_${Date.now()}`,
      contentHtml,
      contentText,
      {
        id: template?.id || 'blank',
        title: template?.title || 'Blank Letter',
        category: template?.category || 'General',
      }
    );

    console.info(`[${requestId}] Draft generated`, {
      draftId: draft.draftId,
      templateId,
      wordCount: draft.wordCount,
    });

    return NextResponse.json(
      {
        success: true,
        draftId: draft.draftId,
        documentName: draft.documentName,
        contentHtml: draft.contentHtml,
        contentText: draft.contentText,
        template: draft.template,
        wordCount: draft.wordCount,
        createdAt: draft.createdAt,
        updatedAt: draft.updatedAt,
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
