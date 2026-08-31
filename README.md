# Date invitation ❤️

A small, personal, interactive invitation. The visitor walks through a handful of
screens, plans the date, and confirms it - and the plan lands in your inbox. The
NO button on the first screen refuses to be clicked.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

---

## 1. Get the answers in your inbox

GitHub Pages only serves files - there is no server to save anything - so the
finished plan is posted straight from the visitor's browser to **Web3Forms**,
which emails it to you.

1. Open <https://web3forms.com>
2. Type the email address that should receive the plan, press the button.
3. They email you an **access key** immediately (no account, no password).
4. Paste it into `src/data/delivery.ts`:

```ts
export const DELIVERY = {
  web3formsAccessKey: "paste-the-key-here",
  ...
};
```

5. Commit and push - the site redeploys and the next confirmation reaches you.

The key sits in the page source, and that is fine: it can only send a form to
the address you registered, and grants nothing else.

**Leave it empty and the site still works.** The confirmation screen then shows
a "Copy the plan 💌" button (a native share sheet on phones) so the plan can be
pasted into Messenger or Zalo by hand. The same button is the fallback if the
send ever fails, so an answer can never be lost.

What you receive: one email per confirmation, with a line per answer plus a
plain-text summary and a timestamp.

### Testing the delivery

Two things will waste your time if you do not know them:

- **Web3Forms refuses server-side calls on the free plan.** A `curl` POST comes
  back `403 "Use our API in client side"`. It has to come from a browser.
- **Cloudflare (in front of their API) blocks headless browsers.** An automated
  check in headless Chromium fails with a CORS error that looks exactly like a
  bug in this code - it is not. Drive a real browser
  (`chromium.launch({ channel: "chrome", headless: false })`) and the same
  request returns `200 {"success": true}`.

---

## 2. Put it on GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes on every push
to `main`. It reads the repository name itself, so there is nothing to edit.

This one is already live at <https://toanvocuc.github.io/date-invitation/>.
Every push to `main` redeploys it; nothing else to do.

Setting it up again from scratch:

1. Create a **public** repository on GitHub (Pages is free only for public repos).
2. Push this folder to it:

```bash
git remote add origin https://github.com/<you>/<repo>.git
git branch -M main
git push -u origin main
```

3. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
   This step cannot be skipped by putting `enablement: true` on
   `actions/configure-pages` - the workflow's own token is not allowed to create
   the Pages site, and the build just fails with
   *"Resource not accessible by integration"*.
4. Push once more (or **Actions → Deploy to GitHub Pages → Run workflow**).

The site appears at `https://<you>.github.io/<repo>/` - that is the link to send.

Renaming the repo changes the URL and the asset prefix; just push again and the
workflow picks the new name up.

To build the static site by hand:

```bash
NEXT_STATIC_EXPORT=true NEXT_BASE_PATH=/<repo-name> npm run build   # -> out/
```

---

## Where things live

```
src/
  app/                      layout, globals.css (palette + fonts)
  types/date.ts             DatePlan - every answer, one place
  lib/
    flow.ts                 stage order, skipping, next/prev
    dodge.ts                the NO button escape geometry (pure functions)
    summary.ts              answers -> readable lines (screen, email, clipboard)
    submitPlan.ts           posts the plan to Web3Forms
    rng.ts, useMounted.ts   SSR-safe helpers
  data/                     <- edit these, not the components
    intro.ts                greeting, question, avatar
    noButton.ts             danger radius, jump distance, escalating labels
    stageOptions.ts         Stage 1 / 1.5 / 2 / 3 choices
    dressCode.ts            Stage 5 choices
    delivery.ts             your Web3Forms access key
  components/
    DateInvitation/         orchestrator, intro screen, YES + NO buttons
    stages/                 Stage1 ... Stage5, StageSummary, StageConfirmed
    ui/                     card, heading, selection card, progress, background
```

## Things worth knowing before you extend it

**Adding a stage.** Three edits: an id in `STAGE_ORDER` (`src/lib/flow.ts`), a
component in `components/stages/`, a `case` in `DateInvitation.renderStage()`.
Add its answer to `DatePlan` as an **optional** field. If it should appear in the
progress row, add it to `PROGRESS_STAGES`; if it should show on the summary, add
a row in `buildSummary()` (`src/lib/summary.ts`) - that one function feeds the
summary screen, the email and the clipboard at once. The Q&A game goes between
Stage 4 and Stage 5; both files are marked with a comment.

**Stage props.** Every stage gets `{ plan, update, advance, goBack, goTo }`.
`update(patch)` stores an answer, `advance(patch?)` stores and moves on, `goTo`
jumps anywhere (the summary uses it to edit one line). `advance` reads the merged
answers immediately, so a stage can decide where to go in the same click - that
is how Stage 1 skips Stage 1.5.

**Conditional stages.** `isStageSkipped()` in `flow.ts` is the single source of
truth - navigation *and* the progress indicator both read it.

**Motion preference.** `<MotionConfig reducedMotion="user">` in
`DateInvitation.tsx` handles it globally. Do **not** branch on
`useReducedMotion()` inside render to change props or markup - the server has no
idea what the visitor prefers, and it breaks hydration. Use `useMounted()` if
something really must be client-only.

**The NO button** renders through a portal on `document.body`. It has to: the
frosted card and the stage transition both create containing blocks that would
otherwise trap a `position: fixed` element. `src/lib/dodge.ts` guarantees it stays
on screen, off the YES button, and away from the cursor - including after a
longer label makes the button wider.
