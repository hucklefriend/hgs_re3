import type { GridPlaneController } from '../grid/grid-plane-controller';
import { BasePageController } from './page-controller';

export class StandardPageController extends BasePageController
{
    private readonly gridPlaneController: GridPlaneController;
    private readonly header: HTMLElement | null;
    private readonly panels: HTMLElement[];
    private readonly alignedLists: HTMLElement[];
    private readonly gridBlocks: HTMLElement[];
    private readonly transmissionRows: HTMLElement[];
    private readonly transmissionImages: HTMLImageElement[];
    private removeMetricsListener: (() => void) | null = null;

    public constructor(
        root: HTMLElement,
        gridPlaneController: GridPlaneController,
    )
    {
        super(root);
        this.gridPlaneController = gridPlaneController;
        this.header = root.querySelector<HTMLElement>('.site-standard-page__header');
        this.panels = Array.from(root.querySelectorAll<HTMLElement>(
            '#current-node > #current-node-content, #current-node > section.node, #current-node > .lineup-franchise',
        ));
        this.alignedLists = Array.from(root.querySelectorAll<HTMLElement>('[data-grid-aligned-list]'));
        this.gridBlocks = this.alignedLists.flatMap((list) => Array.from(list.querySelectorAll<HTMLElement>('[data-grid-block]')));
        this.transmissionRows = Array.from(root.querySelectorAll<HTMLElement>('.home-transmission-row'));
        this.transmissionImages = Array.from(root.querySelectorAll<HTMLImageElement>('.home-transmission-row__image'));
    }

    protected startPage(): void
    {
        this.removeMetricsListener = this.gridPlaneController.onMetricsChange(this.syncGridHeights);
        this.transmissionImages.forEach((image) => image.addEventListener('load', this.syncGridHeights));
        this.syncGridHeights();
    }

    protected disposePage(): void
    {
        this.removeMetricsListener?.();
        this.removeMetricsListener = null;
        this.transmissionImages.forEach((image) => image.removeEventListener('load', this.syncGridHeights));
        this.alignedLists.forEach((list) => list.style.removeProperty('--site-list-grid-offset'));
        this.gridBlocks.forEach((block) => block.style.removeProperty('block-size'));
        this.header?.style.removeProperty('block-size');
        this.panels.forEach((panel) => panel.style.removeProperty('block-size'));
        this.transmissionRows.forEach((row) => row.style.removeProperty('block-size'));
    }

    private readonly syncGridHeights = (): void =>
    {
        this.alignedLists.forEach((list) => list.style.removeProperty('--site-list-grid-offset'));
        this.gridBlocks.forEach((block) => block.style.removeProperty('block-size'));
        this.header?.style.removeProperty('block-size');
        this.panels.forEach((panel) => panel.style.removeProperty('block-size'));
        this.transmissionRows.forEach((row) => row.style.removeProperty('block-size'));

        const rowHeight = this.gridPlaneController.metrics.rowHeight;
        if (this.header) {
            this.snapBlockSizeToGrid(this.header, rowHeight);
        }

        this.transmissionRows.forEach((row) => {
            this.snapBlockSizeToGrid(row, rowHeight);
        });

        this.panels.forEach((panel) => {
            this.snapBlockSizeToGrid(panel, rowHeight);
        });

        this.alignedLists.forEach((list) => {
            const firstBlock = list.querySelector<HTMLElement>('[data-grid-block]');
            if (!firstBlock) {
                return;
            }

            const top = firstBlock.getBoundingClientRect().top + window.scrollY;
            const origin = this.gridPlaneController.metrics.origin.y;
            const nextLine = origin + Math.ceil((top - origin - 0.5) / rowHeight) * rowHeight;
            list.style.setProperty('--site-list-grid-offset', `${Math.max(0, nextLine - top)}px`);
            list.querySelectorAll<HTMLElement>('[data-grid-block]').forEach((block) => {
                this.snapBlockSizeToGrid(block, rowHeight);
            });
        });
    };

    private snapBlockSizeToGrid(element: HTMLElement, rowHeight: number): void
    {
        const naturalHeight = element.getBoundingClientRect().height;
        const gridRows = Math.ceil(naturalHeight / rowHeight);
        element.style.setProperty('block-size', `${gridRows * rowHeight}px`);
    }
}
