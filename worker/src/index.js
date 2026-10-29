const ALLOWED_PAGES = new Set(["index.html", "about.html", "services.html", "projects.html", "contact.html", "evaluation.html"]);
const BRANCH = "feature/visual-admin-cms";

function json(data, status = 200, origin = "*") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Vary": "Origin"
    }
  });
}
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
function b64url(bytes) {
  let s = "";
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function fromB64url(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  s += "=".repeat((4 - s.length % 4) % 4);
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}
async function hmac(secret, value) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}
async function makeToken(env) {
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000, scope: "portfolio-admin" })));
  const signature = b64url(await hmac(env.SESSION_SECRET, payload));
  return payload + "." + signature;
}
async function verifyToken(request, env) {
  const header = request.headers.get("Authorization") || "";
  if (!header.startsWith("Bearer ")) return false;
  const parts = header.slice(7).split(".");
  if (parts.length !== 2) return false;
  const expected = b64url(await hmac(env.SESSION_SECRET, parts[0]));
  if (!timingSafeEqual(expected, parts[1])) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(parts[0])));
    return payload.scope === "portfolio-admin" && payload.exp > Date.now();
  } catch { return false; }
}
function allowedOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGIN || "").split(",").map(x => x.trim()).filter(Boolean);
  if (!origin) return allowed[0] || "*";
  return allowed.includes(origin) ? origin : "null";
}
function validOrigin(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  const allowed = (env.ALLOWED_ORIGIN || "").split(",").map(x => x.trim()).filter(Boolean);
  return allowed.includes(origin);
}
function validatePath(path) {
  return typeof path === "string" && ALLOWED_PAGES.has(path) && !path.includes("..") && !path.startsWith("/");
}
async function githubRequest(env, path, init = {}) {
  const response = await fetch("https://api.github.com/repos/" + env.GITHUB_REPOSITORY + path, {
    ...init,
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": "Bearer " + env.GITHUB_TOKEN,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Portfolio-Studio-Worker",
      ...(init.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.message || "GitHub API request failed";
    throw new Error(response.status === 409 ? "GitHub conflict: reload the page and retry." : message);
  }
  return body;
}
export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request, env);
    if (request.method === "OPTIONS") {
      if (!validOrigin(request, env)) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Max-Age": "86400",
        "Vary": "Origin"
      }});
    }
    const url = new URL(request.url);
    if (!["GET", "POST", "PUT"].includes(request.method)) return json({ error: "Method not allowed" }, 405, origin);
    if (!validOrigin(request, env)) return json({ error: "Origin not allowed" }, 403, origin);
    if (!env.ADMIN_PASSWORD || !env.GITHUB_TOKEN || !env.GITHUB_REPOSITORY || !env.SESSION_SECRET) {
      return json({ error: "Worker setup is incomplete. Configure all required secrets and variables." }, 500, origin);
    }
    if (url.pathname === "/api/login" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const submitted = typeof body.password === "string" ? body.password : "";
      if (!timingSafeEqual(submitted, env.ADMIN_PASSWORD)) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return json({ error: "Incorrect password." }, 401, origin);
      }
      return json({ token: await makeToken(env), expiresIn: 28800 }, 200, origin);
    }
    if (!url.pathname.startsWith("/api/")) return json({ error: "Not found" }, 404, origin);
    if (!await verifyToken(request, env)) return json({ error: "Session expired. Sign in again." }, 401, origin);

    if (url.pathname === "/api/file" && request.method === "GET") {
      const path = url.searchParams.get("path");
      if (!validatePath(path)) return json({ error: "File is not allowed." }, 400, origin);
      try {
        const file = await githubRequest(env, "/contents/" + encodeURIComponent(path) + "?ref=" + encodeURIComponent(BRANCH));
        const content = new TextDecoder().decode(Uint8Array.from(atob(file.content.replace(/\n/g, "")), c => c.charCodeAt(0)));
        return json({ path, content, sha: file.sha, branch: BRANCH }, 200, origin);
      } catch (error) { return json({ error: error.message }, 502, origin); }
    }
    if (url.pathname === "/api/pull-request" && request.method === "POST") {
      try {
        const existing = await githubRequest(env, "/pulls?state=open&head=" + encodeURIComponent(env.GITHUB_REPOSITORY.split("/")[0] + ":" + BRANCH) + "&base=main");
        if (Array.isArray(existing) && existing.length) {
          return json({ ok: true, url: existing[0].html_url, number: existing[0].number, existing: true }, 200, origin);
        }
        const result = await githubRequest(env, "/pulls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Review portfolio visual editor changes",
            head: BRANCH,
            base: "main",
            body: "Please review the portfolio updates from Portfolio Studio before merging. Check desktop/mobile layouts, links, and page scripts."
          })
        });
        return json({ ok: true, url: result.html_url, number: result.number, existing: false }, 200, origin);
      } catch (error) { return json({ error: error.message }, 502, origin); }
    }
    if (url.pathname === "/api/file" && request.method === "PUT") {
      const body = await request.json().catch(() => ({}));
      const path = body.path;
      const content = body.content;
      const message = typeof body.message === "string" ? body.message.slice(0, 120) : "Update portfolio page from visual editor";
      if (!validatePath(path)) return json({ error: "File is not allowed." }, 400, origin);
      if (typeof content !== "string" || content.length > 900000) return json({ error: "Invalid content or file too large (900 KB maximum)." }, 400, origin);
      try {
        let existing;
        try { existing = await githubRequest(env, "/contents/" + encodeURIComponent(path) + "?ref=" + encodeURIComponent(BRANCH)); }
        catch (error) { throw new Error("Could not read current file on the development branch: " + error.message); }
        const encoded = btoa(Array.from(new TextEncoder().encode(content), b => String.fromCharCode(b)).join(""));
        const result = await githubRequest(env, "/contents/" + encodeURIComponent(path), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, content: encoded, sha: existing.sha, branch: BRANCH })
        });
        return json({ ok: true, path, branch: BRANCH, commit: result.commit?.sha || "" }, 200, origin);
      } catch (error) { return json({ error: error.message }, 502, origin); }
    }
    return json({ error: "Not found" }, 404, origin);
  }
};