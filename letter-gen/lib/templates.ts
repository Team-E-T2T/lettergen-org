export type Template = {
  id: string;
  category: string;
  title: string;
  description: string;
};

export const templates: Template[] = [
  {
    id: '1',
    category: 'Personal',
    title: 'Executive Partnership',
    description: 'A polished inquiry for high-level business collaborations and strategic partnerships.',
  },
  {
    id: '2',
    category: 'Office',
    title: 'Legal Dispute Resolution',
    description: 'A firm yet professional document for addressing contractual disagreements or claims.',
  },
  {
    id: '3',
    category: 'Government',
    title: 'Sponsorship Proposal',
    description: 'Persuasive structure for seeking event funding or brand collaboration support.',
  },
  {
    id: '4',
    category: 'Bank',
    title: 'Notice of Resignation',
    description: 'Graceful and professional template for departing your current role on good terms.',
  },
  {
    id: '5',
    category: 'School',
    title: 'Consumer Grievance',
    description: 'Assertive but respectful template for resolving issues with products or services.',
  },
  {
    id: '6',
    category: 'Official',
    title: 'Public Records Request',
    description: 'Compliant formatting for requesting documents under information freedom acts.',
  },
];
