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
      senderEmail,
      senderMailingAddress,
      recipientName,
      recipientOrganization,
      recipientAddress,
      subjectLine,
      letterTone,
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

    // Resolve template from the same backend source as /api/templates/:id.
    const template = await getTemplate(templateId);
    if (!template) {
      console.warn(`[${requestId}] Template not found`, { templateId });
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    // Generate letter content
    const opening =
      letterTone === 'friendly'
        ? 'I hope you are doing well as you read this request.'
        : 'I am contacting you to formally request your attention and support on the following matter.';

    const requestText = mainPoints
      ? mainPoints.trim()
      : 'Please let me know how we can move forward together on the items described in the subject line.';

    const normalizedClosing =
      typeof preferredClosing === 'string' ? preferredClosing.trim().toLowerCase() : '';
    const closing =
      normalizedClosing === 'best' || normalizedClosing === 'best regards'
        ? 'Best regards,'
        : normalizedClosing === 'respectfully'
        ? 'Respectfully,'
        : normalizedClosing
        ? `${preferredClosing.toString().trim().replace(/,+$/, '')},`
        : 'Sincerely,';

    const letterDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const contentHtml = useTemplateBody
      ? `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; white-space: pre-wrap;">
        ${requestText || 'No content provided.'}
      </div>
    `.trim()
      : `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p><strong>${senderMailingAddress || 'Your Address'}</strong></p>
        <p>${letterDate}</p>
        
        <p><strong>${recipientName || 'Recipient Name'}</strong><br/>
        ${recipientOrganization || 'Company/Organization'}<br/>
        ${recipientAddress || 'Recipient Address'}</p>
        
        <p><strong>Subject: ${subjectLine}</strong></p>
        
        <p>Dear ${recipientName || '[Recipient Name]'},</p>
        
        <p>${opening}</p>
        
        <p>${requestText}</p>
        
        <p>Thank you for your time and consideration. Please feel free to reach out if you need any clarification or additional details.</p>
        
        <p>${closing}<br/>
        ${senderFullName}<br/>
        ${senderEmail}</p>
      </div>
    `.trim();

    const contentText = contentHtml.replace(/<[^>]*>/g, '').trim();

    // Create draft
    const draft = createDraft(
      templateId,
      `Letter_${Date.now()}`,
      contentHtml,
      contentText,
      {
        id: template.id,
        title: template.title,
        category: template.category,
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
