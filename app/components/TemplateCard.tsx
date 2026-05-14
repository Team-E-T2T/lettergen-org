"use client";
import { motion } from "framer-motion";
import CategoryPill from "./CategoryPill";

type TemplateCardProps = {
  category: string;
  title: string;
  description: string;
  image?: string;
  onUse?: () => void;
  onPreview?: () => void;
};

export default function TemplateCard({ category, title, description }: TemplateCardProps) {
  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      className="card-bg flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/80 p-5 shadow-soft transition-shadow hover:shadow-hover"
    >
      <div className="flex items-start justify-between">
        <CategoryPill label={category} />
      </div>

      <div className="mt-4 flex-1">
        <div className="h-40 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-700 shadow-inner">
          <div className="flex h-full w-full items-end justify-between p-4">
            <div className="h-10 w-24 rounded-full bg-white/15 backdrop-blur" />
            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur" />
          </div>
        </div>
        <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5">
          Use Template
        </button>
        <button className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-950">
          Preview
        </button>
      </div>
    </motion.article>
  );
}
