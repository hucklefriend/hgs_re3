import type { Disposable } from '../core/disposable';
import { GridMetrics } from './grid-metrics';

const DEFAULT_COLUMNS = 16;
const DEFAULT_ROW_HEIGHT = 48;

/**
 * 共通グリッドの実測値をCSSカスタムプロパティへ同期する。
 */
export class GridPlaneController implements Disposable
{
    private readonly _root: HTMLElement;
    private readonly _plane: HTMLElement;
    private readonly _frame: HTMLElement;
    private readonly _metrics: GridMetrics;
    private readonly _resizeObserver: ResizeObserver | null;
    private _animationFrameId: number | null = null;
    private _started: boolean = false;

    public constructor(root: HTMLElement)
    {
        const plane = root.querySelector<HTMLElement>('[data-grid-plane]');
        const frame = root.querySelector<HTMLElement>('[data-grid-frame]');

        if (!plane || !frame) {
            throw new Error('The public site grid requires a plane and a frame.');
        }

        this._root = root;
        this._plane = plane;
        this._frame = frame;
        this._metrics = new GridMetrics({
            columns: DEFAULT_COLUMNS,
            origin: { x: 0, y: 0 },
            width: 1,
            rowHeight: DEFAULT_ROW_HEIGHT,
            documentHeight: 0,
        });
        this._resizeObserver = typeof ResizeObserver === 'undefined'
            ? null
            : new ResizeObserver(() => this.scheduleSync());
    }

    public get metrics(): GridMetrics
    {
        return this._metrics;
    }

    public start(): void
    {
        if (this._started) {
            return;
        }

        this._started = true;
        window.addEventListener('resize', this.scheduleSync, { passive: true });
        this._resizeObserver?.observe(this._root);
        this._resizeObserver?.observe(this._frame);
        this.sync();
    }

    public dispose(): void
    {
        if (!this._started) {
            return;
        }

        window.removeEventListener('resize', this.scheduleSync);
        this._resizeObserver?.disconnect();

        if (this._animationFrameId !== null) {
            window.cancelAnimationFrame(this._animationFrameId);
            this._animationFrameId = null;
        }

        this._started = false;
    }

    private readonly scheduleSync = (): void =>
    {
        if (this._animationFrameId !== null) {
            return;
        }

        this._animationFrameId = window.requestAnimationFrame(() => {
            this._animationFrameId = null;
            this.sync();
        });
    };

    private sync(): void
    {
        const frameRect = this._frame.getBoundingClientRect();
        const planeRect = this._plane.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(this._root);
        const columns = this.readPositiveInteger(computedStyle.getPropertyValue('--site-grid-columns'), DEFAULT_COLUMNS);
        const rowHeight = this.readPositiveNumber(computedStyle.getPropertyValue('--site-grid-row-size'), DEFAULT_ROW_HEIGHT);
        const documentHeight = Math.max(
            document.documentElement.scrollHeight,
            this._root.scrollHeight,
            window.innerHeight,
        );
        const origin = {
            x: frameRect.left - planeRect.left,
            y: rowHeight,
        };

        this._metrics.update({
            columns,
            origin,
            width: frameRect.width,
            rowHeight,
            documentHeight,
        });

        this._root.style.setProperty('--site-grid-origin-x', `${origin.x}px`);
        this._root.style.setProperty('--site-grid-origin-y', `${origin.y}px`);
        this._root.style.setProperty('--site-grid-width', `${frameRect.width}px`);
        this._root.style.setProperty('--site-grid-cell-width', `${this._metrics.cellWidth}px`);
        this._plane.style.blockSize = `${documentHeight}px`;
        this._root.querySelectorAll<HTMLElement>('[data-grid-columns]').forEach((element) => {
            element.textContent = String(columns);
        });
    }

    private readPositiveInteger(value: string, fallback: number): number
    {
        const number = Number.parseInt(value.trim(), 10);

        return Number.isInteger(number) && number > 0 ? number : fallback;
    }

    private readPositiveNumber(value: string, fallback: number): number
    {
        const number = Number.parseFloat(value.trim());

        return Number.isFinite(number) && number > 0 ? number : fallback;
    }
}
