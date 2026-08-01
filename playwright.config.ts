import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import os from 'os';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const globalSetupPath = path.resolve(__dirname, 'global-setup.ts');

// ============================================
// Environment Information for Allure Reports
// ============================================
const rawOsRelease = os.release();

const osType =
  os.platform() === 'win32'
    ? 'Windows'
    : os.platform() === 'darwin'
      ? 'macOS'
      : 'Linux';

const osEdition =
  osType === 'Windows'
    ? rawOsRelease.startsWith('10.0') &&
      Number(rawOsRelease.split('.')[2] || '0') >= 22000
      ? 'Windows 11'
      : 'Windows 10'
    : osType;

const environmentInfo = {
  framework: 'Playwright',
  language: 'TypeScript',
  application: 'MMManager',
  environment: 'Testing',
  os: osEdition,
  osVersion: rawOsRelease,
  nodeVersion: process.version,
};

/**
 * ============================================================
 * Playwright Configuration
 * ============================================================
 */
export default defineConfig({
  testDir: './tests',

  globalSetup: globalSetupPath,

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 3 : 1,

  timeout: 60000,

  expect: {
    timeout: 10000,
  },

  // ============================================================
  // Reporters
  // ============================================================
  reporter: process.env.CI
    ? [
        ['list'],

        [
          'html',
          {
            open: 'never',
            outputFolder: 'playwright-report',
          },
        ],

        [
          'json',
          {
            outputFile: 'test-results/results.json',
          },
        ],

        [
          'junit',
          {
            outputFile: 'test-results/junit.xml',
          },
        ],

        [
          'allure-playwright',
          {
            detail: true,
            outputFolder: 'allure-results',
            suiteTitle: false,

            environmentInfo: {
              ...environmentInfo,
              environment: 'CI',
            },
          },
        ],
      ]
    : [
        ['list'],

        [
          'html',
          {
            open: 'never',
            outputFolder: 'playwright-report',
          },
        ],

        [
          'allure-playwright',
          {
            detail: true,
            outputFolder: 'allure-results',
            suiteTitle: false,

            environmentInfo,
          },
        ],
      ],

  // ============================================================
  // Global Test Settings
  // ============================================================
  use: {
    baseURL: process.env.MMM_BASE_URL,

    headless:
      process.env.HEADLESS === 'true' ||
      process.env.CI === 'true',

    trace: process.env.CI
      ? 'retain-on-failure'
      : 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    viewport: {
      width: 1440,
      height: 900,
    },

    actionTimeout: 15000,

    navigationTimeout: 30000,

    ignoreHTTPSErrors: true,

    locale: 'en-IN',

    timezoneId: 'Asia/Kolkata',
  },

  // ============================================================
  // Browsers
  // ============================================================
  projects: process.env.CI
    ? [
        {
          name: 'chromium',

          use: {
            ...devices['Desktop Chrome'],

            viewport: {
              width: 1440,
              height: 900,
            },
          },
        },

        {
          name: 'firefox',

          use: {
            ...devices['Desktop Firefox'],

            viewport: {
              width: 1920,
              height: 1080,
            },
          },
        },

        {
          name: 'webkit',

          use: {
            ...devices['Desktop Safari'],

            viewport: {
              width: 1920,
              height: 1080,
            },
          },
        },
      ]
    : [
        {
          name: 'chromium',

          use: {
            ...devices['Desktop Chrome'],

            viewport: {
              width: 1440,
              height: 900,
            },
          },
        },

        {
          name: 'firefox',

          use: {
            ...devices['Desktop Firefox'],

            viewport: {
              width: 1440,
              height: 900,
            },
          },
        },

        {
          name: 'webkit',

          use: {
            ...devices['Desktop Safari'],

            viewport: {
              width: 1440,
              height: 900,
            },
          },
        },
      ],

  outputDir: 'test-results/',

  /*
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  */
});