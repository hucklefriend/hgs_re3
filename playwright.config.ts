import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright設定ファイル
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* 並列実行の設定 */
  fullyParallel: true,
  
  /* CI環境でのみfail fastを有効化 */
  forbidOnly: !!process.env.CI,
  
  /* リトライ設定 */
  retries: process.env.CI ? 2 : 0,
  
  /* 並列ワーカー数 */
  workers: process.env.CI ? 1 : undefined,
  
  /* レポーター設定 */
  reporter: 'html',
  
  /* 共通設定 */
  use: {
    /* ベースURL */
    baseURL: 'https://stg.horrorgame.net/',
    
    /* 失敗時のスクリーンショット */
    screenshot: 'only-on-failure',
    
    /* 失敗時のトレース */
    trace: 'on-first-retry',
    
    /* ビデオ録画 */
    video: 'retain-on-failure',
  },

  /* プロジェクト設定 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* 開発サーバー設定（必要に応じて） */
  // webServer: {
  //   command: 'php artisan serve',
  //   url: 'http://localhost:8000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

