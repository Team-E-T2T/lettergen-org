/**
 * Backend API client — server-side only.
 *
 * Set BACKEND_URL in .env.local to point at a local or staging server.
 * Falls back to the deployed Cloud Run service when not set.
 *
 * Example .env.local:
 *   BACKEND_URL=http://localhost:8000
 */

const BACKEND_URL =
  process.env.BACKEND_URL ??
  'https://lettergen-513500384322.us-central1.run.app';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Full template record returned by GET /templates/{template_id} */
export type Template = {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  content: string;
  image: string | null;
  defaultToneOptions: string[];
  defaultClosingOptions: string[];
  formSchema: Record<string, unknown>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  source: string;
};

/** Summary shape returned inside GET /templates list */
export type TemplateSummary = {
  id: string;
  title: string;
  description: string;
  category: string;
  content?: string;
  image?: string;
};

// ─── Template endpoints ───────────────────────────────────────────────────────

/**
 * GET /templates/{template_id}
 *
 * Returns the full template record, or null on 404.
 * Throws on unexpected server/network errors.
 */
export async function getTemplate(templateId: string): Promise<Template | null> {
  const res = await fetch(
    `${BACKEND_URL}/templates/${encodeURIComponent(templateId)}`,
    // Always fetch fresh — template content may be updated at any time.
    { cache: 'no-store' },
  );

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(
      `Backend error fetching template "${templateId}": ${res.status} ${res.statusText}`,
    );
  }

  return res.json() as Promise<Template>;
}

/**
 * GET /templates
 *
 * Returns a paginated list of template summaries.
 */
export async function listTemplates(opts?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ templates: TemplateSummary[]; page: number; limit: number; total: number }> {
  const params = new URLSearchParams();
  if (opts?.search) params.set('search', opts.search);
  if (opts?.category) params.set('category', opts.category);
  if (opts?.page) params.set('page', String(opts.page));
  if (opts?.limit) params.set('limit', String(opts.limit));

  const res = await fetch(
    `${BACKEND_URL}/templates${params.size ? `?${params}` : ''}`,
    { cache: 'no-store' },
  );

  if (!res.ok) {
    throw new Error(`Backend error listing templates: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * GET /template-categories
 *
 * Returns all available template category strings.
 */
export async function listCategories(): Promise<string[]> {
  const res = await fetch(`${BACKEND_URL}/template-categories`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Backend error fetching categories: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { categories: string[] };
  return data.categories;
}
