import { test as setup } from '../fixtures/test.fixture';
import { users } from '../test-data/users';

const authFile = 'playwright/.auth/user.json';

setup('authenticate user', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login(
    users.standardUser.username,
    users.standardUser.password,
  );

  await page.context().storageState({ path: authFile });
});
