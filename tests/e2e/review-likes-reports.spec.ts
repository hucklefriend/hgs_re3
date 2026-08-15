import { test, expect } from '@playwright/test';
import { waitForPublicPageReady, createTestAccount, loginUser } from './support/utils';

/** Identity V のタイトルキー */
const TITLE_KEY = 'identity-v';

/**
 * ユーザーAとしてログインしてレビューを投稿し、そのレビューページの URL を返す。
 * 呼び出し後、page はレビュー一覧ページに遷移した状態になる。
 */
const postReviewAsUserA = async (
  page: Parameters<typeof loginUser>[0],
  request: Parameters<typeof createTestAccount>[0],
): Promise<string> =>
{
  const accountA = await createTestAccount(request);
  await loginUser(page, accountA.email, accountA.password);

  // レビューフォームへ直接遷移して最小限の入力で公開
  await page.goto(`user/review/${TITLE_KEY}/form`);
  await waitForPublicPageReady(page);

  await page.check('input[name="play_status"][value="cleared"]');
  await page.fill('#body', 'いいね・通報テスト用のレビューです。');

  const publishPromise = page.waitForResponse(
    (r) =>
      r.url().includes('/user/review') &&
      !r.url().includes('/draft') &&
      !r.url().includes('/form') &&
      r.request().method() === 'POST',
  );
  await Promise.all([
    publishPromise,
    page.getByRole('button', { name: '公開する' }).click(),
  ]);
  await waitForPublicPageReady(page);

  // タイトルのレビュー一覧ページへ → 「全文を読む」リンクからレビュー URL を取得
  await page.goto(`game/title/${TITLE_KEY}/reviews`);
  await waitForPublicPageReady(page);

  // 「全文を読む」リンクをクリックしてレビュー個別ページへ遷移
  await Promise.all([
    page.waitForURL(/\/review\/[^/?#]+$/),
    page.getByRole('link', { name: '全文を読む' }).first().click(),
  ]);
  await waitForPublicPageReady(page);

  return page.url();
};

// ---------------------------------------------------------------------------

/**
 * ログイン後、他ユーザーのレビューにいいね・いいね解除できる
 */
test('ログイン後、他ユーザーのレビューにいいねできる', async ({ page, request }) =>
{
  test.setTimeout(120000);

  const jsErrors: string[] = [];
  page.on('pageerror', (err) => jsErrors.push(err.message));

  // ユーザー A としてレビューを投稿し、レビューページ URL を取得
  const reviewUrl = await postReviewAsUserA(page, request);

  // ログアウトしてユーザー B でログイン
  await page.context().clearCookies();

  const accountB = await createTestAccount(request);
  await loginUser(page, accountB.email, accountB.password);

  // A のレビューページへ遷移
  await page.goto(reviewUrl);
  await waitForPublicPageReady(page);

  // いいね前のカウントを取得
  const likeCountLocator = page.locator('.js-like-count').first();
  const beforeCount = parseInt((await likeCountLocator.textContent()) ?? '0', 10);

  // いいねボタンをクリック
  const likeButton = page.locator('button[title="いいね"]');
  const likePromise = page.waitForResponse(
    (r) => r.url().includes('/like') && r.request().method() === 'POST',
  );
  await Promise.all([
    likePromise,
    likeButton.click(),
  ]);

  // いいね数が +1 されることを確認
  await expect(likeCountLocator).toHaveText(String(beforeCount + 1));
  await expect(likeButton).toBeEnabled();

  // 再度クリックしていいねを解除
  const unlikePromise = page.waitForResponse(
    (r) => r.url().includes('/unlike') && r.request().method() === 'POST',
  );
  await Promise.all([
    unlikePromise,
    likeButton.click(),
  ]);

  // いいね数が元に戻ることを確認
  await expect(likeCountLocator).toHaveText(String(beforeCount));

  expect(jsErrors).toHaveLength(0);
});

// ---------------------------------------------------------------------------

/**
 * 未ログイン時、いいねボタン（フォーム）が表示されない
 */
test('未ログイン時、いいねボタンが表示されない', async ({ page }) =>
{
  // タイトル詳細ページへ（未ログイン）
  await page.goto(`game/title/${TITLE_KEY}`);
  await waitForPublicPageReady(page);

  // いいね用フォームが表示されないことを確認
  await expect(page.locator('form.review-reaction-form[data-reaction-kind="like"]')).not.toBeVisible();
});

// ---------------------------------------------------------------------------

/**
 * ログイン後、レビューを通報できる
 */
test('ログイン後、レビューを通報できる', async ({ page, request }) =>
{
  test.setTimeout(90000);

  // ユーザー A としてレビューを投稿し、レビューページ URL を取得
  const reviewUrl = await postReviewAsUserA(page, request);

  // ログアウトしてユーザー B でログイン
  await page.context().clearCookies();

  const accountB = await createTestAccount(request);
  await loginUser(page, accountB.email, accountB.password);

  // A のレビューページへ遷移
  await page.goto(reviewUrl);
  await waitForPublicPageReady(page);

  // 通報モーダルを開いて送信
  await page.locator('button[title="通報"]').click();
  const reportForm = page.locator('form.review-reaction-form[data-reaction-kind="report"]');
  await expect(reportForm).toBeVisible();
  await reportForm.getByLabel('不適切な内容').check();

  const reportPromise = page.waitForResponse(
    (r) => r.url().includes('/report') && r.request().method() === 'POST',
  );
  await Promise.all([
    reportPromise,
    reportForm.getByRole('button', { name: '通報する' }).click(),
  ]);

  // 通報済みに変わることを確認（JS でボタンテキストが変化）
  await expect(page.locator('button:has-text("通報済み"), span:has-text("通報済み")')).toBeVisible();

  // ページをリロードして「通報済み」スパンが表示されることを確認（サーバー側でも反映）
  await page.goto(reviewUrl);
  await waitForPublicPageReady(page);

  // 通報フォームが消え、通報済みスパンが表示されている
  await expect(page.locator('form.review-reaction-form[data-reaction-kind="report"]')).not.toBeVisible();
  await expect(page.locator('span').filter({ hasText: '通報済み' }).first()).toBeVisible();
});
