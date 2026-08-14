import type { Disposable } from '../core/disposable';
import type { MotionPreference } from '../core/motion-preference';

export interface PageController extends Disposable
{
    start(): void;
}

export abstract class RevealingPageController implements PageController
{
    protected readonly root: HTMLElement;
    private readonly motionPreference: MotionPreference;
    private observer: IntersectionObserver | null = null;
    private started: boolean = false;

    protected constructor(root: HTMLElement, motionPreference: MotionPreference)
    {
        this.root = root;
        this.motionPreference = motionPreference;
    }

    public start(): void
    {
        if (this.started) {
            return;
        }

        this.started = true;
        this.startPage();
        this.startReveal();
    }

    public dispose(): void
    {
        if (!this.started) {
            return;
        }

        this.observer?.disconnect();
        this.observer = null;
        this.disposePage();
        this.started = false;
    }

    protected startPage(): void
    {
    }

    protected disposePage(): void
    {
    }

    private startReveal(): void
    {
        const items = Array.from(this.root.querySelectorAll<HTMLElement>('[data-page-reveal]'));
        if (items.length === 0) {
            return;
        }

        if (!this.motionPreference.canAnimate || !('IntersectionObserver' in window)) {
            items.forEach((item) => item.classList.add('is-visible'));
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');
                this.observer?.unobserve(entry.target);
            });
        }, { threshold: 0.1 });

        items.forEach((item) => this.observer?.observe(item));
    }
}
