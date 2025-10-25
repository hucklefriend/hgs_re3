import { test, expect } from '@playwright/test';

/**
 * メーカーページのE2Eテスト
 * 各ページにアクセスしてJavaScriptエラーやコンソールエラーが発生しないことを確認
 */

test('メーカー一覧ページが正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「カプコン」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/capcom');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「テクモ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/tecmo');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「任天堂」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/nintendo');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ソニーコンピュータエンタテインメント」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/sce');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「フロム・ソフトウェア」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/from-software');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Electronic Arts」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/electronic-arts');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「マーベラスエンターテイメント」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/marvelous-e');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「マイクロソフト」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/ms');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「セガ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/sega');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「日本一ソフトウェア」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/nippon1');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「バンダイナムコエンターテインメント」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/bandai-namco-entertainment');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「スクウェア・エニックス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/square-enix');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「タカラ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/takara');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「バンダイ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/bandai');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「GAE」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/gae');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「スパイク」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/spike');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「コンパイルハート」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/compile-heart');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「AQインタラクティブ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/aq');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ハドソン」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/hudson');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「D3パブリッシャー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/d3p');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「エニックス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/enix');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「トンキンハウス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/tonkin-house');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「サミー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/summy');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アトラス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/atlus');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「バンプレスト」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/bamprest');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「インターチャネル・ホロン」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/interchannel-holon');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ナウプロダクション」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/nowpro');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「メトロ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/metro');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アタリ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/atari');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「エクシング・エンタテイメント」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/xing-entertainment');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ディンプル」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/dimple');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アウトブレイク」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/outbreak');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ヒューマン」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/human');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ビー・ファクトリー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/b-f');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ギャガ・コミュニケーションズ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/gaga');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アクレイムジャパン」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/acclaim-japan');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ワープ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/warp');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「コナミ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/konami');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ユタカ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/yutaka');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アイディアファクトリー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/idea-factory');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「サクセス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/success');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「クレイジーゲーム」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/crazy');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ジャレコ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/jaleco');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「メディアエンターテイメント」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/media-entertainment');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「サイバーフロント」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/cyber-front');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ビクターインタラクティブソフトウエア」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/victor');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ヴィジット」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/visit');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アイドス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/eidos');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「角川書店」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/kadokawa');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ピーアンドエー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/p-and-a');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アクティビジョン」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/activision');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ライブドア」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/livedoor');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Sega of America」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/sega-a');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「インターチャネル」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/innter-channel');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「パンドラボックス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/pandora-box');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ジェネックス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/genex');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アテナ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/athene');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ズー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/zoo');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ライアーソフト」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/liar-soft');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「F&C FC03」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/fc-fc03');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「タイガーマンプロジェクト」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/tigerman-project');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アボガドパワーズ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/abogado-owers');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Lass」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/lass');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ブルーゲイル」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/blue-gale');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「シーズウェア」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/cs-ware');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「MBS Truth」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/mbs-truth');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「BLACK CYC」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/black-cyc');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「美遊」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/miyu');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「rúf」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/ruf');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Project-μ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/project-myu');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「mirage」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/mirage');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Innocent Grey」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/innocent-grey');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Candle」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/candle');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「TOPCAT」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/topcat');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ジュエリー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/jewelry');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ニトロプラス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/nitro-plus');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「D.O.」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/do');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「シルキーズ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/silkys');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ケロQ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/kero-q');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Gage」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/gage');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アトリエかぐや」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/atelier-kaguya');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アルケミスト」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/alchemist');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「07th Expansion」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/07th');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「七転び八転がり」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/7-8');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ワーナーブラザーズエンターテインメント」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/warnerbros');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「5bp.」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/5bp');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「CHUNSOFT」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/chunsoft');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「BOOST ON」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/boost-on');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Ubisoft」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/ubi');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Apple」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/apple');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「aspyr」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/aspyr');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「DMM GAMES」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/dmm');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Google」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/google');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「GSC Game World」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/gsc-game-world');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「IMGN.PRO」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/imgn-pro');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「SEEC」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/seec');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ソニー・インタラクティブエンターテインメント」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/sie');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「SKH Apps」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/skh-apps');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Starbreeze」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/starbreeze');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「すたじおみりす」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/miris');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「スパイク・チュンソフト」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/spike-chunsoft');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「パック・イン・ビデオ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/pack-in-video');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アークシステムワークス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/arc-system-works');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「インターグロー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/intergrow');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「エクスペリエンス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/experience');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ザイザックス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/zzyzx');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ツクダシナジー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/tsukuda');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ヌードメーカー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/nude-maker');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ベセスダ・ソフトワークス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/bethesda');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Infinitap Games」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/infinitap');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「LKA」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/lka');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Psytec Games」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/psytec');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「レイニーフロッグ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/rainy-flog');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Red Barrels」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/red-barrels');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「TOBE」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/tobe');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「United Independent Entertainment」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/united-independent-entertainment');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アリエルーフ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/arieroof');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「エムスリイエンタテインメント」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/m3-entertainment');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「クロスファンクション」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/cross-function');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「メディアファクトリー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/media-factory');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「DISTORTION」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/distortion');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Frictional Games」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/frictional-games');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「hourglass」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/hourglass');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Mindscape」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/mindscape');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Moon Parrot」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/moon-parrot');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Sheep」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/sheep');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「SkyFish」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/sky-fish');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Tripwire Interactive」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/tripwire-interactive');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ZyX」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/zyx');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「あんく」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/anku');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ぴ～にゃん」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/pi-nyan');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アウトリガー工房」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/outrigger');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「サンソフト」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/sunsoft');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「シエラオンライン」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/sierra-online');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「シエラ・パイオニア」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/sierra-pioneer');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ワンドロー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/one-draw');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「電脳CLUB」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/denno-club');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「TETRATECH」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/tetratech');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ビック東海」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/big-toukai');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「加賀クリエイト」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/kaga-create');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「フリュー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/furyu');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Valve」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/valve');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Monolith Productions」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/monolith-productions');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「KID」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/kid');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「プリンセスソフト」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/princess-soft');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Digital Happiness」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/digital-happiness');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アイチェリー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/aicherry');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「N43Project」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/n43');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Palace」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/palace');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「テイクツー・インタラクティブ・ジャパン」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/take-two-jp');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「テトラ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/tetra');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「AMT Savan」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/amt-savan');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Novectacle」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/novectacle');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「言語社」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/gengo-sha');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「dramatic create」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/dramatic-create');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「エンターグラム」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/entergram');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ハムスター」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/humstar');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「シャノン」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/shanon');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「トイボックス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/toy-box');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ハミングバードソフト」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/haming-bird-soft');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Deep Silver」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/deep-silver');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Oasis Games」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/oasis-games');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Gun Media」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/gun-media');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ナツメアタリ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/natsume-atari');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Net Ease」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/net-ease');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ケムコ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/kemco');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「桜花一門」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/ouka-ichimon');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「オーバーランド」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/overland');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Endnight Games」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/endnight-games');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Dynamic Pixels」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/dynamic-pixels');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「tinyBuild」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/tiny-build');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「PLAYISM」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/playism');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Krillbite Studio」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/krillbite');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「GOG Limited」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/gog');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「コーエーテクモ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/koei-tecmo');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アシッド」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/acid');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Catchweight Studio」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/catchweight-studio');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Team17」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/team-17');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「NAYUTA STUDIO」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/nayuta-studio');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Mint Mentis」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/mint-mentis');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ヘキサドライブ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/hexa-drive');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「くまハッカー」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/kuma-hacker');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Dave Kang」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/dave-kang');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Kwalee」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/kwalee');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「noprops」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/noprops');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「アンダードア」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/under-door');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「DorsalFin Studio」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/dorsal-fin-studio');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「THQ Nordic」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/thq-nordic');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「SUPERDELUXE GAMES」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/superdeluxe-games');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「東映アニメーション」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/toei-animation');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「トイジアム」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/toydium');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Puppet Combo」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/puppet-combo');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「qureate」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/qureate');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「âge」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/age');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Epic Games」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/epic-game');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ぶる～べり～そふと」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/blue-berry-soft');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「ナイトメアスタジオ」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/nightmare-studio');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「eastasiasoft」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/eastasiasoft');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「メビウス」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/mebius');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「MAGES.」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/mages');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Digital Extreams」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/digital-extreams');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「SONNORI」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/sonnori');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('メーカー詳細ページ「Mob Entertainment」が正常に表示される', async ({ page }) =>
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
  
  // ページにアクセス
  await page.goto('game/maker/mob-entertainment');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});
