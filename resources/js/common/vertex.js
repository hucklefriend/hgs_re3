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

    getPointAtFraction(v2, m, n) {
        let xDiff = v2.x - this.x;
        let yDiff = v2.y - this.y;

        let x = this.x + (xDiff * m / n);
        let y = this.y + (yDiff * m / n);

        return new Vertex(x, y);
    }

    /**
     * オブジェクト化
     * 
     * @returns {Object}
     */
    toObj()
    {
        return {
            x: this.x,
            y: this.y
        };
    }
}
