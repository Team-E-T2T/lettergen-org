// In-memory database for development
// Replace with real DB (PostgreSQL, MongoDB, etc.) in production

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  content?: string;
  image?: string;
  defaultToneOptions?: string[];
  defaultClosingOptions?: string[];
  formSchema?: Record<string, unknown>;
}

export interface LetterDraft {
  draftId: string;
  templateId: string;
  documentName: string;
  contentHtml: string;
  contentText?: string;
  template: {
    id: string;
    title: string;
    category: string;
  };
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  userId?: string; // For future multi-user support
}

// Mock templates database
export const templatesDB: Template[] = [
  {
    id: '1',
    category: 'Personal',
    title: 'Formal Request Letter',
    description: 'A polished inquiry for high-level business collaborations and strategic partnerships.',
    defaultToneOptions: ['formal', 'friendly', 'persuasive'],
    defaultClosingOptions: ['sincerely', 'best regards', 'respectfully'],
    formSchema: {
      senderInfo: { required: true },
      recipientDetails: { required: true },
    },
  },
  {
    id: '2',
    category: 'Office',
    title: 'Legal Dispute Resolution',
    description: 'A firm yet professional document for addressing contractual disagreements or claims.',
    defaultToneOptions: ['formal', 'assertive'],
    defaultClosingOptions: ['sincerely', 'respectfully'],
  },
  {
    id: '3',
    category: 'Government',
    title: 'Sponsorship Proposal',
    description: 'Persuasive structure for seeking event funding or brand collaboration support.',
    defaultToneOptions: ['professional', 'persuasive', 'friendly'],
    defaultClosingOptions: ['best regards', 'sincerely'],
  },
  {
    id: '4',
    category: 'Bank',
    title: 'Notice of Resignation',
    description: 'Graceful and professional template for departing your current role on good terms.',
    defaultToneOptions: ['formal', 'professional'],
    defaultClosingOptions: ['sincerely', 'best regards'],
  },
  {
    id: '5',
    category: 'School',
    title: 'Consumer Grievance',
    description: 'Assertive but respectful template for resolving issues with products or services.',
    defaultToneOptions: ['assertive', 'respectful', 'formal'],
    defaultClosingOptions: ['sincerely', 'best regards'],
  },
  {
    id: '6',
    category: 'Official',
    title: 'Public Records Request',
    description: 'Compliant formatting for requesting documents under information freedom acts.',
    defaultToneOptions: ['formal', 'official'],
    defaultClosingOptions: ['sincerely', 'respectfully'],
  },
];

// Mock drafts database - in production use a real database
const draftsDB: Map<string, LetterDraft> = new Map();

// Helper to generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Helper to count words in HTML
function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// TEMPLATES
export function getAllTemplates(search?: string, category?: string): Template[] {
  let results = [...templatesDB];

  if (category && category !== 'All') {
    results = results.filter(t => t.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }

  return results;
}

export function getTemplateById(id: string): Template | undefined {
  return templatesDB.find(t => t.id === id);
}

// DRAFTS
export function createDraft(
  templateId: string,
  documentName: string,
  contentHtml: string,
  contentText: string,
  template: { id: string; title: string; category: string }
): LetterDraft {
  const draftId = generateId();
  const now = new Date().toISOString();

  const draft: LetterDraft = {
    draftId,
    templateId,
    documentName,
    contentHtml,
    contentText,
    template,
    wordCount: countWords(contentHtml),
    createdAt: now,
    updatedAt: now,
  };

  draftsDB.set(draftId, draft);
  return draft;
}

export function getDraftById(draftId: string): LetterDraft | undefined {
  return draftsDB.get(draftId);
}

export function updateDraft(
  draftId: string,
  updates: { documentName?: string; contentHtml?: string }
): LetterDraft | undefined {
  const draft = draftsDB.get(draftId);
  if (!draft) return undefined;

  const updated: LetterDraft = {
    ...draft,
    ...updates,
    wordCount: updates.contentHtml ? countWords(updates.contentHtml) : draft.wordCount,
    updatedAt: new Date().toISOString(),
  };

  draftsDB.set(draftId, updated);
  return updated;
}

export function deleteDraft(draftId: string): boolean {
  return draftsDB.delete(draftId);
}
