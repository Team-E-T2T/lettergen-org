"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import { templates as allTemplates } from "@/lib/templates";

export const dynamic = 'force-dynamic';

function getSelectedTemplateTitle(templateId: string) {
  if (!templateId) {
    return "Formal Request Letter";
  }

  const selectedTemplate = allTemplates.find((template) => template.id === templateId);
  return selectedTemplate?.title ?? "Formal Request Letter";
}

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default function NewPage() {
  const router = useRouter();
  const letterTitle = useMemo(() => getSelectedTemplateTitle("") , []);

  const [senderInfo, setSenderInfo] = useState({
    fullName: "",
    email: "",
    address: "",
  });

  const [recipientDetails, setRecipientDetails] = useState({
    name: "",
    company: "",
    address: "",
  });

  const [letterPurpose, setLetterPurpose] = useState({
    subject: "",
    tone: "formal",
    closing: "sincerely",
    body: "",
  });

  const currentDate = useMemo(() => formatDate(new Date()), []);

  const previewBody = useMemo(() => {
    const opening =
      letterPurpose.tone === "friendly"
        ? "I hope you are doing well as you read this request."
        : "I am contacting you to formally request your attention and support on the following matter.";

    const requestText = letterPurpose.body
      ? letterPurpose.body.trim()
      : "Please let me know how we can move forward together on the items described in the subject line.";

    return `${opening}

${requestText}

Thank you for your time and consideration. Please feel free to reach out if you need any clarification or additional details.`;
  }, [letterPurpose.body, letterPurpose.tone]);

  const handleGenerate = () => {
    const letterData = {
      senderInfo,
      recipientDetails,
      letterPurpose,
      currentDate,
    };
    localStorage.setItem('letterData', JSON.stringify(letterData));
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
                  <h2 className="text-lg font-semibold text-gray-900">Sender Information</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormInput
                    label="Full Name"
                    placeholder="Johnathan Doe"
                    value={senderInfo.fullName}
                    onChange={(e) => setSenderInfo({ ...senderInfo, fullName: e.target.value })}
                  />
                  <FormInput
                    label="Email Address"
                    placeholder="john@architect.com"
                    type="email"
                    value={senderInfo.email}
                    onChange={(e) => setSenderInfo({ ...senderInfo, email: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <FormInput
                      label="Mailing Address"
                      placeholder="123 Editorial Way, Suite 400, New York, NY"
                      value={senderInfo.address}
                      onChange={(e) => setSenderInfo({ ...senderInfo, address: e.target.value })}
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
                    value={recipientDetails.name}
                    onChange={(e) => setRecipientDetails({ ...recipientDetails, name: e.target.value })}
                  />
                  <FormInput
                    label="Company / Organization"
                    placeholder="Global Editorial Corp"
                    value={recipientDetails.company}
                    onChange={(e) => setRecipientDetails({ ...recipientDetails, company: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <FormInput
                      label="Recipient Address"
                      placeholder="456 Corporate Plaza, Los Angeles, CA"
                      type="textarea"
                      value={recipientDetails.address}
                      onChange={(e) => setRecipientDetails({ ...recipientDetails, address: e.target.value })}
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
                    value={letterPurpose.subject}
                    onChange={(e) => setLetterPurpose({ ...letterPurpose, subject: e.target.value })}
                  />
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormInput
                      label="Letter Tone"
                      type="select"
                      name="letterTone"
                      placeholder="Formal & Professional"
                      value={letterPurpose.tone}
                      onChange={(e) => setLetterPurpose({ ...letterPurpose, tone: e.target.value })}
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
                      value={letterPurpose.closing}
                      onChange={(e) => setLetterPurpose({ ...letterPurpose, closing: e.target.value })}
                      options={[
                        { value: "sincerely", label: "Sincerely," },
                        { value: "best", label: "Best regards," },
                      ]}
                    />
                  </div>
                  <FormInput
                    label="Main Points & Content"
                    type="textarea"
                    placeholder="Outline the core of your request here. Our AI will weave these into a polished narrative..."
                    value={letterPurpose.body}
                    onChange={(e) => setLetterPurpose({ ...letterPurpose, body: e.target.value })}
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
              <div className="rounded-[28px] bg-white p-8 shadow-sm border border-[#E5E7EB] min-h-[320px] text-sm leading-6">
                <div className="space-y-5">
                  <div>
                    <p className="text-gray-900">{senderInfo.fullName || "Your Name"}</p>
                    <p className="text-gray-900 whitespace-pre-line">{senderInfo.address || "Your Address"}</p>
                  </div>

                  <div className="text-gray-500">{currentDate}</div>

                  <div className="space-y-2">
                    <p className="text-gray-900">{recipientDetails.name || "Recipient Name"}</p>
                    <p className="text-gray-600">{recipientDetails.company || "Company / Organization"}</p>
                    {recipientDetails.address && <p className="text-gray-600 whitespace-pre-line">{recipientDetails.address}</p>}
                  </div>

                  <div className="border-t border-gray-200 pt-5">
                    <p className="text-gray-900">{letterPurpose.subject || "Formal Request for Collaboration"}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-5">
                    <p className="text-gray-900">{recipientDetails.name ? `Dear ${recipientDetails.name},` : "Dear [Recipient Name],"}</p>
                    <div className="mt-3 text-gray-900 whitespace-pre-line">{previewBody}</div>
                  </div>

                  <div className="pt-4">
                    <p className="text-gray-900">{letterPurpose.closing === "best" ? "Best regards," : "Sincerely,"}</p>
                    <p className="text-gray-900">{senderInfo.fullName || "Your Name"}</p>
                  </div>
                </div>
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
