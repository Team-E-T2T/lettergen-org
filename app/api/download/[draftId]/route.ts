import { NextRequest, NextResponse } from 'next/server';
import { getDraftById } from '@/lib/db';

/**
 * Download endpoint for exported drafts.
 * 
 * GET /api/download/{draftId}?format=pdf&name=fileName
 * 
 * For local development: generates a simple PDF or text file.
 * For production: would serve pre-generated files from persistent storage.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  try {
    const { draftId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'pdf';
    const fileName = searchParams.get('name') || draftId;

    // Validate format
    if (!['pdf', 'docx'].includes(format)) {
      return NextResponse.json(
        { error: "'format' must be either 'pdf' or 'docx'." },
        { status: 400 }
      );
    }

    // Retrieve the draft to generate the file
    const draft = getDraftById(draftId);
    if (!draft) {
      return NextResponse.json(
        { error: 'Export file not found.', fileName: `${fileName}.${format}` },
        { status: 404 }
      );
    }

    // For local development: return a simple mock file
    // In production with real PDF generation, this would serve a pre-generated file
    let content: string | Buffer;
    let contentType: string;
    let displayFileName: string;

    if (format === 'pdf') {
      // Mock PDF: simple HTML wrapped in a minimal PDF-like format
      // In production, use a real PDF library like pdfkit or html2pdf
      contentType = 'application/pdf';
      displayFileName = `${fileName}.pdf`;
      content = generateMockPDF(draft.documentName, draft.contentHtml);
    } else if (format === 'docx') {
      // Mock DOCX: text content wrapped with DOCX headers
      // In production, use docx library
      contentType =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      displayFileName = `${fileName}.docx`;
      content = generateMockDOCX(draft.documentName, draft.contentText || draft.contentHtml);
    } else {
      return NextResponse.json(
        { error: 'Unsupported format' },
        { status: 400 }
      );
    }

    return new NextResponse(new Uint8Array(content), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${displayFileName}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('GET /api/download/:draftId error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}

/**
 * Generate a minimal mock PDF for development.
 * Replace with a real PDF library (pdfkit, html2pdf, etc.) in production.
 */
function generateMockPDF(documentName: string, contentHtml: string): Buffer {
  // Extract text from HTML
  const plainText = contentHtml.replace(/<[^>]*>/g, '').trim();

  // Create a minimal PDF-like structure (not a real PDF, but will download)
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 200 >>
stream
BT
/F1 12 Tf
50 700 Td
(${documentName.replace(/[()]/g, '')}) Tj
0 -20 Td
(${plainText.substring(0, 200).replace(/[()]/g, '')}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000244 00000 n
0000000333 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
583
%%EOF`;

  return Buffer.from(pdfContent, 'utf-8');
}

/**
 * Generate a minimal mock DOCX for development.
 * Replace with a real DOCX library in production.
 */
function generateMockDOCX(documentName: string, content: string): Buffer {
  // Simple DOCX is actually a ZIP archive. For dev, we'll create a minimal XML-based mock.
  // In production, use the 'docx' npm library.
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <title>${documentName}</title>
  <body>
    <p>${content.replace(/[<>]/g, '').substring(0, 500)}</p>
  </body>
</document>`;

  return Buffer.from(xmlContent, 'utf-8');
}
