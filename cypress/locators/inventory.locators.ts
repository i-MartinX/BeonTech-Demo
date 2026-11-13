export const InventoryLocators = {
  addToCartButton: (slug: string) => `[data-test="add-to-cart-${slug}"]`,
  removeButton: (slug: string) => `[data-test="remove-${slug}"]`,
  cartLink: '.shopping_cart_link',
  cartBadge: '[data-test="shopping-cart-badge"]',
} as const
