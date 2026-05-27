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
import { getTemplate } from '@/lib/api';
import NewLetterForm from './NewLetterForm';

export default async function NewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await searchParams;

  // No template ID in the URL → nothing to show.
  if (!id || typeof id !== 'string') {
    notFound();
  }

  // Fetch the template from the backend on the server (Node.js, not the browser).
  const template = await getTemplate(id);

  // Template not found in the backend → show the 404 page.
  if (template === null) {
    notFound();
  }

  return <NewLetterForm template={template} />;
}
