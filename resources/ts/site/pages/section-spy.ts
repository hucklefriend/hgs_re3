import type { Disposable } from '../core/disposable';

export class SectionSpy implements Disposable
{
    private readonly root: HTMLElement;
    private readonly links: HTMLAnchorElement[];
    private observer: IntersectionObserver | null = null;

    public constructor(root: HTMLElement)
    {
        this.root = root;
        this.links = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-section-spy] a[href^="#"]'));
    }

    public start(): void
    {
        if (this.links.length === 0 || !('IntersectionObserver' in window)) {
            return;
        }

        const sections = this.links
            .map((link) => {
                const id = link.hash.slice(1);
                return id ? document.getElementById(id) : null;
            })
            .filter((section): section is HTMLElement => section !== null);

        this.observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

            if (!visible) {
                return;
            }

            this.links.forEach((link) => {
                const selected = link.hash === `#${visible.target.id}`;
                link.classList.toggle('is-active', selected);
                if (selected) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }, {
            rootMargin: '-15% 0px -58%',
            threshold: [0.08, 0.3, 0.6],
        });

        sections.forEach((section) => this.observer?.observe(section));
    }

    public dispose(): void
    {
        this.observer?.disconnect();
        this.observer = null;
    }
}
