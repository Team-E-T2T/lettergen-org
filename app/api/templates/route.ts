import { NextRequest, NextResponse } from 'next/server';
import { getAllTemplates } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    // const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    // const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    const templates = getAllTemplates(search, category);

    return NextResponse.json(
      {
        success: true,
        templates,
        total: templates.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /templates error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
