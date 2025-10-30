import { test, expect } from '@playwright/test';

/**
 * プラットフォームページのE2Eテスト
 * 各ページにアクセスしてJavaScriptエラーやコンソールエラーが発生しないことを確認
 */

test('プラットフォーム一覧ページが正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「Windows」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/windows');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「ファミコン」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/famicom');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「スーパーファミコン」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/super-famicom');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「PlayStation」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/playstation');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「セガサターン」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/sega-saturn');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「PlayStation2」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/playstation2');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「Xbox」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/xbox');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「Xbox360」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/xbox360');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「PlayStation3」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/playstation3');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「Wii」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/wii');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「PlayStation Portable」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/playstation-portable');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「ニンテンドーDS」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/nintendo-ds');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「3DO」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/3do');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「ドリームキャスト」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/dream-cast');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「GameCube」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/game-cube');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「Nintendo 64」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/nintendo-64');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「ゲームボーイアドバンス」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/gameboy-advance');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「ワンダースワン」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/wonder-swan');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「携帯電話」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/feature-phone');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「ゲームボーイカラー」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/gameboy-color');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「ファミコンディスクシステム」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/famicom-disc-system');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「サテラビュー」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/satteraview');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「ニンテンドー3DS」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/nintendo-3ds');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「PlayStation Vita」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/playstation-vita');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「Wii U」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/wii-u');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「Android」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/android');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「iOS」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/ios');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「new ニンテンドー3DS」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/new-nintendo-3ds');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「PlayStation4」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/playstation4');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「Nintendo Switch」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/switch');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「XBOX One」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/xbox-one');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「DVD-PG」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/dvd-pg');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「PCエンジン」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/pc-engine');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「UMD-PG」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/umd-pg');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「ゲームアーカイブス」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/game-archives');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「バーチャルコンソール」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/virtual-console');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「Xbox Live」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/xbox-live');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「XBOX Series X|S」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/xbox-series-xs');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「PlayStation5」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/playstation5');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「Steam」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/steam');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「GOG.com」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/gog');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「プロジェクトEGG」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/project-egg');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「DMM GAMES」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/dmm-games');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「FANZA GAMES」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/fanza-games');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「Epic Games Store」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/epic-games-store');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「DOS/V」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/dos-v');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「PC-9801」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/pc-9801');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('プラットフォーム詳細ページ「Nintendo Switch2」が正常に表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('game/platform/switch2');

  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(3000);
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});
