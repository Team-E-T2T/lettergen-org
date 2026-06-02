export type BackendTemplate = {
  id: string;
  title: string;
  description: string;
  category: string;
  content?: string | null;
  image?: string | null;
};

export type DraftResponse = {
  draftId: string;
  documentName: string;
  contentHtml: string;
  contentText: string;
  template: {
    id: string;
    title: string;
    category: string;
  };
  templateName: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  lastEditedAt: string;
  wordCount: number;
};

const BACKEND_BASE_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

async function safeFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Backend request failed: ${response.status} ${response.statusText} - ${errorBody}`);
  }
  return response.json();
}

export async function listBackendTemplates(): Promise<BackendTemplate[]> {
  const result = await safeFetch<{ templates: BackendTemplate[] }>(`${BACKEND_BASE_URL}/templates`);
  return result.templates;
}

export async function fetchTemplateById(templateId: string): Promise<BackendTemplate | null> {
  try {
    return await safeFetch<BackendTemplate>(`${BACKEND_BASE_URL}/templates/${encodeURIComponent(templateId)}`);
  } catch {
    return null;
  }
}

export default BACKEND_BASE_URL;
