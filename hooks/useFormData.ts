import { useState, useEffect } from 'react';

export type FormData = {
  /** The backend template ID selected by the user — needed for POST /letters/generate */
  templateId: string;
  fullName: string;
  email: string;
  mailingAddress: string;
  recipientName: string;
  company: string;
  recipientAddress: string;
  subjectLine: string;
  letterTone: string;
  preferredClosing: string;
  letterBody: string;
};

const STORAGE_KEY = 'lettergen_form_data';

const EMPTY_FORM: FormData = {
  templateId: '',
  fullName: '',
  email: '',
  mailingAddress: '',
  recipientName: '',
  company: '',
  recipientAddress: '',
  subjectLine: '',
  letterTone: '',
  preferredClosing: '',
  letterBody: '',
};

export function useFormData() {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFormData({ ...EMPTY_FORM, ...JSON.parse(stored) });
      } catch (error) {
        console.error('Failed to parse form data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever formData changes
  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearFormData = () => {
    setFormData(EMPTY_FORM);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { formData, updateFormData, clearFormData };
}
