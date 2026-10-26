const { mkdtempSync } = require('node:fs');
const { join } = require('node:path');
process.env.CCNA_BROWSER_DATABASE_URL ||= 'file:' + join(mkdtempSync('/tmp/ccna-browser-'), 'browser.db');
const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests/browser',
  workers: 1,
  timeout: 45000,
  reporter: 'list',
  outputDir: '/tmp/ccna-playwright-results',
  use: {
    baseURL: 'http://127.0.0.1:5175',
    locale: 'es-PE',
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] },
  },
  webServer: [
    {
      command: 'node tools/browser-server.cjs',
      url: 'http://127.0.0.1:3101/api/health',
      env: { PORT: '3101', NODE_ENV: 'development', DATABASE_URL: process.env.CCNA_BROWSER_DATABASE_URL },
      reuseExistingServer: false,
    },
    {
      command: 'npm --prefix client run dev -- --host 127.0.0.1 --port 5175 --strictPort',
      url: 'http://127.0.0.1:5175',
      env: { VITE_API_BASE_URL: 'http://127.0.0.1:3101/api' },
      reuseExistingServer: false,
    },
  ],
});
