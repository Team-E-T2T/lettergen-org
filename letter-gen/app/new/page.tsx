"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { templates as allTemplates } from "@/lib/templates";

const defaultContent = "Dear [Name],\n\n[Type your letter here...]\n";

function getInitialDraft(templateId: string) {
  if (!templateId) {
    return {
      name: "",
      description: "",
      content: defaultContent,
    };
  }

  const selectedTemplate = allTemplates.find((template) => template.id === templateId);

  if (selectedTemplate) {
    return {
      name: selectedTemplate.title,
      description: selectedTemplate.description,
      content: selectedTemplate.content ?? defaultContent,
    };
  }

  return {
    name: templateId
      .split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    description: "",
    content: defaultContent,
  };
}

type NewLetterEditorProps = {
  initialDraft: ReturnType<typeof getInitialDraft>;
};

function NewLetterEditor({ initialDraft }: NewLetterEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(initialDraft.name);
  const [description, setDescription] = useState(initialDraft.description);
  const [content, setContent] = useState(initialDraft.content);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.alert(`Document "${name || "New Letter"}" generated successfully!`);
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
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Template Configuration Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:outline-none"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Document Purpose Description
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:outline-none"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Letter Correspondence Content Body
            </label>
            <textarea
              rows={16}
              className="w-full whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-relaxed text-slate-900 focus:border-slate-300 focus:outline-none"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-full bg-slate-950 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Generate Document
            </button>
            <Link
              href="/"
              className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function NewLetterForm() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id") ?? "";
  const initialDraft = useMemo(() => getInitialDraft(templateId), [templateId]);

  return <NewLetterEditor key={templateId || "new"} initialDraft={initialDraft} />;
}

export default function NewPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500">
          Loading document structures...
        </div>
      }
    >
      <NewLetterForm />
    </Suspense>
  );
}
