# Backend API Reference

This document describes the active HTTP endpoints exposed by `server.py` for frontend integration.

## Base behavior
- All responses are JSON unless otherwise noted.
- Error responses use the format:

```json
{
  "error": "<message>",
  "<detailKey>": "<detailValue>"
}
```
- Remote test base URL: `https://lettergen-513500384322.us-central1.run.app`

## Endpoints

### GET /health
- Purpose: liveness/readiness probe
- Response: `200 OK`

```json
{ "status": "ok" }
```

---

### GET /templates
- Purpose: return a paginated list of templates
- Query parameters:
  - `search` (string, optional)
  - `category` (string, optional)
  - `page` (positive integer, optional, default: `1`)
  - `limit` (positive integer, optional, default: `20`)

- Response: `200 OK`

```json
{
  "templates": [
    {
      "id": "example-template",
      "title": "Example Template",
      "description": "A short summary.",
      "category": "general",
      "content": "...",
      "image": "..."
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

- Notes:
  - `content` and `image` are optional in the returned template summary.
  - Returns only templates that match the search text and/or category filter.

---

### GET /templates/{template_id}
- Purpose: return a single template record by ID
- Path parameters:
  - `template_id` (string)

- Response: `200 OK` or `404 Not Found`

```json
{
  "id": "example-template",
  "name": "example-template",
  "title": "Example Template",
  "description": "A short summary.",
  "category": "general",
  "content": "...",
  "image": null,
  "defaultToneOptions": ["formal", "professional", "firm"],
  "defaultClosingOptions": ["Sincerely", "Regards", "Thank you"],
  "formSchema": {},
  "tags": [],
  "createdAt": "2026-05-22T12:00:00Z",
  "updatedAt": "2026-05-22T12:00:00Z",
  "source": "local-json"
}
```

---

### GET /template-categories
- Purpose: return all available template categories
- Response: `200 OK`

```json
{ "categories": ["general", "billing", "legal"] }
```

---

### GET /letters
- Purpose: return a paginated list of letter drafts
- Query parameters:
  - `page` (positive integer, optional, default: `1`)
  - `limit` (positive integer, optional, default: `20`)
  - `templateId` (string, optional)

- Response: `200 OK`

```json
{
  "drafts": [
    {
      "draftId": "example-template-john-doe-2026-05-22T12:00:00Z",
      "documentName": "example-template-john-doe.html",
      "templateName": "Example Template",
      "updatedAt": "2026-05-22T12:00:00Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

---

### POST /letters/generate
- Purpose: generate a new letter draft from a template
- Request body: JSON object
  - `templateId`: string
  - `senderFullName`: string
  - `senderEmail`: string
  - `senderMailingAddress`: string
  - `recipientName`: string
  - `recipientOrganization`: string
  - `recipientAddress`: string
  - `subjectLine`: string
  - `letterTone`: string
  - `preferredClosing`: string
  - `mainPoints`: string

- Response: `201 Created` or `400 Bad Request` / `404 Not Found`

```json
{
  "draftId": "example-template-john-doe-2026-05-22T12:00:00Z",
  "documentName": "example-template-john-doe.html",
  "contentHtml": "<article>...</article>",
  "contentText": "...",
  "template": {
    "id": "example-template",
    "title": "Example Template",
    "category": "general"
  },
  "templateName": "Example Template",
  "category": "general",
  "createdAt": "2026-05-22T12:00:00Z",
  "updatedAt": "2026-05-22T12:00:00Z",
  "lastEditedAt": "2026-05-22T12:00:00Z",
  "wordCount": 123
}
```

- Notes:
  - All fields are required and must be non-empty strings.
  - If `templateId` does not exist, returns `404`.

---

### GET /letters/{draft_id}
- Purpose: retrieve a generated draft for preview/editing
- Path parameters:
  - `draft_id`: string

- Response: `200 OK` or `404 Not Found`

```json
{
  "draftId": "example-template-john-doe-2026-05-22T12:00:00Z",
  "documentName": "example-template-john-doe.html",
  "contentHtml": "<article>...</article>",
  "templateName": "Example Template",
  "category": "general",
  "lastEditedAt": "2026-05-22T12:00:00Z",
  "wordCount": 123
}
```

---

### PATCH /letters/{draft_id}
- Purpose: save changes to an existing draft
- Path parameters:
  - `draft_id`: string
- Request body: JSON object
  - `documentName`: string
  - `contentHtml`: string
  - `updatedAt`: string, optional

- Response: `200 OK` or `400 Bad Request` / `404 Not Found`

```json
{
  "success": true,
  "draftId": "example-template-john-doe-2026-05-22T12:00:00Z",
  "updatedAt": "2026-05-22T12:15:00Z",
  "wordCount": 128
}
```

---

### POST /letters/{draft_id}/export
- Purpose: create an export file for a draft
- Path parameters:
  - `draft_id`: string
- Request body: JSON object
  - `format`: string, one of `pdf` or `docx`
  - `fileName`: string, optional

- Response: `200 OK` or `400 Bad Request` / `404 Not Found` / `500 Internal Server Error`

```json
{ "downloadUrl": "http://.../downloads/example.pdf" }
```

- Notes:
  - `500` can occur if export dependencies are missing.

---

### GET /downloads/{file_name}
- Purpose: download a generated export file
- Path parameters:
  - `file_name`: string
- Response: `200 OK` with binary file stream

- Notes:
  - Returns `404 Not Found` if the file does not exist.

---

## Notes for frontend developers

- Templates are stored in `html_files/saved_templates` and may be bootstrapped from legacy HTML files.
- The app currently supports rich HTML saved from the editor, so `contentHtml` should preserve the editor output.
- The draft list endpoint returns a simplified draft summary, while `/letters/{draft_id}` returns the full preview payload.
- If a request body is invalid JSON, the server returns `400 Bad Request`.

---

## Legacy cleanup guidance

- `html/` contains legacy HTML example files and is not required for runtime if `html_files/saved_templates` already contains template JSON.
- `html_files/file1.html` and `html_files/file2.html` are legacy sample sources and can be removed when preserving the canonical example templates in `html_files/saved_templates`.
- Keep the useful example templates such as `electricity-request`, `water-request`, and `standardized-storage-template` for frontend testing and coverage.
