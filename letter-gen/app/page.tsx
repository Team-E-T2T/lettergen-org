import FeatureCard from "./components/FeatureCard";
import TemplateCard from "./components/TemplateCard";
import { Layout, Edit3, Download } from "lucide-react";
import { templates as allTemplates } from "../lib/templates";

export default function Home() {
  const gallery = allTemplates.slice(0, 4);

  return (
    <div className="soft-bg">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full px-3 py-1 text-sm" style={{ background: 'rgba(219,234,254,0.6)', color: 'rgb(var(--color-primary))' }}>
              <span className="rounded-full h-2 w-2 block" style={{ background: 'rgb(219,234,254)' }} />
              NOW WITH AI DRAFTING
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Generate Professional <span className="text-primary-600">Letters</span> in Seconds
            </h1>

            <p className="max-w-2xl text-lg text-slate-600">
              The AI-powered way to draft formal correspondence with precision and speed. Transform your thoughts into polished, editorial-grade documents.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="/new" className="rounded-full px-6 py-3 text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}>
                Start
              </a>
              <a href="/templates" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700">
                View Templates
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-12 -bottom-10 z-0 h-56 w-56 rounded-full bg-gradient-to-br from-sky-200 to-indigo-200 opacity-60 blur-3xl" />
            <div className="relative z-10 mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-hover">
              <div className="rounded-xl bg-slate-900 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-300">Untitled letter</div>
                  <div className="text-xs text-slate-500">AI Draft</div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-3 w-3/4 rounded-full bg-white/20" />
                  <div className="h-3 w-full rounded-full bg-white/20" />
                  <div className="h-3 w-5/6 rounded-full bg-white/20" />
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-white/10" />
                  <div className="h-8 w-8 rounded bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-20 rounded-2xl bg-slate-50 p-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold text-slate-900">Precision in Three Acts</h2>
            <p className="mt-2 text-slate-600">Sophisticated drafting, simplified for modern professionals.</p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <FeatureCard Icon={Layout} title="Choose a Template" description="Select from our curated library of professional architectures, from formal notices to creative pitches." />
            <FeatureCard Icon={Edit3} title="Fill in Details" description="Provide key context. Our AI editorial engine weaves your specifics into a cohesive, authoritative narrative." />
            <FeatureCard Icon={Download} title="Download Your Letter" description="Review your composition on our digital vellum and export to PDF, Word, or direct email in one click." />
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Curated Blueprints</h3>
              <p className="mt-1 text-sm text-slate-600">The industry standard for formal correspondence.</p>
            </div>
            <a href="/templates" className="text-sm font-medium text-slate-700">View Gallery →</a>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((t) => (
              <TemplateCard key={t.id} category={t.category} title={t.title} description={t.description} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-3xl rounded-2xl p-10 text-center" style={{ background: 'linear-gradient(135deg,#E6F0FF,#F5F7FF)' }}>
            <h2 className="text-3xl font-semibold text-slate-900">Ready to Write Your Next Chapter?</h2>
            <p className="mt-3 text-slate-600">Join 50,000+ editors and professionals who have elevated their correspondence with LetterFlow.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a href="/new" className="rounded-full px-6 py-3 text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}>
                Create My First Letter
              </a>
              <a href="/about" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700">
                About Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
