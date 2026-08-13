import type { Disposable } from './disposable';

/**
 * OSの動き設定とタブ表示状態をまとめて扱う。
 */
export class MotionPreference implements Disposable
{
    private readonly _mediaQuery: MediaQueryList;
    private _started: boolean = false;

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

    public dispose(): void
    {
        if (!this._started) {
            return;
        }

        this._mediaQuery.removeEventListener('change', this.handleChange);
        document.removeEventListener('visibilitychange', this.handleChange);
        this._started = false;
    }

    private readonly handleChange = (): void =>
    {
        this.syncRootState();
    };

    private syncRootState(): void
    {
        document.documentElement.dataset.motion = this.canAnimate ? 'full' : 'reduced';
    }
}
