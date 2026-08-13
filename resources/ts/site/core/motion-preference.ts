import type { Disposable } from './disposable';

/**
 * OSの動き設定とタブ表示状態をまとめて扱う。
 */
export class MotionPreference implements Disposable
{
    private readonly _mediaQuery: MediaQueryList;
    private readonly _listeners: Set<(canAnimate: boolean) => void> = new Set();
    private _started: boolean = false;
    private _lastCanAnimate: boolean | null = null;

    public constructor()
    {
        this._mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    }

    public get canAnimate(): boolean
    {
        return !this._mediaQuery.matches && document.visibilityState === 'visible';
    }

    public start(): void
    {
        if (this._started) {
            return;
        }

        this._started = true;
        this._mediaQuery.addEventListener('change', this.handleChange);
        document.addEventListener('visibilitychange', this.handleChange);
        this.syncRootState();
    }

    public onChange(listener: (canAnimate: boolean) => void): () => void
    {
        this._listeners.add(listener);

        return () => this._listeners.delete(listener);
    }

    public dispose(): void
    {
        if (!this._started) {
            return;
        }

        this._mediaQuery.removeEventListener('change', this.handleChange);
        document.removeEventListener('visibilitychange', this.handleChange);
        this._listeners.clear();
        this._lastCanAnimate = null;
        this._started = false;
    }

    private readonly handleChange = (): void =>
    {
        this.syncRootState();
    };

    private syncRootState(): void
    {
        const canAnimate = this.canAnimate;
        document.documentElement.dataset.motion = canAnimate ? 'full' : 'reduced';

        if (canAnimate === this._lastCanAnimate) {
            return;
        }

        this._lastCanAnimate = canAnimate;
        this._listeners.forEach((listener) => listener(canAnimate));
    }
}
