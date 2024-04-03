/**
 * 頂点
 */
export class Vertex
{
    /**
     * コンストラクタ
     *
     * @param x
     * @param y
     */
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    /**
     * リロード
     *
     * @param x
     * @param y
     */
    reload(x, y)
    {
        this.x = x;
        this.y = y;
    }

    /**
     * 移動
     *
     * @param moveX
     * @param moveY
     */
    move(moveX, moveY)
    {
        this.x += moveX;
        this.y += moveY;
    }
}
