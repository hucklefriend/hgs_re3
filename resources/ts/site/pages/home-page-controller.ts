import type { GridPlaneController } from '../grid/grid-plane-controller';
import { BasePageController } from './page-controller';

export class HomePageController extends BasePageController
{
    private readonly _gridPlaneController: GridPlaneController;
    private readonly _commandMenu: HTMLElement | null;
    private readonly _firstCommandLink: HTMLElement | null;
    private readonly _transmissionList: HTMLElement | null;
    private readonly _transmissionRows: HTMLElement[];
    private readonly _transmissionImages: HTMLImageElement[];
    private readonly _footer: HTMLElement | null;
    private _removeMetricsListener: (() => void) | null = null;

    public constructor(
        root: HTMLElement,
        gridPlaneController: GridPlaneController,
    )
    {
        super(root);
        this._gridPlaneController = gridPlaneController;
        this._commandMenu = root.querySelector<HTMLElement>('.home-command-menu');
        this._firstCommandLink = this._commandMenu?.querySelector<HTMLElement>('.home-command-link') ?? null;
        this._transmissionList = root.querySelector<HTMLElement>('.home-transmission-list');
        this._transmissionRows = Array.from(root.querySelectorAll<HTMLElement>('.home-transmission-row'));
        this._transmissionImages = Array.from(root.querySelectorAll<HTMLImageElement>('.home-transmission-row__image'));
        this._footer = root.querySelector<HTMLElement>('.site-footer');
    }

    protected startPage(): void
    {
        this._removeMetricsListener = this._gridPlaneController.onMetricsChange(this.syncGridAlignment);
        this._transmissionImages.forEach((image) => image.addEventListener('load', this.syncGridAlignment));
        this.syncGridAlignment();
    }

    protected disposePage(): void
    {
        this._removeMetricsListener?.();
        this._removeMetricsListener = null;
        this._transmissionImages.forEach((image) => image.removeEventListener('load', this.syncGridAlignment));
        this.root.style.removeProperty('--home-content-grid-offset');
        this.root.style.removeProperty('--home-transmission-grid-offset');
        this.root.style.removeProperty('--home-footer-grid-offset');
        this._transmissionRows.forEach((row) => row.style.removeProperty('block-size'));
    }

    private readonly syncGridAlignment = (): void =>
    {
        this.syncCommandMenuAlignment();
        this.syncTransmissionAlignment();
        this.syncFooterAlignment();
    };

    private syncCommandMenuAlignment(): void
    {
        if (this._commandMenu === null || this._firstCommandLink === null) {
            return;
        }

        this.root.style.setProperty('--home-content-grid-offset', '0px');
        const rect = this._firstCommandLink.getBoundingClientRect();
        const firstLinkOrigin = {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
        };
        const snappedOrigin = this._gridPlaneController.metrics.snapToIntersection(firstLinkOrigin);
        const offset = snappedOrigin.y - firstLinkOrigin.y;

        this.root.style.setProperty('--home-content-grid-offset', `${offset}px`);
    }

    private syncTransmissionAlignment(): void
    {
        if (this._transmissionList === null) {
            return;
        }

        this.root.style.setProperty('--home-transmission-grid-offset', '0px');
        this._transmissionRows.forEach((row) => row.style.removeProperty('block-size'));

        const rowHeight = this._gridPlaneController.metrics.rowHeight;
        this._transmissionRows.forEach((row) => {
            const currentHeight = row.getBoundingClientRect().height;
            const gridRows = Math.ceil(currentHeight / rowHeight);
            row.style.setProperty('block-size', `${gridRows * rowHeight}px`);
        });

        const rect = this._transmissionList.getBoundingClientRect();
        const listOrigin = {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
        };
        const snappedOrigin = this._gridPlaneController.metrics.snapToIntersection(listOrigin);
        const offset = snappedOrigin.y - listOrigin.y;

        this.root.style.setProperty('--home-transmission-grid-offset', `${offset}px`);
    }

    private syncFooterAlignment(): void
    {
        if (this._footer === null) {
            return;
        }

        this.root.style.setProperty('--home-footer-grid-offset', '0px');
        const rect = this._footer.getBoundingClientRect();
        const footerOrigin = {
            x: this._gridPlaneController.metrics.origin.x,
            y: rect.top + window.scrollY,
        };
        const snappedOrigin = this._gridPlaneController.metrics.snapToIntersection(footerOrigin);
        let offset = snappedOrigin.y - footerOrigin.y;

        if (offset < -0.5) {
            offset += this._gridPlaneController.metrics.rowHeight;
        }

        if (Math.abs(offset) <= 0.5) {
            offset = 0;
        }

        this.root.style.setProperty('--home-footer-grid-offset', `${offset}px`);
    }
}
