"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
// Absolute path configuration link to read from your data array
import { templates as allTemplates } from "@/lib/templates";

function UseTemplateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id") || "";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  // Safely searches and matches content parameter parameters
  useEffect(() => {
    if (templateId) {
      const selectedTemplate = allTemplates.find((t: any) => t.id === templateId);

      if (selectedTemplate) {
        setName(selectedTemplate.title);
        setDescription(selectedTemplate.description);
        // Extracts the full raw multi-line structural template string block directly
        setContent(selectedTemplate.content || "Dear [Name],\n\n[Type your letter here...]");
      } else {
        // Safe programmatic formatting fallback if direct ID string isn't located
        const cleanName = templateId
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        setName(cleanName);
      }
    }
  }, [templateId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Document "${name}" Generated Successfully!`);
    router.push("/templates");
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Edit Layout: {name || "New Document"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Modify the content fields below to generate your custom file.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Template Configuration Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Document Purpose Description
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Letter Correspondence Content Body
            </label>
            <textarea
              rows={16}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:outline-none font-mono whitespace-pre-wrap leading-relaxed"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-full bg-slate-950 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              Generate Document
            </button>
            <Link
              href="/templates"
              className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// NextJS Suspense fallback layer block prevents build-time environment hook initialization faults
export default function UseTemplatePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading document structures...</div>}>
      <UseTemplateForm />
    </Suspense>
  );
}
