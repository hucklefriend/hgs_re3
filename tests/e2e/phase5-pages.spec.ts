import { expect, test } from '@playwright/test';

test('トップページはPhase 5のタイトル画面と実データ新着欄を表示する', async ({ page }) =>
{
    await page.goto('');
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');
    await expect(page.locator('body')).toHaveClass(/site-page--home/);
    await expect(page.locator('#home-hero-title')).toContainText('HORROR GAME');
    await expect(page.locator('#latest')).toBeVisible();
    await expect(page.locator('.home-command-link').first()).toHaveAttribute('href', /game\/lineup/);

    const commandMenu = page.locator('.home-command-menu');
    await expect(commandMenu).toHaveClass(/is-visible/);
    await expect(commandMenu).toHaveCSS('transform', 'none');
    const gridAlignment = await commandMenu.evaluate((menu) => {
        const root = document.querySelector<HTMLElement>('[data-public-app]');
        const label = menu.querySelector<HTMLElement>('.home-command-menu__label');
        const links = Array.from(menu.querySelectorAll<HTMLElement>('.home-command-link'));
        if (root === null || label === null || links.length === 0) {
            throw new Error('The home command menu is incomplete.');
        }

        const rootStyle = window.getComputedStyle(root);
        const rowSize = Number.parseFloat(rootStyle.getPropertyValue('--site-grid-row-size'));
        const originY = Number.parseFloat(rootStyle.getPropertyValue('--site-grid-origin-y'));
        const distanceFromGrid = (position: number): number => {
            const remainder = ((position - originY) % rowSize + rowSize) % rowSize;

            return Math.min(remainder, rowSize - remainder);
        };

        return {
            pageKind: root.dataset.pageKind,
            rowSize,
            originY,
            contentOffset: rootStyle.getPropertyValue('--home-content-grid-offset').trim(),
            labelHeight: label.getBoundingClientRect().height,
            linkHeights: links.map((link) => link.getBoundingClientRect().height),
            boundaryOffsets: links.flatMap((link) => {
                const rect = link.getBoundingClientRect();

                return [distanceFromGrid(rect.top), distanceFromGrid(rect.bottom)];
            }),
        };
    });

    expect(gridAlignment.pageKind).toBe('root');
    expect(gridAlignment.contentOffset).not.toBe('');
    expect(gridAlignment.labelHeight).toBeCloseTo(gridAlignment.rowSize, 1);
    gridAlignment.linkHeights.forEach((height) => {
        expect(height).toBeCloseTo(gridAlignment.rowSize * 2, 1);
    });
    gridAlignment.boundaryOffsets.forEach((offset) => {
        expect(offset, JSON.stringify(gridAlignment)).toBeLessThanOrEqual(1);
    });
});

test('lineup opens and closes the search panel with SEARCH', async ({ page }) =>
{
    await page.goto('game/lineup');
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');
    await expect(page.locator('body')).toHaveClass(/site-page--lineup/);

    const searchToggle = page.locator('#lineup-search-toggle');
    const searchPanel = page.locator('#lineup-search-panel');
    await expect(searchPanel).toBeHidden();
    await expect(searchToggle).toHaveAttribute('aria-expanded', 'false');

    await searchToggle.click();
    await expect(searchPanel).toBeVisible();
    await expect(searchToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#search-input')).toBeFocused();

    await searchToggle.click();
    await expect(searchPanel).toBeHidden();
    await expect(searchToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(searchPanel).toHaveAttribute('hidden', '');

    await searchToggle.click();
    await expect(searchPanel).toBeVisible();
    await expect(searchToggle).toHaveAttribute('aria-expanded', 'true');
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
