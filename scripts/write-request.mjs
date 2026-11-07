#!/usr/bin/env node
// SPDX-License-Identifier: MIT
//
// Writes one games-request-<lease>.json the way the plugins service's
// `work` job would (astra-games-catalogue's lib/ingest.mjs `parseRequest`
// reads it): one astra.games.leases/1 lease item, as a plain JSON file —
// never a string a workflow interpolated into a shell. This script never
// talks to the catalogue; it only writes the file bin/ingest.mjs reads.
//
//   node write-request.mjs <lease_id> <repo_id> <tag> <out_file>

import fs from "node:fs";
import path from "node:path";

const [leaseId, repoId, tag, outFile] = process.argv.slice(2);
if (!leaseId || !repoId || !tag || !outFile) {
  console.error("usage: write-request.mjs <lease_id> <repo_id> <tag> <out_file>");
  process.exit(2);
}

const request = {
  lease_id: leaseId,
  repo_id: Number(repoId),
  tag,
  // No site exists in this rehearsal to mint a binding token; each release
  // repository carries its own `.well-known/astra-gi-owner` line instead,
  // and this is that token's sha256 (public by DEC-2 -- never a secret).
  binding_token_sha256: process.env.BINDING_TOKEN_SHA256 ?? null,
  confirmed: [],
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(request, null, 2));
console.log(`wrote ${outFile}: ${JSON.stringify(request)}`);
