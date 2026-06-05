'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/FormInput';
import { useFormData } from '@/hooks/useFormData';
import type { Template } from '@/lib/api';

type Props = {
  template: Template;
};

export default function NewLetterForm({ template }: Props) {
  const router = useRouter();
  const { formData, updateFormData } = useFormData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  // Persist the templateId into form state so the generate step can use it.
  useEffect(() => {
    updateFormData({ templateId: template.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.id]);

  const handleGenerate = async () => {
    // Validate required fields
    if (!formData.fullName?.trim()) {
      setGenerationError('Full name is required');
      return;
    }
    if (!formData.recipientName?.trim()) {
      setGenerationError('Recipient name is required');
      return;
    }
    if (!formData.recipientAddress?.trim()) {
      setGenerationError('Recipient address is required');
      return;
    }
    if (!formData.subjectLine?.trim()) {
      setGenerationError('Subject line is required');
      return;
    }

    setIsGenerating(true);
    setGenerationError('');

    try {
      const response = await fetch('/api/letters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: formData.templateId,
          senderFullName: formData.fullName,
          senderEmail: formData.email,
          senderMailingAddress: formData.mailingAddress,
          recipientName: formData.recipientName,
          recipientOrganization: formData.company,
          recipientAddress: formData.recipientAddress,
          subjectLine: formData.subjectLine,
          letterTone: formData.letterTone,
          preferredClosing: formData.preferredClosing,
          mainPoints: formData.letterBody,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setGenerationError(data.error || 'Failed to generate letter');
        setIsGenerating(false);
        return;
      }

      const data = await response.json();
      console.log('[NewLetterForm] Generate response:', {
        success: data.success,
        draftId: data.draftId,
        hasContentHtml: !!data.contentHtml,
        contentHtmlLength: data.contentHtml?.length || 0,
      });

      if (data.success && data.draftId) {
        // Store the generated draft data in localStorage (persists across sessions)
        if (typeof window !== 'undefined') {
          const draftData = {
            draftId: data.draftId,
            documentName: data.documentName || 'Generated Letter',
            contentHtml: data.contentHtml || '',
            templateName: data.template?.title || '',
            category: data.template?.category || '',
            lastEditedAt: data.createdAt || new Date().toISOString(),
            wordCount: data.wordCount || 0,
          };
          localStorage.setItem(`draft_${data.draftId}`, JSON.stringify(draftData));
          
          // Verify it was stored correctly
          const verify = localStorage.getItem(`draft_${data.draftId}`);
          const verifyData = verify ? JSON.parse(verify) : null;
          console.log('[NewLetterForm] Verified localStorage storage:', {
            stored: !!verify,
            contentHtmlMatch: verifyData?.contentHtmlLength === draftData.contentHtmlLength,
            contentHtmlLength: verifyData?.contentHtmlLength || 0,
          });
        }
        console.log('[NewLetterForm] Redirecting to preview with draftId:', data.draftId);
        router.push(`/preview?draftId=${data.draftId}`);
      } else {
        setGenerationError('Invalid response from server');
        setIsGenerating(false);
      }
    } catch (err) {
      console.error('Generate error:', err);
      setGenerationError('Network error: Unable to generate letter');
      setIsGenerating(false);
    }
  };

  // Map the backend's defaultToneOptions array → <select> options.
  // e.g. ["formal", "professional", "firm"] → [{ value, label }]
  const toneOptions = template.defaultToneOptions.map((tone) => ({
    value: tone,
    label: tone.charAt(0).toUpperCase() + tone.slice(1),
  }));

  // Map the backend's defaultClosingOptions array → <select> options.
  // e.g. ["Sincerely", "Regards", "Thank you"] → [{ value, label }]
  const closingOptions = template.defaultClosingOptions.map((closing) => ({
    value: closing,
    label: closing,
  }));

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <header className="space-y-6">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">
              Choose Template
            </Link>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900">Fill Details</span>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-paper border border-[#E5E7EB]">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              {template.title}
            </h1>
            {template.description && (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
                {template.description}
              </p>
            )}
          </div>
        </header>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[70%_30%]">
          {/* Form */}
          <section className="rounded-[32px] bg-white p-8 shadow-paper border border-[#E5E7EB]">
            <div className="space-y-12">
              {/* 01 · Your Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1FF] text-sm font-semibold text-[#0052CC]">
                    01
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Your Information</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormInput
                    label="Full Name"
                    placeholder="Johnathan Doe"
                    value={formData.fullName}
                    onChange={(e) => updateFormData({ fullName: e.target.value })}
                  />
                  <FormInput
                    label="Email Address"
                    placeholder="john@architect.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <FormInput
                      label="Mailing Address"
                      placeholder="123 Editorial Way, Suite 400, New York, NY"
                      value={formData.mailingAddress}
                      onChange={(e) => updateFormData({ mailingAddress: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* 02 · Recipient Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1FF] text-sm font-semibold text-[#0052CC]">
                    02
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Recipient Details</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormInput
                    label="Recipient Name"
                    placeholder="Sarah Jenkins"
                    value={formData.recipientName}
                    onChange={(e) => updateFormData({ recipientName: e.target.value })}
                  />
                  <FormInput
                    label="Company / Organization"
                    placeholder="Global Editorial Corp"
                    value={formData.company}
                    onChange={(e) => updateFormData({ company: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <FormInput
                      label="Recipient Address"
                      placeholder="456 Corporate Plaza, Los Angeles, CA"
                      type="textarea"
                      value={formData.recipientAddress}
                      onChange={(e) => updateFormData({ recipientAddress: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* 03 · Letter Purpose */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1FF] text-sm font-semibold text-[#0052CC]">
                    03
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Letter Purpose</h2>
                </div>
                <div className="space-y-6">
                  <FormInput
                    label="Subject Line"
                    placeholder="Formal Request for Project Review"
                    value={formData.subjectLine}
                    onChange={(e) => updateFormData({ subjectLine: e.target.value })}
                  />
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Letter Tone — options come from the backend template */}
                    <FormInput
                      label="Letter Tone"
                      type="select"
                      name="letterTone"
                      placeholder="Select tone"
                      value={formData.letterTone}
                      onChange={(e) => updateFormData({ letterTone: e.target.value })}
                      options={toneOptions}
                    />
                    {/* Preferred Closing — options come from the backend template */}
                    <FormInput
                      label="Preferred Closing"
                      type="select"
                      name="preferredClosing"
                      placeholder="Select closing"
                      value={formData.preferredClosing}
                      onChange={(e) => updateFormData({ preferredClosing: e.target.value })}
                      options={closingOptions}
                    />
                  </div>
                  <FormInput
                    label="Main Points & Content"
                    type="textarea"
                    placeholder="Outline the core of your request here. Our AI will weave these into a polished narrative..."
                    value={formData.letterBody}
                    onChange={(e) => updateFormData({ letterBody: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3">
              {generationError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {generationError}
                </div>
              )}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex items-center justify-center rounded-full bg-[#0052CC] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#003EA1] disabled:bg-gray-400 disabled:cursor-not-allowed max-w-fit"
              >
                {isGenerating ? 'Generating...' : 'Generate Letter'}
              </button>
              <p className="text-xs text-gray-500">LetterGen AI will optimize for clarity and tone.</p>
            </div>
          </section>

          {/* Live Preview sidebar */}
          <aside className="space-y-6">
            <div className="rounded-[32px] bg-[#F3F4F6] p-6 shadow-paper border border-[#E5E7EB]">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-6">
                Live Vellum Preview
              </h3>
              <div className="rounded-[28px] bg-white p-8 shadow-sm border border-[#E5E7EB] min-h-[500px] overflow-y-auto text-sm leading-6">
                {formData.fullName ||
                formData.recipientName ||
                formData.subjectLine ||
                formData.letterBody ? (
                  <div className="space-y-4 text-gray-900">
                    <div className="text-xs text-gray-500">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>

                    {(formData.recipientName || formData.company || formData.recipientAddress) && (
                      <div className="space-y-1 text-xs">
                        {formData.recipientName && (
                          <div className="font-medium">{formData.recipientName}</div>
                        )}
                        {formData.company && <div>{formData.company}</div>}
                        {formData.recipientAddress && (
                          <div className="whitespace-pre-wrap">{formData.recipientAddress}</div>
                        )}
                      </div>
                    )}

                    {formData.recipientName && (
                      <div className="text-xs">
                        Dear {formData.recipientName.split(' ')[0]},
                      </div>
                    )}

                    {formData.subjectLine && (
                      <div className="font-semibold text-xs">Re: {formData.subjectLine}</div>
                    )}

                    {formData.letterBody && (
                      <div className="text-xs whitespace-pre-wrap">{formData.letterBody}</div>
                    )}

                    {(formData.fullName || formData.email || formData.mailingAddress) && (
                      <div className="space-y-1 mt-4 pt-4 border-t border-gray-200 text-xs">
                        <div>{formData.preferredClosing || 'Sincerely'},</div>
                        {formData.fullName && (
                          <div className="font-medium">{formData.fullName}</div>
                        )}
                        {formData.email && <div>{formData.email}</div>}
                        {formData.mailingAddress && <div>{formData.mailingAddress}</div>}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <div className="h-2.5 w-20 rounded-full bg-[#E5E7EB]" />
                    <div className="h-2 w-24 rounded-full bg-[#E5E7EB]" />
                    <div className="h-2 w-28 rounded-full bg-[#E5E7EB]" />
                    <p className="text-xs text-gray-500">Fill details to see preview</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-6 shadow-paper border border-[#E5E7EB]">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-5">
                Editorial Best Practices
              </h3>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="mt-1 h-5 w-5 rounded-full bg-[#EAF1FF] text-[#0052CC] flex items-center justify-center text-xs">
                    ✓
                  </span>
                  <span>Keep the subject line under 7 words for maximum impact.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-5 w-5 rounded-full bg-[#EAF1FF] text-[#0052CC] flex items-center justify-center text-xs">
                    ✓
                  </span>
                  <span>Avoid passive voice to sound more authoritative in requests.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-5 w-5 rounded-full bg-[#EAF1FF] text-[#0052CC] flex items-center justify-center text-xs">
                    ✓
                  </span>
                  <span>Ensure recipient details are double-checked for hierarchy accuracy.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
