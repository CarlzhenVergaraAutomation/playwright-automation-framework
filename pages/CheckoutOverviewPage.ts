import { Page, expect, Locator } from '@playwright/test';

export class CheckoutOverviewPage {
  checkoutFinishbutton: Locator;

  constructor(private page: Page) {
    this.checkoutFinishbutton = this.page.getByRole('button', {
      name: 'Finish',
    });
  }

  async verifyCheckoutOverview() {
    await expect(
      this.page.getByText('Checkout: Overview', { exact: true }),
    ).toBeVisible();
  }
  getProductItem(itemName: string) {
    return this.page
      .locator('[data-test="inventory-item"]')
      .filter({ has: this.page.getByText(itemName, { exact: true }) });
  }
  //verifying all the details of the items in the checkout overview page
  async verifyItemDetails(
    itemName: string,
    expectedDesc: string,
    expectedPrice: string,
    expectedQty: string,
  ) {
    const item = this.getProductItem(itemName);

    await expect(item.getByText(itemName, { exact: true })).toBeVisible();
    await expect(item.locator('.inventory_item_desc')).toHaveText(expectedDesc);
    await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText(
      expectedPrice,
    );
    await expect(item.locator('[data-test="item-quantity"]')).toHaveText(
      expectedQty,
    );
  }
  //clicking on the finish button to complete the checkout process
  async finishCheckout() {
    await this.checkoutFinishbutton.click();
  }

  async cancelCheckout() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }
}
