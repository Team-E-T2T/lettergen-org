'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import TemplateCard from './components/TemplateCard';
import type { TemplateSummary } from '@/lib/api';

type Props = {
  templates: TemplateSummary[];
  categories: string[];
};

export default function TemplateGallery({ templates, categories }: Props) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string>('All');

  const allCategories = ['All', ...categories];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      const matchCategory = active === 'All' || t.category === active;
      const matchQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [query, active, templates]);

  return (
    <>
      {/* Search + category filter bar */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {allCategories.map((cat) => {
            const activeClass =
              cat === active
                ? 'bg-slate-950 text-white shadow-soft'
                : 'bg-slate-100 text-slate-600';
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${activeClass}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Template grid */}
      <section className="mt-8">
        <div className="mb-4 text-sm text-slate-500">
          Showing {filtered.length} template{filtered.length === 1 ? '' : 's'}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-soft">
            No templates match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <TemplateCard
                key={t.id}
                templateId={t.id}
                category={t.category}
                title={t.title}
                description={t.description}
                image={t.image}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
