"use client";
import Link from "next/link";
import { Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-950"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-soft">
              LF
            </span>
            <span>LetterFlow</span>
          </Link>
          <nav className="hidden text-sm text-slate-500 md:block">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-slate-950">
                  Home
                </Link>
              </li>
              <li className="text-slate-300">/</li>
              <li className="text-slate-950">Templates</li>
            </ol>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/new"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            New Letter
          </Link>
          <button aria-label="notifications" className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50">
            <Bell size={18} />
          </button>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500 ring-1 ring-slate-200">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
