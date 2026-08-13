import type { Disposable } from '../core/disposable';
import type { MotionPreference } from '../core/motion-preference';
import type { TransitionStore } from './transition-store';

const HANDOFF_ARRIVAL_DURATION = 620;
const DIRECT_ARRIVAL_DURATION = 420;

/**
 * 全文書ロード後の表示復帰と、BFCache復元時の状態初期化を担当する。
 */
export class PageArrivalController implements Disposable
{
    private readonly _root: HTMLElement;
    private readonly _motionPreference: MotionPreference;
    private readonly _transitionStore: TransitionStore;
    private _animationFrameId: number | null = null;
    private _timerId: number | null = null;
    private _started: boolean = false;

    public constructor(
        root: HTMLElement,
        motionPreference: MotionPreference,
        transitionStore: TransitionStore,
    ) {
        this._root = root;
        this._motionPreference = motionPreference;
        this._transitionStore = transitionStore;
    }

    public start(): void
    {
        if (this._started) {
            return;
        }

        this._started = true;
        window.addEventListener('pageshow', this.handlePageShow);

        try {
            const transition = this._transitionStore.consume(window.location.href);
            this.runArrival(transition !== null);
        } catch {
            this.makeReady();
        }
    }

    public dispose(): void
    {
        if (!this._started) {
            return;
        }

        window.removeEventListener('pageshow', this.handlePageShow);
        this.clearScheduledWork();
        this.resetVisualState();
        this._started = false;
    }

    private readonly handlePageShow = (event: PageTransitionEvent): void =>
    {
        if (!event.persisted) {
            return;
        }

        this.clearScheduledWork();
        this.resetVisualState();
        this.makeReady();
    };

    private runArrival(hasTransition: boolean): void
    {
        this.resetVisualState();

        if (!this._motionPreference.canAnimate) {
            this.makeReady();
            return;
        }

        this._root.dataset.pageArriving = 'true';
        this._root.dataset.arrivalKind = hasTransition ? 'handoff' : 'direct';
        const duration = hasTransition ? HANDOFF_ARRIVAL_DURATION : DIRECT_ARRIVAL_DURATION;

        this._animationFrameId = window.requestAnimationFrame(() => {
            this._animationFrameId = null;
            this.makeReady();
            this._timerId = window.setTimeout(() => {
                this._timerId = null;
                delete this._root.dataset.pageArriving;
                delete this._root.dataset.arrivalKind;
            }, duration);
        });
    }

    private makeReady(): void
    {
        this._root.dataset.pageReady = 'true';
    }

    private resetVisualState(): void
    {
        delete this._root.dataset.pageDeparting;
        delete this._root.dataset.pageArriving;
        delete this._root.dataset.arrivalKind;
        this._root.querySelectorAll<HTMLElement>('[data-transition-muted]').forEach((element) => {
            element.removeAttribute('data-transition-muted');
        });
        this._root.querySelector<HTMLElement>('[data-header-node]')?.removeAttribute('data-receiving');
    }

    private clearScheduledWork(): void
    {
        if (this._animationFrameId !== null) {
            window.cancelAnimationFrame(this._animationFrameId);
            this._animationFrameId = null;
        }
        if (this._timerId !== null) {
            window.clearTimeout(this._timerId);
            this._timerId = null;
        }
    }
}
