# Revenue Orchestrator

**Autonomous Revenue Orchestration Engine.** Scattered apps in. Decisive action out.

Revenue Orchestrator takes signals from the tools a company already uses (WhatsApp, Zoom, Google Meet, Gmail,
Google Maps, accounting, ERP, CRM, billing, support), refines them into context, and lets one brain with four
algorithms decide where every hour of selling should go. Teams get Signal Cards; leaders talk to it by voice.

- **Live presentation:** https://keevin227.github.io/Revenue-Orchestrator/
- **Product concept:** [docs/CONCEPT.md](docs/CONCEPT.md)

## The presentation

A 16-slide cinematic deck in plain HTML, CSS and JavaScript (no build step), in [`site/`](site).

| Key | Action |
|---|---|
| `→` `Space` `Enter` / click | next step or slide |
| `←` / click on the left third | previous |
| `F` | fullscreen |
| `Home` / `End` | first / last slide |

Deep links work by slide number, e.g. `#4` opens the system animation. On touch screens, swipe.

Run locally:

```sh
cd site && python3 -m http.server 8000   # then open http://localhost:8000
```

Deployment: every push to `main` (or the working branch) that touches `site/` runs
[`.github/workflows/pages.yml`](.github/workflows/pages.yml), which publishes `site/` to GitHub Pages.
Pages must be set to **Source: GitHub Actions** in the repository settings.

Brand marks come from [Simple Icons](https://simpleicons.org) (CC0) and are trademarks of their owners, shown only to
illustrate example integrations. All customer names and figures in the deck are illustrative.
