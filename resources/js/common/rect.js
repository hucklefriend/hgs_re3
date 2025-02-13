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
        this.width = 0;
        this.height = 0;

        this.calcSize();
    }

    /**
     * サイズ計算
     */
    calcSize()
    {
        this.width = this.right - this.left;
        this.height = this.bottom - this.top;
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
        this.calcSize();
    }

    /**
     * 中心座標とサイズから座標を設定
     *
     * @param x
     * @param y
     * @param w
     * @param h
     */
    setRectByCenter(x, y, w, h)
    {
        this.left = x - w / 2;
        this.right = this.left + w;
        this.top = y - h / 2;
        this.bottom = this.top + h;
        this.calcSize();
    }

    /**
     * 別のRectと重なっているか
     */
    intersects(rect)
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

        this.calcSize();
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

    /**
     * 空のRectを設定
     */
    setEmpty()
    {
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
    }

    /**
     * 空かどうか
     *
     * @returns {boolean}
     */
    isEmpty()
    {
        return (this.left === this.right) || (this.top === this.bottom);
    }

    /**
     * 引数で渡されたrectと重なっている部分だけにする
     */
    intersect(rect)
    {
        this.left = Math.max(this.left, rect.left);
        this.right = Math.min(this.right, rect.right);
        this.top = Math.max(this.top, rect.top);
        this.bottom = Math.min(this.bottom, rect.bottom);
    }

    toJson()
    {
        return {
            left: this.left,
            right: this.right,
            top: this.top,
            bottom: this.bottom
        };
    }

    /**
     * 2つのRectが重なっている部分の新しいRectを返す
     * 重なりがなければsetEmptyしたRectを返す
     */
    static getOverlapRect(rect1, rect2)
    {
        let overlapRect = new Rect();

        if (rect1.isOverlap(rect2)) {
            overlapRect.left = Math.max(rect1.left, rect2.left);
            overlapRect.right = Math.min(rect1.right, rect2.right);
            overlapRect.top = Math.max(rect1.top, rect2.top);
            overlapRect.bottom = Math.min(rect1.bottom, rect2.bottom);
        } else {
            overlapRect.setEmpty();
        }

        return overlapRect;
    }

    /**
     * ウィンドウの情報からViewRectとして設定
     * 
     * @returns {Rect}
     */
    setWindowViewRect()
    {
        this.left = window.scrollX;
        this.right = window.scrollX + window.innerWidth;
        this.top = window.scrollY;
        this.bottom = window.scrollY + window.innerHeight;

        return this;
    }
}
