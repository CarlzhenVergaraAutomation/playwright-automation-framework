import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  private checkoutButton: Locator;

  constructor(private page: Page) {
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
  getCartItem(cartItem: string) {
    return this.page
      .locator('[data-test="inventory-item"]')
      .filter({ has: this.page.getByText(cartItem, { exact: true }) });
  }
  async verifyCartItemDetails(
    cartItem: string,
    expectedDesc: string,
    expectedPrice: string,
    expectedQty: string,
  ) {
    const item = this.getCartItem(cartItem);

    await expect(item.getByText(cartItem, { exact: true })).toBeVisible();
    await expect(item.locator('[data-test="inventory-item-desc"]')).toHaveText(
      expectedDesc,
    );
    await expect(item.locator('.inventory_item_price')).toHaveText(
      expectedPrice,
    );
    await expect(item.locator('[data-test="item-quantity"]')).toHaveText(
      expectedQty,
    );

    await expect(item.getByRole('button', { name: 'Remove' })).toBeVisible();
  }
}
