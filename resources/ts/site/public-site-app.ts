import { ComponentManager } from '../component-manager';
import type { Disposable } from './core/disposable';
import { MotionPreference } from './core/motion-preference';
import { PageRevealController } from './core/page-reveal-controller';
import { GridPlaneController } from './grid/grid-plane-controller';

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
    private readonly _pageRevealController: PageRevealController;
    private readonly _gridPlaneController: GridPlaneController;
    private _started: boolean = false;

    public constructor(root: HTMLElement)
    {
        this._root = root;
        this._componentManager = ComponentManager.getInstance();
        this._motionPreference = new MotionPreference();
        this._pageRevealController = new PageRevealController(root, this._motionPreference);
        this._gridPlaneController = new GridPlaneController(root);
    }

    public start(): void
    {
        if (this._started) {
            return;
        }

        this._started = true;
        this._motionPreference.start();
        this._gridPlaneController.start();
        this._componentManager.initializeDocument(window.components ?? {});
        window.components = {};
        this._pageRevealController.start();
    }

    public dispose(): void
    {
        if (!this._started) {
            return;
        }

        this._pageRevealController.dispose();
        this._componentManager.disposeComponents();
        this._gridPlaneController.dispose();
        this._motionPreference.dispose();
        this._started = false;
    }
}
