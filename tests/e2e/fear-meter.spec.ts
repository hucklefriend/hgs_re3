import { test, expect } from '@playwright/test';
import { waitForTreeAppeared } from './support/utils';

/**
 * 怖さメーターのE2Eテスト
 * 未ログイン時はゲームタイトル照会画面で「あなたの怖さメーター」リンクが表示されないことを確認する
 */
test('未ログイン時、ゲームタイトル照会画面で「あなたの怖さメーター」リンクが表示されない', async ({ page }) =>
{
  // TOPから遷移
  await page.goto('');
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);

  // フランチャイズをクリック
  await page.getByRole('link', { name: 'フランチャイズ' }).click();
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);

  // 「あ」をクリックしてアコーディオンを開く
  await page.getByRole('button', { name: 'あ' }).click();
  await page.waitForTimeout(500);

  // 「Identity V」をクリック（フランチャイズ詳細へ）
  await page.getByRole('link', { name: 'Identity V' }).first().click();
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);

  // タイトルラインナップの「Identity V」をクリック（ゲームタイトル照会画面へ）
  await page.locator('#title-lineup-tree-node').getByRole('link', { name: 'Identity V' }).click();
  await page.waitForLoadState('networkidle');
  await waitForTreeAppeared(page);

  // ゲームタイトル照会画面に遷移したことを確認
  await expect(page.locator('#title-review-node')).toBeVisible();

  // 未ログイン状態では「あなたの怖さメーター」リンクが表示されないことを確認
  await expect(page.getByRole('link', { name: 'あなたの怖さメーター' })).not.toBeVisible();
});
