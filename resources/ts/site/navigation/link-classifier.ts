export interface LinkDescriptor
{
    href: string;
    rawHref: string | null;
    currentUrl: string;
    target?: string;
    rel?: string;
    navigationScope?: string;
    hasDownload?: boolean;
}

export interface LinkActivation
{
    button: number;
    defaultPrevented: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

/**
 * 通常の同一オリジンGETリンクだけを接続演出の対象にする。
 */
export class LinkClassifier
{
    public destinationForDescriptor(descriptor: LinkDescriptor): URL | null
    {
        const rawHref = descriptor.rawHref?.trim() ?? '';
        if (rawHref === '' || rawHref.startsWith('#')) {
            return null;
        }

        const target = descriptor.target?.trim().toLowerCase() ?? '';
        if ((target !== '' && target !== '_self') || descriptor.hasDownload) {
            return null;
        }

        const relTokens = (descriptor.rel ?? '')
            .toLowerCase()
            .split(/\s+/)
            .filter((token) => token !== '');
        if (relTokens.includes('external') || descriptor.navigationScope === 'external') {
            return null;
        }

        let current: URL;
        let destination: URL;
        try {
            current = new URL(descriptor.currentUrl);
            destination = new URL(descriptor.href, current);
        } catch {
            return null;
        }

        if (!['http:', 'https:'].includes(destination.protocol) || destination.origin !== current.origin) {
            return null;
        }

        if (this.isAdminPath(destination.pathname)) {
            return null;
        }

        const sameDocument = destination.pathname === current.pathname
            && destination.search === current.search;
        if (sameDocument && destination.hash !== '') {
            return null;
        }

        return destination;
    }

    public destinationForAnchor(
        anchor: HTMLAnchorElement,
        currentUrl: string = window.location.href,
    ): URL | null {
        return this.destinationForDescriptor({
            href: anchor.href,
            rawHref: anchor.getAttribute('href'),
            currentUrl,
            target: anchor.target,
            rel: anchor.rel,
            navigationScope: anchor.dataset.hgnScope,
            hasDownload: anchor.hasAttribute('download'),
        });
    }

    public destinationForActivation(
        anchor: HTMLAnchorElement,
        event: MouseEvent,
        currentUrl: string = window.location.href,
    ): URL | null {
        if (!this.isStandardActivation(event)) {
            return null;
        }

        return this.destinationForAnchor(anchor, currentUrl);
    }

    public isStandardActivation(activation: LinkActivation): boolean
    {
        return activation.button === 0
            && !activation.defaultPrevented
            && !activation.altKey
            && !activation.ctrlKey
            && !activation.metaKey
            && !activation.shiftKey;
    }

    private isAdminPath(pathname: string): boolean
    {
        return /(?:^|\/)admin(?:\/|$)/i.test(pathname);
    }
}
