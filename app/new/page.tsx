/**
 * /new?id={templateId}  — "Fill Details" page (Step 2)
 *
 * This is a Server Component. It reads the `id` query parameter, fetches the
 * full template record from the backend, and passes it to the client-side form.
 *
 * No 'use client' — data fetching happens on the Node.js server so the browser
 * never needs to talk directly to the backend for this initial load.
 */

import { notFound } from 'next/navigation';
import { getTemplate, listTemplates } from '@/lib/api';
import NewLetterForm from './NewLetterForm';

export default async function NewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await searchParams;

  let templateId = typeof id === 'string' ? id : undefined;

  if (!templateId) {
    const result = await listTemplates({ limit: 1 });
    if (!result.templates.length) {
      notFound();
    }
    templateId = result.templates[0].id;
  }

  const template = await getTemplate(templateId);

  if (template === null) {
    notFound();
  }

  return <NewLetterForm template={template} />;
}
