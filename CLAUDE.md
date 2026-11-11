# Portfolio site (fabiodev.io)

Fabio's portfolio, aimed at Forward Deployed Engineer roles. Live at
https://fabiodev.io, deployed by Vercel on every push to `main`.

@AGENTS.md

## Commands

```bash
npm run dev           # http://localhost:3000 (drafts visible)
npm run build         # production build (drafts hidden); every route must be static
npm run lint          # ESLint, strict jsx-a11y, zero warnings allowed
npm run format        # Prettier, with Tailwind class sorting
npm run format:check
npm run typecheck     # generates route types, then tsc --noEmit
npm test              # Vitest unit + component a11y tests, one run
npm run test:watch    # Vitest in watch mode
npm run test:a11y     # Playwright + axe on a production build (builds first)
npm run check         # all of the above checks, in order: the "done" gate
```

## Before calling a change done

A change is done only when **`npm run check` passes locally**: lint, format,
typecheck, unit tests, and page-level a11y tests, with no failures and no
warnings. Never report work as finished while any of them fail, and never
skip one because it's slow.

Also:

- `npm run build` shows every route as `○` (static) or `●` (SSG). No `ƒ`
  (dynamic) routes.
- New or changed behavior comes with tests (see Testing). New or changed
  components come with an axe test.

## Git

- Never commit or push without Fabio's approval. Leave changes uncommitted
  for review first.
- `main` is protected: changes land only through pull requests, and CI
  (`.github/workflows/ci.yml`) runs on every PR. Work on a branch, push the
  branch, and open a PR with `gh pr create`. Never push to `main` directly.
- Keep local `main` in sync with `origin/main`; don't stack unpushed commits
  on it.
- One commit per logical change, with a summary line plus a short bullet body.
- Never commit anything personal beyond what's on the public resume (phone,
  home address). If it slips into an unpushed commit, amend it out rather
  than committing a fix on top.

## Architecture

- **Fully static.** No API routes, server actions, or request-time APIs until
  Phase 2 (AI demos). Route handlers need `export const dynamic = "force-static"`.
- **`lib/site.ts`** is the single source of truth for name, pitch, URL, email,
  links, and the "In progress" block. Don't hardcode these anywhere else. `site.url`
  has no trailing slash, since code builds URLs as `${site.url}/path`.
- **Content is MDX in the repo**, not a CMS or database:
  - `content/blog/*.mdx` → `/blog/[slug]`
  - `content/projects/*.mdx` → `/projects/[slug]`
  - `content/about.mdx` → `/about`
  - The filename is the slug.
- **`lib/content/`** is the only code that knows where content lives:
  `types.ts` (metadata shapes), `validate.ts` (throws at build time on bad
  metadata), `listing.ts` (folder listing + draft rule), `posts.ts` and
  `projects.ts` (loaders). Pages call `getPosts`/`getPost`/`getProjects`/
  `getProject`; nothing else reads the file system.
- Each loader writes out its own ``import(`@/content/<folder>/${slug}.mdx`)``.
  The bundler needs that literal path to know which folder to compile, so
  don't abstract it into a shared helper.

## Writing content

- Every `.mdx` file exports `metadata` (see `lib/content/types.ts`).
  - Posts need `title`, `description`, `date`, and `tags`.
  - Projects need `title`, `summary`, `status` (`"building"` | `"shipped"`),
    `date`, and `stack`. `links` and `featured` are optional.
- Dates are `YYYY-MM-DD`. Sorting compares them as strings.
- `draft: true` shows in dev with a badge and is left out of production
  (pages, RSS, sitemap).
- Case studies follow the template in `content/projects/README.md`.
- **Keep `{/* */}` comments in MDX on one line.** Prettier rewrites multi-line
  ones into `{/_ _/}`, which breaks the build.
- Placeholders Fabio must fill in are visible `_TODO: ..._` lines (rendered on
  purpose so they can't ship unnoticed) or `{/* TODO(fabio): ... */}`.
- Write in Fabio's voice, but never invent facts about Fabio's experience.
  Draft from what Fabio provides and mark gaps as TODOs.

## Components

- One component per file. Group by feature folder (`components/blog/`,
  `components/projects/`, `components/home/`, `components/about/`). Components
  used by more than one feature go in `components/ui/`.
- Named exports, written as typed arrow consts with a separate props type:

  ```tsx
  type ThingProps = {
    label: string;
  };

  export const Thing: FC<ThingProps> = ({ label }) => {
    const handleClick = () => {};
    return <button onClick={handleClick}>{label}</button>;
  };
  ```

  - Use plain `FC` when there are no props.
  - Handlers are arrow consts too.
  - Import `FC` and `ReactNode` as types.
  - Effect cleanups use an explicit block (`return () => { ... };`), never
    the curried `() => () =>` shorthand.

- Next.js special files (`page.tsx`, `layout.tsx`, `not-found.tsx`, `route.ts`,
  `opengraph-image.tsx`, `sitemap.ts`, `robots.ts`) use `export default function`.
  The framework requires the default export.
- Server Components by default. Add `"use client"` only where state or browser
  APIs need it (currently `ThemeToggle`, `CopyEmailButton`, `NavLink`).
- Internal navigation uses `next/link`. Files in `public/` (like
  `/resume.pdf`) use a plain `<a>`.
- Imports use the `@/` alias, ordered: packages, then `@/components`, then
  `@/lib`, then relative.

## Styling

- Tailwind CSS v4, configured in CSS (`app/globals.css`). There is no
  `tailwind.config.js`.
- Colors come from the design tokens in `globals.css`
  (`background`, `foreground`, `muted`, `border`, `surface`, `accent`). Use the
  token classes (`text-muted`, `bg-surface`, ...), never raw hex values or
  Tailwind palette colors. The Phase 3 redesign should mostly be a token change.
- Dark mode follows `data-theme` on `<html>` (set before first paint by
  `lib/theme.ts`). Use the `dark:` variant.
- Content width comes from the `page-container` utility.
- MDX bodies render inside `prose max-w-none`. The prose colors are mapped to
  the tokens in `globals.css`. Inside MDX, custom components that style their
  own lists or headings need `not-prose`.
- OG images (`lib/og.tsx`) can't read CSS variables, so their colors mirror
  the light tokens by hand. Keep them in sync if the tokens change. Satori
  requires `display: flex` on any element with more than one child.

## Accessibility (WCAG 2.1 AA)

The site targets **WCAG 2.1 AA**. These rules are not optional:

- Semantic HTML first. Use ARIA only when no native element fits.
- Every new or changed component needs an axe test (`vitest-axe`, via
  `axe` from `@/test/axe`) asserting no violations.
- Never add `eslint-disable` for `jsx-a11y` rules, never weaken or delete axe
  tests, and never edit lint or test config to make checks pass. Fix the
  underlying issue, even if that means changing the design or the content.
- Never disable, bypass, or edit the `.claude/hooks` guardrails to get past a
  failure.
- A task is done only when `npm run lint`, `npm test`, and
  `npm run test:a11y` all pass (`npm run check` runs them all).

Specifics:

- Keep the heading order intact. Lists under a section heading take a lower
  heading level (see `PostList`'s `headingLevel` prop).
- Decorative glyphs in links (`←`, `→`, `↗`) go in `<span aria-hidden>`.
- Icon-only buttons need an `aria-label`.
- Every text and background token pair meets 4.5:1 in both themes, enforced by
  `app/theme-contrast.test.ts`.
- The global `:focus-visible` ring in `globals.css` is the focus style. Don't
  remove outlines.
- Nothing may scroll sideways at 320px (WCAG Reflow) or wider, including
  code blocks in MDX: a scrolling `<pre>` isn't keyboard-reachable. Code
  blocks wrap long lines (`.prose pre` in `globals.css`), but wrapping breaks
  ASCII diagrams, so draw those vertically and keep them under ~30 characters
  wide.

## Testing

- **Unit and component tests** (Vitest + Testing Library + jsdom) sit next to
  the code they test: `lib/dates.test.ts` beside `lib/dates.ts`. Shared setup
  is in `vitest.setup.ts`; jsdom has no `matchMedia`, so it's stubbed there.
- Vitest can't render `async` Server Components (pages, loaders). Those are
  covered by the **page-level tests** in `e2e/` (Playwright + axe), which build
  the site with `SHOW_DRAFTS=true` so drafts are audited before publishing.
  They read the page list from `/sitemap.xml`, so new pages are covered
  automatically.
- Mock Next-only modules (`next/navigation`) with `vi.mock`. Tests import from
  `vitest` explicitly (no globals).
- A test that can't fail is worthless: when adding a check, break the code
  once to see it fail, then restore it.

## Guardrail hooks

`.claude/settings.json` wires two hooks into every Claude Code session:

- **After every Edit/Write** (`.claude/hooks/lint-file.mjs`): ESLint runs on
  the edited file. Errors and warnings come back immediately; fix them before
  moving on.
- **When a turn ends** (`.claude/hooks/stop-checks.mjs`): `npm run check` runs
  if the working tree differs from `HEAD` (skipped if nothing changed since
  the last green run). On failure the turn is blocked and the output is
  returned; fix the problem and try again. After 3 blocked attempts the turn
  is allowed to end with a warning to Fabio, and the work is **not** done.

Never disable, bypass, or edit these hooks (or their settings) to get past a
failure. Changes to the hooks themselves need Fabio's explicit approval.

## Next.js 16 notes

- `params` is a Promise: `const { slug } = await params`.
- Type pages with the generated globals `PageProps<"/route/[slug]">` and
  `LayoutProps<"/">`.
- Dynamic routes use `generateStaticParams` plus `export const dynamicParams = false`.
- MDX remark/rehype plugins go in `next.config.ts` as strings
  (`"remark-gfm"`), because Turbopack can't receive JS functions.
