import { test, expect } from '@playwright/test';

test('GET post should return 200', async ({ request }) => {
  const startTime = Date.now();
  //API request
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/1',
  );
  //headers validation
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

  // expect(body[0].id).toBe(1);
  // expect(body[0].userId).toBe(1);
  // expect(body[0].title).toBe(
  //   'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  // );
  // expect(body[1].id).toBe(2);
  // expect(body[1].userId).toBe(1);

  // expect(body[2].id).toBe(3);
  // expect(body[2].userId).toBe(1);

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
//8
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
//9
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
//10
test('DELETE post should return 200', async ({ request }) => {
  const postId = 1;

  const response = await request.delete(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  );

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toEqual({});
});
//10
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
//11
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
//12
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
//13
test('API request with authorization header', async ({ request }) => {
  const token = process.env.API_TOKEN;

  if (!token) {
    throw new Error('API_TOKEN is not configured');
  }

  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/1',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  expect(response.status()).toBe(200);
});
