# BeonTech-Demo

The following repo is made to show the result to the respective questions asked during our first interview.

Cypress + TypeScript suite with two tests:

- **API:** Restful-Booker booking lifecycle (auth, create, read, update, delete).
- **UI:** SauceDemo purchase path (login, add two items, verify cart, checkout, confirm order).

**Published report:** the latest run is published to GitHub Pages on every push to `master`. The link appears on each CI run page.

**Use the following dynamic link to understand the repo**
[![Architecture diagram of i-martinx/beontech-demo](https://gitdiagram.com/i-martinx/beontech-demo/diagram.png)](https://gitdiagram.com/i-martinx/beontech-demo?utm_source=readme&utm_medium=picture)

<figure align="center">
  <img src="imgs\diagram.png" alt="Architecture diagram">
  <figcaption><b>Figure 1:</b><i> Repo architecture overview.</i></figcaption>
</figure>

You can check the report of the test cases [at the following link](https://i-martinx.github.io/BeonTech-Demo/)

## Prerequisites

- Node.js 18 or newer (tested with Node 22)
- npm
- Internet access (the tests call the live sites)

## Installation

```bash
npm install
```

### Credentials

The demo logins are not stored in the config. Create a local `cypress.env.json` (git-ignored) from the template:

```bash
cp cypress.env.example.json cypress.env.json
```

Alternatively, set `CYPRESS_apiUser`, `CYPRESS_apiPassword`, `CYPRESS_uiUser`, and `CYPRESS_uiPassword` as environment variables.

## Running the tests

Short commands (headless by default):

| Command       | What it runs                     |
| ------------- | -------------------------------- |
| `npm run all` | All specs (API and UI), headless |
| `npm run api` | API spec only, headless          |
| `npm run ui`  | UI spec only, headless           |

Full names work the same way: `npm test` and `npm run test:all` (all specs), `npm run test:api`, and `npm run test:ui`. Two more commands:

| Command                  | What it runs                 |
| ------------------------ | ---------------------------- |
| `npm run test:ui:headed` | UI spec in a visible browser |
| `npm run open`           | Cypress interactive runner   |

## Quality checks

| Command                | What it checks                                             |
| ---------------------- | ---------------------------------------------------------- |
| `npm run check`        | Formatting, lint, file names, and types (all of the below) |
| `npm run format`       | Formats the code with Prettier                             |
| `npm run format:check` | Prettier only                                              |
| `npm run lint`         | ESLint (TypeScript, Cypress rules)                         |
| `npm run lint:names`   | File and folder naming rules (`.ls-lint.yml`)              |
| `npm run typecheck`    | TypeScript type check                                      |
| `npm run audit`        | Fails on high or critical dependency vulnerabilities       |

## Reports

Each run writes an HTML report to `reports/mochawesome/index.html`. It lists every test as Passed or Failed. A failed test shows the failing assertion and a screenshot. `npm run summary` prints the same pass/fail table as text.

If Cypress fails to start with `bad option: --smoke-test`, the shell has `ELECTRON_RUN_AS_NODE=1` set. Clear it for the run, for example `env -u ELECTRON_RUN_AS_NODE npm test` in Git Bash.

## Continuous integration

`.github/workflows/` contains three workflows:

| Workflow     | When it runs                    | What it does                                                                                                                                                                                                              |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`     | Push to `master`, pull requests | Quality checks, secret scan (gitleaks), dependency audit, then the Cypress tests. Writes a pass/fail table to the run page, uploads the HTML report as an artifact, and on `master` publishes the report to GitHub Pages. |
| `codeql.yml` | Push, pull requests, weekly     | CodeQL static security analysis. Results appear under the repository's Security tab.                                                                                                                                      |
| Dependabot   | Weekly                          | Opens update pull requests for npm packages and GitHub Actions.                                                                                                                                                           |

### One-time repository setup

1. **Secrets:** Settings → Secrets and variables → Actions → add `API_USER`, `API_PASSWORD`, `UI_USER`, and `UI_PASSWORD`. The values are in `cypress.env.example.json`.
2. **GitHub Pages:** Settings → Pages → Source: **GitHub Actions**.
3. **CodeQL:** on a public repository it runs with no extra setup.
4. **Gitleaks:** works on a personal repository with no setup. If the repository belongs to an organization, gitleaks needs a license key in the `GITLEAKS_LICENSE` secret.

Pull requests from forks do not receive repository secrets, so their Cypress step cannot log in.

## Quality and security libraries

### What each library does

| Library                      | Type       | Purpose in this project                                                                                                                                                               |
| ---------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prettier                     | Formatting | Applies one code style to every file. Settings are in `.prettierrc.json` (no semicolons, single quotes, trailing commas, 100-character lines). CI fails when a file is not formatted. |
| ESLint with `@eslint/js`     | Lint       | Finds likely bugs and unsafe code. The rules are in `eslint.config.mjs`.                                                                                                              |
| `typescript-eslint`          | Lint       | Adds TypeScript-aware rules, such as flagging `any` types and unused variables.                                                                                                       |
| `eslint-plugin-cypress`      | Lint       | Adds Cypress rules, such as catching async test functions and unsafe command chaining.                                                                                                |
| `eslint-config-prettier`     | Lint       | Turns off ESLint style rules that conflict with Prettier, so the two tools never disagree.                                                                                            |
| `globals`                    | Lint       | Lists the global names (`describe`, `cy`, `Cypress`) that ESLint should accept.                                                                                                       |
| TypeScript (`strict` mode)   | Types      | Checks types across the whole project (`npm run typecheck`), catching wrong arguments and missing values before a test runs.                                                          |
| ls-lint (`@ls-lint/ls-lint`) | Naming     | Checks file and folder names against `.ls-lint.yml`, for example `login.page.ts` and `booking.api.ts`.                                                                                |
| npm audit                    | Security   | Compares installed packages with the npm advisory database. `npm run audit` fails on high or critical issues.                                                                         |
| gitleaks                     | Security   | Scans the full git history for passwords and keys. `.gitleaks.toml` allows the example credentials file, which holds only the public demo logins.                                     |
| CodeQL                       | Security   | GitHub's static analysis. Looks for risky code patterns in JavaScript and TypeScript and reports them under the Security tab.                                                         |
| Dependabot                   | Security   | Opens pull requests when npm packages or GitHub Actions have newer versions, including security fixes. Settings are in `.github/dependabot.yml`.                                      |
| cypress-mochawesome-reporter | Reporting  | Builds the HTML report that is published to GitHub Pages.                                                                                                                             |

### Security decisions in the code

- **No credentials in the repository.** Non-sensitive settings, such as the API URL, use `Cypress.expose()`. Passwords and usernames are read with `cy.env()`, which Cypress provides for sensitive values.
- Every workflow starts with read-only access. Only the publish job can write to Pages, and only the CodeQL job can write security results.
- **Only `master` publishes.** Pull request code is tested but never replaces the public report. This is to enhance security

### Workflow files (`.github/`)

**`ci.yml`** runs three jobs in order:

- **Triggers:** runs on a push to `master`, on every pull request, and on a manual **Run workflow** click.
- **Concurrency:** a new run on the same branch cancels the older run that is still in progress.
- **`quality`:** checks out the full git history (gitleaks needs it), installs the exact versions from `package-lock.json` with `npm ci`, then runs `npm run check`, `npm run audit`, and the gitleaks scan.
- **`test`:** runs only when `quality` passes. The four `CYPRESS_*` variables are filled from repository secrets, and Cypress reads them as `apiUser`, `apiPassword`, `uiUser`, and `uiPassword`. `npm test` runs both specs. The summary and the artifact upload use `if: always()`, so they run even when a test fails.
- **`publish-report`:** runs after `test` only on `master`, and only when `test` was not skipped. It downloads the report artifact, uploads it as the Pages artifact, deploys it, and writes the Pages link to the run summary. Its `pages` concurrency group queues deployments, so two runs cannot publish at the same time.

**`codeql.yml`** runs on pushes and pull requests to `master`, and every Monday at 06:00 UTC. It sets up CodeQL for JavaScript and TypeScript, then analyzes the code. Only this job has `security-events: write`, so it can post results to the Security tab.

**`dependabot.yml`** checks npm packages and GitHub Actions versions every week. The `dev-tooling` group puts all npm updates into one pull request, which keeps the review queue short.



## Procjet structure

- **Specs (`cypress/e2e/`)** They call page objects for the UI and API functions for HTTP, and do not use selectors or raw requests to continue the order with POM (Page object model).
- **Page objects (`cypress/pages/`)** functions for each screen
- **Locators (`cypress/locators/`)** keep the selectors for each page in separate files
- **API layer (`cypress/api/booking.api.ts`)** Each returns the raw response
- **Data (`data/`)** holds test inputs as JSON, so the specs contain no hard-coded payloads.
- **Config (`cypress.config.ts`)** holds the base URLs. Credentials come from `cypress.env.json` or CI secrets.
- **Scripts (`scripts/ci-summary.mjs`)** help to create the report into the pass/fail table on the CI run page.

##

<h3>Part 3: The Deliverables</h3>
Because BEON engineers work seamlessly as embedded team members with U.S. clients, documentation and manual QA intuition are just as critical as automation.
<br><br>

1. Manual QA Bug Report (Simulated Jira Ticket)<br><br>
   Instructions: Explore SauceDemo manually using the user problem_user.
   [AI Boundary]: No AI allowed here. This requires human exploratory testing to spot visual and functional anomalies.
   Find at least one bug caused by this user.
   In your README, write a professional bug report (Title, Description, Steps to Reproduce, Expected vs. Actual Results, Severity).

<h3>Bugs Detected:</h3>
1.1 We cannot purchase due last name textbox is modifying the first name textbox

1.2 Some items are not able to be added to the shopping cart

1.3 Once and item is added, we cannot remove it from the cart in the inventory page

1.4 Typo found on 3rd work item description
<br><br>

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Title**              | Once an item is added, we cannot remove it from the cart in the inventory page                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Description**        | Add several items into the cart in the inventory page and then try to remove them                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Steps to Reproduce** | 1. Go to the login page<br>&nbsp;&nbsp;&nbsp;&nbsp;- **URL:** https://www.saucedemo.com<br>2. Log in with the following credentials<br>&nbsp;&nbsp;&nbsp;&nbsp;- **User:** `error_user`<br>&nbsp;&nbsp;&nbsp;&nbsp;- **Password:** `secret_sauce`<br>3. You should land on the `/inventory` page<br>4. Add all the items to the cart (every button changes from Add to Remove)<br>5. Click all Remove buttons. The items cannot be removed, and the ones already added cannot be added again |
| **Expected result**    | We should be able to add and remove any item on the inventory page without a previous action blocking the next one                                                                                                                                                                                                                                                                                                                                                                           |
| **Actual result**      | Some items cannot be removed from the cart, or added again once removed                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Severity**           | **Critical** (highly impacts the purchasing experience)                                                                                                                                                                                                                                                                                                                                                                                                                                      |

2. The README.md
   [AI Boundary]: You may use AI to help format the markdown, but the architectural explanations must be your own words.
   Include prerequisites, installation instructions, execution commands (UI vs API, Headless vs UI), and a brief explanation of your chosen framework architecture.

3. Test Reporting (Optional but Highly Recommended)
   Integrate a reporting tool (Playwright HTML Reporter, Allure, Mochawesome, etc.).
