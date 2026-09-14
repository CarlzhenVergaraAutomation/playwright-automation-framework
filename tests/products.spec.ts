import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { users } from '../test-data/users';

test.describe('Product Suite', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      users.standardUser.username,
      users.standardUser.password,
    );
  });

  test('Product added to cart', async ({ page }) => {
    const productPage = new ProductPage(page);

    //list of products
    await productPage.addProductToCart('Sauce Labs Backpack');
  });
});
