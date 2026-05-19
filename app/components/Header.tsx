"use client";
import Link from "next/link";
// visual icons available via lucide-react when needed

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-primary-600 text-xl font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
            LetterFlow
          </Link>
        </div>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm text-slate-600">
            <li>
              <a href="#features" className="hover:text-slate-900">Features</a>
            </li>
            <li>
              <Link href="/" className="hover:text-slate-900">Templates</Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-sm text-slate-600 hover:underline">Sign In</Link>
          <Link
            href="/new"
            className="rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
