# Powered Business Card Monorepo

This monorepo contains four projects:

- `apps/webapp`: React + TypeScript web app with lint and prettier
- `apps/server`: Fastify + TypeScript server using command & repository patterns, Mocha tests
- `apps/mobile`: Flutter app using feature-first pattern
- `tests/automation-test`: Playwright + TypeScript automation tests using Page Object Model (POM)

## Prerequisites

- Node.js 18+
- npm 9+ (using npm workspaces)
- Flutter SDK (for mobile app)
- An OpenAI API key (`OPENAI_API_KEY`) for card generation

## Getting Started

Root scripts:

- Install all workspace deps: `npm install`
- Build server: `npm run -w @powered/server build`
- Start server (dev): `npm run -w @powered/server dev`
- Start webapp (dev): `npm run -w @powered/webapp dev`
- Run automation tests: `npm run -w @powered/automation test`

## Structure

```
apps/
  webapp/         # React + TS (Vite)
  server/         # Fastify + TS (Mocha tests)
  mobile/         # Flutter (feature-first)
tests/
  automation-test/ # Playwright + TS (POM)
```

## Environment

Create a `.env` file in `apps/server` with:

```
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
PORT=8080
```

## Notes

- The card generation API supports both `web` and `mobile` versions via a request parameter.
- Linting and Prettier are configured per project for clarity.