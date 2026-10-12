import { test as base, APIRequestContext } from '@playwright/test';
import { createApiContext } from '../utils/apiContext';
import { PostsAPI } from '../api/PostAPI';

type ApiFixtures = {
  api: APIRequestContext;
  postsAPI: PostsAPI;
};

export const test = base.extend<ApiFixtures>({
  //API Context fixture
  // eslint-disable-next-line no-empty-pattern
  api: async ({}, use) => {
    //creating fixture called api
    const api = await createApiContext(); //creates the API context
    await use(api); //give the API context to the test
    await api.dispose(); //cleans up after the test finishes
  },
  //Posts API fixture
  postsAPI: async ({ api }, use) => {
    const postAPI = new PostsAPI(api);

    await use(postAPI);
  },
});

export { expect } from '@playwright/test';
