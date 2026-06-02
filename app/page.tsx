import TemplateLibrary from "@/components/TemplateLibrary";
import { listBackendTemplates } from "@/lib/backend";

export default async function HomePage() {
  let templates = [];
  let loadError = false;

  try {
    templates = await listBackendTemplates();
  } catch (error) {
    loadError = true;
  }

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

      {loadError ? (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-soft">
          Unable to load templates from the backend. Please ensure the backend is running and try again.
        </div>
      ) : (
        <TemplateLibrary initialTemplates={templates} />
      )}
    </div>
  );
}
