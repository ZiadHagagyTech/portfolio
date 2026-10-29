# Portfolio Studio — setup

This dashboard is being developed on `feature/visual-admin-cms`. It does not use Firebase. GitHub is the source of truth for the portfolio files, and a Cloudflare Worker securely proxies GitHub API writes.

## Current implementation stage

- Arabic/English admin interface with light/dark UI.
- Page selector for the six existing HTML pages.
- Preview-based text/link edits and basic inline styling.
- Section reordering in the preview.
- Saves only to `feature/visual-admin-cms`, never directly to `main`.
- The API Worker restricts writes to the six known HTML pages and keeps the GitHub token on the server side.

This is the first working foundation, not yet a full arbitrary block/page builder. New section templates, image uploads, richer responsive controls, and review/publish automation should be built and tested in follow-up commits.

## 1. Create a Cloudflare Worker

1. Create a Worker in the Cloudflare dashboard or install Wrangler and run `npx wrangler deploy` from the `worker` folder.
2. Configure these secrets on the Worker:
   - `ADMIN_PASSWORD`: a long, unique admin password.
   - `SESSION_SECRET`: a random secret with at least 32 characters.
   - `GITHUB_TOKEN`: a fine-grained GitHub token limited to this repository, with **Contents: Read and write** permission. Do not commit this token into the repository or put it in browser JavaScript.
3. The variable `GITHUB_REPOSITORY` is already set to `ZiadHagagyTech/portfolio`.
4. Set `ALLOWED_ORIGIN` to the exact origin serving the admin page, with no trailing slash. Example: `https://ziadhagagytech.github.io`. If the site uses a custom domain, use that origin instead. Do not use `*` for a deployed admin site.
5. Deploy and copy the Worker URL.

Example Wrangler commands (run from `worker`):

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
npx wrangler secret put GITHUB_TOKEN
npx wrangler deploy
```

Generate a session secret locally, for example with `openssl rand -hex 32`. Keep secrets private.

## 2. Configure the dashboard

In `admin/admin.js`, replace `https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev` with the deployed Worker URL. Commit this change to the development branch.

## 3. Hosting and safe publishing

- Ensure GitHub Pages is configured for the intended production source before expecting live site updates.
- The dashboard saves edits to `feature/visual-admin-cms` only.
- Review changes on that branch, then open a Pull Request to `main`. Merge only after reviewing the diff and checking the site.
- The dashboard should not be treated as production-ready until the Worker URL, secrets, allowed origin, authentication, and page preview are tested in the actual hosting environment.

## Security notes

- Never put a GitHub token in HTML, CSS, or client-side JavaScript.
- Use a dedicated fine-grained token and rotate it if exposed.
- Protect the dashboard URL and use a strong unique admin password.
- The Worker issues an eight-hour signed session token. This is an admin gate, not a substitute for protecting the GitHub token and reviewing changes before merge.
