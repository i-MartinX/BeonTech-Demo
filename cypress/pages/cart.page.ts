import { CartLocators } from '../locators/cart.locators'

export interface ExpectedCartItem {
  name: string
  quantity: number
}

export const CartPage = {
  // Finds each item by its name, so the check does not depend on display order.
  verifyItems(expected: ExpectedCartItem[]) {
    cy.get(CartLocators.item).should('have.length', expected.length)
    expected.forEach(({ name, quantity }) => {
      cy.contains(CartLocators.itemName, name)
        .closest(CartLocators.item)
        .find(CartLocators.itemQuantity)
        .should('have.text', String(quantity))
    })
  },

  proceedToCheckout() {
    cy.get(CartLocators.checkoutButton).click()
    cy.url().should('include', '/checkout-step-one.html')
  },
}
