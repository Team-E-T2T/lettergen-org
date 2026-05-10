export default function Home() {
  return (
    <div className="soft-bg">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-soft">
              <span className="mr-2 h-2 w-2 rounded-full bg-sky-500" />
              Modern letter generation for teams and individuals
            </div>
            <div className="space-y-5">
              <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Generate professional letters with a cleaner workflow.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Choose a template, refine the tone, and export polished letters for business, government, or personal use. Everything is
                presented in a calmer, more premium interface.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/templates"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Browse Templates
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                See Features
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
                <div className="text-2xl font-semibold tracking-tight text-slate-950">40+</div>
                <div className="mt-1 text-sm text-slate-500">Ready-made formats</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
                <div className="text-2xl font-semibold tracking-tight text-slate-950">1 min</div>
                <div className="mt-1 text-sm text-slate-500">From draft to export</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
                <div className="text-2xl font-semibold tracking-tight text-slate-950">24/7</div>
                <div className="mt-1 text-sm text-slate-500">Always available</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-sky-100 via-white to-slate-100 blur-3xl" />
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Letter preview</span>
                  <span>Live</span>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="h-3 w-28 rounded-full bg-white/20" />
                  <div className="h-3 w-3/4 rounded-full bg-white/20" />
                  <div className="h-3 w-2/3 rounded-full bg-white/20" />
                </div>
                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-sky-200">Tone</div>
                    <div className="mt-2 text-sm font-medium">Professional</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-sky-200">Format</div>
                    <div className="mt-2 text-sm font-medium">Formal letter</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Precision in three steps</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="card-bg rounded-3xl border border-slate-200 p-6 shadow-soft">
              <div className="text-sm font-semibold text-slate-500">01</div>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">Draft</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Choose a template and provide the key details needed to personalize your letter.</p>
            </div>
            <div className="card-bg rounded-3xl border border-slate-200 p-6 shadow-soft">
              <div className="text-sm font-semibold text-slate-500">02</div>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">Refine</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Adjust tone and structure for clarity, confidence, and the right level of formality.</p>
            </div>
            <div className="card-bg rounded-3xl border border-slate-200 p-6 shadow-soft">
              <div className="text-sm font-semibold text-slate-500">03</div>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">Deliver</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Export your finished letter with formatting preserved and ready to send.</p>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Curated blueprints</h2>
              <p className="mt-2 max-w-2xl text-slate-600">A selection of high-quality templates to get you moving quickly without sacrificing polish.</p>
            </div>
            <a href="/templates" className="text-sm font-semibold text-slate-950 transition-colors hover:text-sky-600">
              Explore all templates
            </a>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700 shadow-soft">Executive Partnership</div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700 shadow-soft">Legal Dispute Resolution</div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700 shadow-soft">Sponsorship Proposal</div>
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">Ready to create your first letter?</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Start from a template and customize it in minutes with a more focused, modern interface.</p>
            </div>
            <a href="/templates" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5">
              Choose a Template
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
