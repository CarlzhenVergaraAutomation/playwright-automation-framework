import { expect, Page } from '@playwright/test';

export class CheckoutCompletePage {
  constructor(private page: Page) {}

  async verifyCheckoutComplete(
    checkImage: string,
    thankyouMessage: string,
    orderMessage: string,
  ) {
    await expect(
      this.page.getByText('Checkout: Complete!', { exact: true }),
    ).toBeVisible();

    await expect(
      this.page.locator('[data-test="pony-express"]'),
    ).toHaveAttribute('src', checkImage);
    await expect(
      this.page.getByText(thankyouMessage, { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByText(orderMessage, { exact: true }),
    ).toBeVisible();
  }
}
