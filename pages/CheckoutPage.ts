import { Locator, Page } from '@playwright/test';
import { CheckoutInformation } from '../types/checkout';

export class CheckoutPage {
  private firstnameInput: Locator;
  private lastnameInput: Locator;
  private postalCodeInput: Locator;
  private continueButton: Locator;
  private cancelButton: Locator;

  constructor(private page: Page) {
    this.firstnameInput = this.page.getByRole('textbox', {
      name: 'First Name',
    });
    this.lastnameInput = this.page.getByRole('textbox', {
      name: 'Last Name',
    });
    this.postalCodeInput = this.page.getByRole('textbox', {
      name: 'Zip/Postal Code',
    });
    this.continueButton = this.page.getByRole('button', { name: 'Continue' });
    this.cancelButton = this.page.getByRole('button', { name: 'Cancel' });
  }

  async enterCheckoutInformation(checkoutinformation: CheckoutInformation) {
    await this.firstnameInput.fill(checkoutinformation.firstname);
    await this.lastnameInput.fill(checkoutinformation.lastname);
    await this.postalCodeInput.fill(checkoutinformation.postal);
  }
  async continueToOverview() {
    await this.continueButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }
}
