import { test, expect } from '../fixtures/api.fixture';
import { getApiHeaders } from '../utils/apiHeaders';
import { createApiContext } from '../utils/apiContext';
import { expectValidPost } from '../utils/apiAssertions';
import { postData } from '../test-data/apiData';
import { postSchema, postsSchema } from '../utils/schemas/post.schema';
import { userSchema, usersSchema } from '../utils/schemas/user.schema';

// Direct request tests cover post retrieval, creation, updates, and deletion.
test('GET post should return 200', async ({ request }) => {
  const startTime = Date.now();
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/1',
  );
  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');

  const responseTime = Date.now() - startTime;
  expect(responseTime).toBeLessThan(5000);

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.id).toBe(1);
  expect(body.userId).toBe(1);
  expect(body.title).toBe(
    'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  );
  expect(body.body).toBeTruthy();
});

test('GET invalid post should return 404', async ({ request }) => {
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/999999',
  );

  expect(response.status()).toBe(404);

  const body = await response.json();

  expect(body).toEqual({});
});

test('GET posts by userId should return 200', async ({ request }) => {
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts?userId=1',
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.length).toBe(10);

  // Check each returned post's ordering, fields, types, and non-empty text.
  for (let i = 0; i < body.length; i++) {
    expect(body[i].id).toBe(i + 1);
    expect(body[i].userId).toBe(1);

    expect(typeof body[i].id).toBe('number');
    expect(typeof body[i].userId).toBe('number');
    expect(typeof body[i].title).toBe('string');
    expect(typeof body[i].body).toBe('string');

    expect(body[i]).toHaveProperty('id');
    expect(body[i]).toHaveProperty('userId');
    expect(body[i]).toHaveProperty('title');
    expect(body[i]).toHaveProperty('body');

    expect(body[i].title).toBeTruthy();
    expect(body[i].body).toBeTruthy();

    expect(body[0]).toEqual({
      userId: 1,
      id: 1,
      title:
        'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: expect.any(String),
    });
  }
  for (const post of body) {
    expect(post.userId).toBe(1);
  }
});

test('GET post by ID should return 200', async ({ request }) => {
  const postId = 2;
  const expectedTitle = 'qui est esse';
  const response = await request.get(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  );

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.id).toBe(postId);
  expect(body.title).toBe(expectedTitle);
});

test('GET user posts should return 200', async ({ request }) => {
  const userId = 1;

  const response = await request.get(
    `https://jsonplaceholder.typicode.com/users/${userId}/posts`,
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.length).toBe(10);
  expect(body[0].id).toBe(1);
  expect(body[0].userId).toBe(1);
  expect(body[0].title).toBe(
    'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  );

  for (const post of body) {
    expect(post.userId).toBe(userId);
  }
});

test('POST post should create a new post', async ({ request }) => {
  const response = await request.post(
    'https://jsonplaceholder.typicode.com/posts',
    {
      data: {
        title: 'My new test post',
        body: 'This is my API automation test.',
        userId: 1,
      },
    },
  );

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body.title).toBe('My new test post');
  expect(body.body).toBe('This is my API automation test.');
  expect(body.userId).toBe(1);
  expect(body.id).toBeTruthy();
});

test('POST post using test data variables', async ({ request }) => {
  const title = 'Variable Test Post';
  const postBody = 'Created using reusable test data.';
  const userId = 1;

  const response = await request.post(
    'https://jsonplaceholder.typicode.com/posts',
    {
      data: {
        title: title,
        body: postBody,
        userId: userId,
      },
    },
  );

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body.title).toBe(title);
  expect(body.body).toBe(postBody);
  expect(body.userId).toBe(userId);
});

test('POST response should return a created post ID', async ({ request }) => {
  const title = 'Created Post for Follow-up Test';
  const postBody = 'This post will be used for API validation.';
  const userId = 1;

  const response = await request.post(
    'https://jsonplaceholder.typicode.com/posts',
    {
      data: {
        title,
        body: postBody,
        userId,
      },
    },
  );

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body.id).toBeTruthy();
  expect(body.title).toBe(title);
  expect(body.body).toBe(postBody);
  expect(body.userId).toBe(userId);
});

test('POST request with custom headers', async ({ request }) => {
  const response = await request.post(
    'https://jsonplaceholder.typicode.com/posts',
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Test-Client': 'Playwright-Automation',
      },
      data: {
        title: 'Header Test Post',
        body: 'Testing custom request headers.',
        userId: 1,
      },
    },
  );

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body.title).toBe('Header Test Post');
});

test('PUT post should update an existing post', async ({ request }) => {
  const postId = 1;

  const response = await request.put(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    {
      data: {
        id: postId,
        title: 'Updated API Test Post',
        body: 'This post was updated by API automation.',
        userId: 1,
      },
    },
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.id).toBe(postId);
  expect(body.title).toBe('Updated API Test Post');
  expect(body.body).toBe('This post was updated by API automation.');
  expect(body.userId).toBe(1);
});

test('PATCH post should update a specific field', async ({ request }) => {
  const postId = 1;

  const response = await request.patch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    {
      data: {
        title: 'Patched API Test Post',
      },
    },
  );

  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.title).toBe('Patched API Test Post');
});

test('DELETE post should return 200', async ({ request }) => {
  const postId = 1;

  const response = await request.delete(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  );

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toEqual({});
});

test('API request with authorization header', async ({ request }) => {
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/1',
    {
      headers: getApiHeaders(),
    },
  );

  expect(response.status()).toBe(200);
});

// Context and fixture tests exercise the shared API helpers.
test('GET post using authenticated API context', async () => {
  const api = await createApiContext();

  try {
    const response = await api.get('/posts/1');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(1);
    expect(body.userId).toBe(1);
  } finally {
    await api.dispose();
  }
});

// Fixture-based CRUD tests use the shared PostsAPI implementation.
test('GET post using PostsAPI fixture', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.id).toBe(1);
});

test('GET non-existent post', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(99999);

  expect(response.status()).toBe(404);
});

test('POST request using PostsAPI', async ({ postsAPI }) => {
  const response = await postsAPI.createPost(postData.validPost);

  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  expect(responseBody.title).toBe('My API Fixture Test');
  expect(responseBody.body).toBe('Testing POST using PostsAPI');
  expect(responseBody.userId).toBe(1);
});

test('POST with empty required fields', async ({ postsAPI }) => {
  const response = await postsAPI.createPost({
    title: '',
    body: '',
    userId: 1,
  });

  expect(response.status()).toBe(201);
});

test('PUT request using PostsAPI fixture', async ({ postsAPI }) => {
  const response = await postsAPI.updatePost(1, postData.updatedPost);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.title).toBe('Updated title');
  expect(responseBody.body).toBe('Updated body');
  expect(responseBody.userId).toBe(1);
});

test('DELETE request using API fixture', async ({ postsAPI }) => {
  const response = await postsAPI.deletePost(1);

  expect(response.status()).toBe(200);
});
// Chaining and extraction checks use response data in subsequent assertions.
test('API request chaining example', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  const postId = responseBody.id;

  expect(postId).toBe(1);

  const secondResponse = await postsAPI.getPost(postId);

  expect(secondResponse.status()).toBe(200);
});
test('Extract data from API response', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  const postId = responseBody.id;
  const userId = responseBody.userId;
  const title = responseBody.title;

  expect(postId).toBe(1);
  expect(userId).toBe(1);
  expect(title).toBeTruthy();
});
test('Extract nested data from API response', async ({ api }) => {
  const response = await api.get('/users/1');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  const userId = responseBody.id;
  const userName = responseBody.name;
  const city = responseBody.address.city;
  const companyName = responseBody.company.name;

  expect(userId).toBe(1);
  expect(userName).toBeTruthy();
  expect(city).toBeTruthy();
  expect(companyName).toBeTruthy();
});
test('Extract data from API array response', async ({ api }) => {
  const response = await api.get('/posts');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  const firstPost = responseBody[0];

  expect(firstPost.id).toBe(1);
  expect(firstPost.userId).toBe(1);
  expect(firstPost.title).toBeTruthy();
});
// Collection checks validate post lists and reusable post assertions.
test('Validate all posts in API response', async ({ api }) => {
  const response = await api.get('/posts');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  for (const post of responseBody) {
    expect(post.id).toBeTruthy();
    expect(post.userId).toBeTruthy();
    expect(post.title).toBeTruthy();
    expect(post.body).toBeTruthy();
  }
});
test('Validate filtered posts by userId', async ({ api }) => {
  const response = await api.get('/posts?userId=1');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  for (const post of responseBody) {
    expect(post.userId).toBe(1);
  }
});
test('Validate API response structure', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty('userId');
  expect(responseBody).toHaveProperty('id');
  expect(responseBody).toHaveProperty('title');
  expect(responseBody).toHaveProperty('body');
});
test('Validate API response data types', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(typeof responseBody.id).toBe('number');
  expect(typeof responseBody.userId).toBe('number');
  expect(typeof responseBody.title).toBe('string');
  expect(typeof responseBody.body).toBe('string');
});
test('Validate post using reusable API assertion', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expectValidPost(responseBody);
});
test('Validate all posts using reusable API assertion', async ({ api }) => {
  const response = await api.get('/posts');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  for (const post of responseBody) {
    expectValidPost(post);
  }
});
test('Validate filtered posts using reusable API assertion', async ({
  api,
}) => {
  const response = await api.get('/posts?userId=1');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  for (const post of responseBody) {
    expect(post.userId).toBe(1);
    expectValidPost(post);
  }
});
// Metadata checks cover headers, response time, and non-empty response bodies.
test('Validate API response headers', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const contentType = response.headers()['content-type'];

  expect(contentType).toContain('application/json');
});
test('Validate multiple API response headers', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const headers = response.headers();

  expect(headers['content-type']).toContain('application/json');
  expect(headers).toHaveProperty('content-type');
});
test('Validate API response time', async ({ postsAPI }) => {
  const startTime = Date.now();

  const response = await postsAPI.getPost(1);

  const responseTime = Date.now() - startTime;

  expect(response.status()).toBe(200);
  expect(responseTime).toBeLessThan(5000);
});
test('Validate API response body is not empty', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toBeTruthy();
  expect(Object.keys(responseBody).length).toBeGreaterThan(0);
});
test('Validate API array response is not empty', async ({ api }) => {
  const response = await api.get('/posts');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
test('Validate specific post in API array', async ({ api }) => {
  const response = await api.get('/posts');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);

  const firstPost = responseBody[0];

  expect(firstPost.id).toBe(1);
  expect(firstPost.userId).toBe(1);
});
// Array search checks cover presence, absence, and ordering.
test('Find specific post in API array', async ({ api }) => {
  const response = await api.get('/posts');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  const post = responseBody.find((item: { id: number }) => item.id === 5);

  expect(post).toBeTruthy();
  expect(post.id).toBe(5);
});
test('Verify specific post does not exist in API array', async ({ api }) => {
  const response = await api.get('/posts');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  const post = responseBody.find((item: { id: number }) => item.id === 99999);

  expect(post).toBeUndefined();
});
test('Validate API response sorting', async ({ api }) => {
  const response = await api.get('/posts');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  for (let i = 0; i < responseBody.length - 1; i++) {
    expect(responseBody[i].id).toBeLessThan(responseBody[i + 1].id);
  }
});
//This would fail since JSONPlaceholder's /posts endpoint normally returns IDs in ascending order
test('Validate API response sorting descending', async ({ api }) => {
  const response = await api.get('/posts');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  for (let i = 0; i < responseBody.length - 1; i++) {
    expect(responseBody[i].id).toBeGreaterThan(responseBody[i + 1].id);
  }
});
// Value checks exercise text and numeric assertions on a single post.
test('Validate API response contains expected value', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.title).toContain('sunt');
});
test('Validate multiple expected values in API response', async ({
  postsAPI,
}) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.title).toContain('sunt');
  expect(responseBody.title).toContain('facere');
  expect(responseBody.title).toContain('provident');
});
test('Validate API response contains one of the expected values', async ({
  postsAPI,
}) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(
    responseBody.title.includes('sunt') || responseBody.title.includes('hello'),
  ).toBe(true);
});
test('Validate API response does not contain unexpected value', async ({
  postsAPI,
}) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.title).not.toContain('hello');
});
test('Validate API response string length', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.title.length).toBeGreaterThan(0);
});
test('Validate API response minimum string length', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.title.length).toBeGreaterThanOrEqual(10);
});
test('Validate API response maximum string length', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  console.log('Title length:', responseBody.title.length);

  expect(responseBody.title.length).toBeLessThanOrEqual(100);
});
test('Validate API response number range', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  console.log('Post ID:', responseBody.id);

  expect(responseBody.id).toBeGreaterThanOrEqual(1);
  expect(responseBody.id).toBeLessThanOrEqual(100);
});
test('Validate API response number is not unexpected value', async ({
  postsAPI,
}) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.id).not.toBe(99);
});
// Primitive-value checks cover booleans, nullish values, and property assertions.
test('Validate API boolean value', async ({ api }) => {
  const response = await api.get('/users/1');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  const isUserObject = typeof responseBody === 'object';

  console.log('Is user response an object?', isUserObject);

  expect(isUserObject).toBe(true);
});
test('Validate boolean property', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const testData = {
    isActive: true,
  };

  console.log('Is active:', testData.isActive);

  expect(typeof testData.isActive).toBe('boolean');
  expect(testData.isActive).toBe(true);
});
test('Validate null property', async ({ api }) => {
  const response = await api.get('/users/1');

  expect(response.status()).toBe(200);

  const testData = {
    middleName: null,
  };

  expect(testData.middleName).toBeNull();
});
test('Validate undefined property', async ({ api }) => {
  const response = await api.get('/users/1');

  expect(response.status()).toBe(200);

  const testData: { middleName?: string } = {};

  expect(testData.middleName).toBeUndefined();
});
test('Validate empty string, null, and undefined', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  console.log('API title:', responseBody.title);

  const testData = {
    name: '',
    middleName: null,
    nickname: undefined,
  };

  expect(testData.name).toBe('');
  expect(testData.middleName).toBeNull();
  expect(testData.nickname).toBeUndefined();
});
test('Validate API property is not null', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  console.log('Title:', responseBody.title);

  expect(responseBody.title).not.toBeNull();
});
test('Validate API property exists and is not null', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty('title');
  expect(responseBody.title).not.toBeNull();
});
// Property checks cover exact, nested, and unexpected values.
test('Validate API property and expected value', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty('id', 1);
  expect(responseBody).toHaveProperty('userId', 1);
});
test('Validate multiple API properties and expected values', async ({
  postsAPI,
}) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty('id', 1);
  expect(responseBody).toHaveProperty('userId', 1);
  expect(responseBody).toHaveProperty(
    'title',
    'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  );
});
test('Validate nested API property and expected value', async ({ api }) => {
  const response = await api.get('/users/1');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty('address.city', 'Gwenborough');
  expect(responseBody).toHaveProperty('address.street', 'Kulas Light');
  expect(responseBody).toHaveProperty('company.name', 'Romaguera-Crona');
});
test('Validate unexpected nested API value does not exist', async ({ api }) => {
  const response = await api.get('/users/1');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).not.toHaveProperty('address.city', 'Manila');
});
test('Validate nested API property completely', async ({ api }) => {
  const response = await api.get('/users/1');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty('address.city');
  expect(responseBody.address.city).not.toBeNull();
  expect(responseBody.address.city).toBe('Gwenborough');
});
test('Validate API property data type and value', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  console.log('Post ID:', typeof responseBody.id);
  console.log('Post Title:', typeof responseBody.title);
  expect(typeof responseBody.id).toBe('number');
  expect(typeof responseBody.title).toBe('string');

  console.log('Post ID value:', responseBody.id);
  console.log('Post userId value:', responseBody.userId);
  expect(responseBody.id).toBe(1);
  expect(responseBody.userId).toBe(1);
});

// This test combines status, schema, structure, type, value, and text checks.
test('Validate API response comprehensively', async ({ postsAPI }) => {
  const response = await postsAPI.getPost(1);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(false);

  const result = postSchema.safeParse(responseBody);

  expect(result.success).toBe(true);

  expect(responseBody).toHaveProperty('id');
  expect(responseBody).toHaveProperty('userId');
  expect(responseBody).toHaveProperty('title');
  expect(responseBody).toHaveProperty('body');

  expect(typeof responseBody.id).toBe('number');
  expect(typeof responseBody.userId).toBe('number');
  expect(typeof responseBody.title).toBe('string');
  expect(typeof responseBody.body).toBe('string');

  expect(responseBody.id).toBe(1);
  expect(responseBody.userId).toBe(1);

  expect(responseBody.title.length).toBeGreaterThan(0);
  expect(responseBody.body.length).toBeGreaterThan(0);
});
// Zod checks validate user and post schemas against representative data.
test('Validate nested object using Zod', async () => {
  const validUser = {
    id: 1,
    name: 'Leanne Graham',
    address: {
      city: 'Gwenborough',
      geo: {
        lat: '-37.3159',
        lng: '81.1496',
      },
    },
  };

  const result = userSchema.safeParse(validUser);

  if (!result.success) {
    console.log(result.error.issues);
  }

  expect(result.success).toBe(true);
});
test('Validate array of users using Zod', async () => {
  const validUsers = [
    {
      id: 1,
      name: 'Leanne Graham',
      address: {
        city: 'Gwenborough',
        geo: {
          lat: '-37.3159',
          lng: '81.1496',
        },
      },
    },
    {
      id: 2,
      name: 'Ervin Howell',
      address: {
        city: 'Wisokyburgh',
        geo: {
          lat: '-43.9509',
          lng: '-34.4618',
        },
      },
    },
  ];
  const result = usersSchema.safeParse(validUsers);

  if (!result.success) {
    console.log(result.error.issues);
  }
  expect(result.success).toBe(true);
});
test('Validate array of posts using Zod', async ({ api }) => {
  const response = await api.get('/posts');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);

  const result = postsSchema.safeParse(responseBody);
  expect(responseBody.length).toBe(100);

  if (result.success === false) {
    console.log(result.error.issues);
  }
  expect(result.success).toBe(true);
});

// Individual post cases cover required fields, valid input, and trimming.
test('Reject empty title using Zod', async () => {
  const invalidPost = {
    userId: 1,
    id: 1,
    title: '',
    body: 'Test body',
  };

  const result = postSchema.safeParse(invalidPost);
  expect(result.success).toBe(false);

  if (result.success === false) {
    console.log(result.error.issues);
  }
});

test('Validate valid title using Zod', async () => {
  const validPost = {
    userId: 1,
    id: 1,
    title: 'Valid test title',
    body: 'Test body',
  };

  const result = postSchema.safeParse(validPost);
  expect(result.success).toBe(true);

  if (result.success === false) {
    console.log(result.error.issues);
  }
});

test('Reject empty body using Zod', async () => {
  const invalidPost = {
    userId: 1,
    id: 1,
    title: 'Valid test title',
    body: '   ',
  };

  const result = postSchema.safeParse(invalidPost);
  expect(result.success).toBe(false);

  if (result.success === false) {
    console.log(result.error.issues);
  }
});

test('Trim whitespace from body using Zod', async () => {
  const validPost = {
    userId: 1,
    id: 1,
    title: 'Valid test title',
    body: ' Hello API ',
  };

  const result = postSchema.safeParse(validPost);
  expect(result.success).toBe(true);

  if (result.success === true) {
    expect(validPost.body).toBe(' Hello API ');
    expect(result.data.body).toBe('Hello API');
  }
});

test('Reject whitespace-only title using Zod', async () => {
  const invalidPost = {
    userId: 1,
    id: 1,
    title: '   ',
    body: 'Valid test body',
  };

  const result = postSchema.safeParse(invalidPost);
  expect(result.success).toBe(false);

  if (!result.success) {
    console.log(result.error.issues);
  }
});

test('Reject whitespace-only for both title and body using Zod', async () => {
  const invalidPost = {
    userId: 1,
    id: 1,
    title: '   ',
    body: '   ',
  };

  const result = postSchema.safeParse(invalidPost);
  expect(result.success).toBe(false);

  if (!result.success) {
    expect(result.error.issues).toHaveLength(2);
    expect(
      result.error.issues.some((issue) => issue.path.includes('title')),
    ).toBe(true);
    expect(
      result.error.issues.some((issue) => issue.path.includes('body')),
    ).toBe(true);
  }
});
