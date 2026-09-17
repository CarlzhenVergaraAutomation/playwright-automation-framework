import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

export const environments = {
  //$env:TEST_ENV="local"
  local: {
    baseURL: 'https://www.saucedemo.com',
  },
  //$env:TEST_ENV="qa"
  qa: {
    baseURL: 'https://www.saucedemo.com',
  },
  //$env:TEST_ENV="staging"
  staging: {
    baseURL: 'https://www.saucedemo.com',
  },
} as const;

export type EnvironmentName = keyof typeof environments;

const requestedEnvironment = process.env.TEST_ENV || 'local';

if (!(requestedEnvironment in environments)) {
  throw new Error(
    `Invalid TEST_ENV: ${requestedEnvironment}. ` +
      `Allowed values: ${Object.keys(environments).join(', ')}`,
  );
}

export const selectedEnvironment = requestedEnvironment as EnvironmentName;

export const environmentConfig = environments[selectedEnvironment];
