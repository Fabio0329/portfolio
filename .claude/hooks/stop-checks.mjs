// Stop hook: before Claude ends a turn, run `npm run check` (lint, format,
// typecheck, unit tests, page-level a11y tests). If it fails, block the stop
// and hand Claude the failing output, so the turn can't end with anything red.
//
// - Skips turns where the working tree matches HEAD (nothing to check).
// - Remembers the last green state, so unchanged work isn't re-checked on
//   every turn while it waits for review.
// - Blocks at most MAX_ATTEMPTS times in a row per session, then lets the turn
//   end with a warning, so a check that can't be fixed never traps the session.
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const MAX_ATTEMPTS = 3;
const OUTPUT_LINES = 80;

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

const readStdin = async () => {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data;
};

// Colors off, so the output handed back to Claude is plain text.
const run = (command, args) =>
  spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1" },
  });

const respond = (output) => {
  process.stdout.write(JSON.stringify(output));
  process.exit(0);
};

const input = JSON.parse((await readStdin()) || "{}");

// What changed relative to HEAD: modified, staged, and untracked files.
// With -z, each entry is "XY path"; renames and copies are followed by an
// extra entry holding the old path, which is skipped.
const entries = run("git", [
  "status",
  "--porcelain=v1",
  "-z",
  "--untracked-files=all",
]).stdout.split("\0");
const changed = [];
for (let i = 0; i < entries.length; i++) {
  const entry = entries[i];
  if (!entry) continue;
  changed.push(entry.slice(3));
  if (/^[RC]/.test(entry)) i++;
}
if (changed.length === 0) process.exit(0);

// Fingerprint of the working tree: HEAD plus the contents of changed files.
const hash = createHash("sha256").update(
  run("git", ["rev-parse", "HEAD"]).stdout,
);
for (const file of changed.sort()) {
  const full = path.join(root, file);
  hash.update(file);
  hash.update(existsSync(full) ? readFileSync(full) : "<deleted>");
}
const fingerprint = hash.digest("hex");

const stateDir = path.join(tmpdir(), "claude-portfolio-hooks");
mkdirSync(stateDir, { recursive: true });
const repoKey = createHash("sha256").update(root).digest("hex").slice(0, 12);
const greenFile = path.join(stateDir, `green-${repoKey}`);
const attemptsFile = path.join(
  stateDir,
  `attempts-${repoKey}-${input.session_id ?? "unknown"}`,
);

const read = (file) => (existsSync(file) ? readFileSync(file, "utf8") : "");

if (read(greenFile) === fingerprint) process.exit(0);

const result = run("npm", ["run", "check"]);

if (result.status === 0) {
  writeFileSync(greenFile, fingerprint);
  writeFileSync(attemptsFile, "0");
  process.exit(0);
}

const attempts = Number(read(attemptsFile) || "0") + 1;
// Keep the end of the output, where failures are reported.
const output = `${result.stdout}${result.stderr}`
  .split("\n")
  .slice(-OUTPUT_LINES)
  .join("\n");

if (attempts > MAX_ATTEMPTS) {
  writeFileSync(attemptsFile, "0");
  respond({
    systemMessage:
      `npm run check is still failing after ${MAX_ATTEMPTS} attempts, so ` +
      `the turn was allowed to end. The work is NOT done; ask Claude to fix it.`,
  });
}

writeFileSync(attemptsFile, String(attempts));
respond({
  decision: "block",
  reason:
    `npm run check failed (attempt ${attempts} of ${MAX_ATTEMPTS}). The task ` +
    `isn't done until it passes. Fix the underlying problem; never disable ` +
    `rules, weaken tests, or edit lint/test config or these hooks to get ` +
    `past it (see CLAUDE.md).\n\nLast ${OUTPUT_LINES} lines of output:\n${output}`,
});
