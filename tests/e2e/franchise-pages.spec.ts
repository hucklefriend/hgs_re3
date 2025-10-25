import { test, expect } from '@playwright/test';

/**
 * フランチャイズページのE2Eテスト
 * 各ページにアクセスしてJavaScriptエラーやコンソールエラーが発生しないことを確認
 */

test('フランチャイズ一覧ページが正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchises');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「バイオハザード」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/biohazard');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「零」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/zero');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「アローン・イン・ザ・ダーク」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/alone-in-the-dark');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「エコーナイト」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/echonight');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「クロックタワー」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/clock-tower');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「SIREN」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/siren');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DARKSEED」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/darkseed');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Dの食卓」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/d-no-shokutaku');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「トワイライトシンドローム」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/twhilight-syndrome');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「流行り神」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/hayarigami');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ファミコン探偵倶楽部」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/famicom-tantei-kurabu');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ナナシ ノ ゲエム」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/nanashinogeemu');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「サイレントヒル」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/silent-hill');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「F.E.A.R.」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/fear');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「CONDEMNED」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/condemned');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「RESISTANCE」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/resistance');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「LEFT 4 DEAD」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/left-4-dead');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「パラサイト・イヴ」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/parasite-eve');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「逢魔が時」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/ouma-ga-toki');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「弟切草」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/otogiriso');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「かまいたちの夜」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/kamaitachi-no-yoru');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「忌火起草」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/imabikiso');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DEAD SPACE」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dead-space');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「学校であった怖い話」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/gakko-de-atta-kowai-hanashi');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「恐怖新聞」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/kyofu-shinbun');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「厄」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yaku');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「アカイイト」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/akaiito');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「アリス・イン・ナイトメア」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/alice-in-nightmare');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「夜光虫」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yakouchu');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「S.T.A.L.K.E.R.」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/stalker');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「涼崎探偵事務所ファイル」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/suzusaki-tantei-jimusho-file');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「螺旋回廊」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/rasen-kairou');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ひぐらしのなく頃に」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/higurashi-no-naku-koroni');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「コープスパーティー」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/corps-party');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「サイコブレイク」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/psycho-break');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Dead Island」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dead-island');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「The Last of Us」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/the-last-of-us');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「夜廻」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yomawari');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「OUTLAST」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/outlast');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「SAW」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/saw');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Killing Floor」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/killing-floor');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「D\'ERLANGER」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/derlanger');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ファンタズム」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/phantasm');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「フェアリーテイル」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/fairy-tail');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「稲川淳二」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/inagawa-junji');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ゴーストハンター(ハミングバード)」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/ghost-hunter');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DreadOut」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dread-out');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DEMENTIUM」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dementium');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「The DARKNESS」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/the-darkness');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ゴーストヴァイブレーション」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/ghost-vibration');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ファタモルガーナの館」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/fata-morgana-no-yakata');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Amnesia」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/amnesia');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ルイージマンション」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/luigi-mansion');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「九怨-kuon-」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/kuon');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ヴァンパイア・レイン」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/vampire-rain');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「michigan」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/michigan');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「R?MJ THE MYSTERY HOSPITAL」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/r-mj-the-mystery-hospital');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「・・・いる！」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/iru');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「es」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/es');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「エターナル・ダークネス」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/eternal-darkness');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「歸らずの森」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/kaerazuno-mori');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「グレゴリーホラーショー」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/gregory-horror-show');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「The FEAR」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/the-fear');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Juggernaut～戦慄の扉～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/juggernaut-senritsu-no-tobira');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「SIMPLEシリーズ」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/simple-series');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「スウィートホーム」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/sweet-home');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DARK TALES From The Lost Soul」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dark-tales-from-the-lost-soul');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「デビルマン」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/devilman');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ダークメサイア」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dark-messiah');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ハングリィ・ゴースト」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/hungry-ghost');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「プリズナー オブ アイス」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/prisoner-of-ice');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「夕闇通り探検隊」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yuyamidoori-tankentai');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「LAST WHISPER」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/last-whisper');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「彼岸島」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/higanjima');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DEMENTO」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/demento');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「やるドラ」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yaru-dora');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「四八（仮）」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/shijuhachi');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ファーレンハイト」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/fahrenheit');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「学校の怪談DS」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/gakkou-no-kaidan');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「みてはいけない」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/miteha-ikenai');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「呪怨」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/juon');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「CALLING～黒き着信～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/calling-kuroki-shakushin');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「イルブリード」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/illbleed');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「CARRIER」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/carrier');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「コワイシャシン～心霊写真奇譚～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/kowai-shashin-shinrei-shashin-kitan');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DINO CRISIS」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dino-crisis');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DEEP FEAR」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/deep-fear');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ノクターン」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/nocturne');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「バンパイアハンターD」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/vampire-hunter-d');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「闇吹く夏 帝都物語ふたたび」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yamifuku-natsu-teito-monogatari-futatabi');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「遊星からの物体X」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yuusei-karano-buttai-x');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ルールオブローズ」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/rule-of-rose');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「RUN LIKE HELL」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/run-like-hell');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「SAINTS 聖なる魔物」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/saints-seinaru-mamono');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Necro-Nesia」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/necro-nesia');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「THE 大量地獄」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/the-tairyo-jigoku');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「darkSector」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dark-sector');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Red Seeds Profile -レッドシーズプロファイル-」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/red-seeds-profile');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「人魚の烙印」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/ningyo-no-rakuin');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「あかずの間」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/akazuno-ma');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「黒ノ十三」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/kuro-no-jusan');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「最終電車」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/saishu-densha');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「大幽霊屋敷～浜村淳の実話怪談～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dai-yuurei-yashiki-hamamura-jun-no-jitsuwa-kaidan');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「死者の呼ぶ館」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/shisha-no-yobu-yakata');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「吸血姫夕維～千夜抄～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/vampire-yui-senyasho');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「閉鎖病院」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/heisa-byotoh');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「19時03分上野発夜光列車」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/19ji13fun-uenohatsu-yakouressha');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「実話怪談「新耳袋」」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/jitsuwa-kaidan-shinmimibukuro');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「歪みの国のアリス」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yugami-no-kuni-no-alice');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Alan Wake」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/alan-wake');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「リング」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/ring');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「おおかみかくし」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/ookamikakushi');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「腐り姫～euthanasia～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/kusari-hime-euthanasia');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「朝の来ない夜に抱かれて -ETERNAL NIGHT-」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/asa-no-konai-yoru-ni-dakarete');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「螢子」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/hotaruko');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「BIFRONTE ～公界島奇譚～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/bifronte-kugaitou-kitan');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DIVI・DEAD」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/divi-dead');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DOOP」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/doop');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「EXTRAVAGANZA」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/extravaganza');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「つくとり」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/tsukutori');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ほとせなる呪 ちとせなる詛」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/hotosenaruuta-chitosenarushirushi');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「アノニマス」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/anonymous');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「カルタグラ～ツキ狂イノ病～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/karutagura-tsuki');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ゴア・スクリーミング・ショウ」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/gore-screaming-show');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「闇色の童話」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yamiiro-no-dowa');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「果てしなく青い、この空の下で…。」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/hateshinaku-aoi-konosora-no-shita-de');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ダイアの約束 ～逢いたくて～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dia-no-yakusoku-aitakute');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「沙耶の唄」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/saya-no-uta');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「雑音領域」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/zatsuon-ryoiki');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「肢体を洗う」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/shitai-wo-arau');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「二重影」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/nijuu-ei');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「蜜柑」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/mikan');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「牝姫の虜 ～廃校舎の制服少女～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/mehime-no-toriko-haikousha-no-seifuku-shoujo');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「幽明境を異にする」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yuumei-sakai-wo-koto-ni-suru');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「「超」怖い話」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/chou-kowai-hanashi');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「クリオスタシス」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/cryostasis');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「イケニエノヨル」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/ikenie-no-yoru');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「シャドウ オブ ザ ダムド」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/shadow-of-the-damned');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Rise of Nightmares」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/rise-of-nightmares');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「心霊カメラ ～憑いてる手帳～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/shinei-camera-tsuiteru-techou');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ゾンビU」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/zonbie-u');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Dead by Daylight」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dead-by-daylight');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Emily Wants to Play」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/emily-wants-to-play');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「NightCry」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/night-cry');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Until Dawn」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/until-dawn');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「WHITEDAY～学校という名の迷宮～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/whiteday-gakkou-to-una-no-meikyuu');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ゲゲゲの鬼太郎」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/gegege-no-kitaro');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ドラキュラ」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dracula');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「フロムダスクティルドーン」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/from-dusk-till-dawn');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ホラート -ディアトロフ峠の惨劇-」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/kholat-dyatlov-touge-no-sangeki');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Layers of Fear」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/layers-of-fear');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「脱出×和風ホラー：夢怨」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dasshutsu-wafuu-horror-muon');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「心霊旅館からの脱出」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/shirei-ryokan-karano-dasshutsu');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「祝姫」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/iwaihime');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Crystal Rift」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/crystal-rift');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DAYLIGHT」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/daylight');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Night Walker」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/night-walker');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「One\'s Own [or very]」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/ones-own-or-very');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Pineview Drive - House of Horror」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/pineview-drive-house-of-horror');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「The Town of Light」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/the-twon-of-light');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「エイリアン」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/alien');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「カース ザ・アイ・オブ・イシス」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/curse-the-eye-of-isis');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「デッドハウス 再生」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dead-house-saisei');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ネバーエンディングナイトメア」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/never-ending-nightmare');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ヒア・ゼイ・ライ –眠りし者たち-」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/here-they-lie-nemurishi-monotachi');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「リトルナイトメア」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/little-nightmare');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「The Inpatient -闇の病棟-」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/the-inpatient');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「霊刻 -池田貴族心霊研究所-」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/reikoku-ikeda-kizoku-shinrei-kenkyuujo');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「innocence pain ～満ちる闇　欠ける月～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/innocence-pain-michiru-yami-kakeru-tsuki');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「この歌が終わったら - When this song is over -」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/kono-uta-ga-owattara');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「シンギュラリティ」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/singularity');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「シンクロ」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/synchro');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「トワイライトホテル」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/twilight-hotel');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ブルースティンガー」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/blue-stinger');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「一夜怪談」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/ichiya-kaidan');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「九十九の奏〜欠け月の夜想曲〜」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/tsukumo-no-kanade-kaketsuki-no-yasoukyoku');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「公開されなかった手記」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/kokai-sarenakatta-shuki');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「古伝降霊術 百物語〜ほんとにあった怖い話〜」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/koden-koureijutsu-honto-ni-atta-kowai-hanashi');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「彼岸花の咲く夜に」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/higanbana-no-saku-koroni');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「悪魔の招待状」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/akuma-no-shoutaijou');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「昏き祟りの森で」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/kuraki-tatari-no-mori-de');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「漆黒のシャルノス -What a beautiful tomorrow-」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/shikkoku-no-sharnoth');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「狗哭」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/inunaki');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「疼き～淫欲に満ちる月～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/uzuki-inyoku-ni-michiru-tsuki');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「紅い夜、星の囁きを聴け」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/akai-yoru-hoshi-no-sasayaki-wo-kike');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「怪奇! ドリル男の恐怖」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/kaiki-drill-otoko-no-kyoufu');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DreadEye VR」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dread-eye-vr');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「B～蒼き背徳～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/b-aoki-haitoku');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「CLOSED NIGHTMARE」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/closed-nightmare');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DYING: Reborn」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dying-reborn');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「13日の金曜日」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/friday-the-13th');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Identity V」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/identity-v');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「レイジングループ」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/raging-loop');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「CHAINMAN」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/chainman');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「インスティンクト」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/instinct');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「THE FOREST」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/the-forest');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Hello Neighbor」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/hello-neighbor');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「YUMENIKKI-DREAM DIARY-」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yumenikki');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Among the Sleep」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/among-the-sleep');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「廃深」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/haishin');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Poppy Playtime」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/poppy-playtime');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「GARTEN OF BANBAN」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/garten-of-banban');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「DAYMARE」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/daymare');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「8番出口」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/8ban-deguchi');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Remothered」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/remothered');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「つぐのひ」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/tsugunohi');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「夜、灯す」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yoru-tomosu');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「THE DARK PICTURES」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/the-dark-pictures');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「CARRION」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/carrion');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「LIMBO」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/limbo');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Martha is Dead」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/martha-is-dead');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「殺しの館」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/koroshi-no-yakata');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ドットホラーストーリー」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/dot-horror-story');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「VIVIETTE」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/viviette');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「心霊ホラーADV」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/shinrei-horror-adv');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「夕鬼」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yuoni');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「女鬼橋」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/mekikyou');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「SONG OF HORROR」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/song-of-horror');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「HOME SWEET HOME」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/home-sweet-home');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「野狗子: Slitterhead」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yakushi-slitterhead');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「MADiSON」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/madison');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Killer Frequency」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/killer-frequency');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Apsulov: End of Gods」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/apsulov-end-of-gods');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「CONSCRIPT」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/conscript');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ウツロマユ -Hollow Cocoon-」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/utsuromayu-hollow-cocoon');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Year Of The Ladybug」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/year-of-the-ladybug');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「■■ノニラヤ」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/noniraya');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「不可視の帰路」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/fukashi-no-kiro');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「The Spirit of the Samurai」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/the-spirit-of-the-samurai');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「青鬼」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/aooni');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「看板村」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/kanbanmura');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「鳴蟇村」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/naribikimura');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「赤川次郎ミステリー」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/akagawa-jirou-mistery');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「晦-つきこもり-」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/tsukikomori');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「黄泉～悪夢のアイランド～」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yomi-akumu-no-island');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「ゴーストハンター(EA)」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/ghost-hunter-ea');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「闇からのいざない TENEBRAE I」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/yami-karano-izanai-tenebrae-i');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('フランチャイズ詳細ページ「Greyhill Incident」が正常に表示される', async ({ page }) =>
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
  await page.goto('game/franchise/greyhill-incident');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});
