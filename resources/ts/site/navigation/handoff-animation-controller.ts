import type { Disposable } from '../core/disposable';
import type { DocumentPoint } from '../grid/grid-metrics';

export type HandoffAnimationResult = 'completed' | 'cancelled' | 'timeout';

interface HandoffSegment
{
    from: DocumentPoint;
    to: DocumentPoint;
    length: number;
    offset: number;
    element: HTMLElement;
}

interface ActiveAnimation
{
    token: HTMLElement;
    routeLayer: HTMLElement;
    segments: HandoffSegment[];
    totalDistance: number;
    animationFrameId: number | null;
    timeoutId: number | null;
    resolve: (result: HandoffAnimationResult) => void;
    settled: boolean;
}

const MINIMUM_DURATION = 320;
const MAXIMUM_DURATION = 880;
const SAFETY_MARGIN = 300;
const ARRIVAL_PROGRESS = 0.86;

/**
 * 遷移ノードと通過済みのグリッド経路を文書座標で描画する。
 */
export class HandoffAnimationController implements Disposable
{
    private readonly _layer: HTMLElement;
    private readonly _headerNode: HTMLElement | null;
    private _active: ActiveAnimation | null = null;

    public constructor(root: HTMLElement)
    {
        const layer = root.querySelector<HTMLElement>('[data-handoff-layer]');
        if (!layer) {
            throw new Error('The public site requires a handoff animation layer.');
        }

        this._layer = layer;
        this._headerNode = root.querySelector<HTMLElement>('[data-header-node]');
    }

    public play(
        route: DocumentPoint[],
        onPosition: (point: DocumentPoint) => void,
        onArrival: () => void = () => {},
    ): Promise<HandoffAnimationResult> {
        this.cancel();

        if (route.length === 0) {
            return Promise.resolve('cancelled');
        }

        return new Promise((resolve) => {
            const token = this.createToken(route[0]);
            const routeLayer = this._layer.ownerDocument.createElement('div');
            routeLayer.className = 'site-handoff-route';
            routeLayer.setAttribute('aria-hidden', 'true');
            const segments = this.createSegments(route, routeLayer);
            const totalDistance = segments.reduce((total, segment) => total + segment.length, 0);
            const active: ActiveAnimation = {
                token,
                routeLayer,
                segments,
                totalDistance,
                animationFrameId: null,
                timeoutId: null,
                resolve,
                settled: false,
            };
            this._active = active;
            this._layer.append(routeLayer, token);

            if (totalDistance === 0) {
                this.renderToken(token, route[0], 0.78);
                onPosition(route[0]);
                this.flashHeaderNode();
                onArrival();
                this.finish(active, 'completed');
                return;
            }

            const duration = Math.min(MAXIMUM_DURATION, Math.max(MINIMUM_DURATION, 220 + (totalDistance * 0.14)));
            const startedAt = performance.now();
            const destination = route[route.length - 1];
            let arrived = false;
            active.timeoutId = window.setTimeout(() => this.finish(active, 'timeout'), duration + SAFETY_MARGIN);

            const tick = (timestamp: number): void => {
                active.animationFrameId = null;
                if (active.settled) {
                    return;
                }

                try {
                    const progress = Math.min(1, Math.max(0, (timestamp - startedAt) / duration));
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const distance = totalDistance * eased;

                    if (!arrived && progress >= ARRIVAL_PROGRESS) {
                        arrived = true;
                        this.renderToken(token, destination, 0.78);
                        this.renderRoute(active, totalDistance);
                        onPosition(destination);
                        this.flashHeaderNode();
                        onArrival();
                    } else if (!arrived) {
                        const point = this.pointAt(active, distance);
                        this.renderToken(token, point, 1 - (eased * 0.22));
                        this.renderRoute(active, distance);
                        onPosition(point);
                    }

                    if (progress >= 1) {
                        if (!arrived) {
                            this.renderToken(token, destination, 0.78);
                            this.renderRoute(active, totalDistance);
                            onPosition(destination);
                            this.flashHeaderNode();
                            onArrival();
                        }
                        this.finish(active, 'completed');
                        return;
                    }

                    active.animationFrameId = window.requestAnimationFrame(tick);
                } catch {
                    this.finish(active, 'cancelled');
                }
            };

            active.animationFrameId = window.requestAnimationFrame(tick);
        });
    }

    public cancel(): void
    {
        if (this._active) {
            this.finish(this._active, 'cancelled');
        }
    }

    public dispose(): void
    {
        this.cancel();
        this._headerNode?.removeAttribute('data-receiving');
    }

    private createToken(point: DocumentPoint): HTMLElement
    {
        const token = this._layer.ownerDocument.createElement('span');
        token.className = 'site-handoff-token';
        token.setAttribute('aria-hidden', 'true');
        token.innerHTML = '<i></i><i></i><i></i><i></i><i></i><i></i>';
        this.renderToken(token, point, 1);

        return token;
    }

    private createSegments(route: DocumentPoint[], routeLayer: HTMLElement): HandoffSegment[]
    {
        let offset = 0;

        return route.slice(1).map((to, index) => {
            const from = route[index];
            const length = Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
            if (length <= 0 || (to.x !== from.x && to.y !== from.y)) {
                throw new RangeError('Handoff route segments must be non-zero and orthogonal.');
            }

            const element = routeLayer.ownerDocument.createElement('span');
            element.className = 'site-handoff-route__segment';
            element.style.left = `${from.x}px`;
            element.style.top = `${from.y}px`;
            element.style.width = `${length}px`;
            element.style.transform = `rotate(${Math.atan2(to.y - from.y, to.x - from.x)}rad)`;
            element.append(routeLayer.ownerDocument.createElement('i'));
            routeLayer.append(element);
            const segment = { from, to, length, offset, element };
            offset += length;

            return segment;
        });
    }

    private pointAt(active: ActiveAnimation, distance: number): DocumentPoint
    {
        let segment = active.segments[active.segments.length - 1];
        const found = active.segments.find((candidate) => distance <= candidate.offset + candidate.length);
        if (found) {
            segment = found;
        }

        const progress = Math.min(1, Math.max(0, (distance - segment.offset) / segment.length));

        return {
            x: segment.from.x + ((segment.to.x - segment.from.x) * progress),
            y: segment.from.y + ((segment.to.y - segment.from.y) * progress),
        };
    }

    private renderToken(token: HTMLElement, point: DocumentPoint, scale: number): void
    {
        token.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) scale(${scale})`;
    }

    private renderRoute(active: ActiveAnimation, distance: number): void
    {
        active.segments.forEach((segment) => {
            const progress = Math.min(1, Math.max(0, (distance - segment.offset) / segment.length));
            segment.element.style.setProperty('--site-route-progress', String(progress));
        });
    }

    private flashHeaderNode(): void
    {
        this._headerNode?.setAttribute('data-receiving', '');
    }

    private finish(active: ActiveAnimation, result: HandoffAnimationResult): void
    {
        if (active.settled) {
            return;
        }

        active.settled = true;
        if (active.animationFrameId !== null) {
            window.cancelAnimationFrame(active.animationFrameId);
        }
        if (active.timeoutId !== null) {
            window.clearTimeout(active.timeoutId);
        }
        active.token.remove();
        active.routeLayer.remove();
        if (this._active === active) {
            this._active = null;
        }
        active.resolve(result);
    }
}
