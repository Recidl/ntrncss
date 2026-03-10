# Security Hardening Notes

This project now includes a basic protection layer for the contact endpoint in `public/contact.php` via `public/security.php`.

## Included Protections

- Strict request method enforcement (`POST` only).
- Origin/referrer allow-list checks.
- Per-IP rate limiting (8 requests per 10 minutes).
- JSON payload size limit.
- Input cleaning and suspicious payload detection (basic XSS/SQLi/path-traversal patterns).
- Strict email and field validation.
- Service/category consistency validation.
- Safer image handling:
  - base64 strict decode
  - MIME verification using `finfo`
  - file size limit (10MB)
  - sanitized attachment filenames
- Bot friction:
  - hidden honeypot field
  - submission timing check
- Hardened response headers for the PHP endpoint.
- Hardened error responses (no internal mailer error leakage).

## Feature Status Matrix

Security (Client Side / Website Files):
- Content Security Policy (CSP): Added in `index.html` via meta policy. Adjust allow-lists as integrations change.
- Subresource Integrity (SRI): Optional SRI hook added to dynamic YouTube API loader; use with version-pinned third-party assets only.
- CORS policies in client fetch: `secureFetch` enforces same-origin mode/credentials for in-app requests.
- Input sanitization and validation: Strong server-side validation active; client-side field validation and filtering in contact form retained.
- Secure cookies/tokens in JS: Cookie writes now add `Secure` when running on HTTPS. Note: `HttpOnly` cookies must be set by server headers, not JavaScript.

Performance:
- Lazy loading: Already used across many images; retained.
- Code splitting / dynamic imports: Enabled route-level lazy loading using `React.lazy` + `Suspense` fallback.
- Minification / bundling: Provided by Vite production build.
- Service workers and caching: Refined to avoid caching sensitive endpoints and cross-origin responses.
- Image optimization formats: Existing usage includes modern web delivery from CDNs; consider AVIF/WebP local pipeline for further gains.

Integration / Extensibility:
- API integration + fetch handling: Added `src/lib/http.js` wrapper with timeout, retry, and safe defaults.
- Webhooks / event handling: Browser-side event handling exists; server webhook endpoints should remain backend-only.
- Third-party SDK load scope: YouTube SDK already dynamic-loaded only where needed.
- PWA features: Manifest + service worker already present and now hardened.
- WASM modules: Not currently used (add only for CPU-heavy in-browser workloads).

## Deployment Checklist (Important)

These protections should be complemented by infrastructure-level security:

1. Enable HTTPS everywhere and force redirect HTTP to HTTPS.
2. Set HSTS on your real web server:
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
3. Add a strict Content Security Policy on your production web server.
4. Keep PHP and PHPMailer updated.
5. Move SMTP credentials out of source code into environment variables.
6. Use a WAF/CDN (Cloudflare or similar) with bot and rate-limit rules.
7. Restrict CORS/origin to your real domains only.
8. Log blocked requests and monitor repeated offender IPs.

## Secrets and Environment Variables

Use environment variables for all sensitive values:

- SMTP credentials
- admin routing emails
- private API keys
- tokens/secrets for third-party integrations

Rules:

1. Keep secrets out of frontend code and out of `VITE_*` variables.
2. Keep real `.env` files out of git.
3. Commit only templates like `.env.example`.
4. Rotate credentials immediately if they were ever committed.

This repository now includes:

- `.env.example` for local setup
- `.env.production.example` for host-panel/server configuration

The contact endpoint (`public/contact.php`) reads sensitive mail settings from environment variables and fails closed if required values are missing.

## About Source/File Theft

No public website can make client-side source code fully unstealable because browsers must download it to run it.

What you can do:

- Keep secrets and critical logic server-side.
- Never expose API keys or SMTP credentials in frontend code.
- Minify build output (already handled by Vite builds).
- Serve files over HTTPS and apply strict access controls to private assets.

