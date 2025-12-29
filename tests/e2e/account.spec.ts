import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';
import { waitForTreeAppeared } from './support/utils';

/**
 * 新規登録して、ログインしマイページで設定を行い、退会する
 */
test('新規登録して、ログインしマイページで設定を行い、退会する', async ({ page, request }) =>
{
  // テストタイムアウトを120秒に設定（長いE2Eテストのため）
  test.setTimeout(120000);
  
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
  
  // プロフィール設定のテスト
  const updatedUserName = 'Updated Playwright User';
  const updatedShowId = `user_${randomLocalPart}`;
  
  // プロフィール設定ページに移動
  await page.goto('user/my-node/profile');
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  // プロフィール設定フォームが表示されていることを確認
  await expect(page.locator('#profile-edit-node')).toBeVisible();
  
  // ユーザー名とユーザーIDを変更
  await page.fill('#name', updatedUserName);
  await page.fill('#show_id', updatedShowId);
  
  // 更新ボタンをクリック
  const profileUpdateResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/user/my-node/profile') && response.request().method() === 'POST'
  );
  await Promise.all([
    profileUpdateResponsePromise,
    page.getByRole('button', { name: '更新' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  
  // 成功メッセージが表示されることを確認
  await expect(page.locator('.alert-success')).toContainText('プロフィールを更新しました。');
  
  // マイページに戻り、変更が反映されていることを確認
  await expect(page.locator('#mypage-welcome-node')).toContainText(updatedUserName);
  
  // パスワード変更のテスト
  const newPassword = 'NewPassword123!';
  
  // パスワード変更ページに移動
  await page.goto('user/my-node/password');
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  // パスワード変更フォームが表示されていることを確認
  await expect(page.locator('#password-change-form-node')).toBeVisible();
  
  // 現在のパスワード、新しいパスワード、新しいパスワード（確認）を入力
  await page.fill('#current_password', password);
  await page.fill('#password', newPassword);
  await page.fill('#password_confirmation', newPassword);
  
  // 変更ボタンをクリック
  const passwordUpdateResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/user/my-node/password') && response.request().method() === 'POST'
  );
  await Promise.all([
    passwordUpdateResponsePromise,
    page.getByRole('button', { name: '変更' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  
  // 成功メッセージが表示されることを確認
  await expect(page.locator('.alert-success')).toContainText('パスワードを変更しました。');
  
  // 新しいパスワードでログインできることを確認するため、ログアウトしてから新しいパスワードでログイン
  await page.goto('logout');
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  // ログインページに移動
  await page.goto('login');
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  await page.fill('#email', email);
  await page.fill('#password', newPassword);
  const loginWithNewPasswordResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/auth') && response.request().method() === 'POST'
  );
  await Promise.all([
    loginWithNewPasswordResponsePromise,
    page.getByRole('button', { name: 'ログイン' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  await expect(page.locator('#mypage-welcome-node')).toContainText(updatedUserName);
  
  // メールアドレス変更のテスト
  const newEmailLocalPart = randomUUID().replace(/-/g, '').slice(0, 12);
  const newEmail = `${newEmailLocalPart}@horrorgame.net`;
  
  // メールアドレス変更ページに移動
  await page.goto('user/my-node/email');
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  // メールアドレス変更フォームが表示されていることを確認
  await expect(page.locator('#email-change-form-node')).toBeVisible();
  
  // 新しいメールアドレスを入力して送信
  await page.fill('#new_email', newEmail);
  const emailUpdateResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/user/my-node/email') && response.request().method() === 'POST'
  );
  await Promise.all([
    emailUpdateResponsePromise,
    page.getByRole('button', { name: '確認メールを送信' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  
  // 成功メッセージが表示されることを確認
  await expect(page.locator('.alert-success')).toContainText('確認メールを送信しました。メールをご確認ください。');
  
  // メールアドレス変更用URLを取得
  const emailChangePayload = await (async () =>
  {
    const response = await request.get('api/test/email-change-url',
    {
      params: { new_email: newEmail },
    });

    if (response.ok())
    {
      return await response.json();
    }

    throw new Error('メールアドレス変更用URLの取得に失敗しました。' + response.status());
  })();

  const emailChangeUrl = emailChangePayload.email_change_url as string;
  const resolvedEmailChangeUrl = emailChangeUrl.startsWith('http')
    ? emailChangeUrl
    : new URL(emailChangeUrl, page.url()).toString();
  const emailChangePath = new URL(resolvedEmailChangeUrl).pathname;

  // メールアドレス変更確定URLにアクセス
  await page.goto(emailChangePath);
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  // 成功メッセージが表示されることを確認
  await expect(page.locator('.alert-success')).toContainText('メールアドレスを変更しました。');
  
  // 新しいメールアドレスでログインできることを確認するため、ログアウトしてから新しいメールアドレスでログイン
  await page.goto('logout');
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  // ログインページに移動
  await page.goto('login');
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  await page.fill('#email', newEmail);
  await page.fill('#password', newPassword);
  const loginWithNewEmailResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/auth') && response.request().method() === 'POST'
  );
  await Promise.all([
    loginWithNewEmailResponsePromise,
    page.getByRole('button', { name: 'ログイン' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  await expect(page.locator('#mypage-welcome-node')).toContainText(updatedUserName);
  
  // 退会のテスト
  // 退会ページに移動
  await page.goto('user/my-node/withdraw');
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  // 退会フォームが表示されていることを確認
  await expect(page.locator('#withdraw-form-node')).toBeVisible();
  
  // パスワードを入力して退会ボタンをクリック
  await page.fill('#password', newPassword);
  const withdrawResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/user/my-node/withdraw') && response.request().method() === 'POST'
  );
  await Promise.all([
    withdrawResponsePromise,
    page.getByRole('button', { name: '退会' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  
  // 成功メッセージが表示されることを確認
  await expect(page.locator('.alert-success')).toContainText('退会が完了しました。');
  
  // 退会後にログインできないことを確認
  await page.fill('#email', newEmail);
  await page.fill('#password', newPassword);
  const loginAfterWithdrawResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/auth') && response.request().method() === 'POST'
  );
  await Promise.all([
    loginAfterWithdrawResponsePromise,
    page.getByRole('button', { name: 'ログイン' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  
  // エラーメッセージが表示されることを確認
  await expect(page.locator('.alert-danger')).toContainText('メールアドレスまたはパスワードが正しくありません。');

  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});




/**
 * 新規登録時にnameフィールドに値が入っていると登録用URLが発行されない
 */
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




/**
 * 登録済みのメールアドレスで新規登録しようとするとエラーメッセージが表示される
 */
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




/**
 * 新規登録後、1時間以上経過すると登録処理が無効になる
 */
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



/**
 * パスワードリセット申請して、パスワードを変更しログインできる
 */
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

  // パスワードを戻す
  const resetPasswordResponse = await request.post('api/test/reset-webmaster-password');
  expect(resetPasswordResponse.ok()).toBe(true);

  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});


