/**
 * Home page — template browser (Step 1)
 *
 * Server Component: fetches all templates and categories from the backend on
 * the Node.js server, then passes the data to the client-side gallery for
 * interactive search and filtering.
 */

import { listTemplates, listCategories } from '@/lib/api';
import TemplateGallery from './TemplateGallery';
import Link from 'next/link'; 

export default async function HomePage() {
  // Both requests run in parallel on the server.
  const [{ templates }, categories] = await Promise.all([
    listTemplates({ limit: 100 }),
    listCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <header className="mb-10 space-y-4">
        {/* Top row with badge and AI button on opposite sides */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="inline-flex items-center self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-soft">
            Browse the library
          </div>
          
          {/* Beautiful, styled modern AI button */}
          <Link href="/templates/new" className="inline-block">
            <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 active:scale-[0.98] transition-all duration-200">
              <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-3.3l-.85-.6C7.8 11.16 7 10.12 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.12-.8 2.16-2.15 3.1z"/>
              </svg>
              Create Template with AI
            </button>
          </Link>
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
