# NextDrop

A countdown tracker for upcoming video game releases. Browse what's coming out soon, search the full catalog, filter by platform, and save games you're waiting for — all backed by live data from [RAWG.io](https://rawg.io/apidocs).

**Live demo:** https://hydrobee3000.github.io/NextDrop/

## Tech stack

| Tool | Purpose |
| --- | --- |
| [Angular 19](https://angular.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [RxJS](https://rxjs.dev) | HTTP calls, search debouncing |
| Angular Signals | Local state |
| SCSS | Component styles |
| [RAWG.io API](https://rawg.io/apidocs) | Game data |
| [@lucide/angular](https://github.com/lucide-icons/lucide) | UI icons |
| [simple-icons](https://simpleicons.org/) | Platform logos |
| [GitHub Actions](https://github.com/features/actions) | CI/CD |
| [GitHub Pages](https://pages.github.com) | Hosting |

## Getting started

### Prerequisites

- Node.js 20+
- A free [RAWG API key](https://rawg.io/apidocs)

### Setup

```bash
npm install
cp src/environments/environment.ts.example src/environments/environment.ts
cp src/environments/environment.development.ts.example src/environments/environment.development.ts
```

Edit both files and replace `YOUR_RAWG_API_KEY` with your real key. These files are gitignored — never commit a real key.

### Run

```bash
npm start
```

Open `http://localhost:4200/`. The app reloads automatically as you edit source files.

## Available scripts

| Script | Description |
| --- | --- |
| `npm start` | Start a local dev server at `http://localhost:4200/`. |
| `npm run build` | Production build, output in `dist/nextdrop/browser`. |
| `npm run watch` | Development build in watch mode. |
| `npm test` | Run unit tests with Karma. |

## CI/CD

- **CI** (`.github/workflows/ci.yml`) runs on every push/PR to `main`: typecheck + production build.
- **Deploy** (`.github/workflows/deploy.yml`) publishes to GitHub Pages, triggered manually (`gh workflow run deploy.yml`) after cutting a release — not on every commit.

## Project structure

```
src/app/
├── components/   # Reusable UI: game cards, filters, nav, platform icons, language switcher
├── pages/        # Routed pages: home, search, favorites
├── services/     # GamesApiService (RAWG), FavoritesService, I18nService
├── pipes/        # daysUntil, translate, localizedDate
├── models/       # Game, RawgGame, Locale
└── shared/       # Platform-filter/icon helpers, pluralization, translation dictionary
```
