import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 現在のファイルのディレクトリを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.playwright.local または .env.playwright から環境変数を読み込む
dotenv.config({ path: join(__dirname, '.env.playwright.local') });
dotenv.config({ path: join(__dirname, '.env.playwright') });

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
    /* ベースURL（デフォルトはlocalhost） */
    baseURL: 'http://localhos',
    
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
      use: {
        ...devices['Desktop Chrome'],
        /* ベースURL */
        baseURL: 'http://localhost/hgs_re3/public/',
      },
    },
    {
      name: 'stg',
      testMatch: /(account|basic-pages)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        /* ベースURL（ステージング環境） */
        baseURL: 'https://stg.horrorgame.net/',
        /* HTTP認証（Basic/Digest認証） */
        ...(process.env.PLAYWRIGHT_DIGEST_USERNAME && process.env.PLAYWRIGHT_DIGEST_PASSWORD
          ? {
              httpCredentials: {
                username: process.env.PLAYWRIGHT_DIGEST_USERNAME,
                password: process.env.PLAYWRIGHT_DIGEST_PASSWORD,
              },
            }
          : {}),
      },
    },
  ],
});

