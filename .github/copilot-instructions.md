## Purpose

This file gives focused, actionable guidance for AI coding agents working in this repository so they can be productive immediately.

**Big Picture**
- **Framework:** Next.js (app router) with `app/` as the new entry point. See [app/layout.tsx](app/layout.tsx#L1) and [app/page.tsx](app/page.tsx#L1).
- **Legacy code:** A previous Create-React-App project was kept under `source_from_old_project_to_converted %20_to_this_project/src`. That folder contains many client-only examples (JSX, DOM usage, localStorage) used as migration references.

**When to use which code area**
- New features: prefer the `app/` directory (server components by default). Use `use client` at the top of a file when the code uses browser APIs, hooks, or direct DOM access.
- Migrations and examples: inspect `source_from_old_project_to_converted %20_to_this_project/src` for ready-made components to port (e.g., AI integrations and Google Sheets helpers).

**Key integration points & patterns (concrete examples)**
- AI integrations: `source_from_old_project_to_converted %20_to_this_project/src/components/common/AIBoard.jsx` demonstrates using `@google/genai` and `openai-edge` and storing API keys in `localStorage` (look for `KEY_GEMINI_NM`, `KEY_GPT_NM`). See [source_from_old_project_to_converted %20_to_this_project/src/common/common.js](source_from_old_project_to_converted%20_to_this_project/src/common/common.js#L1).
- Google Sheets: `source_from_old_project_to_converted %20_to_this_project/src/components/learning/api/sheetDataRepository.js` uses the browser `gapi` client and expects a spreadsheet id from `localStorage` or config.
- DOM & browser globals: many legacy files call `document`, `window`, and `localStorage`. These must only be used in client components (`use client`) when moved into `app/`.

**Developer workflows / commands**
- Run dev server: `npm run dev` (also works with `pnpm dev`, `yarn dev`, or `bun dev`). See [package.json](package.json#L1).
- Build: `npm run build`; Start: `npm run start`; Lint: `npm run lint`.

**Project-specific conventions**
- Mixed-language repo: Next.js + TypeScript in `app/`, legacy JS/JSX in `source_from_old_project_to_converted %20_to_this_project/src`. Be mindful of typing when migrating JS files to TS.
- Prefer server components in `app/` for non-UI logic; explicit `use client` for components that access browser APIs.
- Styling: global styles live in `app/globals.css`. Legacy components include their own CSS modules under the legacy folder.

**Secrets & keys**
- The legacy code stores API keys in `localStorage` keys named in `common/common.js`: `KEY_GEMINI_NM`, `KEY_GPT_NM`, `KEY_GOOGLE_SHEET_NM`. Avoid hard-coding secrets; prefer environment variables and Next.js runtime config when converting server-side usage.

**Where to look first (fast onboarding)**
- Read the new app entry: [app/layout.tsx](app/layout.tsx#L1) and [app/page.tsx](app/page.tsx#L1).
- Inspect the migration examples: `source_from_old_project_to_converted %20_to_this_project/src/components/common/AIBoard.jsx` and `.../learning/api/sheetDataRepository.js`.
- Shared utilities: `source_from_old_project_to_converted %20_to_this_project/src/common/common.js` (localStorage keys and DOM helpers).

**Coding tips for AI agents (actionable rules)**
- If a legacy file uses `document`, `window`, `localStorage`, or `navigator`, mark it as `use client` before moving into `app/`.
- When suggesting code changes, include exact file paths and small focused patches. Prefer minimal changes and preserve existing APIs.
- For new server-side integrations, move API keys to environment variables (`process.env.*`) and call external APIs from Next.js API routes or server components, not client code.

If anything above is unclear or you'd like me to expand specific migration examples, say which file or integration to deep-dive into and I'll iterate.
