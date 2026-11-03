# fabiodev.io

Source for [fabiodev.io](https://fabiodev.io), my portfolio and learning log as I
move into Forward Deployed Engineering.

The site is deliberately small. The engineering is in how it's built and
checked: fully static, content as code, WCAG 2.1 AA enforced by tests, and CI
on every pull request.

## Stack

- **Next.js 16** (App Router) and **TypeScript**, fully static: every route is
  pre-rendered at build time
- **Tailwind CSS v4** with a design-token layer, so a redesign is mostly a
  token change
- **MDX** for log posts and case studies, compiled at build time with
  `@next/mdx`
- **Vercel** for hosting, with Vercel Web Analytics
- Generated Open Graph images, a sitemap, robots.txt, and an RSS feed

## Quality checks

| Check                    | Tool                                                                                  | Runs        |
| ------------------------ | ------------------------------------------------------------------------------------- | ----------- |
| Lint, strict a11y rules  | ESLint + `jsx-a11y` strict, zero warnings allowed                                     | locally, CI |
| Formatting               | Prettier, with Tailwind class sorting                                                 | locally, CI |
| Types                    | TypeScript                                                                            | locally, CI |
| Unit and component tests | Vitest + Testing Library, each component checked by axe                               | locally, CI |
| Color contrast           | test that every design-token pair meets 4.5:1 in both themes                          | locally, CI |
| Page-level accessibility | Playwright + axe on a production build: every page, light and dark, desktop and 375px | locally, CI |
| Keyboard access          | Playwright: skip link, theme toggle, visible focus                                    | locally, CI |

`npm run check` runs all of them. `main` is protected: changes land through
pull requests, and [CI](.github/workflows/ci.yml) runs the same checks plus a
production build on each one.

At launch (October 2026), Lighthouse scored 100 in performance,
accessibility, best practices, and SEO on every public page, on both mobile
and desktop.

## Working with an AI coding agent

I build this site with [Claude Code](https://claude.com/claude-code), and the
repo is set up so the agent can't call work done until the checks pass:

- [`CLAUDE.md`](CLAUDE.md) holds the project's conventions and the
  accessibility rules. For example, the agent must fix the underlying issue
  rather than disable a lint rule or weaken a test.
- [`.claude/hooks/`](.claude/hooks) runs ESLint after every file edit, and runs
  the full `npm run check` when the agent tries to finish. A failure blocks it
  and returns the error output, so it has to fix the problem and try again
  (capped at 3 attempts).

The model decides how to make a change; the tests decide when it's done.

## Running it locally

Requires Node.js 22.

```bash
npm install
npm run dev          # http://localhost:3000 (drafts visible)
```

The page-level accessibility tests drive headless Chromium. Install it once:

```bash
npx playwright install --with-deps chromium
```

| Script               | What it does                                                     |
| -------------------- | ---------------------------------------------------------------- |
| `npm run dev`        | Dev server, with drafts shown                                    |
| `npm run build`      | Production build, with drafts hidden; every route must be static |
| `npm run lint`       | ESLint, zero warnings allowed                                    |
| `npm run format`     | Format with Prettier                                             |
| `npm run typecheck`  | Generate route types, then type-check                            |
| `npm test`           | Unit and component tests                                         |
| `npm run test:watch` | Unit tests in watch mode                                         |
| `npm run test:a11y`  | Build the site, then run the page-level accessibility tests      |
| `npm run check`      | All of the checks above, in order                                |

## Project layout

```text
app/          routes, metadata files (sitemap, robots, OG images), RSS
components/   one component per file, grouped by feature
content/      MDX: log posts, case studies, and the About page
lib/site.ts   name, links, email, and the "Now" block
lib/content/  loads and validates MDX metadata
e2e/          Playwright accessibility and keyboard tests
```

Unit tests sit next to the code they test, for example `lib/dates.test.ts`.

## Adding content

Log posts go in `content/log/` and case studies in `content/projects/`. The
filename becomes the URL: `content/log/hello.mdx` is served at `/log/hello`.
Each file exports its metadata:

```mdx
export const metadata = {
  title: "Hello",
  description: "One sentence for the list page and link previews.",
  date: "2026-11-03",
  tags: ["nextjs"],
  draft: true,
};

Post body in Markdown.
```

- Missing or malformed metadata fails the build, so a broken post never ships.
- `draft: true` shows the post in `npm run dev` and leaves it out of
  production, including the RSS feed and sitemap. The accessibility tests
  still check drafts.
- Case studies follow the template in
  [`content/projects/README.md`](content/projects/README.md).
