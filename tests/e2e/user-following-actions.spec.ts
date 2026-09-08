import { expect, test } from '@playwright/test';
import { createTestAccount, loginUser, waitForPublicPageReady } from './support/utils';

for (const action of [
  { label: 'フォローを解除', endpoint: 'follow', method: 'DELETE' },
  { label: 'ブロックする', endpoint: 'block', method: 'POST' },
]) {
test(`フォロー中一覧でミュート後に${action.label}と幕の演出を確認する`, async ({ page, request }) =>
{
  const targetAccount = await createTestAccount(request);
  await loginUser(page, targetAccount.email, targetAccount.password);

  const targetShowIdText = await page.locator('#mypage-welcome-node p.text-slate-500').textContent();
  const targetShowId = targetShowIdText?.trim().replace(/^@/, '');
  expect(targetShowId).toBeTruthy();

  await page.context().clearCookies();

  const viewerAccount = await createTestAccount(request);
  await loginUser(page, viewerAccount.email, viewerAccount.password);
  const viewerShowId = (await page.locator('#mypage-welcome-node p.text-slate-500').textContent())?.trim().replace(/^@/, '');
  await page.goto(`user/${targetShowId}`);
  await waitForPublicPageReady(page);

  const followResponsePromise = page.waitForResponse(response =>
    response.url().endsWith(`/api/users/${targetShowId}/follow`)
      && response.request().method() === 'POST'
  );
  await page.getByRole('button', { name: 'フォローする' }).click();
  expect((await followResponsePromise).ok()).toBe(true);

  await page.goto('user/my-node/following');
  await waitForPublicPageReady(page);

  const menuTrigger = page.getByRole('button', { name: 'Test Userの操作メニュー' });
  await expect(menuTrigger.locator('[data-connection-terminal]')).toHaveCount(1);
  await menuTrigger.click();

  const successAnimationPromise = page.locator('[data-handoff-layer]').evaluate(element => new Promise<void>(resolve => {
    const observer = new MutationObserver(() => {
      if (element.querySelector('.site-handoff-route')) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(element, { childList: true });
  }));
  const muteResponsePromise = page.waitForResponse(response =>
    response.url().endsWith(`/user/my-node/following/${targetShowId}/mute`)
      && response.request().method() === 'POST'
  );
  await page.getByRole('menuitem', { name: 'ミュートする' }).click();
  expect((await muteResponsePromise).status()).toBe(303);
  await successAnimationPromise;
  await waitForPublicPageReady(page);
  await page.reload();
  await waitForPublicPageReady(page);

  await menuTrigger.click();
  await expect(page.getByRole('menuitem', { name: 'ミュートを解除' })).toBeVisible();

  const departureMaskPromise = page.locator('[data-public-app]').evaluate(element => new Promise<void>(resolve => {
    const observer = new MutationObserver(() => {
      if (element.getAttribute('data-page-departing') === 'true'
          && (element as HTMLElement).style.getPropertyValue('--site-departure-mask-top')) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(element, { attributes: true });
  }));
  const unfollowResponsePromise = page.waitForResponse(response =>
    response.url().endsWith(`/api/users/${targetShowId}/${action.endpoint}`)
      && response.request().method() === action.method
  );
  if (action.endpoint === 'block') {
    page.once('dialog', dialog => dialog.accept());
  }
  await page.getByRole('menuitem', { name: action.label }).click();
  expect((await unfollowResponsePromise).ok()).toBe(true);
  await departureMaskPromise;
  await waitForPublicPageReady(page);

  await expect(page.getByText('フォロー中ユーザーはいないようだ。')).toBeVisible();

  await page.goto('user/my-node/muting');
  await waitForPublicPageReady(page);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await menuTrigger.click();
  await expect(page.getByRole('menuitem', { name: 'プロフィールを見る' }).locator('[data-connection-terminal]')).toHaveCount(0);
  await page.getByRole('menuitem', { name: 'ミュートを解除' }).click();
  await expect(page.getByText('ミュートしているユーザーはいないようだ。')).toBeVisible();
  await page.reload();
  await expect(page.getByText('ミュートしているユーザーはいないようだ。')).toBeVisible();

  if (action.endpoint === 'block') {
    await page.goto('user/my-node/blocking');
    await waitForPublicPageReady(page);
    await expect(page.locator('a.following-user-link')).toHaveCount(0);
    await menuTrigger.click();
    await page.getByRole('menuitem', { name: 'ブロックを解除' }).click();
    await expect(page.getByText('ブロックしているユーザーはいないようだ。')).toBeVisible();
  } else {
    await page.context().clearCookies();
    await loginUser(page, targetAccount.email, targetAccount.password);
    await page.goto(`user/${viewerShowId}`);
    await waitForPublicPageReady(page);
    const followed = page.waitForResponse(response => response.url().endsWith(`/api/users/${viewerShowId}/follow`) && response.request().method() === 'POST');
    await page.getByRole('button', { name: 'フォローする' }).click();
    expect((await followed).ok()).toBe(true);
    await page.context().clearCookies();
    await loginUser(page, viewerAccount.email, viewerAccount.password);
    await page.goto('user/my-node/followers');
    await waitForPublicPageReady(page);
    await menuTrigger.click();
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('menuitem', { name: 'ブロックする' }).click();
    await expect(page.getByText('フォロワーはいないようだ。')).toBeVisible();
  }

});
}
