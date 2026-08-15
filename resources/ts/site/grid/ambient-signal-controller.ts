import type { Disposable } from '../core/disposable';
import type { MotionPreference } from '../core/motion-preference';
import { AmbientSignalRoutePlanner, type AmbientSignalDirection } from './ambient-signal-route-planner';
import { AmbientSignal } from './ambient-signal';
import type { GridPlaneController } from './grid-plane-controller';

const DESKTOP_MAXIMUM_SIGNALS = 4;
const MOBILE_MAXIMUM_SIGNALS = 2;
const MINIMUM_SPAWN_DELAY = 650;
const MAXIMUM_SPAWN_DELAY = 1800;
const MINIMUM_SIGNAL_SPEED = 440;
const MAXIMUM_SIGNAL_SPEED = 720;
const DIRECTIONS: AmbientSignalDirection[] = ['right', 'left', 'down', 'up'];

/**
 * 背景信号の発生間隔、同時数、動作可否を管理する。
 */
export class AmbientSignalController implements Disposable
{
    private readonly _layer: HTMLElement;
    private readonly _gridPlaneController: GridPlaneController;
    private readonly _motionPreference: MotionPreference;
    private readonly _routePlanner: AmbientSignalRoutePlanner;
    private readonly _signals: Set<AmbientSignal> = new Set();
    private _spawnTimerId: number | null = null;
    private _removeMotionListener: (() => void) | null = null;
    private _removeMetricsListener: (() => void) | null = null;
    private _started: boolean = false;

    public constructor(
        root: HTMLElement,
        gridPlaneController: GridPlaneController,
        motionPreference: MotionPreference,
    ) {
        const layer = root.querySelector<HTMLElement>('[data-ambient-signal-layer]');
        if (!layer) {
            throw new Error('The public site grid requires an ambient signal layer.');
        }

        this._layer = layer;
        this._gridPlaneController = gridPlaneController;
        this._motionPreference = motionPreference;
        this._routePlanner = new AmbientSignalRoutePlanner();
    }

    public start(): void
    {
        if (this._started) {
            return;
        }

        this._started = true;
        this._removeMotionListener = this._motionPreference.onChange(this.reconcileAnimationState);
        this._removeMetricsListener = this._gridPlaneController.onMetricsChange(this.handleMetricsChange);
        this.reconcileAnimationState();
    }

    public dispose(): void
    {
        if (!this._started) {
            return;
        }

        this._started = false;
        this.cancelSpawn();
        this.clearSignals();
        this._removeMotionListener?.();
        this._removeMetricsListener?.();
        this._removeMotionListener = null;
        this._removeMetricsListener = null;
    }

    private readonly reconcileAnimationState = (): void =>
    {
        this.cancelSpawn();
        this.clearSignals();

        if (this._started && this._motionPreference.canAnimate) {
            this.scheduleSpawn(200 + (Math.random() * 400));
        }
    };

    private readonly handleMetricsChange = (): void =>
    {
        if (!this._started) {
            return;
        }

        this.cancelSpawn();
        this.clearSignals();

        if (this._motionPreference.canAnimate) {
            this.scheduleSpawn(180);
        }
    };

    private readonly spawn = (): void =>
    {
        this._spawnTimerId = null;

        if (!this._started || !this._motionPreference.canAnimate) {
            return;
        }

        const metrics = this._gridPlaneController.metrics;
        const maximumSignals = metrics.columns <= 4
            ? MOBILE_MAXIMUM_SIGNALS
            : DESKTOP_MAXIMUM_SIGNALS;

        if (this._signals.size < maximumSignals) {
            const rows = Math.max(1, Math.ceil((metrics.documentHeight - metrics.origin.y) / metrics.rowHeight));
            const direction = DIRECTIONS[this.randomInteger(0, DIRECTIONS.length - 1)];
            const horizontal = direction === 'right' || direction === 'left';
            const crossLimit = horizontal ? rows : metrics.columns;
            const gridRoute = this._routePlanner.plan({
                columns: metrics.columns,
                rows,
                direction,
                startCrossAxis: this.randomInteger(0, crossLimit),
                detours: this.randomInteger(0, 2),
            });
            const route = gridRoute.map((point) => metrics.gridToDocument(point));
            let signal: AmbientSignal;

            signal = new AmbientSignal(
                this._layer,
                route,
                this.randomNumber(MINIMUM_SIGNAL_SPEED, MAXIMUM_SIGNAL_SPEED),
                () => this._signals.delete(signal),
            );
            this._signals.add(signal);
            signal.start();
        }

        this.scheduleSpawn(this.randomNumber(MINIMUM_SPAWN_DELAY, MAXIMUM_SPAWN_DELAY));
    };

    private scheduleSpawn(delay: number): void
    {
        if (this._spawnTimerId !== null || !this._started || !this._motionPreference.canAnimate) {
            return;
        }

        this._spawnTimerId = window.setTimeout(this.spawn, delay);
    }

    private cancelSpawn(): void
    {
        if (this._spawnTimerId === null) {
            return;
        }

        window.clearTimeout(this._spawnTimerId);
        this._spawnTimerId = null;
    }

    private clearSignals(): void
    {
        this._signals.forEach((signal) => signal.dispose());
        this._signals.clear();
    }

    private randomInteger(minimum: number, maximum: number): number
    {
        return Math.floor(this.randomNumber(minimum, maximum + 1));
    }

    private randomNumber(minimum: number, maximum: number): number
    {
        return minimum + (Math.random() * (maximum - minimum));
    }
}
