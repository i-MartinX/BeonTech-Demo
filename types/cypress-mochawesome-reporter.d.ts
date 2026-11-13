// The reporter plugin ships without type declarations.
declare module 'cypress-mochawesome-reporter/plugin' {
  const plugin: (on: Cypress.PluginEvents) => void
  export default plugin
}
