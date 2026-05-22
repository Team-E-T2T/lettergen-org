import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'select' | 'textarea';
  name?: string;
  options?: Option[];
  value?: string;
  onChange?: (value: string) => void;
}

export default function FormInput({
  label,
  placeholder,
  type = 'text',
  name,
  options,
  value = '',
  onChange,
}: Props) {
  const baseStyles =
    'w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-brand-blue';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={`${baseStyles} min-h-[140px] resize-none`}
        />
      
) : type === 'select' ? (
  <select name={name} value={value} onChange={handleChange} className={baseStyles}>
    <option value="">{placeholder || "Select an option"}</option>
    {options?.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={baseStyles}
        />
      )}
    </div>
  );
}
