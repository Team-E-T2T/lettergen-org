"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import FormInput from "@/components/FormInput";
import type { BackendTemplate } from "@/lib/backend";

type NewTemplateFormProps = {
  template: BackendTemplate | null;
  templateId: string;
};

export default function NewTemplateForm({ template, templateId }: NewTemplateFormProps) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);

  const letterTitle = useMemo(() => {
    if (!template) {
      return "Formal Request Letter";
    }
    return template.title;
  }, [template]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData.entries()) as Record<string, string>;
    body.templateId = template?.id ?? templateId;

    try {
      const response = await fetch("/api/letters/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!response.ok) {
        setErrorMessage(result.error || "Unable to generate a letter draft.");
        setIsSubmitting(false);
        return;
      }

      setDraftId(result.draftId ?? null);
      setStatusMessage("Your letter draft was created successfully.");
      setIsSubmitting(false);
    } catch (error) {
      setErrorMessage("Unable to reach the backend. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (templateId && !template) {
    return (
      <div className="min-h-screen bg-brand-bg px-6 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="rounded-[32px] bg-white p-8 shadow-paper border border-[#E5E7EB]">
            <h1 className="text-3xl font-semibold text-gray-900">Template not found</h1>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              We could not find the requested template. Return to the template library and choose another option.
            </p>
            <Link href="/" className="mt-6 inline-flex rounded-full bg-[#0052CC] px-5 py-3 text-sm font-semibold text-white hover:bg-[#003EA1]">
              Back to templates
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              Fill in the details below to generate a polished letter draft directly from the backend.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[70%_30%]">
          <section className="rounded-[32px] bg-white p-8 shadow-paper border border-[#E5E7EB]">
            <form className="space-y-12" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1FF] text-sm font-semibold text-[#0052CC]">
                    01
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Your Information</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormInput label="Full Name" name="senderFullName" placeholder="Johnathan Doe" />
                  <FormInput label="Email Address" name="senderEmail" placeholder="john@architect.com" type="email" />
                  <div className="md:col-span-2">
                    <FormInput label="Mailing Address" name="senderMailingAddress" placeholder="123 Editorial Way, Suite 400, New York, NY" />
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
                  <FormInput label="Recipient Name" name="recipientName" placeholder="Sarah Jenkins" />
                  <FormInput label="Company / Organization" name="recipientOrganization" placeholder="Global Editorial Corp" />
                  <div className="md:col-span-2">
                    <FormInput label="Recipient Address" name="recipientAddress" placeholder="456 Corporate Plaza, Los Angeles, CA" type="textarea" />
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
                  <FormInput label="Subject Line" name="subjectLine" placeholder="Formal Request for Project Review" />
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormInput
                      label="Letter Tone"
                      type="select"
                      name="letterTone"
                      placeholder="Formal & Professional"
                      options={[
                        { value: "formal", label: "Formal & Professional" },
                        { value: "friendly", label: "Friendly & Clear" },
                      ]}
                    />
                    <FormInput
                      label="Preferred Closing"
                      type="select"
                      name="preferredClosing"
                      placeholder="Sincerely,"
                      options={[
                        { value: "sincerely", label: "Sincerely," },
                        { value: "best", label: "Best regards," },
                      ]}
                    />
                  </div>
                  <FormInput
                    label="Main Points & Content"
                    name="mainPoints"
                    type="textarea"
                    placeholder="Outline the core of your request here. Our backend will generate a polished narrative."
                  />
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-[#0052CC] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#003EA1] disabled:cursor-not-allowed disabled:opacity-60 max-w-fit"
                >
                  {isSubmitting ? "Generating…" : "Generate Letter"}
                </button>
                <p className="text-xs text-gray-500">We send the request to the backend endpoint to create your draft.</p>
                {statusMessage && <p className="text-sm text-green-600">{statusMessage}</p>}
                {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
                {draftId && (
                  <p className="text-sm text-slate-700">
                    Draft created: <span className="font-semibold">{draftId}</span>
                  </p>
                )}
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[32px] bg-[#F3F4F6] p-6 shadow-paper border border-[#E5E7EB]">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-6">Live Vellum Preview</h3>
              <div className="rounded-[28px] bg-white p-8 shadow-sm border border-[#E5E7EB] min-h-[320px] flex flex-col items-center justify-center gap-3">
                <div className="h-2.5 w-20 rounded-full bg-[#E5E7EB]" />
                <div className="h-2 w-24 rounded-full bg-[#E5E7EB]" />
                <div className="h-2 w-28 rounded-full bg-[#E5E7EB]" />
                <p className="text-sm text-gray-500 text-center">Complete the form to unlock the backend draft.</p>
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
