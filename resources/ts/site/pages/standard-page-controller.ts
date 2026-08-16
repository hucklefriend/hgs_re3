import type { GridPlaneController } from '../grid/grid-plane-controller';
import { BasePageController } from './page-controller';

export class StandardPageController extends BasePageController
{
    private readonly gridPlaneController: GridPlaneController;
    private readonly panels: HTMLElement[];
    private removeMetricsListener: (() => void) | null = null;

    public constructor(
        root: HTMLElement,
        gridPlaneController: GridPlaneController,
    )
    {
        super(root);
        this.gridPlaneController = gridPlaneController;
        this.panels = Array.from(root.querySelectorAll<HTMLElement>(
            '#current-node > #current-node-content, #current-node > section.node',
        ));
    }

    protected startPage(): void
    {
        this.removeMetricsListener = this.gridPlaneController.onMetricsChange(this.syncPanelHeights);
        this.syncPanelHeights();
    }

    protected disposePage(): void
    {
        this.removeMetricsListener?.();
        this.removeMetricsListener = null;
        this.panels.forEach((panel) => panel.style.removeProperty('block-size'));
    }

    private readonly syncPanelHeights = (): void =>
    {
        this.panels.forEach((panel) => panel.style.removeProperty('block-size'));

        const rowHeight = this.gridPlaneController.metrics.rowHeight;
        this.panels.forEach((panel) => {
            const naturalHeight = panel.getBoundingClientRect().height;
            const gridRows = Math.ceil(naturalHeight / rowHeight);
            panel.style.setProperty('block-size', `${gridRows * rowHeight}px`);
        });
    };
}
