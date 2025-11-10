import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test('新規登録して、ログインしマイページが表示される', async ({ page, request }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  const randomLocalPart = randomUUID().replace(/-/g, '').slice(0, 12);
  const email = `${randomLocalPart}@horrorgame.net`;
  const password = 'Password123!';
  const userName = 'Playwright User';
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  await page.goto('register');
  
  // ページが完全に読み込まれるまで待機（ネットワークアイドル状態）
  await page.waitForLoadState('networkidle');
  
  // アニメーションや遅延実行されるスクリプトのために追加で待機
  await page.waitForTimeout(1000);
  
  await page.fill('#email', email);
  const registerResponsePromise = page.waitForResponse((res) =>
    res.url().includes('/register') && res.request().method() === 'POST'
  );
  await Promise.all([
    registerResponsePromise,
    page.getByRole('button', { name: '新規登録' }).click(),
  ]);
  
  // メール送信のために追加で待機
  await page.waitForTimeout(1000);
  await expect(page.locator('#register-pending-node')).toBeVisible();

  const registrationPayload = await (async () =>
  {
    for (let attempt = 0; attempt < 5; attempt++)
    {
      const response = await request.get('api/test/registration-url',
      {
        params: { email },
      });

      if (response.ok())
      {
        return await response.json();
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    throw new Error('登録用URLの取得に失敗しました。');
  })();

  const registrationUrl = registrationPayload.registration_url as string;
  const resolvedRegistrationUrl = registrationUrl.startsWith('http')
    ? registrationUrl
    : new URL(registrationUrl, page.url()).toString();
  const registrationPath = new URL(resolvedRegistrationUrl).pathname;

  await page.goto(registrationPath);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  await page.fill('#name', userName);
  await page.fill('#password', password);
  await Promise.all([
    page.getByRole('button', { name: '登録を完了する' }).click(),
  ]);

  await page.waitForTimeout(1000);
  await expect(page.locator('.alert-success')).toContainText('登録が完了しました。');

  await page.fill('#email', email);
  await page.fill('#password', password);
  await Promise.all([
    page.getByRole('button', { name: 'ログイン' }).click(),
  ]);

  await page.waitForTimeout(1000);
  await expect(page.locator('#mypage-welcome-node')).toContainText(userName);
  

  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});


