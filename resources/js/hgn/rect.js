import {Vertex} from './vertex.js';

/**
 * 矩形
 */
export class Rect
{
    /**
     * コンストラクタ
     *
     * @param x
     * @param y
     * @param w
     * @param h
     */
    constructor(x = 0, y = 0, w = 0, h = 0)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    /**
     * 左上の座標を取得
     *
     * @returns {Vertex}
     */
    get leftTop()
    {
        return new Vertex(this.x, this.y);
    }

    /**
     * 右上の座標を取得
     *
     * @returns {Vertex}
     */
    get rightTop()
    {
        return new Vertex(this.x + this.w, this.y);
    }

    /**
     * 右下の座標を取得
     *
     * @returns {Vertex}
     */
    get rightBottom()
    {
        return new Vertex(this.x + this.w, this.y + this.h);
    }

    /**
     * 左下の座標を取得
     *
     * @returns {Vertex}
     */
    get leftBottom()
    {
        return new Vertex(this.x, this.y + this.h);
    }
}
