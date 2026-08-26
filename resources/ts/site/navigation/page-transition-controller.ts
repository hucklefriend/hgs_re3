import type { Disposable } from '../core/disposable';
import type { MotionPreference } from '../core/motion-preference';
import type { GridPlaneController } from '../grid/grid-plane-controller';
import type { ConnectionTerminalController } from './connection-terminal-controller';
import type { HandoffAnimationController } from './handoff-animation-controller';
import type { HandoffRoutePlanner } from './handoff-route-planner';
import type { LinkClassifier } from './link-classifier';
import type { ScrollFollowController } from './scroll-follow-controller';
import type { TransitionStore } from './transition-store';

const NAVIGATION_SAFETY_TIMEOUT = 1_300;
const DEPARTURE_MASK_GAP = 96;
const DEPARTURE_MASK_INITIAL_LAG = 64;
const DEPARTURE_MASK_FOLLOW_RATE = 0.14;
const DEPARTURE_MASK_COMPLETION_DURATION = 260;

/**
 * リンクまたはフォーム操作から通常の全文書遷移までを一度だけ実行する。
 */
export class PageTransitionController implements Disposable
{
    private readonly _root: HTMLElement;
    private readonly _motionPreference: MotionPreference;
    private readonly _gridPlaneController: GridPlaneController;
    private readonly _linkClassifier: LinkClassifier;
    private readonly _terminalController: ConnectionTerminalController;
    private readonly _routePlanner: HandoffRoutePlanner;
    private readonly _animationController: HandoffAnimationController;
    private readonly _scrollFollowController: ScrollFollowController;
    private readonly _transitionStore: TransitionStore;
    private _locked: boolean = false;
    private _generation: number = 0;
    private _started: boolean = false;
    private _departureMaskTop: number | null = null;
    private _departureMaskAnimationFrameId: number | null = null;
    private _departureMaskAnimationResolve: (() => void) | null = null;
    private readonly _resumingForms: WeakSet<HTMLFormElement> = new WeakSet();

    public constructor(
        root: HTMLElement,
        motionPreference: MotionPreference,
        gridPlaneController: GridPlaneController,
        linkClassifier: LinkClassifier,
        terminalController: ConnectionTerminalController,
        routePlanner: HandoffRoutePlanner,
        animationController: HandoffAnimationController,
        scrollFollowController: ScrollFollowController,
        transitionStore: TransitionStore,
    ) {
        this._root = root;
        this._motionPreference = motionPreference;
        this._gridPlaneController = gridPlaneController;
        this._linkClassifier = linkClassifier;
        this._terminalController = terminalController;
        this._routePlanner = routePlanner;
        this._animationController = animationController;
        this._scrollFollowController = scrollFollowController;
        this._transitionStore = transitionStore;
    }

    public start(): void
    {
        if (this._started) {
            return;
        }

        this._started = true;
        document.addEventListener('click', this.handleClick);
        document.addEventListener('submit', this.handleSubmit);
        window.addEventListener('pageshow', this.handlePageShow);
    }

    public dispose(): void
    {
        if (!this._started) {
            return;
        }

        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('submit', this.handleSubmit);
        window.removeEventListener('pageshow', this.handlePageShow);
        this.reset();
        this._started = false;
    }

    public reset(): void
    {
        this._generation += 1;
        this._locked = false;
        this._animationController.cancel();
        this._scrollFollowController.dispose();
        this._terminalController.reset();
        delete this._root.dataset.pageDeparting;
        this.cancelDepartureMaskAnimation();
        this._departureMaskTop = null;
        this._root.style.removeProperty('--site-departure-mask-top');
    }

    private readonly handleClick = (event: MouseEvent): void =>
    {
        if (!(event.target instanceof Element)) {
            return;
        }

        const anchor = event.target.closest<HTMLAnchorElement>('a[href]');
        if (!anchor || !this._root.contains(anchor)) {
            return;
        }

        const destination = this._linkClassifier.destinationForActivation(anchor, event);
        if (!destination) {
            return;
        }

        event.preventDefault();
        if (this._locked) {
            return;
        }

        this._locked = true;
        void this.startTransition(anchor, destination, () => window.location.assign(destination.href));
    };

    private readonly handleSubmit = (event: SubmitEvent): void =>
    {
        if (!(event.target instanceof HTMLFormElement)
            || event.defaultPrevented
            || this._resumingForms.has(event.target)
            || !this._root.contains(event.target)) {
            return;
        }

        const form = event.target;
        const submitter = event.submitter;
        if (!(submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement)
            || !submitter.classList.contains('has-site-connection-terminal')) {
            return;
        }

        const target = form.target.trim().toLowerCase();
        if ((target !== '' && target !== '_self') || form.method.toLowerCase() === 'dialog') {
            return;
        }

        let destination: URL;
        try {
            destination = new URL(form.action, window.location.href);
        } catch {
            return;
        }
        if (destination.origin !== window.location.origin) {
            return;
        }

        event.preventDefault();
        if (this._locked) {
            return;
        }

        this._locked = true;
        void this.startTransition(submitter, destination, () => {
            this._resumingForms.add(form);
            try {
                form.requestSubmit(submitter);
            } finally {
                this._resumingForms.delete(form);
            }
        });
    };

    private readonly handlePageShow = (event: PageTransitionEvent): void =>
    {
        if (event.persisted) {
            this.reset();
        }
    };

    private async startTransition(
        originElement: HTMLElement,
        destination: URL,
        beginNavigation: () => void,
    ): Promise<void>
    {
        const generation = this._generation;
        let safetyTimerId: number | null = null;
        let navigationStarted = false;
        let departureMaskCompletion: Promise<void> | null = null;
        const navigateOnce = (): void => {
            if (navigationStarted || this._generation !== generation) {
                return;
            }

            navigationStarted = true;
            beginNavigation();
        };

        try {
            this._transitionStore.save({
                from: window.location.href,
                to: destination.href,
                startedAt: Date.now(),
            });

            if (!this._motionPreference.canAnimate) {
                return;
            }

            const origin = this._terminalController.documentPointFor(originElement);
            const route = this._routePlanner.plan(origin, this._gridPlaneController.metrics);
            const header = this._root.querySelector<HTMLElement>('[data-site-header]');
            const headerHeight = header?.offsetHeight ?? 0;
            let headerBottom = headerHeight;
            if (header !== null) {
                headerBottom = header.getBoundingClientRect().bottom + window.scrollY;
            }
            const startDepartureMaskCompletion = (): void => {
                if (departureMaskCompletion !== null) {
                    return;
                }

                departureMaskCompletion = this.completeDepartureMask(headerBottom, generation);
            };
            this._terminalController.setConnecting(originElement, true);
            this.startDepartureMask(origin);
            this._root.dataset.pageDeparting = 'true';
            this._scrollFollowController.start(origin, headerHeight);

            const safetyTimeout = new Promise<'safety-timeout'>((resolve) => {
                safetyTimerId = window.setTimeout(() => resolve('safety-timeout'), NAVIGATION_SAFETY_TIMEOUT);
            });
            const animationResult = await Promise.race([
                this._animationController.play(
                    route,
                    (point) => {
                        this.updateDepartureMask(point);
                        this._scrollFollowController.update(point);
                    },
                    startDepartureMaskCompletion,
                ),
                safetyTimeout,
            ]);
            if (animationResult === 'safety-timeout') {
                this._animationController.cancel();
            }
            startDepartureMaskCompletion();
            if (departureMaskCompletion !== null) {
                await departureMaskCompletion;
            }
        } catch {
            // 演出に失敗しても finally で通常遷移する。
        } finally {
            if (safetyTimerId !== null) {
                window.clearTimeout(safetyTimerId);
            }
            this._animationController.cancel();
            this._scrollFollowController.dispose();
            navigateOnce();
        }
    }

    private startDepartureMask(origin: { y: number }): void
    {
        this._departureMaskTop = origin.y + DEPARTURE_MASK_GAP + DEPARTURE_MASK_INITIAL_LAG;
        this.renderDepartureMask();
    }

    private updateDepartureMask(point: { y: number }): void
    {
        if (this._departureMaskTop === null) {
            return;
        }

        const closestAllowedTop = point.y + DEPARTURE_MASK_GAP;
        if (closestAllowedTop >= this._departureMaskTop) {
            this._departureMaskTop = closestAllowedTop;
        } else {
            const distance = this._departureMaskTop - closestAllowedTop;
            this._departureMaskTop -= distance * DEPARTURE_MASK_FOLLOW_RATE;
        }

        this.renderDepartureMask();
    }

    private renderDepartureMask(): void
    {
        if (this._departureMaskTop === null) {
            return;
        }

        this._root.style.setProperty('--site-departure-mask-top', `${this._departureMaskTop}px`);
    }

    private completeDepartureMask(targetTop: number, generation: number): Promise<void>
    {
        if (this._departureMaskTop === null) {
            return Promise.resolve();
        }

        this.cancelDepartureMaskAnimation();
        const startTop = this._departureMaskTop;
        const endTop = Math.max(0, Math.min(startTop, targetTop));
        if (startTop === endTop) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const startedAt = performance.now();
            this._departureMaskAnimationResolve = resolve;

            const tick = (timestamp: number): void => {
                this._departureMaskAnimationFrameId = null;
                if (generation !== this._generation) {
                    this.finishDepartureMaskAnimation(resolve);
                    return;
                }

                const progress = Math.min(1, Math.max(0,
                    (timestamp - startedAt) / DEPARTURE_MASK_COMPLETION_DURATION,
                ));
                const eased = 1 - Math.pow(1 - progress, 3);
                this._departureMaskTop = startTop + ((endTop - startTop) * eased);
                this.renderDepartureMask();

                if (progress >= 1) {
                    this.finishDepartureMaskAnimation(resolve);
                    return;
                }

                this._departureMaskAnimationFrameId = window.requestAnimationFrame(tick);
            };

            this._departureMaskAnimationFrameId = window.requestAnimationFrame(tick);
        });
    }

    private cancelDepartureMaskAnimation(): void
    {
        if (this._departureMaskAnimationFrameId !== null) {
            window.cancelAnimationFrame(this._departureMaskAnimationFrameId);
            this._departureMaskAnimationFrameId = null;
        }

        const resolve = this._departureMaskAnimationResolve;
        this._departureMaskAnimationResolve = null;
        resolve?.();
    }

    private finishDepartureMaskAnimation(resolve: () => void): void
    {
        if (this._departureMaskAnimationResolve !== resolve) {
            return;
        }

        this._departureMaskAnimationResolve = null;
        resolve();
    }

}
