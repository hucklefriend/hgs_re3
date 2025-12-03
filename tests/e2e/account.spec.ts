import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';
import { waitForTreeAppeared } from './support/utils';

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
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  await page.fill('#email', email);
  const registerResponsePromise = page.waitForResponse((res) =>
    res.url().includes('/register') && res.request().method() === 'POST'
  );
  await Promise.all([
    registerResponsePromise,
    page.getByRole('button', { name: '新規登録' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  await expect(page.locator('#register-pending-node')).toBeVisible();

  const registrationPayload = await (async () =>
  {
    const response = await request.get('api/test/registration-url',
    {
      params: { email },
    });

    if (response.ok())
    {
      return await response.json();
    }

    throw new Error('登録用URLの取得に失敗しました。' + response.status());
  })();

  const registrationUrl = registrationPayload.registration_url as string;
  const resolvedRegistrationUrl = registrationUrl.startsWith('http')
    ? registrationUrl
    : new URL(registrationUrl, page.url()).toString();
  const registrationPath = new URL(resolvedRegistrationUrl).pathname;

  await page.goto(registrationPath);
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);

  await page.fill('#name', userName);
  await page.fill('#password', password);
  await Promise.all([
    page.getByRole('button', { name: '登録を完了する' }).click(),
  ]);

  await waitForTreeAppeared(page);
  await expect(page.locator('.alert-success')).toContainText('登録が完了しました。');

  await page.fill('#email', email);
  await page.fill('#password', password);
  const loginResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/auth') && response.request().method() === 'POST'
  );
  await Promise.all([
    loginResponsePromise,
    page.getByRole('button', { name: 'ログイン' }).click(),
  ]);

  await waitForTreeAppeared(page);
  await expect(page.locator('#mypage-welcome-node')).toContainText(userName);
  

  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('新規登録時にnameフィールドに値が入っていると登録用URLが発行されない', async ({ page, request }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  const randomLocalPart = randomUUID().replace(/-/g, '').slice(0, 12);
  const email = `${randomLocalPart}@horrorgame.net`;
  const invalidName = 'Invalid Name';
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
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
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  // emailとnameの両方に値を入力（nameは空であるべき）
  await page.fill('#email', email);
  // nameフィールドは非表示（bot対策）のため、evaluateで直接値を設定
  await page.evaluate((value) =>
    {
      const nameInput = document.querySelector('#name') as HTMLInputElement;
      if (nameInput)
      {
        nameInput.value = value;
      }
    }, invalidName);
  
  const registerResponsePromise = page.waitForResponse((res) =>
    res.url().includes('/register') && res.request().method() === 'POST'
  );
  await Promise.all([
    registerResponsePromise,
    page.getByRole('button', { name: '新規登録' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  
  // バリデーションエラーが表示されることを確認（オプション）
  // エラーメッセージが表示される可能性がある
  
  // 登録用URLの取得を試みる（失敗することを期待）
  const registrationUrlResponse = await request.get('api/test/registration-url',
  {
    params: { email },
  });
  
  // 登録用URLが発行されていないことを確認（404が返される）
  expect(registrationUrlResponse.status()).toBe(404);
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('登録済みのメールアドレスで新規登録しようとするとエラーメッセージが表示される', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  const registeredEmail = 'webmaster@horrorgame.net';
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
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
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  await page.fill('#email', registeredEmail);
  const registerResponsePromise = page.waitForResponse((res) =>
    res.url().includes('/register') && res.request().method() === 'POST'
  );
  await Promise.all([
    registerResponsePromise,
    page.getByRole('button', { name: '新規登録' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  
  // バリデーションエラーメッセージが表示されることを確認
  await expect(page.locator('.alert-warning')).toContainText('このメールアドレスで新規登録はできません。');
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('新規登録後、1時間以上経過すると登録処理が無効になる', async ({ page, request }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  const randomLocalPart = randomUUID().replace(/-/g, '').slice(0, 12);
  const email = `${randomLocalPart}@horrorgame.net`;
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
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
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  await page.fill('#email', email);
  const registerResponsePromise = page.waitForResponse((res) =>
    res.url().includes('/register') && res.request().method() === 'POST'
  );
  await Promise.all([
    registerResponsePromise,
    page.getByRole('button', { name: '新規登録' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  await expect(page.locator('#register-pending-node')).toBeVisible();

  // 登録用URLを取得
  const registrationPayload = await (async () =>
  {
    const response = await request.get('api/test/registration-url',
    {
      params: { email },
    });

    if (response.ok())
    {
      return await response.json();
    }

    throw new Error('登録用URLの取得に失敗しました。' + response.status());
  })();

  const registrationUrl = registrationPayload.registration_url as string;
  const resolvedRegistrationUrl = registrationUrl.startsWith('http')
    ? registrationUrl
    : new URL(registrationUrl, page.url()).toString();
  const registrationPath = new URL(resolvedRegistrationUrl).pathname;

  // 有効期限を1時間以上前に変更
  const expireResponse = await request.post('api/test/expire-registration',
  {
    data: { email },
  });

  expect(expireResponse.ok()).toBe(true);

  // 登録完了URLにアクセス（有効期限切れのため新規登録ページにリダイレクトされる）
  await page.goto(registrationPath);
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);

  // 新規登録ページにリダイレクトされていることを確認
  await expect(page).toHaveURL(/\/register/);

  // エラーメッセージが表示されることを確認
  await expect(page.locator('.alert-danger')).toContainText('登録リンクの有効期限が切れています。再度登録してください。');

  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('パスワードリセット申請して、パスワードを変更しログインできる', async ({ page, request }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  const email = 'webmaster@horrorgame.net';
  const newPassword = 'NewPassword123!';
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  await page.goto('password-reset');
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  await page.fill('#email', email);
  const passwordResetResponsePromise = page.waitForResponse((res) =>
    res.url().includes('/password-reset') && res.request().method() === 'POST'
  );
  await Promise.all([
    passwordResetResponsePromise,
    page.getByRole('button', { name: '送信' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  await expect(page.locator('#password-reset-sent-node')).toBeVisible();

  // パスワードリセット用URLを取得
  const passwordResetPayload = await (async () =>
  {
    const response = await request.get('api/test/password-reset-url',
    {
      params: { email },
    });

    if (response.ok())
    {
      return await response.json();
    }

    throw new Error('パスワードリセット用URLの取得に失敗しました。' + response.status());
  })();

  const passwordResetUrl = passwordResetPayload.password_reset_url as string;
  const resolvedPasswordResetUrl = passwordResetUrl.startsWith('http')
    ? passwordResetUrl
    : new URL(passwordResetUrl, page.url()).toString();
  const passwordResetPath = new URL(resolvedPasswordResetUrl).pathname;

  await page.goto(passwordResetPath);
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);

  await page.fill('#password', newPassword);
  const completePasswordResetResponsePromise = page.waitForResponse((res) =>
    res.url().includes('/password-reset/complete/') && res.request().method() === 'POST'
  );
  await Promise.all([
    completePasswordResetResponsePromise,
    page.getByRole('button', { name: 'パスワードを変更' }).click(),
  ]);

  await waitForTreeAppeared(page);
  await expect(page.locator('.alert-success')).toContainText('パスワードを変更しました。ログインしてください。');

  await page.fill('#email', email);
  await page.fill('#password', newPassword);
  const loginResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/auth') && response.request().method() === 'POST'
  );
  await Promise.all([
    loginResponsePromise,
    page.getByRole('button', { name: 'ログイン' }).click(),
  ]);

  await waitForTreeAppeared(page);
  // ログイン成功を確認（マイページにリダイレクトされる）
  await expect(page.locator('#mypage-welcome-node')).toContainText('ようこそ');

  // パスワードをtesttestに戻す
  const resetPasswordResponse = await request.post('api/test/reset-webmaster-password');
  expect(resetPasswordResponse.ok()).toBe(true);

  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});


