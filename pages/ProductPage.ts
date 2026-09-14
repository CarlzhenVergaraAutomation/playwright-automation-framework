import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly cart: Locator;

  constructor(private page: Page) {
    this.cart = page.locator('[data-test="shopping-cart-link"]');
  }

  async addProductToCart(productName: string) {
    const product = this.page.locator('.inventory_item').filter({
      has: this.page.getByText(productName, { exact: true }),
    });

    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  async openCart() {
    await this.cart.click();
  }
}
