import type { Disposable } from '../core/disposable';
import type { MotionPreference } from '../core/motion-preference';
import type { DocumentPoint } from '../grid/grid-metrics';

/**
 * 文書座標で移動する遷移ノードが画面内に残るようスクロールを追従させる。
 */
export class ScrollFollowController implements Disposable
{
    private readonly _motionPreference: MotionPreference;
    private _trackingViewportY: number = 0;
    private _active: boolean = false;

    public constructor(motionPreference: MotionPreference)
    {
        this._motionPreference = motionPreference;
    }

    public start(origin: DocumentPoint, headerHeight: number): void
    {
        if (!this._motionPreference.canAnimate) {
            this._active = false;
            return;
        }

        const originViewportY = origin.y - window.scrollY;
        const minimumY = headerHeight + 24;
        const maximumY = Math.max(minimumY, window.innerHeight * 0.72);
        this._trackingViewportY = Math.min(maximumY, Math.max(minimumY, originViewportY));
        this._active = true;
    }

    public update(point: DocumentPoint): void
    {
        if (!this._active) {
            return;
        }

        const maximumScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const desiredScroll = Math.min(maximumScroll, Math.max(0, point.y - this._trackingViewportY));
        window.scrollTo(0, desiredScroll);
    }

    public dispose(): void
    {
        this._active = false;
    }
}
