import { expect } from '@playwright/test';

export function expectValidPost(post: {
  id: number;
  title: string;
  body: string;
  userId: number;
}) {
  expect(post).toHaveProperty('id');
  expect(post).toHaveProperty('title');
  expect(post).toHaveProperty('body');
  expect(post).toHaveProperty('userId');

  expect(typeof post.id).toBe('number');
  expect(typeof post.title).toBe('string');
  expect(typeof post.body).toBe('string');
  expect(typeof post.userId).toBe('number');
}
