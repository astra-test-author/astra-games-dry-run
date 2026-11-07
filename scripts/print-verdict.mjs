#!/usr/bin/env node
// SPDX-License-Identifier: MIT
//
// Prints one lease's ingest verdict and finding codes, and exits non-zero
// unless the verdict is "accept". A hold/wait is printed WITH its reason
// (never silently swallowed) before this script fails the step for it --
// astra-plugins-ops dev/game-integrations-plan-merged.md G3 requires both
// releases to actually be accepted in the same run, not merely "not refused".
//
//   node print-verdict.mjs <lease> <candidate_file>

import fs from "node:fs";

const [lease, file] = process.argv.slice(2);
if (!lease || !file) {
  console.error("usage: print-verdict.mjs <lease> <candidate_file>");
  process.exit(2);
}
const c = JSON.parse(fs.readFileSync(file, "utf8"));
const codes = (c.findings ?? []).map((f) => f.code);
const line = `${lease}: verdict=${c.verdict} entry=${c.entry?.id ?? "(none)"} repo=${c.request?.repo_id} tag=${c.request?.tag} findings=${codes.join(",") || "none"}`;
console.log(line);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `- ${line}\n`);
if (c.verdict !== "accept") {
  for (const f of c.findings ?? []) console.error(`  ${f.code}: ${f.message}`);
  console.error(`${lease}: verdict is ${c.verdict}, not accept -- see the finding(s) above for the documented reason`);
  process.exit(1);
}
