// PostToolUse hook (Edit|Write): lint the file Claude just edited, so problems
// surface while the change is fresh. Exit code 2 sends the ESLint output back
// to Claude, which must fix it. Any other file type is ignored.
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

const readStdin = async () => {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data;
};

const input = JSON.parse((await readStdin()) || "{}");
const file = input.tool_input?.file_path;
if (!file) process.exit(0);

const relative = path.relative(root, path.resolve(root, file));
const insideRepo = !relative.startsWith("..") && !path.isAbsolute(relative);
if (!insideRepo || !/\.(m|c)?[jt]sx?$/.test(relative)) process.exit(0);

const eslint = path.join(root, "node_modules", ".bin", "eslint");
const result = spawnSync(
  eslint,
  ["--max-warnings=0", "--no-warn-ignored", relative],
  { cwd: root, encoding: "utf8" },
);

if (result.status === 0) process.exit(0);

process.stderr.write(
  `ESLint found problems in ${relative}. Fix the underlying issue; don't ` +
    `disable the rule (see CLAUDE.md).\n\n${result.stdout}${result.stderr}`,
);
process.exit(2);
