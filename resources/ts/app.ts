import { HgnTree } from './hgn-tree';
import { PublicSiteApp } from './site/public-site-app';

declare global {
    interface Window {
        hgn: HgnTree;
    }
}

let publicSiteApp: PublicSiteApp | null = null;

const startPublicSite = (): void => {
    const root = document.querySelector<HTMLElement>('[data-public-app]');
    if (!root || publicSiteApp) {
        return;
    }

    publicSiteApp = new PublicSiteApp(root);
    publicSiteApp.start();

    // Phase 4 で通常遷移へ切り替えるまで、現行ツリー表示を互換層として起動する。
    window.hgn = HgnTree.getInstance();
    window.hgn.start();
};

window.addEventListener('load', startPublicSite, { once: true });
window.addEventListener('pagehide', (event: PageTransitionEvent) => {
    if (event.persisted) {
        return;
    }

    publicSiteApp?.dispose();
    publicSiteApp = null;
});
