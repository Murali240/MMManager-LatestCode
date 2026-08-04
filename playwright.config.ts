import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({

  testDir: './tests',

  globalSetup: './global-setup.ts',

  fullyParallel: true,

  workers: process.env.CI ? 4 : undefined,

  retries: 0,

  timeout: 60000,

  expect: {
    timeout: 10000
  },

  reporter: [
    ['list'],
    [
      'html',
      {
        open: 'never',
        outputFolder: 'playwright-report'
      }
    ],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results'
      }
    ],
    [
      'junit',
      {
        outputFile: 'test-results/junit.xml'
      }
    ]
  ],

  use: {

    baseURL: process.env.MMM_BASE_URL,

    headless: true,

    screenshot: 'only-on-failure',

    video: 'off',

    trace: 'off',

    viewport: {
      width: 1440,
      height: 900
    },

    actionTimeout: 10000,

    navigationTimeout: 30000,

    ignoreHTTPSErrors: true
  },

  projects: [

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      }
    }

  ],

  outputDir: 'test-results'

});