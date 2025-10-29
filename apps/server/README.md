Powered Business Card Server
============================

Overview
--------
- Provides API endpoints for user data, templates, and card generation.
- Card generation uses OpenAI via a repository with key rotation, timeouts, and robust error handling.
- Swagger UI is available at `/docs` when running locally.

Environment Setup
-----------------
Create a `.env` file in `apps/server` (see `.env.example`):
- `PORT`: Server port (default `8080`).
- `OPENAI_API_KEY`: A single OpenAI API key.
- `OPENAI_API_KEYS`: Comma-separated keys for rotation (alternative to `OPENAI_API_KEY`).
- `OPENAI_ORG_ID`: Optional organization ID.
- `OPENAI_MODEL`: Model name (default `gpt-4o-mini`).
- `OPENAI_TIMEOUT_MS`: Request timeout in milliseconds (default `15000`).
- `RATE_LIMIT_MAX`: Requests per window (default `20`).
- `RATE_LIMIT_WINDOW_MS`: Time window in ms (default `60000`).

Install & Run
-------------
- Install dependencies: `npm install` (in `apps/server`).
- Build: `npm run build`.
- Start: `npm start`.
- Dev: `npm run dev`.

API
---
- `POST /api/card`
  - Body: `{ "description": string }`
  - Responses:
    - `200`: `{ "card": { title, subtitle?, fields[{label,value}], notes? } }`
    - `400`: `{ "error": string }` (validation errors)
    - `500`: `{ "error": string }` (internal errors, timeouts)
  - Notes:
    - Input is trimmed, whitespace-collapsed, control characters removed, max length 1000.
    - Rate limiting applies per IP.

Swagger / OpenAPI
-----------------
- Visit `/docs` for interactive documentation.
  - Includes tags and route schemas.

Error Handling Patterns
-----------------------
- OpenAI errors are mapped to user-friendly messages.
- Timeouts produce `500` with `"OpenAI request timed out"`.
- Validation errors return `400` with a descriptive message.
- Server logs include request method/URL and response status codes.

Testing
-------
- Run tests: `npm test`.
- Unit tests:
  - `OpenAiRepository` parsing and timeout behavior.
  - Env loader validation.
- Integration tests:
  - `GenerateCardCommand` sanitization and validation.
  - API endpoint with Fastify injection.