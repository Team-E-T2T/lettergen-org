import React from 'react';

interface ToolbarButtonProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  command?: string;
}

export default function ToolbarButton({
  label,
  icon,
  active = false,
  onClick,
  command,
}: ToolbarButtonProps) {
  const handleClick = () => {
    if (command) {
      document.execCommand(command, false, undefined)
    }
    onClick?.();
  };

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleClick}
      className={`inline-flex h-11 min-w-[3rem] items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-semibold transition ${
        active
          ? 'border-brand-blue bg-brand-blue/10 text-brand-blue shadow-sm'
          : 'border-brand-border bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}
