# End-to-End Tests (Playwright)

E2E coverage for the meridian-web sign-in / homepage flows, powered by
[Playwright](https://playwright.dev) with
[axe-core](https://github.com/dequelabs/axe-core) accessibility smoke checks.

## What's covered

| Spec | Flows |
|---|---|
| `homepage.spec.ts` | Homepage load, hero content, header nav, anchor navigation |
| `theme-toggle.spec.ts` | Light/dark switching, localStorage persistence, keyboard access |
| `mobile-nav.spec.ts` | Hamburger open/close, `aria-expanded` state, nav + theme toggle on mobile (Pixel 7 viewport) |
| `sign-in.spec.ts` | Form validation (email/password/required), submit gating, auth redirect on success, error toasts on failure — **all API calls mocked** |
| `accessibility.spec.ts` | axe-core WCAG 2.0/2.1 A+AA smoke checks (zero serious/critical violations) on `/` and `/auth/sign-in`, form labelling |

## Running the tests

```bash
# one-time: install deps + the Chromium browser binary
pnpm install
npx playwright install chromium

# run the suite (builds the app and starts it on port 3100 automatically)
pnpm test            # alias for `playwright test`
npx playwright test  # equivalent

# interactive UI mode
pnpm test:e2e:ui

# a single spec / project
npx playwright test e2e/sign-in.spec.ts
npx playwright test --project=mobile-chromium
```

## How it works

- **Production build under test.** The `webServer` block in
  `playwright.config.ts` runs `pnpm build && pnpm start -p 3100` before the
  suite and tears it down afterwards. Testing the production build avoids
  the flaky first-compile timeouts of dev mode. Locally the server is
  reused across runs (`reuseExistingServer`); in CI it's always fresh.
- **No backend required.** The sign-in flow's `POST /api/auth/signin` call
  is intercepted per-test with `page.route()` and fulfilled with canned
  200/401/500 responses, so tests are deterministic and hermetic.
- **Two projects.** `chromium` (Desktop Chrome) runs everything except
  `mobile-nav.spec.ts`, which runs in `mobile-chromium` (Pixel 7) where the
  hamburger menu is actually visible.
- **Accessibility bar.** The axe checks fail only on `serious`/`critical`
  WCAG A/AA violations — strict enough to catch regressions, lenient enough
  not to block on best-practice noise. Tighten by removing the impact
  filter in `accessibility.spec.ts`.

## CI notes

- `forbidOnly` fails the build if a stray `test.only` is committed.
- 2 retries and a single worker in CI (`process.env.CI`), with traces and
  an HTML report (`playwright-report/`) captured on retry/failure.
- Artifacts (`test-results/`, `playwright-report/`) are gitignored.
