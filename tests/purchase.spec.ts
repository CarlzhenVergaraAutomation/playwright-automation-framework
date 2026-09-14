import { test } from '../fixtures/test.fixture';
import { productItems } from '../test-data/productItems';
import { users } from '../test-data/users';
import { checkoutCompleteDetails } from '../test-data/checkoutCompleteDetails';
import { checkoutInformation } from '../test-data/checkout';

test.describe('E2E Purchase Flow', () => {
  // Runs after every test in this file finishes, right before browser cleanup
  test.afterEach(async ({ page }) => {
    await page.waitForTimeout(3000);
  });
  test('Complete full user journey from login to checkout', async ({
    loginPage,
    productPage,
    cartPage,
    checkoutPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    const selectedProducts = [productItems.item1, productItems.item2];

    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(
      users.standardUser.username,
      users.standardUser.password,
    );
    await loginPage.VerifyLoginUrl();

    // Step 2: Add Product
    // Add item 1 to cart using data from productItems
    for (const product of selectedProducts) {
      await productPage.addProductToCart(product.name);
    }

    // Step 3: Open Cart & Verify Item
    await productPage.openCart();
    for (const product of selectedProducts) {
      await cartPage.verifyCartItemDetails(
        product.name,
        product.desc,
        product.price,
        product.qty,
      );
    }
    // Step 4: Proceed to Checkout
    await cartPage.proceedToCheckout();

    await checkoutPage.enterCheckoutInformation(checkoutInformation);
    await checkoutPage.continueToOverview();

    await checkoutOverviewPage.verifyCheckoutOverview();

    for (const product of selectedProducts) {
      await checkoutOverviewPage.verifyItemDetails(
        product.name,
        product.desc,
        product.price,
        product.qty,
      );
    }
    await checkoutOverviewPage.finishCheckout();
    await checkoutCompletePage.verifyCheckoutComplete(
      checkoutCompleteDetails.checkImage,
      checkoutCompleteDetails.thankyouMessage,
      checkoutCompleteDetails.orderMessage,
    );
  });
});
