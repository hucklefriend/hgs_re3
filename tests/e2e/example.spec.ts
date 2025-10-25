import { test, expect } from '@playwright/test';

test('ホームページが表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  await page.goto('');
  
  // ページタイトルを確認
  await expect(page).toHaveTitle(/.*ホラーゲームネットワーク.*/i);
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('基本的なナビゲーションが機能する', async ({ page }) =>
{
  await page.goto('');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
});

