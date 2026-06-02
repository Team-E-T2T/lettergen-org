'use client';

import ToolbarButton from '@/components/ToolbarButton';

type EditorSidebarProps = {
  documentName: string;
  onDocumentNameChange: (value: string) => void;
  onSaveDocument: () => void;
  saveStatus: string;
  templateName: string;
  category: string;
  lastEditedAt: string;
  wordCount: number;
};

export default function EditorSidebar({
  documentName,
  onDocumentNameChange,
  onSaveDocument,
  saveStatus,
  templateName,
  category,
  lastEditedAt,
  wordCount,
}: EditorSidebarProps) {
  return (
    <aside className="space-y-4">
      {/* Document Identity */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Document Identity
        </p>
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Document name
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => onDocumentNameChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <button
            onClick={onSaveDocument}
            disabled={saveStatus === 'Saving...'}
            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            💾 Save Document
          </button>
        </div>
      </div>

      {/* Save Status + Export */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Save status
          </p>
          <p className="mt-2 text-sm text-slate-700">
            {saveStatus || 'No changes saved yet'}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
            Export Options
          </p>
          <div className="space-y-2">
            <ToolbarButton label="📄 PDF Export" />
            <ToolbarButton label="📋 DOCX Format" />
          </div>
        </div>
      </div>

      {/* Draft Details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Draft Details
        </p>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
            <span className="font-semibold text-slate-900">Template</span>
            <span className="text-slate-600">{templateName}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
            <span className="font-semibold text-slate-900">Category</span>
            <span className="text-slate-600">{category}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
            <span className="font-semibold text-slate-900">Last Edited</span>
            <span className="text-slate-600 text-xs">{lastEditedAt}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
            <span className="font-semibold text-slate-900">Word Count</span>
            <span className="text-slate-600">{wordCount}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
