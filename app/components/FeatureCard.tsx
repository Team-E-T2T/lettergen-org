import { LucideProps } from "lucide-react";

export default function FeatureCard({ Icon, title, description }: { Icon: React.ComponentType<LucideProps>; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="rounded-lg grid h-12 w-12 place-items-center text-primary-600" style={{ background: 'rgba(219,234,254,0.6)' }}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
