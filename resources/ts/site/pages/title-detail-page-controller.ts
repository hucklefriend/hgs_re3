import type { GridPlaneController } from '../grid/grid-plane-controller';
import { BasePageController } from './page-controller';
import { SectionSpy } from './section-spy';

export class TitleDetailPageController extends BasePageController
{
    private readonly gridPlaneController: GridPlaneController;
    private readonly heroPanel: HTMLElement | null;
    private readonly heroImages: HTMLImageElement[];
    private readonly detailContent: HTMLElement | null;
    private readonly dataSections: HTMLElement[];
    private readonly dataPanels: HTMLElement[];
    private readonly sectionSpy: SectionSpy;
    private removeMetricsListener: (() => void) | null = null;

    public constructor(root: HTMLElement, gridPlaneController: GridPlaneController)
    {
        super(root);
        this.gridPlaneController = gridPlaneController;
        this.heroPanel = root.querySelector<HTMLElement>('.title-hero__panel');
        this.heroImages = Array.from(this.heroPanel?.querySelectorAll<HTMLImageElement>('img') ?? []);
        this.detailContent = root.querySelector<HTMLElement>('.title-detail-content');
        this.dataSections = Array.from(root.querySelectorAll<HTMLElement>('.title-detail-content > .title-data-section'));
        this.dataPanels = Array.from(root.querySelectorAll<HTMLElement>(
            '.title-fear-panel, .title-data-section > .site-empty-state, .title-review-list > .site-empty-state, .title-review-list > article, .title-package-list > article',
        ));
        this.sectionSpy = new SectionSpy(root);
    }

    protected startPage(): void
    {
        this.sectionSpy.start();
        this.removeMetricsListener = this.gridPlaneController.onMetricsChange(this.syncGridAlignment);
        this.heroImages.forEach((image) => image.addEventListener('load', this.syncGridAlignment));
        this.syncGridAlignment();
    }

    protected disposePage(): void
    {
        this.sectionSpy.dispose();
        this.removeMetricsListener?.();
        this.removeMetricsListener = null;
        this.heroImages.forEach((image) => image.removeEventListener('load', this.syncGridAlignment));
        this.root.style.removeProperty('--title-hero-grid-offset');
        this.root.style.removeProperty('--title-detail-grid-offset');
        this.dataSections.forEach((section) => section.style.removeProperty('block-size'));
        this.dataPanels.forEach((panel) => panel.style.removeProperty('block-size'));
    }

    private readonly syncGridAlignment = (): void =>
    {
        this.syncHeroAlignment();
        this.syncDataAlignment();
    };

    private syncHeroAlignment(): void
    {
        if (this.heroPanel === null) {
            return;
        }

        this.root.style.setProperty('--title-hero-grid-offset', '0px');
        const rect = this.heroPanel.getBoundingClientRect();
        const panelEnd = {
            x: this.gridPlaneController.metrics.origin.x,
            y: rect.bottom + window.scrollY,
        };
        const snappedEnd = this.gridPlaneController.metrics.snapToIntersection(panelEnd);
        let offset = snappedEnd.y - panelEnd.y;

        if (offset < -0.5) {
            offset += this.gridPlaneController.metrics.rowHeight;
        }

        if (Math.abs(offset) <= 0.5) {
            offset = 0;
        }

        this.root.style.setProperty('--title-hero-grid-offset', `${offset}px`);
    }

    private syncDataAlignment(): void
    {
        this.root.style.setProperty('--title-detail-grid-offset', '0px');
        this.dataSections.forEach((section) => section.style.removeProperty('block-size'));
        this.dataPanels.forEach((panel) => panel.style.removeProperty('block-size'));

        const rowHeight = this.gridPlaneController.metrics.rowHeight;
        if (this.detailContent !== null) {
            const rect = this.detailContent.getBoundingClientRect();
            const contentStart = {
                x: this.gridPlaneController.metrics.origin.x,
                y: rect.top + window.scrollY,
            };
            const snappedStart = this.gridPlaneController.metrics.snapToIntersection(contentStart);
            let offset = snappedStart.y - contentStart.y;

            if (offset < -0.5) {
                offset += rowHeight;
            }

            if (Math.abs(offset) <= 0.5) {
                offset = 0;
            }

            this.root.style.setProperty('--title-detail-grid-offset', `${offset}px`);
        }

        this.dataPanels.forEach((panel) => this.snapBlockEndToGrid(panel, rowHeight));
        this.dataSections.forEach((section) => this.snapBlockEndToGrid(section, rowHeight));
    }

    private snapBlockEndToGrid(element: HTMLElement, rowHeight: number): void
    {
        const rect = element.getBoundingClientRect();
        const elementEnd = {
            x: this.gridPlaneController.metrics.origin.x,
            y: rect.bottom + window.scrollY,
        };
        const snappedEnd = this.gridPlaneController.metrics.snapToIntersection(elementEnd);
        let offset = snappedEnd.y - elementEnd.y;

        if (offset < -0.5) {
            offset += rowHeight;
        }

        if (Math.abs(offset) <= 0.5) {
            offset = 0;
        }

        element.style.setProperty('block-size', `${rect.height + offset}px`);
    }
}
