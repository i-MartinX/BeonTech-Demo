import { LoginPage } from '../../pages/login.page'
import { InventoryPage } from '../../pages/inventory.page'
import { CartPage } from '../../pages/cart.page'
import { CheckoutPage } from '../../pages/checkout.page'
import saucedemo from '../../../data/saucedemo.json'
import checkoutInfo from '../../../data/checkout.json'

describe('SauceDemo: critical purchase path', () => {
  it('logs in, adds two items, checks the cart and completes an order', () => {
    const items = saucedemo.items

    LoginPage.visit()
    cy.env(['uiUser', 'uiPassword']).then(({ uiUser, uiPassword }) => {
      LoginPage.loginAs(uiUser, uiPassword)
    })

    InventoryPage.addItemsToCart(items.map((item) => item.slug))
    InventoryPage.openCart()

    CartPage.verifyItems(items.map((item) => ({ name: item.name, quantity: 1 })))
    CartPage.proceedToCheckout()

    CheckoutPage.fillInformation(checkoutInfo)
    CheckoutPage.finishOrder()
    CheckoutPage.verifyOrderComplete()
  })
})
