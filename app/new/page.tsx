import NewTemplateForm from "@/components/NewTemplateForm";
import { fetchTemplateById } from "@/lib/backend";

type NewPageProps = {
  searchParams?: {
    id?: string | string[];
  };
};

export default async function NewPage({ searchParams }: NewPageProps) {
  const templateId = typeof searchParams?.id === "string" ? searchParams.id : "";
  const template = templateId ? await fetchTemplateById(templateId) : null;

  return <NewTemplateForm template={template} templateId={templateId} />;
}
