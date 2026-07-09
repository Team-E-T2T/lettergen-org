// 1. Mark the context object as containing a Promise for params
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // 2. Await the params Promise to unwrap the 'id'
    const { id } = await params;

    const response = await fetch(
      `https://lettergen-513500384322.us-central1.run.app/templates/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Template not found" }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return Response.json(data);

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
