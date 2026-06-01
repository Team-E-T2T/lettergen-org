/**
 * Home page — template browser (Step 1)
 *
 * Server Component: fetches all templates and categories from the backend on
 * the Node.js server, then passes the data to the client-side gallery for
 * interactive search and filtering.
 */

import { listTemplates, listCategories } from '@/lib/api';
import TemplateGallery from './TemplateGallery';

export default async function HomePage() {
  // Both requests run in parallel on the server.
  const [{ templates }, categories] = await Promise.all([
    listTemplates({ limit: 100 }),
    listCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <header className="mb-10 space-y-4">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-soft">
          Browse the library
        </div>
        <div className="max-w-3xl space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Choose a template
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            Browse professionally crafted letter templates for every occasion. Curated layouts
            designed for clarity, authority, and a cleaner presentation.
          </p>
        </div>
      </header>

      {/* Client component handles search, filter, and rendering the grid */}
      <TemplateGallery templates={templates} categories={categories} />
    </div>
  );
}
