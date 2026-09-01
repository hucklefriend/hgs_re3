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

test('フッターの内部リンク端子は文字・円・接続線の共通軸を使う', async ({ page }) =>
{
    await page.goto('');
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');

    const footerLinks = page.locator('.site-footer__nav a');
    await expect(footerLinks).toHaveCount(4);
    await expect(footerLinks.locator('[data-connection-terminal]')).toHaveCount(4);

    const terminalAlignment = await footerLinks.evaluateAll((links) => links.map((link) => {
        const label = link.querySelector<HTMLElement>('.site-connection-label');
        const terminal = link.querySelector<HTMLElement>('[data-connection-terminal]');
        if (label === null || terminal === null) {
            throw new Error('The footer connection label is incomplete.');
        }

        const labelRect = label.getBoundingClientRect();
        const terminalRect = terminal.getBoundingClientRect();
        const terminalStyle = getComputedStyle(terminal);
        const stubStyle = getComputedStyle(terminal, '::after');
        const stubTransform = new DOMMatrixReadOnly(stubStyle.transform);
        const circleCenter = terminal.offsetHeight / 2;
        const stubCenter = Number.parseFloat(terminalStyle.borderTopWidth)
            + Number.parseFloat(stubStyle.top)
            + stubTransform.m42
            + (Number.parseFloat(stubStyle.height) / 2);

        return {
            centerOffsetInEm: (
                terminalRect.top + (terminalRect.height / 2)
                - labelRect.top - (labelRect.height / 2)
            ) / Number.parseFloat(getComputedStyle(label).fontSize),
            lineAxisError: Math.abs(circleCenter - stubCenter),
            ownerIsLabel: terminal.offsetParent === label,
        };
    }));

    terminalAlignment.forEach((alignment) => {
        expect(alignment.ownerIsLabel).toBe(true);
        expect(alignment.centerOffsetInEm).toBeCloseTo(0, 2);
        expect(alignment.lineAxisError).toBeLessThanOrEqual(0.01);
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

    await page.setViewportSize({ width: 320, height: 800 });
    await expect(searchPanel).toHaveCSS('block-size', '400px');
    expect(await searchPanel.evaluate((panel) => panel.scrollHeight <= panel.clientHeight)).toBe(true);
});

test('実データのタイトル詳細はデータセクションとOGPをモバイル幅でも維持する', async ({ page }) =>
{
    await page.goto('game/lineup');
    const detailUrl = await page.locator('.lineup-franchise__entries a').first().getAttribute('href');
    expect(detailUrl).toBeTruthy();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(detailUrl!);
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');
    await expect(page.locator('body')).toHaveClass(/site-page--title-detail/);
    await expect(page.locator('#title-detail-name')).toBeVisible();
    await expect(page.locator('#overview')).toHaveCount(0);
    await expect(page.locator('#fear-meter')).toBeVisible();
    await expect(page.locator('.title-detail-menu a').first()).toHaveAttribute('href', '#fear-meter');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);

    const heroGridOffset = await page.locator('.title-hero__panel').evaluate((heroPanel) => {
        const root = document.querySelector<HTMLElement>('[data-public-app]');
        if (root === null) {
            throw new Error('The public site root is missing.');
        }

        const rootStyle = window.getComputedStyle(root);
        const rowSize = Number.parseFloat(rootStyle.getPropertyValue('--site-grid-row-size'));
        const originY = Number.parseFloat(rootStyle.getPropertyValue('--site-grid-origin-y'));
        const panelEnd = heroPanel.getBoundingClientRect().bottom + window.scrollY;
        const remainder = ((panelEnd - originY) % rowSize + rowSize) % rowSize;

        return Math.min(remainder, rowSize - remainder);
    });
    expect(heroGridOffset).toBeLessThanOrEqual(1);

    const dataGridOffsets = await page.locator('.title-data-section').evaluateAll((sections) => {
        const root = document.querySelector<HTMLElement>('[data-public-app]');
        if (root === null) {
            throw new Error('The public site root is missing.');
        }

        const rootStyle = window.getComputedStyle(root);
        const rowSize = Number.parseFloat(rootStyle.getPropertyValue('--site-grid-row-size'));
        const originY = Number.parseFloat(rootStyle.getPropertyValue('--site-grid-origin-y'));
        const distanceFromGrid = (position: number): number => {
            const remainder = ((position - originY) % rowSize + rowSize) % rowSize;

            return Math.min(remainder, rowSize - remainder);
        };

        return sections.flatMap((section) => {
            const rect = section.getBoundingClientRect();
            const header = section.querySelector<HTMLElement>(':scope > header');

            return [
                distanceFromGrid(rect.top + window.scrollY),
                distanceFromGrid(rect.bottom + window.scrollY),
                header === null ? Number.POSITIVE_INFINITY : distanceFromGrid(header.getBoundingClientRect().bottom + window.scrollY),
            ];
        });
    });
    dataGridOffsets.forEach((offset) => expect(offset).toBeLessThanOrEqual(1));

    const reviewPanelGridOffsets = await page.locator('.title-review-list > :is(article, .site-empty-state)').evaluateAll((panels) => {
        const root = document.querySelector<HTMLElement>('[data-public-app]');
        if (root === null) {
            throw new Error('The public site root is missing.');
        }

        const rootStyle = window.getComputedStyle(root);
        const rowSize = Number.parseFloat(rootStyle.getPropertyValue('--site-grid-row-size'));
        const originY = Number.parseFloat(rootStyle.getPropertyValue('--site-grid-origin-y'));

        return panels.map((panel) => {
            const panelEnd = panel.getBoundingClientRect().bottom + window.scrollY;
            const remainder = ((panelEnd - originY) % rowSize + rowSize) % rowSize;

            return Math.min(remainder, rowSize - remainder);
        });
    });
    expect(reviewPanelGridOffsets.length).toBeGreaterThan(0);
    reviewPanelGridOffsets.forEach((offset) => expect(offset).toBeLessThanOrEqual(1));

    const packageItems = page.locator('.title-package-item');
    expect(await packageItems.count()).toBeGreaterThan(0);
    await expect(packageItems.locator('.title-package-item__identity a')).toHaveCount(0);

    const packageShopLinks = packageItems.locator('.title-package-shops a');
    expect(await packageShopLinks.count()).toBeGreaterThan(0);
    await expect(packageShopLinks.first()).toHaveAttribute('target', '_blank');

    await page.locator('#packages').evaluate((section) => section.scrollIntoView());
    await expect(page.locator('.title-detail-menu a[href="#packages"]')).toHaveClass(/is-active/);

    const reviewsBoundary = await page.locator('#reviews').evaluate((section) => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;

        return sectionTop - window.innerHeight * 0.3;
    });
    await page.evaluate((scrollTop) => window.scrollTo(0, scrollTop - 1), reviewsBoundary);
    await expect(page.locator('.title-detail-menu a[href="#fear-meter"]')).toHaveClass(/is-active/);

    await page.evaluate((scrollTop) => window.scrollTo(0, scrollTop + 1), reviewsBoundary);
    await expect(page.locator('.title-detail-menu a[href="#reviews"]')).toHaveClass(/is-active/);

    await page.evaluate((scrollTop) => window.scrollTo(0, scrollTop - 1), reviewsBoundary);
    await expect(page.locator('.title-detail-menu a[href="#fear-meter"]')).toHaveClass(/is-active/);

    const relatedSection = page.locator('#related');
    if (await relatedSection.count() > 0) {
        await expect(page.locator('.title-detail-menu a[href="#related"]')).toContainText('04シリーズ');
    }

    const loginAction = page.locator('.title-login-action');
    await expect(loginAction).toContainText('ログインしてお気に入りに追加');
    expect(await loginAction.evaluate((action) => {
        const terminal = action.querySelector<HTMLElement>('.site-connection-terminal');
        if (terminal === null) {
            return false;
        }

        return terminal.getBoundingClientRect().left >= action.getBoundingClientRect().right;
    })).toBe(true);

    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(hasHorizontalOverflow).toBe(false);
});

test('販売パッケージはOGP画像と対応する販売先をパッケージ単位で表示する', async ({ page }) =>
{
    await page.goto('game/title/biohazard0');
    await expect(page.locator('[data-public-app]')).toHaveAttribute('data-page-ready', 'true');

    const packageItems = page.locator('.title-package-item');
    expect(await packageItems.count()).toBeGreaterThan(0);
    expect(await packageItems.locator('.title-package-item__visual img').count()).toBeGreaterThan(0);
    await expect(packageItems.locator('.title-package-item__identity a')).toHaveCount(0);

    const itemWithImage = packageItems.filter({ has: page.locator('.title-package-item__visual img') }).first();
    await expect(itemWithImage.locator('.title-package-item__identity h4')).toBeVisible();
    await expect(itemWithImage.locator('.title-package-item__release time')).toBeVisible();
    expect(await itemWithImage.locator('.title-package-shops a').count()).toBeGreaterThan(0);

    const footerGridOffset = await page.locator('.site-footer').evaluate((footer) => {
        const root = document.querySelector<HTMLElement>('[data-public-app]');
        if (root === null) {
            throw new Error('The public site root is missing.');
        }

        const rootStyle = window.getComputedStyle(root);
        const rowSize = Number.parseFloat(rootStyle.getPropertyValue('--site-grid-row-size'));
        const originY = Number.parseFloat(rootStyle.getPropertyValue('--site-grid-origin-y'));
        const footerStart = footer.getBoundingClientRect().top + window.scrollY;
        const remainder = ((footerStart - originY) % rowSize + rowSize) % rowSize;

        return Math.min(remainder, rowSize - remainder);
    });
    expect(footerGridOffset).toBeLessThanOrEqual(1);
});
