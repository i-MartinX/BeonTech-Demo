import { defineConfig } from 'cypress'
import mochawesomePlugin from 'cypress-mochawesome-reporter/plugin'

export default defineConfig({
  // UI tests run against SauceDemo; API tests use the absolute URL from env.apiUrl.
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on) {
      mochawesomePlugin(on)
    },
  },
  // Non-sensitive values, readable with Cypress.expose().
  // Credentials are not stored here. Provide them with cypress.env.json (local, git-ignored)
  // or CYPRESS_<name> environment variables (CI secrets). See cypress.env.example.json.
  expose: {
    apiUrl: 'https://restful-booker.herokuapp.com',
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'reports/mochawesome',
    reportPageTitle: 'BeonTech Challenge Report',
    reportTitle: 'Restful-Booker API and SauceDemo UI',
    charts: true,
    overwrite: true,
    html: true,
    json: true,
    saveJson: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
})
