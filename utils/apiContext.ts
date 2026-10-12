import { request, APIRequestContext } from '@playwright/test';
import { getApiHeaders } from './apiHeaders';

export async function createApiContext(): Promise<APIRequestContext> {
  return await request.newContext({
    baseURL: 'https://jsonplaceholder.typicode.com',
    extraHTTPHeaders: getApiHeaders(),
  });
}
