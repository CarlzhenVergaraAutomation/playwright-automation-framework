import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';

test.describe('Login Suite', () => {
  test('User should be able to login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(
      users.standardUser.username,
      users.standardUser.password,
    );
    await loginPage.VerifyLoginUrl();
  });
});
