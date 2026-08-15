import type { MotionPreference } from '../core/motion-preference';
import type { GridPlaneController } from '../grid/grid-plane-controller';
import { RevealingPageController } from './page-controller';

export class HomePageController extends RevealingPageController
{
    private readonly _gridPlaneController: GridPlaneController;
    private readonly _commandMenu: HTMLElement | null;
    private readonly _firstCommandLink: HTMLElement | null;
    private _removeMetricsListener: (() => void) | null = null;

    public constructor(
        root: HTMLElement,
        motionPreference: MotionPreference,
        gridPlaneController: GridPlaneController,
    )
    {
        super(root, motionPreference);
        this._gridPlaneController = gridPlaneController;
        this._commandMenu = root.querySelector<HTMLElement>('.home-command-menu');
        this._firstCommandLink = this._commandMenu?.querySelector<HTMLElement>('.home-command-link') ?? null;
    }

    protected startPage(): void
    {
        this._removeMetricsListener = this._gridPlaneController.onMetricsChange(this.syncGridAlignment);
        this.syncGridAlignment();
    }

    protected disposePage(): void
    {
        this._removeMetricsListener?.();
        this._removeMetricsListener = null;
        this.root.style.removeProperty('--home-content-grid-offset');
    }

    private readonly syncGridAlignment = (): void =>
    {
        if (this._commandMenu === null || this._firstCommandLink === null) {
            return;
        }

        this.root.style.setProperty('--home-content-grid-offset', '0px');
        // 入場アニメーションの移動量を除き、表示完了後の位置をグリッドへ揃える。
        const rect = this._firstCommandLink.getBoundingClientRect();
        const transform = window.getComputedStyle(this._commandMenu).transform;
        let revealOffsetY = 0;
        if (transform !== 'none') {
            revealOffsetY = new DOMMatrixReadOnly(transform).m42;
        }
        const firstLinkOrigin = {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY - revealOffsetY,
        };
        const snappedOrigin = this._gridPlaneController.metrics.snapToIntersection(firstLinkOrigin);
        const offset = snappedOrigin.y - firstLinkOrigin.y;

        this.root.style.setProperty('--home-content-grid-offset', `${offset}px`);
    };
}
