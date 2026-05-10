export default function Footer() {
  return (
    <footer className="mt-16 w-full border-t border-slate-200/80 bg-white/70">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-medium text-slate-900">LetterFlow</div>
            <div className="mt-1">Professional letters with a sharper workflow.</div>
          </div>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-slate-900">Privacy</a>
            <a href="#" className="transition-colors hover:text-slate-900">Terms</a>
            <a href="#" className="transition-colors hover:text-slate-900">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
