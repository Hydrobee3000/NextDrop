# NextDrop

A countdown tracker for upcoming video game releases: https://hydrobee3000.github.io/NextDrop/

## Stack

- **Angular 19**, standalone components only (no NgModules), lazy routes via `loadComponent` in `src/app/app.routes.ts`.
- **RxJS** for HTTP and streams (search debounce), **Signals** for local and UI state (`signal`, `computed`, `effect`, `input()`, `output()`).
- **SCSS**, styles scoped per component (ViewEncapsulation). No Tailwind.
- **RAWG.io API** as the data source. All requests go through `GamesApiService`; DTOs (`RawgGame`) are mapped to the app's own `Game` model.
- Icons: `@lucide/angular` (UI), `simple-icons` (platform logos).
- Tests: Karma + Jasmine + `TestBed`.

## Commands

```bash
npm start                                # dev server, http://localhost:4200
npx tsc --noEmit -p tsconfig.app.json    # typecheck
npm run build                            # build
npx ng test --watch=false --browsers=ChromeHeadless
npx ng test --include src/app/path/to/file.spec.ts --watch=false --browsers=ChromeHeadless
```

`ng test` needs the `CHROME_BIN` environment variable pointing to Chrome.

CI (`.github/workflows/ci.yml`, job `build`) runs the typecheck, the unit tests and the build on every PR. The `Protect main` ruleset blocks merging a PR into `main` until this check is green, so run all three locally before pushing.

The build warns that `game-detail-modal.component.scss` exceeds its budget. This is known and not an error.

## Browser checks

`.mcp.json` connects the Playwright MCP server (pinned version, headless, isolated profile). Use it to check UI changes in a real browser against the dev server: typing, hovering, navigating, both themes, mobile width. Screenshots alone don't show interactions or animations.

## Structure

- `src/app/pages/`: pages (`home`, `search`, `favorites`, `not-found`).
- `src/app/components/`: reusable components (cards `game-card` / `game-row` / `game-hero` and their `*-skeleton`, `game-filters`, `game-detail-modal`, `layout`, etc.).
- `src/app/services/`: services (`providedIn: 'root'`).
- `src/app/shared/`: pure functions and constants, including translations in `translations.ts`.
- `src/app/pipes/`, `src/app/models/`.
- `src/styles.scss`: design tokens (`--color-*`, `--space-*`, `--tactile-shadow-*`, `--radius-*`), the light theme via `:root[data-theme='light']`, and shared classes (`.tactile-card`, `.tactile-badge`, `.tactile-days-badge`).

## Code conventions

- Colors, spacing, shadows and radii come from the tokens in `styles.scss`, not hardcoded values. Check every visual change in both themes.
- All UI text goes through `TranslatePipe` / `I18nService`. Every key is added to both `ru` and `en` in `src/app/shared/translations.ts`.
- Wrap animations in `@media (prefers-reduced-motion: no-preference)`.
- Comments are in English and short: a one-line JSDoc above a type or class, `//` only for non-obvious decisions. Don't restate the code. A comment describes the file it's in; don't compare it with other components.
- `src/environments/environment.ts` and `environment.development.ts` hold the real RAWG key and are gitignored. Only the `*.example` templates are committed. The key must never appear in code, commits or PRs.
- `/design` holds visual references and is gitignored; don't commit it.

## Tests

- One issue per component spec file. Pure functions in `shared/` can be covered in a single issue.
- Set signal `input()`s with `fixture.componentRef.setInput(...)` + `fixture.detectChanges()`.
- Mock services with `jasmine.createSpyObj`. Services that depend on `HttpClient` are either mocked or used with `provideHttpClient()` + `provideHttpClientTesting()`; tests never hit the real RAWG API.
- When rendering depends on the current date, use `jasmine.clock().install()` + `mockDate()` in `beforeEach` / `afterEach`.
- When a test fails, fix the code, not the test. Loosen a test only on purpose, with the reason stated.

## Workflow

Issues, commits, PRs and documentation are written in English.

1. **Issue.** Conventional-commit style title, lowercase after the type, no scope: `feat: …`, `fix: …`, `style: …`, `test: …`, `docs: …`. The body briefly says what needs to be done, not how. Assign it and add it to the `NextDrop` project.
2. **Branch** off an up-to-date `main`: `<type>/<issue-number>-<slug>`, e.g. `feat/322-search-mascot-dock`. No changes directly on `main`.
3. **Changes** belong to that issue only, with no unrelated edits. Before committing, run the typecheck, the tests and the build.
4. **Commit:** `<type>: <description> (#<issue-number>)`.
5. **PR:** the same title as the issue. The body briefly lists what changed and ends with `Closes #<issue-number>`. Don't describe how it was verified ("tests pass", "checked in the browser"). Assign it and add it to the `NextDrop` project.
6. **Merge:** squash with branch deletion (`gh pr merge <N> --squash --delete-branch`).

**Never add AI attribution to commits or PRs** (`Co-Authored-By: Claude …`, "Generated with Claude Code" and the like), even if a tool adds it by default.

## Agent pipeline

Project subagents live in `.claude/agents/`. Each runs with its own empty context and sees only the task text and this file, so write the task text with everything it needs.

1. **Issue and branch** are created first (see Workflow).
2. **`implementer`** makes the change and runs the typecheck, tests and build. It never commits.
3. **`reviewer`** (read-only) reviews the diff against this file and reports findings. Fix valid findings by running `implementer` again with the findings as the task.
4. The maintainer looks at the result after the review.
5. **`tester`** writes the unit tests for the change and proves they catch regressions.
6. Commit, PR and merge, once the full suite is green.

Each new task starts from step 1 with fresh agents; nothing carries over except what is in the repo.

## AI review of PRs

When reviewing a PR, check first:
- the conventions above: tokens instead of hardcoded values, translations in both languages, `prefers-reduced-motion`, comment style;
- changes outside the PR's issue;
- leaked RAWG keys or other secrets;
- tests loosened just to make them pass;
- Angular or RxJS APIs that don't exist.

Don't nitpick matters of taste that don't break these rules.
