"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import TemplateCard from "../components/TemplateCard";
import { templates as allTemplates } from "../../lib/templates";

const categories = ["All", "Personal", "Government", "Office", "Bank", "Utility or household", "School", "Official"];

export default function TemplatesPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTemplates.filter((t) => {
      const matchCategory = active === "All" || (active === "Utility or household" ? t.category === "Utility or household" : t.category === active);
      const matchQuery = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [query, active]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <header className="mb-10 space-y-4">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-soft">
          Browse the library
        </div>
        <div className="max-w-3xl space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Choose a template</h1>
          <p className="text-lg leading-8 text-slate-600">
            Browse professionally crafted letter templates for every occasion. Curated layouts designed for clarity, authority, and a cleaner
            presentation.
          </p>
        </div>
      </header>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const activeClass = cat === active ? 'bg-slate-950 text-white shadow-soft' : 'bg-slate-100 text-slate-600';
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeClass}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 text-sm text-slate-500">Showing {filtered.length} template{filtered.length === 1 ? '' : 's'}</div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TemplateCard key={t.id} category={t.category} title={t.title} description={t.description} />
          ))}
        </div>
      </section>
    </div>
  );
}
