import type { Disposable } from '../core/disposable';

const ACTIVATION_POINT_RATIO = 0.3;

export function resolveActiveSectionIndex(
    sectionTops: number[],
    activationPoint: number,
    isPageEnd: boolean,
): number
{
    if (sectionTops.length === 0) {
        return -1;
    }

    if (isPageEnd) {
        return sectionTops.length - 1;
    }

    let activeIndex = 0;
    sectionTops.forEach((sectionTop, index) => {
        if (sectionTop <= activationPoint) {
            activeIndex = index;
        }
    });

    return activeIndex;
}

export class SectionSpy implements Disposable
{
    private readonly root: HTMLElement;
    private readonly links: HTMLAnchorElement[];
    private readonly sections: HTMLElement[];
    private animationFrameId: number | null = null;

    public constructor(root: HTMLElement)
    {
        this.root = root;
        this.links = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-section-spy] a[href^="#"]'));
        this.sections = this.links
            .map((link) => {
                const id = link.hash.slice(1);
                return id ? document.getElementById(id) : null;
            })
            .filter((section): section is HTMLElement => section !== null);
    }

    public start(): void
    {
        if (this.sections.length === 0) {
            return;
        }

        window.addEventListener('scroll', this.requestSync, { passive: true });
        window.addEventListener('resize', this.requestSync);
        this.sync();
    }

    public dispose(): void
    {
        window.removeEventListener('scroll', this.requestSync);
        window.removeEventListener('resize', this.requestSync);
        if (this.animationFrameId !== null) {
            window.cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    private readonly requestSync = (): void =>
    {
        if (this.animationFrameId !== null) {
            return;
        }

        this.animationFrameId = window.requestAnimationFrame(() => {
            this.animationFrameId = null;
            this.sync();
        });
    };

    private sync(): void
    {
        const activationPoint = window.innerHeight * ACTIVATION_POINT_RATIO;
        const sectionTops = this.sections.map((section) => section.getBoundingClientRect().top);
        const pageEnd = window.scrollY > 0
            && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
        const activeIndex = resolveActiveSectionIndex(sectionTops, activationPoint, pageEnd);
        const activeSection = this.sections[activeIndex];

        this.links.forEach((link) => {
            const selected = activeSection !== undefined && link.hash === `#${activeSection.id}`;
            link.classList.toggle('is-active', selected);
            if (selected) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }
}
