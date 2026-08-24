import { test, expect } from '@playwright/test';
import { waitForPublicPageReady, createTestAccount, loginUser } from './support/utils';

/** 怖さメーターの選択肢の値（0-4） */
const FEAR_METER_VALUES = [0, 1, 2, 3, 4];

/**
 * 怖さメーターのE2Eテスト
 * 未ログイン時はゲームタイトル照会画面で「あなたの怖さメーター」リンクが表示されないことを確認する
 */
test('未ログイン時、ゲームタイトル照会画面で「あなたの怖さメーター」リンクが表示されない', async ({ page }) =>
{
  await page.goto('game/title/identity-v');
  await waitForPublicPageReady(page);

  await expect(page.locator('#reviews')).toBeVisible();

  const fearSpectrum = page.locator('.title-fear-spectrum');
  await expect(fearSpectrum).toBeVisible();
  await expect(fearSpectrum.locator('li')).toHaveCount(5);
  await expect(fearSpectrum.locator('li').first().locator(':scope > span')).toHaveText('4');
  await expect(fearSpectrum.locator('li').last().locator(':scope > span')).toHaveText('0');
  await expect(fearSpectrum.locator('li.is-current')).toHaveCount(1);
  const fearGauge = page.locator('.title-fear-gauge');
  await expect(fearGauge).toBeVisible();
  await expect(fearGauge.locator('.title-fear-gauge__ticks li')).toHaveCount(5);
  const fearMarker = fearGauge.locator('.title-fear-gauge__marker');
  await expect(fearMarker).toBeVisible();
  await expect(fearMarker).toHaveText(/^\d\.\d$/);
  await expect(page.locator('.title-fear-status')).toHaveCount(0);

  const commentLink = page.getByRole('link', { name: '怖さコメントを見る' });
  await expect(commentLink).toBeVisible();
  await expect(commentLink).toHaveCSS('color', 'rgb(204, 238, 204)');
  await commentLink.hover();
  await expect(commentLink).toHaveCSS('color', 'rgb(114, 255, 155)');
  const terminalCenterOffset = await commentLink.evaluate((link) => {
    const terminal = link.querySelector<HTMLElement>('.site-connection-terminal');
    if (terminal === null) {
      throw new Error('The fear comment link terminal is missing.');
    }

    const linkRect = link.getBoundingClientRect();
    const terminalRect = terminal.getBoundingClientRect();

    return Math.abs((linkRect.top + linkRect.height / 2) - (terminalRect.top + terminalRect.height / 2));
  });
  expect(terminalCenterOffset).toBeLessThanOrEqual(1);

  // 未ログイン状態では「あなたの怖さメーター」リンクが表示されないことを確認
  await expect(page.getByRole('link', { name: 'あなたの怖さメーター' })).not.toBeVisible();
});

/**
 * ログイン後にIdentity Vのタイトル画面へ遷移し、
 * 「あなたの怖さメーター」リンクをクリックして入力・送信し、成功メッセージを確認する
 */
test('ログイン後、怖さメーターを入力して成功メッセージが表示される', async ({ page, request }) =>
{
  test.setTimeout(90000);

  // テスト用アカウントを作成
  const createResponse = await request.post('api/test/create-test-account');
  if (!createResponse.ok()) {
    throw new Error('テスト用アカウントの作成に失敗しました。' + createResponse.status());
  }
  const { email, password } = await createResponse.json();

  // ログイン
  await page.goto('login');
  await waitForPublicPageReady(page);

  await page.fill('#email', email);
  await page.fill('#password', password);
  const loginResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/auth') && response.request().method() === 'POST'
  );
  await Promise.all([
    loginResponsePromise,
    page.getByRole('button', { name: 'ログイン' }).click(),
  ]);
  await waitForPublicPageReady(page);

  // Identity Vのタイトル画面へ遷移
  await page.goto('game/title/identity-v');
  await waitForPublicPageReady(page);

  // 「あなたの怖さメーター」リンクが存在することを確認
  const fearMeterLink = page.getByRole('link', { name: 'あなたの怖さメーター' });
  await expect(fearMeterLink).toBeVisible();

  // リンクをクリック
  await fearMeterLink.click();
  await waitForPublicPageReady(page);

  // デフォルト値2から、0-4のランダムな値へボタンで変更
  const randomValue = FEAR_METER_VALUES[Math.floor(Math.random() * FEAR_METER_VALUES.length)];
  const buttonName = randomValue < 2 ? '怖さメーターを下げる' : '怖さメーターを上げる';
  const clickCount = Math.abs(randomValue - 2);
  for (let i = 0; i < clickCount; i += 1) {
    await page.getByRole('button', { name: buttonName }).click();
  }

  // 送信
  const submitResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/fear-meter') && response.request().method() === 'POST'
  );
  await Promise.all([
    submitResponsePromise,
    page.getByRole('button', { name: '登録' }).click(),
  ]);
  await waitForPublicPageReady(page);

  // 成功メッセージが表示されることを確認
  await expect(page.locator('.title-alert--success')).toContainText('怖さメーターを保存しました。');

  // 再集計を実行
  const recalcResponse = await request.post('api/test/fear-meter/recalculate');
  if (!recalcResponse.ok()) {
    throw new Error('怖さメーター再集計APIの呼び出しに失敗しました。' + recalcResponse.status());
  }

  // 集計結果を取得（表示内容の検証用）
  let statisticsResponse = await request.get('api/test/fear-meter/statistics', {
    params: { title_key: 'identity-v' },
  });
  // 集計が未作成の場合は強制全件再集計して再取得
  if (statisticsResponse.status() === 404) {
    await request.post('api/test/fear-meter/recalculate', {
      data: { force_full: true },
    });
    statisticsResponse = await request.get('api/test/fear-meter/statistics', {
      params: { title_key: 'identity-v' },
    });
  }
  if (!statisticsResponse.ok()) {
    throw new Error('怖さメーター集計結果の取得に失敗しました。' + statisticsResponse.status());
  }
  const statistic = await statisticsResponse.json();

  // タイトル画面に戻る
  await page.goto('game/title/identity-v');
  await waitForPublicPageReady(page);

  // 集計結果が画面に反映されていることを確認
  const titleFearMeter = page.locator('.title-fear-meter');
  await expect(titleFearMeter).toContainText(statistic.fear_meter_text);
  await expect(titleFearMeter).toContainText(Number(statistic.average_rating).toFixed(1));
});

/**
 * 登録済みの怖さメーターを別の値に変更して更新できる（Phase 2）
 */
test('登録済みの怖さメーターを別の値に変更して更新できる', async ({ page, request }) =>
{
  test.setTimeout(90000);

  // テスト用アカウントを作成してログイン
  const account = await createTestAccount(request);
  await loginUser(page, account.email, account.password);

  // Identity V の怖さメーターフォームへ
  await page.goto('user/fear-meter/identity-v/form');
  await waitForPublicPageReady(page);

  // 値 0 で登録（- ボタンを押して最小値 0 にしてから登録）
  // デフォルト値は 2 なので - ボタンを 2 回押す
  await page.getByRole('button', { name: '怖さメーターを下げる' }).click();
  await page.getByRole('button', { name: '怖さメーターを下げる' }).click();

  const registerPromise = page.waitForResponse(
    (r) => r.url().includes('/fear-meter') && r.request().method() === 'POST',
  );
  await Promise.all([
    registerPromise,
    page.getByRole('button', { name: '登録' }).click(),
  ]);
  await waitForPublicPageReady(page);

  // 同フォームへ再アクセス → フォームが表示されていることを確認（「更新」ボタンが存在する）
  await page.goto('user/fear-meter/identity-v/form');
  await waitForPublicPageReady(page);

  await expect(page.getByRole('button', { name: '更新' })).toBeVisible();

  // 別の値（3）に変更して再送信（+ ボタンを 3 回押す）
  await page.getByRole('button', { name: '怖さメーターを上げる' }).click();
  await page.getByRole('button', { name: '怖さメーターを上げる' }).click();
  await page.getByRole('button', { name: '怖さメーターを上げる' }).click();

  const updatePromise = page.waitForResponse(
    (r) => r.url().includes('/fear-meter') && r.request().method() === 'POST',
  );
  await Promise.all([
    updatePromise,
    page.getByRole('button', { name: '更新' }).click(),
  ]);
  await waitForPublicPageReady(page);

  // 成功メッセージが表示されることを確認
  await expect(page.locator('.alert-success')).toContainText('怖さメーターを保存しました。');
});
