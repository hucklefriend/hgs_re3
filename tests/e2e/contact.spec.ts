import { test, expect } from '@playwright/test';
import { waitForTreeAppeared } from './support/utils';

/**
 * 問い合わせ機能のE2Eテスト
 * トップページから問い合わせフォームにアクセスし、問い合わせを送信する
 */
test('問い合わせフォームから問い合わせを送信できる', async ({ page }) =>
{
  // テストタイムアウトを120秒に設定（長いE2Eテストのため）
  test.setTimeout(120000);
  
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // トップページにアクセス
  await page.goto('');
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  // 「問い合わせ」リンクをクリック
  const contactLink = page.locator('#contact-a');
  await expect(contactLink).toBeVisible();
  
  const contactResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/contact') && response.request().method() === 'GET'
  );
  await Promise.all([
    contactResponsePromise,
    contactLink.click(),
  ]);
  
  await waitForTreeAppeared(page);
  
  // 問い合わせフォームが表示されていることを確認
  await expect(page.locator('#contact-form-node')).toBeVisible();
  
  // フォームに入力
  await page.fill('#name', 'テスト');
  
  // カテゴリーをランダム選択
  const categoryOptions = await page.locator('#category option').all();
  // 最初のオプション（「選択してください」）を除く
  const selectableOptions = categoryOptions.slice(1);
  if (selectableOptions.length > 0)
  {
    const randomIndex = Math.floor(Math.random() * selectableOptions.length);
    const randomOption = selectableOptions[randomIndex];
    const optionValue = await randomOption.getAttribute('value');
    if (optionValue !== null)
    {
      await page.selectOption('#category', optionValue);
    }
  }
  
  await page.fill('#message', '問い合わせです');
  
  // 送信ボタンをクリック
  const submitResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/contact') && response.request().method() === 'POST'
  );
  await Promise.all([
    submitResponsePromise,
    page.getByRole('button', { name: '送信' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  
  // 完了画面が表示されることを確認
  await expect(page.getByRole('heading', { name: '送信完了' })).toBeVisible();
  await expect(page.locator('#contact-content-node')).toBeVisible();
  
  // 入力した内容が表示されることを確認
  await expect(page.locator('#contact-content')).toContainText('テスト');
  await expect(page.locator('#contact-content')).toContainText('問い合わせです');
  
  // 返信フォームが表示されていることを確認
  await expect(page.locator('#response-form-node')).toBeVisible();
  
  // 返信を投稿
  await page.fill('#responder_name', 'テスト');
  await page.fill('#message', '追記です');
  
  // 返信を投稿ボタンをクリック
  await page.getByRole('button', { name: '返信を投稿' }).click();
  
  await waitForTreeAppeared(page);
  
  // 返信が投稿されたことを確認
  // 返信を投稿するとContact.Showにリダイレクトされるため、返信が表示されるまで待つ
  // 「追記です」というテキストが表示されるまで待機
  await expect(page.locator('#response-node-content')).toContainText('追記です', { timeout: 10000 });
  
  // 追記後のURLを変数に保存
  const contactUrl = page.url();
  
  // 管理画面にログイン
  // baseURLを取得
  const currentUrl = new URL(page.url());
  const baseURL = `${currentUrl.protocol}//${currentUrl.host}${currentUrl.pathname.split('/contact')[0]}`;
  await page.goto('admin');
  await page.waitForLoadState('networkidle');
  
  // ログインフォームに入力
  await page.fill('#emailAddress', 'webmaster@horrorgame.net');
  await page.fill('#password', 'testtest');
  
  // ログインボタンをクリック
  const loginResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/admin/auth') && response.request().method() === 'POST'
  );
  await Promise.all([
    loginResponsePromise,
    page.getByRole('button', { name: 'ログイン' }).click(),
  ]);
  
  await page.waitForLoadState('networkidle');
  
  // Manageメニューをクリック
  await page.locator('.menu-item.has-sub:has-text("Manage")').click();
  await page.waitForTimeout(500); // サブメニューが開くのを待つ
  
  // Contactをクリック
  await page.getByRole('link', { name: 'Contact' }).click();
  await page.waitForLoadState('networkidle');
  
  // Contact Listの一番上の項目のDetailボタンをクリック
  const firstDetailButton = page.locator('a:has-text("Detail")').first();
  await expect(firstDetailButton).toBeVisible();
  await firstDetailButton.click();
  await page.waitForLoadState('networkidle');
  
  // ステータスを「対応中」に更新
  await page.selectOption('#status', '1'); // 対応中 = 1
  const statusUpdateResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/contact/') && response.url().includes('/status') && response.request().method() === 'POST'
  );
  await Promise.all([
    statusUpdateResponsePromise,
    page.getByRole('button', { name: 'ステータスを更新' }).click(),
  ]);
  
  await page.waitForLoadState('networkidle');
  
  // 管理者返信を投稿
  await page.fill('#responder_name', '管理者');
  await page.fill('#message', '管理者からの返信です');
  
  const adminResponseSubmitPromise = page.waitForResponse((response) =>
    response.url().includes('/contact/') && response.url().includes('/response') && response.request().method() === 'POST'
  );
  await Promise.all([
    adminResponseSubmitPromise,
    page.getByRole('button', { name: '返信を投稿' }).click(),
  ]);
  
  await page.waitForLoadState('networkidle');
  
  // 管理者返信が表示されることを確認
  await expect(page.locator('body')).toContainText('管理者からの返信です');
  
  // contactUrlに再度アクセスして、ステータスが「対応中」であることを確認
  await page.goto(contactUrl);
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  // ステータス表示が「対応中」であることを確認
  await expect(page.locator('body')).toContainText('対応中');
  
  // 管理画面に戻る
  await page.goto('admin/manage/contact');
  await page.waitForLoadState('networkidle');
  
  // 一番上のDetailボタンをクリック
  const firstDetailButtonAgain = page.locator('a:has-text("Detail")').first();
  await expect(firstDetailButtonAgain).toBeVisible();
  await firstDetailButtonAgain.click();
  await page.waitForLoadState('networkidle');
  
  // ステータスを「完了」に更新
  await page.selectOption('#status', '2'); // 完了 = 2
  const statusUpdateToResolvedPromise = page.waitForResponse((response) =>
    response.url().includes('/contact/') && response.url().includes('/status') && response.request().method() === 'POST'
  );
  await Promise.all([
    statusUpdateToResolvedPromise,
    page.getByRole('button', { name: 'ステータスを更新' }).click(),
  ]);
  
  await page.waitForLoadState('networkidle');
  
  // contactUrlに再度アクセスして、ステータスが「完了」であることを確認
  await page.goto(contactUrl);
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  // ステータス表示が「完了」であることを確認
  await expect(page.locator('body')).toContainText('完了');
  
  // 2週間後にクローズされる旨のメッセージが表示されることを確認
  await expect(page.locator('body')).toContainText('2週間後に自動でクローズ');
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

/**
 * 問い合わせ機能のE2Eテスト
 * 投稿内容にひらがな・カタカナが含まれていなかったら、投稿時点ではじかれること
 */
test('投稿内容にひらがな・カタカナが含まれていなかったら、投稿時点ではじかれること', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // トップページにアクセス
  await page.goto('');
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);
  
  // 「問い合わせ」リンクをクリック
  const contactLink = page.locator('#contact-a');
  await expect(contactLink).toBeVisible();
  
  const contactResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/contact') && response.request().method() === 'GET'
  );
  await Promise.all([
    contactResponsePromise,
    contactLink.click(),
  ]);
  
  await waitForTreeAppeared(page);
  
  // 問い合わせフォームが表示されていることを確認
  await expect(page.locator('#contact-form-node')).toBeVisible();
  
  // アルファベットと空白のみの内容を投稿
  const testName = 'Test User Non Kana';
  const testMessage = 'Hello World Test Message';
  
  await page.fill('#name', testName);
  
  // カテゴリーをランダム選択
  const categoryOptions = await page.locator('#category option').all();
  // 最初のオプション（「選択してください」）を除く
  const selectableOptions = categoryOptions.slice(1);
  if (selectableOptions.length > 0)
  {
    const randomIndex = Math.floor(Math.random() * selectableOptions.length);
    const randomOption = selectableOptions[randomIndex];
    const optionValue = await randomOption.getAttribute('value');
    if (optionValue !== null)
    {
      await page.selectOption('#category', optionValue);
    }
  }
  
  await page.fill('#message', testMessage);
  
  // 送信ボタンをクリック
  const submitResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/contact') && response.request().method() === 'POST'
  );
  await Promise.all([
    submitResponsePromise,
    page.getByRole('button', { name: '送信' }).click(),
  ]);
  
  await waitForTreeAppeared(page);
  
  // 完了画面が表示されることを確認（スパムでも完了画面は表示される）
  await expect(page.getByRole('heading', { name: '送信完了' })).toBeVisible();
  
  // 管理画面にログイン
  await page.goto('admin');
  await page.waitForLoadState('networkidle');
  
  // ログインフォームに入力
  await page.fill('#emailAddress', 'webmaster@horrorgame.net');
  await page.fill('#password', 'testtest');
  
  // ログインボタンをクリック
  const loginResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/admin/auth') && response.request().method() === 'POST'
  );
  await Promise.all([
    loginResponsePromise,
    page.getByRole('button', { name: 'ログイン' }).click(),
  ]);
  
  await page.waitForLoadState('networkidle');
  
  // Manageメニューをクリック
  await page.locator('.menu-item.has-sub:has-text("Manage")').click();
  await page.waitForTimeout(500); // サブメニューが開くのを待つ
  
  // Contactをクリック
  await page.getByRole('link', { name: 'Contact' }).click();
  await page.waitForLoadState('networkidle');
  
  // 投稿した名前で検索
  const keywordInput = page.locator('input[name="keyword"]');
  await expect(keywordInput).toBeVisible();
  await keywordInput.fill(testName);
  
  // Searchボタンをクリック
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForLoadState('networkidle');
  
  // 検索結果に投稿した内容が存在しないことを確認
  // 「問い合わせが見つかりませんでした」のメッセージが表示されることを確認
  await expect(page.getByText('問い合わせが見つかりませんでした')).toBeVisible();
  
  // 念のため、Contact Listのパネル内のテーブル内に投稿した内容が存在しないことを確認
  // Contact Listのパネル内のテーブルのtbodyを特定
  const contactListPanel = page.locator('.panel').filter({ hasText: 'Contact List' });
  const contactListTable = contactListPanel.locator('table').first();
  const tableBodyText = (await contactListTable.locator('tbody').textContent()) || '';
  const hasTestNameInTable = tableBodyText.includes(testName);
  const hasTestMessageInTable = tableBodyText.includes(testMessage);
  
  // どちらも表示されていないことを確認
  expect(hasTestNameInTable, `投稿した名前 "${testName}" が管理画面のテーブルに表示されています。スパム対策が機能していません。`).toBe(false);
  expect(hasTestMessageInTable, `投稿したメッセージ "${testMessage}" が管理画面のテーブルに表示されています。スパム対策が機能していません。`).toBe(false);
  
  // メッセージでも検索
  await keywordInput.fill(testMessage);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForLoadState('networkidle');
  
  // 検索結果に投稿した内容が存在しないことを確認
  // 「問い合わせが見つかりませんでした」のメッセージが表示されることを確認
  await expect(page.getByText('問い合わせが見つかりませんでした')).toBeVisible();
  
  // 念のため、Contact Listのパネル内のテーブル内に投稿した内容が存在しないことを確認
  const contactListPanelAfterSearch = page.locator('.panel').filter({ hasText: 'Contact List' });
  const contactListTableAfterSearch = contactListPanelAfterSearch.locator('table').first();
  const tableBodyTextAfterSearch = (await contactListTableAfterSearch.locator('tbody').textContent()) || '';
  const hasTestMessageAfterSearch = tableBodyTextAfterSearch.includes(testMessage);
  
  expect(hasTestMessageAfterSearch, `投稿したメッセージ "${testMessage}" が管理画面のテーブルに表示されています。スパム対策が機能していません。`).toBe(false);
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: ${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

