import { InventoryLocators } from '../locators/inventory.locators'

export const InventoryPage = {
  // Adds each item by its slug, then waits for the badge to show the total count.
  addItemsToCart(slugs: string[]) {
    slugs.forEach((slug) => {
      cy.get(InventoryLocators.addToCartButton(slug)).click()
      cy.get(InventoryLocators.removeButton(slug)).should('be.visible')
    })
    cy.get(InventoryLocators.cartBadge).should('have.text', String(slugs.length))
  },

  openCart() {
    cy.get(InventoryLocators.cartLink).click()
    cy.url().should('include', '/cart.html')
  },
}
