import { useState, useEffect } from 'react';

export type FormData = {
  fullName: string;
  email: string;
  mailingAddress: string;
  recipientName: string;
  company: string;
  recipientAddress: string;
  subjectLine: string;
  letterTone: string;
  letterBody: string;
};

const STORAGE_KEY = 'lettergen_form_data';

export function useFormData() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    mailingAddress: '',
    recipientName: '',
    company: '',
    recipientAddress: '',
    subjectLine: '',
    letterTone: 'formal',
    letterBody: '',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFormData(JSON.parse(stored));
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
    setFormData({
      fullName: '',
      email: '',
      mailingAddress: '',
      recipientName: '',
      company: '',
      recipientAddress: '',
      subjectLine: '',
      letterTone: 'formal',
      letterBody: '',
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  return { formData, updateFormData, clearFormData };
}
