import { notFound } from 'next/navigation';
import PreviewEditor from '@/components/PreviewEditor';
import { getDraft } from '@/lib/api';

export default async function PreviewPage(props: {
  searchParams: Promise<{ draftId?: string | string[] }>;
}) {
  const searchParams = await props.searchParams;
  const draftId = Array.isArray(searchParams.draftId)
    ? searchParams.draftId[0]
    : searchParams.draftId;

  if (!draftId) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-800">
        <div className="mx-auto max-w-4xl rounded-[3rem] border border-slate-200 bg-white p-10 shadow-lg shadow-slate-100">
          <h1 className="text-3xl font-semibold">Draft not selected</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            To edit an existing draft, open this page with a valid draft ID query parameter like{' '}
            <code className="rounded bg-slate-100 px-2 py-1 text-sm">?draftId=&lt;id&gt;</code>.
          </p>
        </div>
      </div>
    );
  }

  const draft = await getDraft(draftId);

  if (!draft) {
    notFound();
  }

  return <PreviewEditor draft={draft} />;
}
