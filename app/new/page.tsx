"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import FormInput from "@/components/FormInput";

export const dynamic = 'force-dynamic';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  content?: string;
  defaultToneOptions?: string[];
  defaultClosingOptions?: string[];
  formSchema?: Record<string, unknown>;
}

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const normalizeToken = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const PLACEHOLDER_REGEX = /{{\s*([a-zA-Z0-9_-]+)\s*}}/g;

const extractPlaceholders = (content: string): string[] => {
  const found = new Set<string>();
  for (const match of content.matchAll(PLACEHOLDER_REGEX)) {
    if (match[1]) found.add(match[1]);
  }
  return Array.from(found);
};

const toLabel = (key: string) =>
  key
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const plainTextToHtml = (value: string) => {
  const normalized = value.trim();
  if (!normalized) return '<p></p>';
  return normalized
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
    .join('');
};

const fieldLabelMap: Record<string, string> = {
  senderFullName: 'Full Name',
  recipientName: 'Recipient Name',
  recipientOrganization: 'Company / Organization',
  recipientAddress: 'Recipient Address',
  subjectLine: 'Subject Line',
};

function NewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id") || "";

  const [template, setTemplate] = useState<Template | null>(null);
  const [templateLoading, setTemplateLoading] = useState(!!templateId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

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

  // Fetch template details
  useEffect(() => {
    if (!templateId) {
      return;
    }

    const fetchTemplate = async () => {
      try {
        console.info('[new/page] Fetching template', { templateId });
        const response = await fetch(`/api/templates/${templateId}`);
        if (!response.ok) {
          console.error('[new/page] Template fetch failed', {
            templateId,
            status: response.status,
            statusText: response.statusText,
          });
          throw new Error("Failed to fetch template");
        }
        const data = await response.json();
        const fetchedTemplate = data.template as Template;
        setTemplate(fetchedTemplate);

        setLetterPurpose((prev) => ({
          subject: prev.subject,
          tone: prev.tone || fetchedTemplate.defaultToneOptions?.[0] || 'formal',
          closing: prev.closing || fetchedTemplate.defaultClosingOptions?.[0] || 'sincerely',
          body: prev.body,
        }));

        console.info('[new/page] Template loaded', {
          templateId,
          title: fetchedTemplate.title,
          hasContent: Boolean(fetchedTemplate.content),
          contentLength: fetchedTemplate.content?.length ?? 0,
        });
      } catch (error) {
        console.error("Failed to fetch template:", error);
        setTemplate(null);
      } finally {
        setTemplateLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const isCoreField = (key: string) => {
    const normalized = normalizeToken(key);
    return new Set([
      'date',
      'name',
      'fullname',
      'sendername',
      'address',
      'senderaddress',
      'mailingaddress',
      'recipientname',
      'recipientaddress',
      'recipientorganization',
      'company',
      'organization',
      'email',
      'senderemail',
      'subject',
      'subjectline',
      'tone',
      'closing',
      'mainpoints',
      'body',
    ]).has(normalized);
  };

  const dynamicFieldKeys = useMemo(() => {
    const schemaKeys = template?.formSchema ? Object.keys(template.formSchema) : [];
    const placeholderKeys = template?.content ? extractPlaceholders(template.content) : [];
    return Array.from(new Set([...schemaKeys, ...placeholderKeys])).filter((key) => !isCoreField(key));
  }, [template]);

  const getFieldValueForPlaceholder = (rawKey: string) => {
    const normalized = normalizeToken(rawKey);
    if (normalized === 'date') return currentDate;
    if (normalized === 'name' || normalized === 'fullname' || normalized === 'sendername') return senderInfo.fullName;
    if (normalized === 'address' || normalized === 'senderaddress' || normalized === 'mailingaddress') return senderInfo.address;
    if (normalized === 'recipientname') return recipientDetails.name;
    if (normalized === 'recipientaddress') return recipientDetails.address;
    if (normalized === 'recipientorganization' || normalized === 'company' || normalized === 'organization') return recipientDetails.company;
    if (normalized === 'email' || normalized === 'senderemail') return senderInfo.email;
    if (normalized === 'subject' || normalized === 'subjectline') return letterPurpose.subject;
    if (normalized === 'tone') return letterPurpose.tone;
    if (normalized === 'closing') return letterPurpose.closing;
    if (normalized === 'body' || normalized === 'mainpoints') return letterPurpose.body;
    return customFields[rawKey] || '';
  };

  const renderedTemplateBody = template?.content
    ? template.content.replace(PLACEHOLDER_REGEX, (_fullMatch, token: string) => getFieldValueForPlaceholder(token))
    : '';

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

  const toneOptions = useMemo(
    () => template?.defaultToneOptions?.map(t => ({ value: t, label: t })) || [
      { value: "formal", label: "Formal & Professional" },
      { value: "friendly", label: "Friendly & Clear" },
    ],
    [template]
  );

  const closingOptions = useMemo(
    () => template?.defaultClosingOptions?.map(c => ({ value: c, label: c })) || [
      { value: "sincerely", label: "Sincerely," },
      { value: "best", label: "Best regards," },
    ],
    [template]
  );

  const handleGenerate = async () => {
    if (!templateId) {
      alert("Template ID is required");
      return;
    }

    const payload: Record<string, string> = {
      templateId,
      senderFullName: senderInfo.fullName.trim(),
      senderEmail: senderInfo.email.trim(),
      senderMailingAddress: senderInfo.address.trim(),
      recipientName: recipientDetails.name.trim(),
      recipientOrganization: recipientDetails.company.trim(),
      recipientAddress: recipientDetails.address.trim(),
      subjectLine: letterPurpose.subject.trim(),
      letterTone: letterPurpose.tone,
      preferredClosing: letterPurpose.closing,
      mainPoints: template?.content ? renderedTemplateBody : letterPurpose.body,
    };

    const requiredFields: Array<keyof typeof fieldLabelMap> = [
      'senderFullName',
      'recipientName',
      'recipientOrganization',
      'recipientAddress',
      'subjectLine',
    ];

    const missingRequired = requiredFields.filter((field) => !payload[field]);
    if (missingRequired.length > 0) {
      const missingLabels = missingRequired.map((field) => fieldLabelMap[field]).join(', ');
      alert(`Please fill in: ${missingLabels}`);
      return;
    }

    setIsGenerating(true);
    try {
      console.info('[new/page] Submitting generate request', {
        templateId,
        subjectLine: payload.subjectLine,
        letterTone: payload.letterTone,
        preferredClosing: payload.preferredClosing,
        mainPointsLength: payload.mainPoints.length,
      });

      const response = await fetch("/api/letters/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorDetails: unknown = null;
        try {
          errorDetails = await response.json();
        } catch {
          errorDetails = await response.text();
        }
        console.error('[new/page] Generate request failed', {
          status: response.status,
          statusText: response.statusText,
          errorDetails,
        });

        const backendMissing =
          typeof errorDetails === 'object' &&
          errorDetails !== null &&
          'missingFields' in errorDetails &&
          Array.isArray((errorDetails as { missingFields?: unknown }).missingFields)
            ? ((errorDetails as { missingFields: string[] }).missingFields)
            : [];

        if (backendMissing.length > 0) {
          const mapped = backendMissing
            .map((field) => fieldLabelMap[field] ?? toLabel(field))
            .join(', ');
          throw new Error(`Please fill in: ${mapped}`);
        }

        throw new Error("Failed to generate letter");
      }

      const data = await response.json();
      const draftId = data.draftId;

      if (template?.content) {
        const resolvedHtml = plainTextToHtml(renderedTemplateBody);
        const patchResponse = await fetch(`/api/letters/${draftId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentName: data.documentName,
            contentHtml: resolvedHtml,
          }),
        });

        if (!patchResponse.ok) {
          console.warn('[new/page] Failed to patch resolved template content', {
            draftId,
            status: patchResponse.status,
            statusText: patchResponse.statusText,
          });
        }
      }

      console.info('[new/page] Generate request succeeded', {
        draftId,
        documentName: data.documentName,
        wordCount: data.wordCount,
      });

      // Save draftId to sessionStorage for preview page
      sessionStorage.setItem("currentDraftId", draftId);

      // Navigate to preview with draftId
      router.push(`/preview?draftId=${draftId}`);
    } catch (error) {
      console.error("Error generating letter:", error);
      alert(error instanceof Error ? error.message : "Failed to generate letter. Please try again.");
    } finally {
      setIsGenerating(false);
    }
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
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              {templateLoading ? "Loading..." : template?.title || "Formal Request Letter"}
            </h1>
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
                  <h2 className="text-lg font-semibold text-gray-900">Template Fields</h2>
                </div>
                <div className="space-y-6">
                  {dynamicFieldKeys.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {dynamicFieldKeys.map((key) => (
                        <FormInput
                          key={key}
                          label={toLabel(key)}
                          placeholder={`Enter ${toLabel(key).toLowerCase()}`}
                          type={normalizeToken(key).includes('address') ? 'textarea' : 'text'}
                          value={customFields[key] || ''}
                          onChange={(e) => setCustomFields((prev) => ({ ...prev, [key]: e.target.value }))}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      This template does not define additional custom fields.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1FF] text-sm font-semibold text-[#0052CC]">
                    04
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
                      options={toneOptions}
                    />
                    <FormInput
                      label="Preferred Closing"
                      type="select"
                      name="preferredClosing"
                      placeholder="Sincerely,"
                      value={letterPurpose.closing}
                      onChange={(e) => setLetterPurpose({ ...letterPurpose, closing: e.target.value })}
                      options={closingOptions}
                    />
                  </div>
                  <FormInput
                    label={template?.content ? "Additional Notes (Optional)" : "Main Points & Content"}
                    type="textarea"
                    placeholder={
                      template?.content
                        ? "Add any extra details not already covered by the template body..."
                        : "Outline the core of your request here. Our AI will weave these into a polished narrative..."
                    }
                    value={letterPurpose.body}
                    onChange={(e) => setLetterPurpose({ ...letterPurpose, body: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || templateLoading}
                className="inline-flex items-center justify-center rounded-full bg-[#0052CC] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#003EA1] disabled:bg-gray-400 disabled:cursor-not-allowed max-w-fit"
              >
                {isGenerating ? "Generating..." : "Generate Letter"}
              </button>
              <p className="text-xs text-gray-500">LetterGen AI will optimize for clarity and tone.</p>
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
                    <div className="mt-3 text-gray-900 whitespace-pre-line">
                      {template?.content ? renderedTemplateBody || "Fill the template fields to preview your full letter body." : previewBody}
                    </div>
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

export default function NewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg px-6 py-8" role="status" aria-live="polite"><span className="sr-only">Loading new letter page</span></div>}>
      <NewPageContent />
    </Suspense>
  );
}
