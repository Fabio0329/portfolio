# Portfolio site (fabiodev.io)

Fabio's portfolio, aimed at Forward Deployed Engineer roles. Live at
https://fabiodev.io, deployed by Vercel on every push to `main`.

@AGENTS.md

## Commands

```bash
npm run dev           # http://localhost:3000 (drafts visible)
npm run build         # production build (drafts hidden); every route must be static
npm run lint          # ESLint
npm run format        # Prettier, with Tailwind class sorting
npm run format:check
npx tsc --noEmit      # needs one build first: PageProps/LayoutProps are generated
```

## Before calling a change done

- `npm run build` passes, and every route shows `○` (static) or `●` (SSG) in the
  output. No `ƒ` (dynamic) routes.
- `npx tsc --noEmit`, `npm run lint`, and `npm run format:check` are clean.
- UI changes: check both themes and a 375px viewport.

## Git

- Never commit or push without Fabio's approval. Leave changes uncommitted
  for review first.
- One commit per logical change, with a summary line plus a short bullet body.
- Never commit anything personal beyond what's on the public resume (phone,
  home address). If it slips into an unpushed commit, amend it out rather
  than committing a fix on top.

## Architecture

- **Fully static.** No API routes, server actions, or request-time APIs until
  Phase 2 (AI demos). Route handlers need `export const dynamic = "force-static"`.
- **`lib/site.ts`** is the single source of truth for name, pitch, URL, email,
  links, and the "Now" block. Don't hardcode these anywhere else. `site.url`
  has no trailing slash, since code builds URLs as `${site.url}/path`.
- **Content is MDX in the repo**, not a CMS or database:
  - `content/log/*.mdx` → `/log/[slug]`
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

- One component per file. Group by feature folder (`components/log/`,
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

## Accessibility

- Keep the heading order intact. Lists under a section heading take a lower
  heading level (see `PostList`'s `headingLevel` prop).
- Decorative glyphs in links (`←`, `→`, `↗`) go in `<span aria-hidden>`.
- Icon-only buttons need an `aria-label`.
- Every text and background token pair must meet WCAG AA (4.5:1) in both
  themes. Recheck after any token change.
- The global `:focus-visible` ring in `globals.css` is the focus style. Don't
  remove outlines.

## Next.js 16 notes

- `params` is a Promise: `const { slug } = await params`.
- Type pages with the generated globals `PageProps<"/route/[slug]">` and
  `LayoutProps<"/">`.
- Dynamic routes use `generateStaticParams` plus `export const dynamicParams = false`.
- MDX remark/rehype plugins go in `next.config.ts` as strings
  (`"remark-gfm"`), because Turbopack can't receive JS functions.
