"use client";

import { useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import FormInput from "@/components/FormInput";
import { templates as allTemplates } from "@/lib/templates";
import { useFormData } from "@/hooks/useFormData";

function getSelectedTemplateTitle(templateId: string) {
  if (!templateId) {
    return "Formal Request Letter";
  }

  const selectedTemplate = allTemplates.find((template) => template.id === templateId);
  return selectedTemplate?.title ?? "Formal Request Letter";
}

function NewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id") ?? "";
  const letterTitle = useMemo(() => getSelectedTemplateTitle(templateId), [templateId]);
  const { formData, updateFormData } = useFormData();

  const handleGenerate = () => {
    router.push("/preview");
  };

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-6">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Choose Template</Link>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900">Fill Details</span>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-paper border border-[#E5E7EB]">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{letterTitle}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
              Fill in the details below to architect a professional request that commands attention and clarity.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[70%_30%]">
          <section className="rounded-[32px] bg-white p-8 shadow-paper border border-[#E5E7EB]">
            <div className="space-y-12">
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
                    onChange={(value) => updateFormData({ fullName: value })}
                  />
                  <FormInput 
                    label="Email Address" 
                    placeholder="john@architect.com" 
                    type="email"
                    value={formData.email}
                    onChange={(value) => updateFormData({ email: value })}
                  />
                  <div className="md:col-span-2">
                    <FormInput 
                      label="Mailing Address" 
                      placeholder="123 Editorial Way, Suite 400, New York, NY"
                      value={formData.mailingAddress}
                      onChange={(value) => updateFormData({ mailingAddress: value })}
                    />
                  </div>
                </div>
              </div>

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
                    onChange={(value) => updateFormData({ recipientName: value })}
                  />
                  <FormInput 
                    label="Company / Organization" 
                    placeholder="Global Editorial Corp"
                    value={formData.company}
                    onChange={(value) => updateFormData({ company: value })}
                  />
                  <div className="md:col-span-2">
                    <FormInput 
                      label="Recipient Address" 
                      placeholder="456 Corporate Plaza, Los Angeles, CA" 
                      type="textarea"
                      value={formData.recipientAddress}
                      onChange={(value) => updateFormData({ recipientAddress: value })}
                    />
                  </div>
                </div>
              </div>

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
                    onChange={(value) => updateFormData({ subjectLine: value })}
                  />
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormInput
                      label="Letter Tone"
                      type="select"
                      name="letterTone"
                      value={formData.letterTone}
                      onChange={(value) => updateFormData({ letterTone: value })}
                      options={[
                        { value: "", label: "Formal & Professional" },
                        { value: "formal", label: "Formal & Professional" },
                        { value: "friendly", label: "Friendly & Clear" },
                      ]}
                    />
                    <FormInput
                      label="Preferred Closing"
                      type="select"
                      name="preferredClosing"
                      options={[
                        { value: "", label: "Sincerely," },
                        { value: "sincerely", label: "Sincerely," },
                        { value: "best", label: "Best regards," },
                      ]}
                    />
                  </div>
                  <FormInput
                    label="Main Points & Content"
                    type="textarea"
                    placeholder="Outline the core of your request here. Our AI will weave these into a polished narrative..."
                    value={formData.letterBody}
                    onChange={(value) => updateFormData({ letterBody: value })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3">
              <button
                onClick={handleGenerate}
                className="inline-flex items-center justify-center rounded-full bg-[#0052CC] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#003EA1] max-w-fit"
              >
                Generate Letter
              </button>
              <p className="text-xs text-gray-500">LetterFlow AI will optimize for clarity and tone.</p>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[32px] bg-[#F3F4F6] p-6 shadow-paper border border-[#E5E7EB]">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-6">Live Vellum Preview</h3>
              <div className="rounded-[28px] bg-white p-8 shadow-sm border border-[#E5E7EB] min-h-[500px] overflow-y-auto text-sm leading-6">
                {formData.fullName || formData.recipientName || formData.subjectLine || formData.letterBody ? (
                  <div className="space-y-4 text-gray-900">
                    <div className="text-xs text-gray-500">
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    
                    {(formData.recipientName || formData.company || formData.recipientAddress) && (
                      <div className="space-y-1 text-xs">
                        {formData.recipientName && <div className="font-medium">{formData.recipientName}</div>}
                        {formData.company && <div>{formData.company}</div>}
                        {formData.recipientAddress && <div className="whitespace-pre-wrap">{formData.recipientAddress}</div>}
                      </div>
                    )}
                    
                    {formData.recipientName && (
                      <div className="text-xs">Dear {formData.recipientName.split(' ')[0]},</div>
                    )}
                    
                    {formData.subjectLine && (
                      <div className="font-semibold text-xs">Re: {formData.subjectLine}</div>
                    )}
                    
                    {formData.letterBody && (
                      <div className="text-xs whitespace-pre-wrap">{formData.letterBody}</div>
                    )}
                    
                    {(formData.fullName || formData.email || formData.mailingAddress) && (
                      <div className="space-y-1 mt-4 pt-4 border-t border-gray-200 text-xs">
                        <div>Sincerely,</div>
                        {formData.fullName && <div className="font-medium">{formData.fullName}</div>}
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
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-5">Editorial Best Practices</h3>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex gap-3"><span className="mt-1 h-5 w-5 rounded-full bg-[#EAF1FF] text-[#0052CC] flex items-center justify-center text-xs">✓</span><span>Keep the subject line under 7 words for maximum impact.</span></li>
                <li className="flex gap-3"><span className="mt-1 h-5 w-5 rounded-full bg-[#EAF1FF] text-[#0052CC] flex items-center justify-center text-xs">✓</span><span>Avoid passive voice to sound more authoritative in requests.</span></li>
                <li className="flex gap-3"><span className="mt-1 h-5 w-5 rounded-full bg-[#EAF1FF] text-[#0052CC] flex items-center justify-center text-xs">✓</span><span>Ensure recipient details are double-checked for hierarchy accuracy.</span></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function NewPage() {
  return (
    <Suspense fallback={null}>
      <NewPageContent />
    </Suspense>
  );
}
