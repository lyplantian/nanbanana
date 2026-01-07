# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds the RootLayout, metadata, and `page.tsx` that stitches the hero, editor, feature, showcase, reviews, and FAQ sections via `components/`.
- `components/` splits into section-level files (kebab-case, e.g., `editor-section.tsx`) and a `components/ui/` library of Radix/Tailwind primitives reused across the experience.
- `hooks/` and `lib/utils.ts` host reusable logic; import them over the `@/*` alias defined in `tsconfig.json` whenever you call cross-folder helpers.
- Static assets live in `public/`, and `styles/globals.css` bootstraps Tailwind + tw-animate with the custom color tokens consumed by the UI.

## Build, Test, and Development Commands
- `npm run dev`: launches the Next.js 16 dev server at http://localhost:3000 with fast refresh and the alias paths ready.
- `npm run build`: performs production bundling so `npm run start` can serve the optimized output; respects `next.config.mjs` (e.g., `typescript.ignoreBuildErrors`).
- `npm run start`: serves the previously built app for local staging or production.
- `npm run lint`: runs ESLint across the repo; treat this as the primary quality gate before commits.

## Coding Style & Naming Conventions
- Follow the TypeScript/Next style already in place: 2-space indentation, PascalCase exports, and kebab-case filenames for sections and providers.
- Keep imports rooted with `@/` rather than long relative paths, and prefer `components/ui/` wrappers for accessible Radix/Sonner patterns.
- Tailwind classes stay inside JSX, with the shared token set defined in `styles/globals.css`; avoid scattering CSS files unless a new global token is needed.

## Testing Guidelines
- No automated tests exist yet; rely on `npm run lint` to catch issues until a framework is added.
- When you add tests, follow either `ComponentName.test.tsx` or `module.spec.ts` next to the implementation and mention the tooling in the PR.
- Document the commands you ran (lint, dev server, etc.) in the PR so reviewers can reproduce your checks.

## Commit & Pull Request Guidelines
- Keep commit messages in the existing bracketed style (e.g., `[新增] 初始化。`), with `[Type] summary` and a short, descriptive sentence.
- PRs should include a summary paragraph, the tests/commands that were executed, any linked issue, and, for UI tweaks, at least one screenshot.
- Mention any new environment variables or feature flags so reviewers know what configuration changed.

## Security & Configuration Tips
- Store secrets such as the `OPENROUTER_API_KEY` referenced in `readme.txt` inside a local `.env.local`; `.gitignore` already excludes `.env*`.
- Never commit real keys; document their names here or in `readme.txt` and reference them in PR notes when new vars are introduced.
