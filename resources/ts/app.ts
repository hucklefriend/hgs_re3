import { PublicSiteApp } from './site/public-site-app';

let publicSiteApp: PublicSiteApp | null = null;

const startPublicSite = (): void => {
    const root = document.querySelector<HTMLElement>('[data-public-app]');
    if (!root || publicSiteApp) {
        return;
    }

    publicSiteApp = new PublicSiteApp(root);
    publicSiteApp.start();
};

window.addEventListener('load', startPublicSite, { once: true });
window.addEventListener('pagehide', (event: PageTransitionEvent) => {
    if (event.persisted) {
        return;
    }

    publicSiteApp?.dispose();
    publicSiteApp = null;
});
