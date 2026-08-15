import { ComponentManager } from '../component-manager';
import type { Disposable } from './core/disposable';
import { MotionPreference } from './core/motion-preference';
import { AmbientSignalController } from './grid/ambient-signal-controller';
import { GridPlaneController } from './grid/grid-plane-controller';
import { ConnectionTerminalController } from './navigation/connection-terminal-controller';
import { HandoffAnimationController } from './navigation/handoff-animation-controller';
import { HandoffRoutePlanner } from './navigation/handoff-route-planner';
import { LinkClassifier } from './navigation/link-classifier';
import { PageArrivalController } from './navigation/page-arrival-controller';
import { PageTransitionController } from './navigation/page-transition-controller';
import { ScrollFollowController } from './navigation/scroll-follow-controller';
import { TransitionStore } from './navigation/transition-store';
import { HomePageController } from './pages/home-page-controller';
import { LineupPageController } from './pages/lineup-page-controller';
import type { PageController } from './pages/page-controller';
import { TitleDetailPageController } from './pages/title-detail-page-controller';

type ComponentConfiguration = { [componentName: string]: any | null };

declare global {
    interface Window
    {
        components?: ComponentConfiguration;
    }
}

/**
 * 公開画面の構成ルート。
 *
 * 各ページは全文書ロード時に一度だけ start() される。旧ツリーとの移行期間中も、
 * ページ内コンポーネントの初回ライフサイクルはこのクラスが所有する。
 */
export class PublicSiteApp implements Disposable
{
    private readonly _root: HTMLElement;
    private readonly _componentManager: ComponentManager;
    private readonly _motionPreference: MotionPreference;
    private readonly _gridPlaneController: GridPlaneController;
    private readonly _ambientSignalController: AmbientSignalController;
    private readonly _connectionTerminalController: ConnectionTerminalController;
    private readonly _pageArrivalController: PageArrivalController;
    private readonly _pageTransitionController: PageTransitionController;
    private readonly _pageController: PageController | null;
    private _started: boolean = false;

    public constructor(root: HTMLElement)
    {
        this._root = root;
        this._componentManager = ComponentManager.getInstance();
        this._motionPreference = new MotionPreference();
        this._gridPlaneController = new GridPlaneController(root);
        this._ambientSignalController = new AmbientSignalController(
            root,
            this._gridPlaneController,
            this._motionPreference,
        );
        const linkClassifier = new LinkClassifier();
        const transitionStore = this.createTransitionStore();
        this._connectionTerminalController = new ConnectionTerminalController(
            root,
            this._gridPlaneController,
            linkClassifier,
        );
        this._pageArrivalController = new PageArrivalController(
            root,
            this._motionPreference,
            transitionStore,
        );
        this._pageTransitionController = new PageTransitionController(
            root,
            this._motionPreference,
            this._gridPlaneController,
            linkClassifier,
            this._connectionTerminalController,
            new HandoffRoutePlanner(),
            new HandoffAnimationController(root),
            new ScrollFollowController(this._motionPreference),
            transitionStore,
        );
        this._pageController = this.createPageController();
    }

    public start(): void
    {
        if (this._started) {
            return;
        }

        this._started = true;
        this._motionPreference.start();
        this._gridPlaneController.start();
        this._ambientSignalController.start();
        this._connectionTerminalController.start();
        this._pageTransitionController.start();
        this._componentManager.initializeDocument(window.components ?? {});
        window.components = {};
        this._pageController?.start();
        this._pageArrivalController.start();
    }

    public dispose(): void
    {
        if (!this._started) {
            return;
        }

        this._pageTransitionController.dispose();
        this._pageArrivalController.dispose();
        this._pageController?.dispose();
        this._componentManager.disposeComponents();
        this._connectionTerminalController.dispose();
        this._ambientSignalController.dispose();
        this._gridPlaneController.dispose();
        this._motionPreference.dispose();
        this._started = false;
    }

    private createTransitionStore(): TransitionStore
    {
        try {
            return new TransitionStore(window.sessionStorage);
        } catch {
            return new TransitionStore(null);
        }
    }

    private createPageController(): PageController | null
    {
        switch (this._root.dataset.pageKind) {
            case 'root':
                return new HomePageController(
                    this._root,
                    this._motionPreference,
                    this._gridPlaneController,
                );

            case 'game-lineup':
                return new LineupPageController(this._root, this._motionPreference);

            case 'game-title-detail':
                return new TitleDetailPageController(this._root, this._motionPreference);

            default:
                return null;
        }
    }
}
