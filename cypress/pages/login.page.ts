import { LoginLocators } from '../locators/login.locators'

export const LoginPage = {
  visit() {
    cy.visit('/')
  },

  loginAs(username: string, password: string) {
    cy.get(LoginLocators.username).type(username)
    cy.get(LoginLocators.password).type(password, { log: false })
    cy.get(LoginLocators.loginButton).click()
    cy.url().should('include', '/inventory.html')
  },
}
