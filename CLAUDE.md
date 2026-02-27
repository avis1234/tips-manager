# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at localhost:5173/tips-manager/
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
```

No test suite. Verify changes with `npm run build` before pushing.

## Deployment

Every push to `main` triggers GitHub Actions → GitHub Pages at `https://avis1234.github.io/tips-manager/`.
The `base: '/tips-manager/'` in `vite.config.js` must match the repo name.

## Architecture

All credentials (Claude API key, Supabase URL, anon key) are entered by the user at runtime and stored in `localStorage` under `ai-tips-settings`. **Nothing is hardcoded.**

### Add-tip data flow

```
User input (text or URL)
  → processtip.js          # orchestrator
    → jina.js              # links only: fetch URL via https://r.jina.ai/{url} (CORS-safe, no auth)
    → claude.js            # analyze with claude-sonnet-4-6, returns structured JSON
    → supabase.js          # lazy client factory, insert into `tips` table
```

`processTip` calls `onStatus('fetching' | 'analyzing' | 'saving')` to drive the `LoadingOverlay`.

### Claude API

- Called directly from the browser — requires header `anthropic-dangerous-direct-browser-access: true`
- Model: `claude-sonnet-4-6`
- Returns JSON: `{ toolName, dateCreated, pageTitle, summary, quality }`
- Claude sometimes wraps JSON in ` ```json ``` ` fences — strip them before `JSON.parse` (already handled in `claude.js`)
- Error codes thrown as `Error('CLAUDE_401' | 'CLAUDE_429' | 'CLAUDE_BAD_JSON' | 'CLAUDE_ERROR')` — mapped to toasts in `App.jsx`

### Supabase

- Table: `tips` — see schema below
- RLS enabled with anon-access policy (allows all for anon role)
- Client cached in module scope in `supabase.js`; recreated if URL/key changes

```
tips: id, entry_type, raw_input, tool_name, date_entered, date_created,
      tip_excerpt, summary, quality, source_url, raw_content, created_at
```

### State management

No external state library. `App.jsx` owns top-level state and passes down callbacks:
- `useSettings` — reads/writes `localStorage`
- `useTips` — Supabase CRUD + re-fetch; re-runs when Supabase credentials change
- Toast notifications auto-dismiss after 4s via `setTimeout`
