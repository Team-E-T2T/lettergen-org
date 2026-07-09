import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const response = await fetch(
      `https://lettergen-513500384322.us-central1.run.app/templates/${id}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: response.status }
      );
    }

    const template = await response.json();
    return NextResponse.json({ success: true, template }, { status: 200 });
  } catch (error) {
    console.error('GET /templates/:id error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}
