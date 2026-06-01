<<<<<<< HEAD
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
=======
"use client";

import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import TemplateCard from "./components/TemplateCard";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
}

const categories = ["All", "Personal", "Government", "Office", "Bank", "Utility or household", "School", "Official"];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("All");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (active !== "All") params.append("category", active);
        if (query) params.append("search", query);

        const response = await fetch(`/api/templates?${params}`);
        if (!response.ok) throw new Error("Failed to fetch templates");

        const data = await response.json();
        setTemplates(data.templates || []);
        setError("");
      } catch (err) {
        setError("Failed to load templates");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchTemplates, 300); // Debounce
    return () => clearTimeout(timer);
  }, [query, active]);

  const filtered = useMemo(() => {
    return templates;
  }, [templates]);
>>>>>>> origin/nimsara_updated

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <header className="mb-10 space-y-4">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-soft">
          Browse the library
        </div>
        <div className="max-w-3xl space-y-3">
<<<<<<< HEAD
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Choose a template
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            Browse professionally crafted letter templates for every occasion. Curated layouts
            designed for clarity, authority, and a cleaner presentation.
=======
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Choose a template</h1>
          <p className="text-lg leading-8 text-slate-600">
            Browse professionally crafted letter templates for every occasion. Curated layouts designed for clarity, authority, and a cleaner
            presentation.
>>>>>>> origin/nimsara_updated
          </p>
        </div>
      </header>

<<<<<<< HEAD
      {/* Client component handles search, filter, and rendering the grid */}
      <TemplateGallery templates={templates} categories={categories} />
=======
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
            const activeClass = cat === active ? "bg-slate-950 text-white shadow-soft" : "bg-slate-100 text-slate-600";
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
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-center text-slate-500">Loading templates...</div>
        ) : (
          <>
            <div className="mb-4 text-sm text-slate-500">
              Showing {filtered.length} template{filtered.length === 1 ? "" : "s"}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((t) => (
                <TemplateCard
                  key={t.id}
                  templateId={t.id}
                  category={t.category}
                  title={t.title}
                  description={t.description}
                />
              ))}
            </div>
          </>
        )}
      </section>
>>>>>>> origin/nimsara_updated
    </div>
  );
}
