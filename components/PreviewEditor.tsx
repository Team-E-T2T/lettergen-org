'use client';

import { useMemo, useRef, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link } from 'lucide-react';
import type { Draft } from '@/lib/api';
import EditorSidebar from '@/components/EditorSidebar';
import ToolbarButton from '@/components/ToolbarButton';

const toolbarActions = [
  { label: 'Bold', command: 'bold', icon: <Bold size={16} /> },
  { label: 'Italic', command: 'italic', icon: <Italic size={16} /> },
  { label: 'Underline', command: 'underline', icon: <Underline size={16} /> },
  { label: 'Bullet list', command: 'insertUnorderedList', icon: <List size={16} /> },
  { label: 'Numbered list', command: 'insertOrderedList', icon: <ListOrdered size={16} /> },
  { label: 'Link', command: 'createLink', isLink: true, icon: <Link size={16} /> },
];

type PreviewEditorProps = {
  draft: Draft;
};

export default function PreviewEditor({ draft }: PreviewEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [documentName, setDocumentName] = useState(draft.documentName);
  const [saveStatus, setSaveStatus] = useState('');
  const [lastEditedAt, setLastEditedAt] = useState(draft.lastEditedAt);
  const [wordCount, setWordCount] = useState(draft.wordCount);

  const formattedLastEditedAt = useMemo(() => {
    try {
      return new Date(lastEditedAt).toLocaleString();
    } catch {
      return lastEditedAt;
    }
  }, [lastEditedAt]);

  const handleToolbarClick = async (action: (typeof toolbarActions)[0]) => {
    if (action.isLink) {
      const url = window.prompt('Enter the URL:');
      if (url) {
        document.execCommand(action.command, false, url);
      }
      return;
    }

    document.execCommand(action.command, false);
  };

  const handleSaveDocument = async () => {
    if (!editorRef.current) return;

    const contentHtml = editorRef.current.innerHTML;
    setSaveStatus('Saving...');

    try {
      const response = await fetch(`/api/letters/${encodeURIComponent(draft.draftId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentName, contentHtml }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setSaveStatus(`Save failed: ${payload?.error || response.statusText}`);
        return;
      }

      setSaveStatus('Saved successfully');
      setLastEditedAt(payload.updatedAt || lastEditedAt);
      setWordCount(payload.wordCount || wordCount);
      window.setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Save failed. Try again.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 xl:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              Save Draft
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Review your letter draft
            </h1>
          </div>
          <div className="flex flex-col gap-1 sm:items-end">
            <p className="text-sm text-slate-600">Template</p>
            <p className="text-lg font-semibold text-slate-900">{draft.templateName}</p>
          </div>
        </div>

        {/* Main Editor + Sidebar Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* Editor Section */}
          <div className="space-y-6">
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-slate-100 px-6 py-4 text-sm text-slate-600">
              <span>Category: {draft.category}</span>
              <span className="text-slate-300">|</span>
              <span>Updated {formattedLastEditedAt}</span>
              <span className="text-slate-300">|</span>
              <span>{wordCount} words</span>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-4 shadow-sm">
              {toolbarActions.map((action) => (
                <ToolbarButton
                  key={action.label}
                  label={action.label}
                  icon={action.icon}
                  command={action.command}
                  onClick={action.isLink ? () => handleToolbarClick(action) : undefined}
                />
              ))}
            </div>

            {/* Editor Content */}
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="min-h-96 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
                dangerouslySetInnerHTML={{ __html: draft.contentHtml }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <EditorSidebar
              documentName={documentName}
              onDocumentNameChange={setDocumentName}
              onSaveDocument={handleSaveDocument}
              saveStatus={saveStatus}
              templateName={draft.templateName}
              category={draft.category}
              lastEditedAt={formattedLastEditedAt}
              wordCount={wordCount}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
