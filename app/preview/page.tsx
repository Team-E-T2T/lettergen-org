'use client';

import Link from 'next/link';
import { useState } from 'react';
import EditorSidebar from '@/components/EditorSidebar';
import ToolbarButton from '@/components/ToolbarButton';

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

  const handleToolbarClick = (action: (typeof toolbarActions)[0]) => {
    setActiveFormat(action.label);
    
    if (action.isLink) {
      const url = prompt('Enter the URL:');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    }
  };

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
                    <span>April 07, 2026</span>
                  </div>
                  <div className="mt-8 space-y-5">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900">Ms. Elena Vance</p>
                      <p className="text-sm text-gray-900">Director of Editorial Strategy</p>
                      <p className="text-sm text-gray-900">Lumina Publishing House</p>
                      <p className="text-sm text-gray-900">1223 Horizon Blvd, Suite 400</p>
                      <p className="text-sm text-gray-900">New York, NY 10014</p>
                    </div>

                    <p className="text-sm text-gray-900">Dear Ms. Vance,</p>

                    <div className="space-y-5 text-sm text-gray-900">
                      <p>
                        I am writing to formally submit my interest in the Senior Narrative Architect position at Lumina Publishing House. Having followed your editorial direction for several years, I am deeply impressed by the consistent elegance and structural integrity of the long-form features produced under your leadership.
                      </p>
                      <p>
                        In my previous role at The Daily Chronicle, I specialized in transforming complex data sets into evocative human stories. This required not only a mastery of language but a keen eye for architectural pacing—ensuring that the reader&apos;s journey is as informative as it is emotionally resonant. My work on the &ldquo;Urban Echoes&rdquo; series received national acclaim for its innovative approach to documentary-style reporting.
                      </p>
                      <p>
                        I believe that my background in linguistic precision and narrative structure aligns perfectly with Lumina&apos;s vision for the next generation of digital storytelling. I look forward to the possibility of discussing how my skills can contribute to your upcoming portfolio projects.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p>Sincerely,</p>
                      <p className="font-semibold text-brand-blue">Arthur Sterling</p>
                      <p className="text-sm text-gray-900">Editorial Consultant</p>
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
