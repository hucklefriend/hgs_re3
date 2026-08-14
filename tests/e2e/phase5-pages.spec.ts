import { expect, test } from '@playwright/test';

test('トップページはPhase 5のタイトル画面と実データ新着欄を表示する', async ({ page }) =>
{
    await page.goto('');
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');
    await expect(page.locator('body')).toHaveClass(/site-page--home/);
    await expect(page.locator('#home-hero-title')).toContainText('HORROR GAME');
    await expect(page.locator('#latest')).toBeVisible();
    await expect(page.locator('.home-command-link').first()).toHaveAttribute('href', /game\/lineup/);
});

test('ラインナップはタイトル検索と詳細条件をコンソール内で切り替える', async ({ page }) =>
{
    await page.goto('game/lineup');
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');
    await expect(page.locator('body')).toHaveClass(/site-page--lineup/);

    const titlePanel = page.locator('[data-console-panel="title"]');
    const advancedPanel = page.locator('[data-console-panel="advanced"]');
    await expect(titlePanel).toBeVisible();

    await page.locator('[data-console-control="advanced"]').click();
    await expect(advancedPanel).toBeVisible();
    await expect(page.locator('#lineup-platform-id')).toBeVisible();

    await page.locator('[data-console-control="title"]').click();
    await expect(titlePanel).toBeVisible();
    await expect(advancedPanel).toBeHidden();
});

test('実データのタイトル詳細は情報セクションとOGPをモバイル幅でも維持する', async ({ page }) =>
{
    await page.goto('game/lineup');
    const detailUrl = await page.locator('.lineup-franchise__entries a').first().getAttribute('href');
    expect(detailUrl).toBeTruthy();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(detailUrl!);
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');
    await expect(page.locator('body')).toHaveClass(/site-page--title-detail/);
    await expect(page.locator('#title-detail-name')).toBeVisible();
    await expect(page.locator('#overview')).toBeVisible();
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);

    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(hasHorizontalOverflow).toBe(false);
});
