'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import EditorSidebar from '@/components/EditorSidebar';
import ToolbarButton from '@/components/ToolbarButton';

interface LetterData {
  senderInfo: { fullName: string; email: string; address: string };
  recipientDetails: { name: string; company: string; address: string };
  letterPurpose: { subject: string; tone: string; closing: string; body: string };
  currentDate: string;
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

export default function PreviewEditPage() {
  const [activeFormat, setActiveFormat] = useState('bold');
  const [letterData, setLetterData] = useState<LetterData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('letterData');
    if (saved) {
      setLetterData(JSON.parse(saved));
    }
  }, []);

  const formattedLetter = useMemo(() => {
    if (!letterData) return null;

    const { senderInfo, recipientDetails, letterPurpose, currentDate } = letterData;
    const opening =
      letterPurpose.tone === "friendly"
        ? "I hope you are doing well as you read this request."
        : "I am contacting you to formally request your attention and support on the following matter.";

    const requestText = letterPurpose.body
      ? letterPurpose.body.trim()
      : "Please let me know how we can move forward together on the items described in the subject line.";

    return {
      senderAddress: senderInfo.address || "Your Address",
      senderName: senderInfo.fullName || "Your Name",
      date: currentDate,
      recipientName: recipientDetails.name || "Recipient Name",
      recipientCompany: recipientDetails.company || "Company / Organization",
      recipientAddress: recipientDetails.address || "Recipient Address",
      subject: letterPurpose.subject || "Formal Request for Collaboration",
      greeting: recipientDetails.name ? `Dear ${recipientDetails.name},` : "Dear [Recipient Name],",
      body: `${opening}\n\n${requestText}\n\nThank you for your time and consideration. Please feel free to reach out if you need any clarification or additional details.`,
      closing: letterPurpose.closing === "best" ? "Best regards," : "Sincerely,",
    };
  }, [letterData]);

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
                  {formattedLetter ? (
                    <div className="flex flex-col gap-4 text-sm text-gray-900">
                      <div className="flex flex-col gap-1">
                        <p>{formattedLetter.senderName}</p>
                        <p>{formattedLetter.senderAddress}</p>
                      </div>

                      <p>{formattedLetter.date}</p>

                      <div className="space-y-1">
                        <p>{formattedLetter.recipientName}</p>
                        <p>{formattedLetter.recipientCompany}</p>
                        <p>{formattedLetter.recipientAddress}</p>
                      </div>

                      <p>{formattedLetter.subject}</p>

                      <p>{formattedLetter.greeting}</p>

                      <div className="whitespace-pre-wrap">
                        {formattedLetter.body}
                      </div>

                      <div className="space-y-1">
                        <p>{formattedLetter.closing}</p>
                        <p>{formattedLetter.senderName}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 text-sm text-gray-900">
                      <span>Loading letter...</span>
                    </div>
                  )}
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
