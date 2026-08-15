import { expect, test } from '@playwright/test';

const standardRoutes = [
    'about',
    'timeline',
    'info',
    'game/franchises',
    'game/maker',
    'game/platform',
    'login',
    'register',
    'contact',
];

test('残りの代表公開GETルートは標準グリッドレイアウトで表示される', async ({ page }) =>
{
    for (const route of standardRoutes) {
        const response = await page.goto(route);

        expect(response?.status(), route).toBeLessThan(400);
        await expect(page.locator('[data-public-app]'), route).toHaveAttribute('data-page-ready', 'true');
        await expect(page.locator('body'), route).toHaveClass(/site-page/);
        await expect(page.locator('.site-standard-page'), route).toBeVisible();
        await expect(page.locator('.site-standard-page h1'), route).not.toBeEmpty();
    }
});

test('旧Ajaxクエリが付いてもJSONではなく通常のHTML文書を返す', async ({ page }) =>
{
    const response = await page.goto('about?a=1&children_only=1');

    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('text/html');
    await expect(page.locator('.site-standard-page')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
});

test('モバイル幅と低減モーションでも標準ページの情報を隠さない', async ({ page }) =>
{
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('game/franchises');

    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');
    await expect(page.locator('.site-standard-page')).toBeVisible();

    const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        invisibleContent: Array.from(document.querySelectorAll<HTMLElement>('.site-standard-page .invisible'))
            .some((element) => getComputedStyle(element).opacity === '0'),
    }));

    expect(layout.overflow).toBe(false);
    expect(layout.invisibleContent).toBe(false);
});

test('JavaScript無効でも本文・通常リンク・ログインフォームを利用できる', async ({ browser }) =>
{
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto('about');
    await expect(page.locator('.site-standard-page')).toBeVisible();
    await expect(page.locator('.site-standard-page a[href]').first()).toBeVisible();

    await page.goto('login');
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], input[type="submit"]').first()).toBeVisible();

    await context.close();
});

test('管理画面のログイン・一覧・詳細・編集は公開レイアウトの変更対象外', async ({ page }) =>
{
    const response = await page.goto('admin/login');

    expect(response?.status()).toBe(200);
    await expect(page.locator('[data-public-app]')).toHaveCount(0);
    await expect(page.locator('form[action$="/admin/auth"]')).toBeVisible();

    await page.fill('#emailAddress', 'webmaster@horrorgame.net');
    await page.fill('#password', 'testtest');
    await Promise.all([
        page.waitForResponse((authResponse) =>
            authResponse.url().includes('/admin/auth') &&
            authResponse.request().method() === 'POST'
        ),
        page.getByRole('button', { name: 'ログイン' }).click(),
    ]);

    await page.goto('admin/master/maker');
    await expect(page.locator('[data-public-app]')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'List' })).toBeVisible();

    await Promise.all([
        page.waitForURL(/\/admin\/master\/maker\/\d+$/),
        page.getByRole('link', { name: /Detail/ }).first().click(),
    ]);
    await expect(page.locator('#maker-table')).toBeVisible();

    await Promise.all([
        page.waitForURL(/\/admin\/master\/maker\/\d+\/edit$/),
        page.getByRole('link', { name: /Edit/ }).click(),
    ]);
    await expect(page.locator('form input[name="_method"][value="PUT"]')).toBeAttached();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
});


test('代表公開画面のレイアウトシフトと長時間タスクを許容範囲に抑える', async ({ page }) =>
{
    await page.addInitScript(() =>
    {
        const metrics = { cls: 0, longestTask: 0 };
        const metricWindow = window as unknown as {
            __phase9PerformanceMetrics: typeof metrics;
        };
        metricWindow.__phase9PerformanceMetrics = metrics;

        new PerformanceObserver((list) =>
        {
            for (const entry of list.getEntries()) {
                const shift = entry as PerformanceEntry & {
                    hadRecentInput: boolean;
                    value: number;
                };
                if (!shift.hadRecentInput) {
                    metrics.cls += shift.value;
                }
            }
        }).observe({ type: 'layout-shift', buffered: true });

        new PerformanceObserver((list) =>
        {
            for (const entry of list.getEntries()) {
                metrics.longestTask = Math.max(metrics.longestTask, entry.duration);
            }
        }).observe({ type: 'longtask', buffered: true });
    });

    await page.goto('');
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');
    await page.evaluate(() => new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    ));

    const initialMetrics = await page.evaluate(() =>
        (window as unknown as {
            __phase9PerformanceMetrics: { cls: number; longestTask: number };
        }).__phase9PerformanceMetrics
    );

    expect(initialMetrics.cls).toBeLessThan(0.1);
    expect(initialMetrics.longestTask).toBeLessThan(1000);

    const interactiveLongestTask = await page.evaluate(() => new Promise<number>((resolve) =>
    {
        const metrics = (window as unknown as {
            __phase9PerformanceMetrics: { cls: number; longestTask: number };
        }).__phase9PerformanceMetrics;
        metrics.longestTask = 0;
        window.scrollTo(0, document.documentElement.scrollHeight);

        requestAnimationFrame(() => requestAnimationFrame(() =>
        {
            window.scrollTo(0, 0);
            requestAnimationFrame(() => requestAnimationFrame(() =>
            {
                resolve(metrics.longestTask);
            }));
        }));
    }));

    expect(interactiveLongestTask).toBeLessThan(100);
});
