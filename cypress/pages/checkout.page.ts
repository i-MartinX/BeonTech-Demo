import { CheckoutLocators } from '../locators/checkout.locators'

export interface CheckoutInfo {
  firstName: string
  lastName: string
  postalCode: string
}

export const CheckoutPage = {
  fillInformation(info: CheckoutInfo) {
    cy.get(CheckoutLocators.firstName).type(info.firstName)
    cy.get(CheckoutLocators.lastName).type(info.lastName)
    cy.get(CheckoutLocators.postalCode).type(info.postalCode)
    cy.get(CheckoutLocators.continueButton).click()
    cy.url().should('include', '/checkout-step-two.html')
  },

  finishOrder() {
    cy.get(CheckoutLocators.finishButton).click()
    cy.url().should('include', '/checkout-complete.html')
  },

  verifyOrderComplete() {
    cy.get(CheckoutLocators.completeHeader).should('have.text', 'Thank you for your order!')
  },
}
