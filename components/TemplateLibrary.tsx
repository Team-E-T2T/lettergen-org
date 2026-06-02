"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import TemplateCard from "@/app/components/TemplateCard";
import type { BackendTemplate } from "@/lib/backend";

type TemplateLibraryProps = {
  initialTemplates: BackendTemplate[];
};

export default function TemplateLibrary({ initialTemplates }: TemplateLibraryProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(initialTemplates.map((template) => template.category)));
    return ["All", ...uniqueCategories];
  }, [initialTemplates]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialTemplates.filter((template) => {
      const matchesCategory = activeCategory === "All" || template.category === activeCategory;
      const matchesQuery =
        !q ||
        template.title.toLowerCase().includes(q) ||
        template.description.toLowerCase().includes(q) ||
        template.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, initialTemplates, query]);

  return (
    <>
      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search templates"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => {
            const activeClass = category === activeCategory ? "bg-slate-950 text-white shadow-soft" : "bg-slate-100 text-slate-600";
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeClass}`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 text-sm text-slate-500">Showing {filtered.length} template{filtered.length === 1 ? "" : "s"}</div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <TemplateCard
              key={template.id}
              templateId={template.id}
              category={template.category}
              title={template.title}
              description={template.description}
            />
          ))}
        </div>
      </section>
    </>
  );
}
