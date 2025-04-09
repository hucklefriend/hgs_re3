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
     * 
     * @param {Rect} rect
     * @returns {boolean}
     */
    overlapWith(rect)
    {
        return this.left < rect.right && this.right > rect.left && this.top < rect.bottom && this.bottom > rect.top;
    }

    /**
     * 別のRectとマージ（より大きなRectにする）
     * 
     * @param {Rect} rect
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
     * 別のRectの内容をコピー
     * 
     * @param {Rect} rect
     */
    copyFrom(rect)
    {
        this.left = rect.left;
        this.right = rect.right;
        this.top = rect.top;
        this.bottom = rect.bottom;
        this.calcSize();
    }

    /**
     * 移動
     * 
     * @param {number} x
     * @param {number} y
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
     * 
     * @param {Rect} rect
     */
    intersect(rect)
    {
        this.left = Math.max(this.left, rect.left);
        this.right = Math.min(this.right, rect.right);
        this.top = Math.max(this.top, rect.top);
        this.bottom = Math.min(this.bottom, rect.bottom);
    }

    /**
     * 点が矩形の中に含まれているかを判定
     * 
     * @param {Vertex} vertex - 判定する点
     * @returns {boolean} - 点が矩形の中に含まれている場合はtrue
     */
    containsVertex(vertex)
    {
        return vertex.x >= this.left && 
               vertex.x <= this.right && 
               vertex.y >= this.top && 
               vertex.y <= this.bottom;
    }

    /**
     * JSONに変換
     * 
     * @returns {Object}
     */
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
    static getIntersection(rect1, rect2)
    {
        let intersectionRect = new Rect();

        if (rect1.overlapWith(rect2)) {
            intersectionRect.left = Math.max(rect1.left, rect2.left);
            intersectionRect.right = Math.min(rect1.right, rect2.right);
            intersectionRect.top = Math.max(rect1.top, rect2.top);
            intersectionRect.bottom = Math.min(rect1.bottom, rect2.bottom);
        } else {
            intersectionRect.setEmpty();
        }

        return intersectionRect;
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
