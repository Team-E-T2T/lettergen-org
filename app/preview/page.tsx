'use client';

import Link from 'next/link';
import { useState } from 'react';
import EditorSidebar from '@/components/EditorSidebar';
import ToolbarButton from '@/components/ToolbarButton';
import { useFormData } from '@/hooks/useFormData';

const toolbarActions = [
  { label: 'Bold', icon: <span className="text-base font-semibold">B</span>, command: 'bold' },
  { label: 'Italic', icon: <span className="text-base italic">I</span>, command: 'italic' },
  { label: 'Underline', icon: <span className="text-base underline">U</span>, command: 'underline' },
  { label: 'Align left', icon: <span className="text-base">≡</span>, command: 'justifyLeft' },
  { label: 'Align center', icon: <span className="text-base">≡</span>, command: 'justifyCenter' },
  { label: 'Align right', icon: <span className="text-base">≡</span>, command: 'justifyRight' },
  { label: 'Link', icon: <span className="text-base">🔗</span>, isLink: true },
];

export default function PreviewEditPage() {
  const [activeFormat, setActiveFormat] = useState('bold');
  const { formData } = useFormData();

  const handleToolbarClick = (action: (typeof toolbarActions)[0]) => {
    setActiveFormat(action.label);
    
    if (action.isLink) {
      const url = prompt('Enter the URL:');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    }
  };

  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-6">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/" className="hover:text-gray-900">Choose Template</Link>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900">Preview & Edit</span>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-paper border border-brand-border">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Preview & Edit</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
              Refine your letter draft with a polished editor view, formatting toolbar, and export-ready sidebar.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_0.8fr]">
          <section className="rounded-[32px] bg-white p-8 shadow-paper border border-brand-border">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-brand-border bg-slate-50 p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  {toolbarActions.map((action) => (
                    <ToolbarButton
                      key={action.label}
                      label={action.label}
                      icon={action.icon}
                      command={action.command}
                      active={activeFormat === action.label}
                      onClick={() => handleToolbarClick(action)}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-brand-border bg-white p-8 shadow-sm min-h-[720px]">
                <div
                  className="min-h-[680px] rounded-[24px] border border-brand-border bg-white p-8 text-sm leading-7 text-gray-900 shadow-sm font-sans"
                  contentEditable
                  suppressContentEditableWarning
                >
                  <div className="flex flex-col gap-1 text-sm text-gray-900">
                    <span>{today}</span>
                  </div>
                  <div className="mt-8 space-y-5">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900">{formData.recipientName || 'Recipient Name'}</p>
                      {formData.company && <p className="text-sm text-gray-900">{formData.company}</p>}
                      {formData.recipientAddress && (
                        formData.recipientAddress.split('\n').map((line, idx) => (
                          <p key={idx} className="text-sm text-gray-900">{line}</p>
                        ))
                      )}
                    </div>

                    <p className="text-sm text-gray-900">Dear {formData.recipientName?.split(' ')[0] || 'Recipient'},</p>

                    <div className="space-y-5 text-sm text-gray-900">
                      {formData.subjectLine && (
                        <p className="font-semibold">Re: {formData.subjectLine}</p>
                      )}
                      {formData.letterBody ? (
                        <p>{formData.letterBody}</p>
                      ) : (
                        <p className="text-gray-400 italic">Your letter content will appear here. Add details in the form to generate your letter.</p>
                      )}
                    </div>

                    <div className="mt-8 space-y-3">
                      <p className="text-sm text-gray-900">Sincerely,</p>
                      <p className="text-sm text-gray-900 font-semibold">{formData.fullName || 'Your Name'}</p>
                      {formData.email && <p className="text-sm text-gray-900">{formData.email}</p>}
                      {formData.mailingAddress && <p className="text-sm text-gray-900">{formData.mailingAddress}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <EditorSidebar />
        </div>
      </div>
    </div>
  );
}
