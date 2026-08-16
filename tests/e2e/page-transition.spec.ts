import { expect, test } from '@playwright/test';

test('公開リンクは接続演出後にAjaxを使わず全文書遷移し、戻る操作で復元できる', async ({ page }) =>
{
    const lineupRequests: { resourceType: string; requestedWith: string | undefined }[] = [];
    page.on('request', (request) => {
        if (!request.url().includes('/game/lineup')) {
            return;
        }

        lineupRequests.push({
            resourceType: request.resourceType(),
            requestedWith: request.headers()['x-requested-with'],
        });
    });

    await page.goto('');
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');
    await page.evaluate(() => {
        window.addEventListener('beforeunload', () => {
            const root = document.querySelector<HTMLElement>('[data-public-app]');
            const header = document.querySelector<HTMLElement>('[data-site-header]');
            if (!root || !header) {
                return;
            }

            sessionStorage.setItem(
                'page-transition-mask-top',
                root.style.getPropertyValue('--site-departure-mask-top'),
            );
            sessionStorage.setItem(
                'page-transition-header-bottom',
                String(header.getBoundingClientRect().bottom + window.scrollY),
            );
        }, { once: true });
    });

    const lineupLink = page.locator('.site-header__nav a').filter({ hasText: 'LINEUP' });
    await lineupLink.click({ noWaitAfter: true });
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-departing', 'true');
    await expect(page.locator('.site-handoff-token')).toHaveCount(1);

    await page.waitForURL('**/game/lineup', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');
    expect(lineupRequests).toEqual([{ resourceType: 'document', requestedWith: undefined }]);
    const departureMaskPosition = await page.evaluate(() => ({
        maskTop: Number.parseFloat(sessionStorage.getItem('page-transition-mask-top') ?? ''),
        headerBottom: Number.parseFloat(sessionStorage.getItem('page-transition-header-bottom') ?? ''),
    }));
    expect(departureMaskPosition.maskTop).toBeCloseTo(departureMaskPosition.headerBottom, 1);

    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/hgs_re3\/public\/$/);
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');
    await expect(page.locator('[data-public-app]')).not.toHaveAttribute('data-page-departing', 'true');
    await expect(page.locator('.site-handoff-token')).toHaveCount(0);
});

test('ページ内ハッシュと修飾キー付きクリックはブラウザー標準動作を維持する', async ({ page, context }) =>
{
    await page.goto('');
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');

    await page.locator('.site-skip-link').evaluate((anchor: HTMLAnchorElement) => anchor.click());
    await expect(page).toHaveURL(/#site-main$/);
    await expect(page.locator('[data-public-app]')).not.toHaveAttribute('data-page-departing', 'true');
    await expect(page.locator('.site-handoff-token')).toHaveCount(0);

    const popupPromise = context.waitForEvent('page');
    await page.locator('.site-header__nav a').filter({ hasText: 'LINEUP' }).click({
        modifiers: ['Control'],
        noWaitAfter: true,
    });
    const popup = await popupPromise;
    await popup.waitForURL('**/game/lineup', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/#site-main$/);
    await expect(page.locator('[data-public-app]')).not.toHaveAttribute('data-page-departing', 'true');
    await popup.close();
});

test('低減モーションでは接続ノードを作らず直ちに通常遷移する', async ({ page }) =>
{
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('');
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');

    await page.evaluate(() => {
        sessionStorage.setItem('phase4-handoff-created', 'false');
        sessionStorage.setItem('phase4-page-departing', 'false');
        const originalAppend = Element.prototype.append;
        Element.prototype.append = function (...nodes: (Node | string)[]): void {
            const createdHandoff = nodes.some((node) => {
                return node instanceof Element && node.classList.contains('site-handoff-token');
            });
            if (createdHandoff) {
                sessionStorage.setItem('phase4-handoff-created', 'true');
            }
            originalAppend.apply(this, nodes);
        };
        window.addEventListener('beforeunload', () => {
            const departing = document.querySelector('[data-public-app]')?.hasAttribute('data-page-departing') ?? false;
            sessionStorage.setItem('phase4-page-departing', String(departing));
        }, { once: true });
    });

    await page.locator('.site-header__nav a').filter({ hasText: 'LINEUP' }).click({ noWaitAfter: true });
    await page.waitForURL('**/game/lineup', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');
    const recordedState = await page.evaluate(() => ({
        handoffCreated: sessionStorage.getItem('phase4-handoff-created'),
        pageDeparting: sessionStorage.getItem('phase4-page-departing'),
    }));
    expect(recordedState).toEqual({ handoffCreated: 'false', pageDeparting: 'false' });
});
