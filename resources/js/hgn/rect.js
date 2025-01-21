import {Vertex} from './vertex.js';

/**
 * 矩形
 */
export class Rect
{
    /**
     * コンストラクタ
     *
     * @param left
     * @param right
     * @param top
     * @param bottom
     */
    constructor(left = 0, right = 0, top = 0, bottom = 0)
    {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }

    /**
     * 設定
     *
     * @param left
     * @param right
     * @param top
     * @param bottom
     */
    setRect(left, right, top, bottom)
    {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }

    setRectByXYWH(x, y, w, h)
    {
        this.left = x - w / 2;
        this.right = this.left + w;
        this.top = y - h / 2;
        this.bottom = this.top + h;
    }

    /**
     * 別のRectと重なっているか
     */
    isOverlap(rect)
    {
        return this.left < rect.right && this.right > rect.left && this.top < rect.bottom && this.bottom > rect.top;
    }

    /**
     * 別のRectとマージ（より大きなRectにする）
     */
    merge(rect)
    {
        this.left = Math.min(this.left, rect.left);
        this.right = Math.max(this.right, rect.right);
        this.top = Math.min(this.top, rect.top);
        this.bottom = Math.max(this.bottom, rect.bottom);
    }

    /**
     * 移動
     */
    move(x, y)
    {
        this.left += x;
        this.right += x;
        this.top += y;
        this.bottom += y;
    }
}
