'use client';

import { useState } from 'react';

export default function EditorSidebar() {
  const [documentName, setDocumentName] = useState('Cover_Letter_Lumina_V2');
  const [saveStatus, setSaveStatus] = useState('');

  const handleSaveDocument = () => {
    setSaveStatus('Saving...');
    const editorContent = document.querySelector('[contentEditable="true"]')?.innerHTML;
    const docData = {
      name: documentName,
      content: editorContent,
      timestamp: new Date().toISOString(),
    };
    
    // Save to localStorage
    localStorage.setItem('letterDocument', JSON.stringify(docData));
    console.log('Document saved:', docData);
    
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handlePDFExport = () => {
    alert('PDF export functionality coming soon!');
  };

  const handleDOCXExport = () => {
    alert('DOCX export functionality coming soon!');
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
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          <button
            onClick={handleSaveDocument}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue/90"
          >
            <span className="text-base">💾</span>
            Save Document
          </button>
          <div className="space-y-3">
            <div className="rounded-[24px] border border-brand-border bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Export Options
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={handlePDFExport}
                  className="inline-flex items-center justify-center rounded-full border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  📄 PDF Export
                </button>
                <button
                  onClick={handleDOCXExport}
                  className="inline-flex items-center justify-center rounded-full border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
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
                  <span className="font-semibold text-gray-900">Template</span>
                  <span className="text-gray-500">Modern Executive</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="font-semibold text-gray-900">Category</span>
                  <span className="text-gray-500">Business / Professional</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="font-semibold text-gray-900">Last Edited</span>
                  <span className="text-gray-500">Today, 2:45 PM</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="font-semibold text-gray-900">Word Count</span>
                  <span className="text-gray-500">248 words</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
