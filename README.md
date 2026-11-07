# astra-games-dry-run

Rehearses the games catalogue's staging "done when" (astra-plugins-ops
`dev/game-integrations-plan-merged.md`, G3) end to end, **without the
plugins service**: a non-owner account publishes a C# test GI
([`astra-gi-staging-csharp`](https://github.com/astra-test-author/astra-gi-staging-csharp))
and a foo-engine foundation
([`astra-foundation-foo-engine`](https://github.com/astra-test-author/astra-foundation-foo-engine)),
and a single `workflow_dispatch` run in this repository:

1. checks out `mihailinl/astra-games-catalogue` (`main` and `data`) read-only;
2. fetches the pinned `gi-probe` the way `ingest.yml` does;
3. builds one ingest request per release from the GitHub API and runs
   `bin/ingest.mjs` for each, printing the verdict and finding codes;
4. signs both candidates plus one `M_REVOKE` act on the GI with throwaway
   **TEST** keys (never the catalogue's real signing secrets), then
   independently re-verifies the signed index and withdrawn documents;
5. uploads the requests, candidates and signed documents (never a private
   key) as a workflow artifact.

See [`.github/workflows/dry-run.yml`](.github/workflows/dry-run.yml) and
[`scripts/dry-sign.mjs`](scripts/dry-sign.mjs) (whose header explains exactly
which seam it uses to sign without the production root key, and why that is
not an edit to the catalogue).

This repository never modifies `astra-games-catalogue` or `AstraPlugins` --
it only imports their already-exported library code read-only, exactly as
their own test suites do.
