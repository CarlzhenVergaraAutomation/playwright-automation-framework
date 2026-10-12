import { test } from '../fixtures/test.fixture';
import { users } from '../test-data/users';

test.describe('Product Suite', () => {
  test('Adding product to the cart', async ({
    //page
    loginPage,
    productPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(
      users.standardUser.username,
      users.standardUser.password,
    );
    await loginPage.VerifyLoginUrl();

    await productPage.addProductToCart('Sauce Labs Backpack');
    await productPage.openCart();
  });
});
