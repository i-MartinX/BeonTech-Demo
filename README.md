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

| Command                  | What it runs                 |
| ------------------------ | ---------------------------- |
| `npm test`               | All specs, headless          |
| `npm run test:api`       | API spec only, headless      |
| `npm run test:ui`        | UI spec only, headless       |
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

## Project structure

- **Specs (`cypress/e2e/`)** describe what is tested. They call page objects for the UI and API functions for HTTP, and do not use selectors or raw requests.
- **Page objects (`cypress/pages/`)** hold process functions for each screen, such as `loginAs`, `addItemsToCart`, `fillInformation`, and `verifyOrderComplete`.
- **Locators (`cypress/locators/`)** keep the selectors for each page in separate files, so a UI change touches one file.
- **API layer (`cypress/api/booking.api.ts`)** has one function per endpoint. Each returns the raw response, so the spec decides what to assert and which value to pass on.
- **Data (`data/`)** holds test inputs as JSON, so the specs contain no hard-coded payloads.
- **Config (`cypress.config.ts`)** holds the base URLs, the non-sensitive settings, and the reporter setup. Credentials come from `cypress.env.json` or CI secrets.
- **Scripts (`scripts/ci-summary.mjs`)** turns the report into the pass/fail table on the CI run page.

Values flow between API steps through Cypress aliases (`@token`, `@bookingId`), so each step reads the value the earlier step produced.

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
