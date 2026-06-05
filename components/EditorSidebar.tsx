'use client';

import { useState } from 'react';

interface EditorSidebarProps {
  draftId?: string;
  documentName?: string;
  contentHtml?: string;
}

export default function EditorSidebar({ draftId, documentName = 'Letter', contentHtml = '' }: EditorSidebarProps) {
  const [docName, setDocName] = useState(documentName);
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const buildDownloadUrl = (urlFromApi: string, currentDraftId: string, format: 'pdf' | 'docx', name: string) => {
    if (!urlFromApi) {
      return `/api/download/${encodeURIComponent(currentDraftId)}?format=${encodeURIComponent(format)}&name=${encodeURIComponent(name)}`;
    }

    try {
      const parsed = new URL(urlFromApi, window.location.origin);
      if (parsed.origin === window.location.origin) {
        return parsed.toString();
      }
    } catch {
      // Fall back to same-origin proxy URL below.
    }

    return `/api/download/${encodeURIComponent(currentDraftId)}?format=${encodeURIComponent(format)}&name=${encodeURIComponent(name)}`;
  };

  const handleSaveDocument = async () => {
    if (!draftId) {
      alert('No draft loaded');
      return;
    }

    setSaveStatus('Saving...');
    setIsSaving(true);

    try {
      const editorContent = document.querySelector('[contentEditable="true"]')?.innerHTML || contentHtml;
      
      const response = await fetch(`/api/letters/${draftId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: docName,
          contentHtml: editorContent,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      setSaveStatus('Saved!');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePDFExport = async () => {
    if (!draftId) {
      alert('No draft loaded');
      return;
    }

    try {
      const response = await fetch(`/api/letters/${draftId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: 'pdf',
          fileName: docName,
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.error ?? `Export failed with status ${response.status}`);
      }

      const data = await response.json();

      // Validate export response contract per pdf_download.md
      if (data.success !== true) {
        throw new Error('Export response missing success confirmation');
      }

      if (!data.downloadUrl) {
        throw new Error('Export response did not include a valid downloadUrl');
      }

      const downloadUrl = buildDownloadUrl(data.downloadUrl, draftId, 'pdf', docName);
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('PDF export error:', error);
      alert(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDOCXExport = async () => {
    if (!draftId) {
      alert('No draft loaded');
      return;
    }

    try {
      const response = await fetch(`/api/letters/${draftId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: 'docx',
          fileName: docName,
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.error ?? `Export failed with status ${response.status}`);
      }

      const data = await response.json();

      // Validate export response contract per pdf_download.md
      if (data.success !== true) {
        throw new Error('Export response missing success confirmation');
      }

      if (!data.downloadUrl) {
        throw new Error('Export response did not include a valid downloadUrl');
      }

      const downloadUrl = buildDownloadUrl(data.downloadUrl, draftId, 'docx', docName);
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('DOCX export error:', error);
      alert(`Failed to export DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <aside className="space-y-6">
      <section className="rounded-[32px] border border-brand-border bg-white p-8 shadow-paper">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500 mb-2 block">
              Document Name
            </label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              disabled={!draftId}
              className="w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-brand-blue disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <button
            onClick={handleSaveDocument}
            disabled={!draftId || isSaving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span className="text-base">💾</span>
            {isSaving ? 'Saving...' : 'Save Document'}
          </button>
          {saveStatus && (
            <div className="text-sm text-green-600 text-center">
              {saveStatus}
            </div>
          )}
          <div className="space-y-3">
            <div className="rounded-[24px] border border-brand-border bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Export Options
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={handlePDFExport}
                  disabled={!draftId}
                  className="inline-flex items-center justify-center rounded-full border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  📄 PDF Export
                </button>
                <button
                  onClick={handleDOCXExport}
                  disabled={!draftId}
                  className="inline-flex items-center justify-center rounded-full border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  📋 DOCX Format
                </button>
              </div>
            </div>

            <div className="rounded-[24px] border border-brand-border bg-slate-50 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Document Info
              </h3>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="font-semibold text-gray-900">Draft ID</span>
                  <span className="text-gray-500 font-mono text-xs">{draftId?.slice(0, 6) || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="font-semibold text-gray-900">Document Name</span>
                  <span className="text-gray-500">{docName}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="font-semibold text-gray-900">Last Edited</span>
                  <span className="text-gray-500">Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
