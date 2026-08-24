import type { GridPlaneController } from '../grid/grid-plane-controller';
import { BasePageController } from './page-controller';

export class StandardPageController extends BasePageController
{
    private readonly gridPlaneController: GridPlaneController;
    private readonly header: HTMLElement | null;
    private readonly panels: HTMLElement[];
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
            '#current-node > #current-node-content, #current-node > section.node',
        ));
    }

    protected startPage(): void
    {
        this.removeMetricsListener = this.gridPlaneController.onMetricsChange(this.syncGridHeights);
        this.syncGridHeights();
    }

    protected disposePage(): void
    {
        this.removeMetricsListener?.();
        this.removeMetricsListener = null;
        this.header?.style.removeProperty('block-size');
        this.panels.forEach((panel) => panel.style.removeProperty('block-size'));
    }

    private readonly syncGridHeights = (): void =>
    {
        this.header?.style.removeProperty('block-size');
        this.panels.forEach((panel) => panel.style.removeProperty('block-size'));

        const rowHeight = this.gridPlaneController.metrics.rowHeight;
        if (this.header) {
            this.snapBlockSizeToGrid(this.header, rowHeight);
        }

        this.panels.forEach((panel) => {
            this.snapBlockSizeToGrid(panel, rowHeight);
        });
    };

    private snapBlockSizeToGrid(element: HTMLElement, rowHeight: number): void
    {
        const naturalHeight = element.getBoundingClientRect().height;
        const gridRows = Math.ceil(naturalHeight / rowHeight);
        element.style.setProperty('block-size', `${gridRows * rowHeight}px`);
    }
}
