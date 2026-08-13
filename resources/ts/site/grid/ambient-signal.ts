import type { Disposable } from '../core/disposable';
import type { DocumentPoint } from './grid-metrics';

interface RouteSegment
{
    from: DocumentPoint;
    to: DocumentPoint;
    startDistance: number;
    length: number;
}

/**
 * 1個の背景信号を経路に沿って描画し、終端で自動破棄する。
 */
export class AmbientSignal implements Disposable
{
    private readonly _element: HTMLElement;
    private readonly _segments: RouteSegment[];
    private readonly _totalDistance: number;
    private readonly _speed: number;
    private readonly _onComplete: () => void;
    private _animationFrameId: number | null = null;
    private _startTime: number | null = null;
    private _disposed: boolean = false;

    public constructor(
        layer: HTMLElement,
        route: DocumentPoint[],
        speed: number,
        onComplete: () => void,
    ) {
        if (route.length < 2) {
            throw new RangeError('An ambient signal route requires at least two points.');
        }

        if (!Number.isFinite(speed) || speed <= 0) {
            throw new RangeError('Ambient signal speed must be greater than zero.');
        }

        this._segments = this.createSegments(route);
        this._totalDistance = this._segments.reduce((total, segment) => total + segment.length, 0);
        this._speed = speed;
        this._onComplete = onComplete;
        this._element = layer.ownerDocument.createElement('span');
        this._element.className = 'site-ambient-signal';
        this._element.setAttribute('aria-hidden', 'true');
        layer.append(this._element);
        this.render(route[0], this._segments[0]);
    }

    public start(): void
    {
        if (this._disposed || this._animationFrameId !== null) {
            return;
        }

        this._animationFrameId = window.requestAnimationFrame(this.tick);
    }

    public dispose(): void
    {
        if (this._disposed) {
            return;
        }

        this._disposed = true;

        if (this._animationFrameId !== null) {
            window.cancelAnimationFrame(this._animationFrameId);
            this._animationFrameId = null;
        }

        this._element.remove();
    }

    private readonly tick = (timestamp: number): void =>
    {
        this._animationFrameId = null;

        if (this._disposed) {
            return;
        }

        this._startTime ??= timestamp;
        const travelledDistance = ((timestamp - this._startTime) / 1000) * this._speed;

        if (travelledDistance >= this._totalDistance) {
            const finalSegment = this._segments[this._segments.length - 1];
            this.render(finalSegment.to, finalSegment);
            this.dispose();
            this._onComplete();
            return;
        }

        const segment = this.findSegment(travelledDistance);
        const progress = (travelledDistance - segment.startDistance) / segment.length;
        this.render({
            x: segment.from.x + ((segment.to.x - segment.from.x) * progress),
            y: segment.from.y + ((segment.to.y - segment.from.y) * progress),
        }, segment);
        this._animationFrameId = window.requestAnimationFrame(this.tick);
    };

    private createSegments(route: DocumentPoint[]): RouteSegment[]
    {
        let startDistance = 0;

        return route.slice(1).map((to, index) => {
            const from = route[index];
            const length = Math.abs(to.x - from.x) + Math.abs(to.y - from.y);

            if (length <= 0 || (to.x !== from.x && to.y !== from.y)) {
                throw new RangeError('Ambient signal segments must be non-zero and orthogonal.');
            }

            const segment = { from, to, startDistance, length };
            startDistance += length;

            return segment;
        });
    }

    private findSegment(distance: number): RouteSegment
    {
        return this._segments.find((segment) => distance < segment.startDistance + segment.length)
            ?? this._segments[this._segments.length - 1];
    }

    private render(point: DocumentPoint, segment: RouteSegment): void
    {
        const horizontal = segment.from.y === segment.to.y;
        const positive = horizontal ? segment.to.x > segment.from.x : segment.to.y > segment.from.y;

        this._element.dataset.axis = horizontal ? 'horizontal' : 'vertical';
        this._element.dataset.direction = positive ? 'positive' : 'negative';
        this._element.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
    }
}
