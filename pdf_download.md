# PDF Download Integration Guide

This guide is for frontend agents and frontend developers updating the letter export flow.

## Purpose

The backend does not expose a permanent static PDF URL ahead of time.

PDF download is a 2-step flow:

1. `POST /letters/{draft_id}/export`
2. Open or fetch the returned `downloadUrl`

Do not construct the download URL on the frontend unless there is a hard requirement to do so. Use the exact `downloadUrl` returned by the export API.

## Current Backend Contract

### 1. Generate a draft

Request:

```http
POST /api/letters/generate
Content-Type: application/json
```

Response:

```json
{
  "draftId": "electricity-request-jane-doe-2026-06-05t07-05-16z",
  "documentName": "electricity-request-jane-doe.html",
  "contentHtml": "<article>...</article>",
  "contentText": "...",
  "template": {
    "id": "electricity-request",
    "title": "Electricity Request",
    "category": "utilities"
  },
  "templateName": "Electricity Request",
  "category": "utilities",
  "createdAt": "2026-06-05T07:05:16Z",
  "updatedAt": "2026-06-05T07:05:16Z",
  "lastEditedAt": "2026-06-05T07:05:16Z",
  "wordCount": 120
}
```

Important field:

- `draftId`: required for export.

### 2. Export the draft

Request:

```http
POST /api/letters/{draft_id}/export
Content-Type: application/json
```

Body:

```json
{
  "format": "pdf",
  "fileName": "Letter_1780639363939"
}
```

Rules:

- `format` must be `pdf` or `docx`.
- `fileName` is optional.
- `fileName` should be treated as a preferred export name stem, not a full file path.
- The backend sanitizes the name before saving the file.

Successful response:

```json
{
  "success": true,
  "downloadUrl": "/api/download/electricity-request-jane-doe-2026-06-05t07-05-16z?format=pdf&name=Letter_1780639363939",
  "fileName": "Letter_1780639363939"
}
```

Meaning of fields:

- `success`: export completed and the file was written.
- `downloadUrl`: real backend route that serves the generated file.
- `fileName`: the requested export name stem returned for client display.

### 3. Download the file

Use the returned `downloadUrl` exactly as-is.

Example:

```http
GET /api/download/{draft_id}?format=pdf&name=Letter_1780639363939
```

The backend resolves that request to a file in local export storage.

## Important Behavior

### Export writes to local server storage

Generated files are written to:

```text
data/exports/
```

The compatibility download endpoint does not regenerate the PDF. It only serves a file that already exists.

That means:

1. `POST /api/letters/{draft_id}/export` must happen before `GET /api/download/{draft_id}...`
2. A repeated GET can succeed again only if the previously exported file is still present on the server
3. If the server is restarted, redeployed, or uses ephemeral container storage, old exported files may disappear

### The backend sanitizes `fileName`

The backend normalizes the file name using the same logic every time.

Current behavior:

- strips path components
- removes unsupported characters
- replaces unsupported sequences with `-`
- appends the requested extension

Examples:

- `Letter_1780639363939` -> stored as `Letter_1780639363939.pdf`
- `My PDF Export` -> stored as `My-PDF-Export.pdf`
- `../../unsafe` -> stored as `unsafe.pdf`

Frontend implication:

- Do not assume the raw `fileName` is the exact stored file name with extension.
- Do not build `/downloads/<name>.pdf` yourself.
- Use the returned `downloadUrl`.

### Compatibility route shape

The backend now supports this download route for frontend compatibility:

```text
/api/download/{draft_id}?format=pdf&name=<fileNameStem>
```

There is also a legacy direct file route:

```text
/downloads/{file_name}
```

Frontend should treat `/api/download/...` as the supported integration path for this flow.

## Frontend Calling Guidance

### Recommended flow

1. Generate or retrieve a valid `draftId`
2. Call export
3. Read `downloadUrl` from the export response
4. Open that URL in the browser, or fetch it as a binary response

### Browser-open example

```ts
type ExportResponse = {
  success: boolean;
  downloadUrl: string;
  fileName: string;
};

export async function exportDraftPdf(draftId: string, fileName: string) {
  const response = await fetch(`/api/letters/${draftId}/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      format: 'pdf',
      fileName,
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(errorPayload?.error ?? 'Export failed');
  }

  const payload = (await response.json()) as ExportResponse;

  if (!payload.success || !payload.downloadUrl) {
    throw new Error('Export response did not include a valid downloadUrl');
  }

  window.open(payload.downloadUrl, '_blank', 'noopener,noreferrer');
}
```

### Same-tab download example

```ts
export async function exportDraftPdfInSameTab(draftId: string, fileName: string) {
  const response = await fetch(`/api/letters/${draftId}/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      format: 'pdf',
      fileName,
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(errorPayload?.error ?? 'Export failed');
  }

  const payload = await response.json();
  window.location.assign(payload.downloadUrl);
}
```

### Binary fetch example

Use this only if the frontend needs to inspect the blob before download.

```ts
export async function fetchDraftPdfBlob(draftId: string, fileName: string) {
  const exportResponse = await fetch(`/api/letters/${draftId}/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      format: 'pdf',
      fileName,
    }),
  });

  if (!exportResponse.ok) {
    const errorPayload = await exportResponse.json().catch(() => null);
    throw new Error(errorPayload?.error ?? 'Export failed');
  }

  const exportPayload = await exportResponse.json();
  const fileResponse = await fetch(exportPayload.downloadUrl);

  if (!fileResponse.ok) {
    throw new Error(`Download failed with status ${fileResponse.status}`);
  }

  return await fileResponse.blob();
}
```

## What To Change In Frontend Code

If the current frontend code manually builds a URL like this:

```ts
const url = `/api/download/${draftId}?format=pdf&name=${fileName}`;
```

replace that pattern with:

```ts
const exportPayload = await exportDraft(...);
const url = exportPayload.downloadUrl;
```

Reason:

- backend sanitization may alter the effective file name
- backend route shapes can evolve while preserving the response contract
- using the returned URL prevents frontend/backend drift

## Error Handling

### Export errors

`POST /api/letters/{draft_id}/export` can return:

- `400` if `format` is invalid
- `404` if the draft does not exist
- `500` if a required export dependency is missing

Example error payload:

```json
{
  "error": "'format' must be either 'pdf' or 'docx'."
}
```

### Download errors

`GET /api/download/{draft_id}?...` can return:

- `400` if `format` is invalid
- `404` if the expected export file is not present on disk

Example error payload:

```json
{
  "error": "Export file not found.",
  "fileName": "Letter_1780639363939.pdf"
}
```

Frontend handling guidance:

1. Treat export failure and download failure as different states
2. If export succeeds but download fails with `404`, surface a message like: `The export file was not available for download. Please retry export.`
3. Do not silently retry GET forever, because this endpoint is file-serving, not job-status polling

## Content Type Expectations

PDF downloads return:

```text
application/pdf
```

DOCX downloads return:

```text
application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

## Local and Deployed Environments

### Local development

Typical returned URL:

```text
http://127.0.0.1:8000/api/download/electricity-request-live-quick-test-2026-06-05t07-05-16z?format=pdf&name=live-quick-check
```

### Frontend with `/api` proxy

If the frontend proxies backend routes under `/api`, the returned URL can already be proxy-compatible.

Frontend should still use the returned `downloadUrl` exactly as provided.

### Deployment note

Exported files are currently served from local server storage, not object storage.

Implication:

- this works for immediate download flows
- this is not a durable long-term file-hosting strategy across restarts or multi-instance deployments

If durable PDF hosting is needed later, the backend should move exports to persistent storage such as cloud object storage and return a stable public or signed URL.

## Agent Checklist

When updating frontend code, ensure all of the following are true:

1. Export is called before download
2. The frontend reads `downloadUrl` from the export response
3. The frontend does not reconstruct the URL manually
4. The frontend handles `400`, `404`, and `500` responses cleanly
5. The frontend treats the returned URL as the source of truth
6. The frontend understands that downloads are currently served from server-local export files