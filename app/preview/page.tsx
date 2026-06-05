'use client';

import Link from 'next/link';
import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import EditorSidebar from '@/components/EditorSidebar';
import ToolbarButton from '@/components/ToolbarButton';

export const dynamic = 'force-dynamic';

interface Draft {
  draftId: string;
  documentName: string;
  contentHtml: string;
  templateName: string;
  category: string;
  lastEditedAt: string;
  wordCount: number;
}

const toolbarActions = [
  { label: 'Bold', icon: <span className="text-base font-semibold">B</span>, command: 'bold' },
  { label: 'Italic', icon: <span className="text-base italic">I</span>, command: 'italic' },
  { label: 'Underline', icon: <span className="text-base underline">U</span>, command: 'underline' },
  { label: 'Align left', icon: <span className="text-base">≡</span>, command: 'justifyLeft' },
  { label: 'Align center', icon: <span className="text-base">≡</span>, command: 'justifyCenter' },
  { label: 'Align right', icon: <span className="text-base">≡</span>, command: 'justifyRight' },
  { label: 'Link', icon: <span className="text-base">🔗</span>, isLink: true },
];

function PreviewEditPageContent() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId') || '';

  const [activeFormat, setActiveFormat] = useState('bold');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(!!draftId);
  const [error, setError] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!draftId) {
      return;
    }

    const fetchDraft = async () => {
      try {
        const response = await fetch(`/api/letters/${draftId}`);
        if (!response.ok) throw new Error('Failed to fetch draft');
        const data = await response.json();
        const initialContent = data.contentHtml || '';
        setDraft(data);
        setContentHtml(initialContent);
        if (editorRef.current) {
          editorRef.current.innerHTML = initialContent;
        }
        setError('');
      } catch (err) {
        console.error('Failed to fetch draft:', err);
        setError('Failed to load draft');
        setDraft(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [draftId]);

  const handleToolbarClick = (action: (typeof toolbarActions)[0]) => {
    setActiveFormat(action.label);
    
    if (action.isLink) {
      const url = prompt('Enter the URL:');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    }
  };

  const handleContentChange = (html: string) => {
    setContentHtml(html);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg px-6 py-8 flex items-center justify-center">
        <p className="text-gray-500">Loading draft...</p>
      </div>
    );
  }

  if (error || !draft) {
    return (
      <div className="min-h-screen bg-brand-bg px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            {error || "Draft not found"}
          </div>
          <Link href="/" className="mt-4 text-blue-600 hover:underline">
            Back to templates
          </Link>
        </div>
      </div>
    );
  }

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
                  ref={editorRef}
                  className="min-h-[680px] rounded-[24px] border border-brand-border bg-white p-8 text-sm leading-7 text-gray-900 shadow-sm font-sans"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => handleContentChange(e.currentTarget.innerHTML)}
                />
              </div>
            </div>
          </section>

          <EditorSidebar draftId={draftId} documentName={draft?.documentName} contentHtml={contentHtml} />
        </div>
      </div>
    </div>
  );
}

export default function PreviewEditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg px-6 py-8" role="status" aria-live="polite"><span className="sr-only">Loading preview page</span></div>}>
      <PreviewEditPageContent />
    </Suspense>
  );
}
