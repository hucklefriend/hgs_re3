import { describe, expect, it } from 'vitest';
import { LinkClassifier, type LinkActivation, type LinkDescriptor } from './link-classifier';

const classifier = new LinkClassifier();
const currentUrl = 'https://horrorgame.net/game/lineup?page=2';
const baseDescriptor: LinkDescriptor = {
    href: 'https://horrorgame.net/game/title/identity-v',
    rawHref: '/game/title/identity-v',
    currentUrl,
};
const baseActivation: LinkActivation = {
    button: 0,
    defaultPrevented: false,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
};

describe('LinkClassifier', () => {
    it('accepts an ordinary same-origin page link', () => {
        expect(classifier.destinationForDescriptor(baseDescriptor)?.href)
            .toBe('https://horrorgame.net/game/title/identity-v');
        expect(classifier.isStandardActivation(baseActivation)).toBe(true);
    });

    it.each([
        { href: 'https://example.com/game', rawHref: 'https://example.com/game' },
        { href: 'mailto:test@example.com', rawHref: 'mailto:test@example.com' },
        { href: 'tel:0000000000', rawHref: 'tel:0000000000' },
        { href: 'javascript:void(0)', rawHref: 'javascript:void(0)' },
    ])('rejects an external or non-document URL: $rawHref', ({ href, rawHref }) => {
        expect(classifier.destinationForDescriptor({ ...baseDescriptor, href, rawHref })).toBeNull();
    });

    it('rejects hash-only and same-document hash links', () => {
        expect(classifier.destinationForDescriptor({
            ...baseDescriptor,
            href: `${currentUrl}#results`,
            rawHref: '#results',
        })).toBeNull();
        expect(classifier.destinationForDescriptor({
            ...baseDescriptor,
            href: `${currentUrl}#results`,
            rawHref: `${currentUrl}#results`,
        })).toBeNull();
    });

    it.each([
        { target: '_blank' },
        { target: 'preview' },
        { hasDownload: true },
        { rel: 'noopener external' },
        { navigationScope: 'external' },
    ])('rejects links with browser-specific behavior', (attributes) => {
        expect(classifier.destinationForDescriptor({ ...baseDescriptor, ...attributes })).toBeNull();
    });

    it.each([
        'https://horrorgame.net/admin',
        'https://horrorgame.net/admin/game/title',
        'https://horrorgame.net/hgs_re3/public/admin/login',
    ])('rejects an admin URL: %s', (href) => {
        expect(classifier.destinationForDescriptor({ ...baseDescriptor, href, rawHref: href })).toBeNull();
    });

    it.each([
        { ctrlKey: true },
        { metaKey: true },
        { shiftKey: true },
        { altKey: true },
        { button: 1 },
        { defaultPrevented: true },
    ])('rejects modified or handled activations', (activation) => {
        expect(classifier.isStandardActivation({ ...baseActivation, ...activation })).toBe(false);
    });
});
