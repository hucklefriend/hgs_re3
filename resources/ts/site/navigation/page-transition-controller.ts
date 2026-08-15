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

/**
 * リンククリックから通常の全文書遷移までを一度だけ実行する。
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
        window.addEventListener('pageshow', this.handlePageShow);
    }

    public dispose(): void
    {
        if (!this._started) {
            return;
        }

        document.removeEventListener('click', this.handleClick);
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
        this._root.querySelectorAll<HTMLElement>('[data-transition-muted]').forEach((element) => {
            element.removeAttribute('data-transition-muted');
        });
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
        void this.startTransition(anchor, destination);
    };

    private readonly handlePageShow = (event: PageTransitionEvent): void =>
    {
        if (event.persisted) {
            this.reset();
        }
    };

    private async startTransition(anchor: HTMLAnchorElement, destination: URL): Promise<void>
    {
        const generation = this._generation;
        let safetyTimerId: number | null = null;
        let navigationStarted = false;
        const beginNavigation = (): void => {
            if (navigationStarted || this._generation !== generation) {
                return;
            }

            window.location.assign(destination.href);
            navigationStarted = true;
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

            const origin = this._terminalController.documentPointFor(anchor);
            const route = this._routePlanner.plan(origin, this._gridPlaneController.metrics);
            const headerHeight = this._root.querySelector<HTMLElement>('[data-site-header]')?.offsetHeight ?? 0;
            this._terminalController.setConnecting(anchor, true);
            this._root.dataset.pageDeparting = 'true';
            this.muteNonSelectedElements(anchor);
            this._scrollFollowController.start(origin, headerHeight);

            const safetyTimeout = new Promise<void>((resolve) => {
                safetyTimerId = window.setTimeout(resolve, NAVIGATION_SAFETY_TIMEOUT);
            });
            await Promise.race([
                this._animationController.play(
                    route,
                    (point) => this._scrollFollowController.update(point),
                    beginNavigation,
                ),
                safetyTimeout,
            ]);
        } catch {
            // 演出に失敗しても finally で通常遷移する。
        } finally {
            if (safetyTimerId !== null) {
                window.clearTimeout(safetyTimerId);
            }
            this._animationController.cancel();
            this._scrollFollowController.dispose();
            beginNavigation();
        }
    }

    private muteNonSelectedElements(anchor: HTMLAnchorElement): void
    {
        const selectors = [
            '.site-header__nav a',
            '.site-breadcrumb',
            '#current-node > .node-head',
            '#current-node > .node-content',
            '#current-node section.node',
            '#current-node form',
            '.site-footer__grid > *',
        ];

        this._root.querySelectorAll<HTMLElement>(selectors.join(',')).forEach((element) => {
            if (element === anchor || element.contains(anchor)) {
                return;
            }

            element.setAttribute('data-transition-muted', '');
        });
    }
}
