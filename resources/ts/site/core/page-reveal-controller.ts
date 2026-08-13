import type { Disposable } from './disposable';
import type { MotionPreference } from './motion-preference';

const REVEAL_DURATION = 620;

/**
 * 全文書ロード時だけ実行する短い対角ワイプ。
 */
export class PageRevealController implements Disposable
{
    private readonly _root: HTMLElement;
    private readonly _motionPreference: MotionPreference;
    private _animationFrameId: number | null = null;
    private _timerId: number | null = null;

    public constructor(root: HTMLElement, motionPreference: MotionPreference)
    {
        this._root = root;
        this._motionPreference = motionPreference;
    }

    public start(): void
    {
        if (!this._motionPreference.canAnimate) {
            this._root.dataset.pageReady = 'true';
            return;
        }

        this._root.dataset.pageArriving = 'true';
        this._animationFrameId = window.requestAnimationFrame(() => {
            this._animationFrameId = null;
            this._root.dataset.pageReady = 'true';
            this._timerId = window.setTimeout(() => {
                delete this._root.dataset.pageArriving;
                this._timerId = null;
            }, REVEAL_DURATION);
        });
    }

    public dispose(): void
    {
        if (this._animationFrameId !== null) {
            window.cancelAnimationFrame(this._animationFrameId);
            this._animationFrameId = null;
        }

        if (this._timerId !== null) {
            window.clearTimeout(this._timerId);
            this._timerId = null;
        }

        delete this._root.dataset.pageArriving;
    }
}
