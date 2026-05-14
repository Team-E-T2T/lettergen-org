export interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
}

export const templates: Template[] = [
  {
    id: "executive-partnership",
    title: "Executive Partnership",
    category: "Office",
    description: "A polished inquiry for high-level business collaborations and strategic partnerships.",
    content: "Dear [Recipient Name],\n\nI am writing on behalf of [Your Company Name] to propose a strategic business partnership. We admire your work in the industry and believe that combining our strengths could yield significant value for both parties.\n\nSpecifically, we see an opportunity to collaborate on [Project/Product Name]. Please let me know your availability for a brief call next week to discuss this further.\n\nSincerely,\n\n[Your Name]\n[Your Title]\n[Your Contact Information]"
  },
  {
    id: "legal-dispute-resolution",
    title: "Legal Dispute Resolution",
    category: "Office",
    description: "A firm yet professional document for addressing contractual disagreements or claims.",
    content: "[Your Name]\n[Your Address]\n\nDear [Recipient Name or Legal Department],\n\nThis letter concerns a contractual disagreement regarding [Agreement Title/Topic] dated [Date of Agreement]. We have made several attempts to resolve this issue through standard support channels, specifically regarding [Briefly description of the breach or issue].\n\nTo resolve this matter amicably without escalation, we propose [State your clear proposed solution/settlement]. Please provide written confirmation of your stance or agreement by [Deadline Date].\n\nSincerely,\n\n[Your Name]\n[Your Contact Information]"
  },
  {
    id: "sponsorship-proposal",
    title: "Sponsorship Proposal",
    category: "Government",
    description: "Persuasive structure for seeking event funding or brand collaboration support.",
    content: "[Your Name/Organization]\n[Your Address]\n\nDear [Sponsor Name or Committee],\n\nWe are pleased to introduce our upcoming initiative, [Event or Project Name], which aims to bring together community members to achieve [Core Goal of Event].\n\nTo ensure this project is fully successful, we are seeking corporate sponsors who share our vision for progress. As a valued sponsor, [Sponsor Company] will receive prominent brand visibility across all our marketing channels, including [List channels, e.g., web banners, print material].\n\nWe would welcome the opportunity to review our custom package structures with you. Thank you for your time and serious consideration.\n\nRespectfully yours,\n\n[Your Name]\n[Your Title]"
  },
  {
    id: "notice-of-resignation",
    title: "Notice of Resignation",
    category: "Bank",
    description: "Graceful and professional template for departing your current role on good terms.",
    content: "[Your Name]\n[Your Address]\n\nDear [Manager Name],\n\nPlease accept this letter as formal notification that I am resigning from my position as [Your Job Title] at [Company/Bank Name]. My final day of employment will be [Your Last Day, e.g., June 15, 2026].\n\nI want to thank you for the wonderful opportunities I have had during my time here. I am grateful for your guidance and the support of my team members.\n\nDuring my remaining time, I will do everything possible to wrap up my projects and ensure a smooth transition of my duties to other staff members.\n\nSincerely,\n\n[Your Name]"
  },
  {
    id: "consumer-grievance",
    title: "Consumer Grievance",
    category: "School",
    description: "Assertive but respectful template for resolving issues with products or services.",
    content: "[Your Name]\n[Your Address]\n\nDear [Customer Relations Manager],\n\nI am writing to formally report a grievance regarding a recent purchase of [Product/Service Name] on [Date of Purchase] under order number [Order/Receipt Number].\n\nUnfortunately, the product has not performed satisfactorily because [Explain the precise problem clearly]. I am highly disappointed with this quality standard.\n\nTo resolve this problem, I request a [State your expectation, e.g., full refund / replacement product]. I look forward to your prompt response to settle this matter.\n\nSincerely,\n\n[Your Name]"
  },
  {
    id: "public-records-request",
    title: "Public Records Request",
    category: "Official",
    description: "Compliant formatting for requesting documents under information freedom acts.",
    content: "[Your Name]\n[Your Mailing Address]\n\nDear [Public Records Officer / Agency Name],\n\nUnder the provisions of the Freedom of Information Act and relevant public records regulations, I hereby request access to and copies of the following documents:\n\n1. [Clearly describe the first record / log file you want]\n2. [Clearly describe the second record, including a specific date range]\n\nIf there are any fees associated with searching or duplicating these public materials, please inform me before processing if the total amount exceeds $[Amount Limit].\n\nThank you for your assistance with this transparency request.\n\nRespectfully,\n\n[Your Name]"
  }
];
