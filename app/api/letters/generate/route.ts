import { NextRequest, NextResponse } from 'next/server';
import { createDraft, getTemplateById } from '@/lib/db';

export async function POST(request: NextRequest) {
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

    // Get template
    const template = getTemplateById(templateId);
    if (!template) {
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

    const closing =
      preferredClosing === 'best'
        ? 'Best regards,'
        : preferredClosing === 'respectfully'
        ? 'Respectfully,'
        : 'Sincerely,';

    const letterDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const contentHtml = `
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
    console.error('POST /letters/generate error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate letter' },
      { status: 500 }
    );
  }
}
