import {Util} from './util.js';

/**
 * 水平線
 */
export class HR
{
    /**
     * コンストラクタ
     *
     * @param dom
     */
    constructor(dom)
    {
        this.dom = dom;

        this.leftX = 0;
        this.rightX = 0;
        this.animFunc = null;
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        this.dom = null;
    }

    /**
     * リロード
     */
    reload()
    {
        if (this.animFunc === null) {
            this.leftX = this.dom.offsetLeft;
            this.rightX = this.dom.offsetLeft + this.dom.offsetWidth;
        }
    }

    /**
     * 描画
     *
     * @param ctx
     */
    draw(ctx)
    {
        if (this.leftX === this.rightX) {
            return;
        }

        let lineVertices = this.getLineVertices();
        if (lineVertices.length > 0) {
            ctx.beginPath();
            lineVertices.forEach((v, i) => {
                if (i === 0) {
                    ctx.moveTo(v.x, v.y);
                } else {
                    ctx.lineTo(v.x, v.y);
                }
            });
            ctx.stroke();
        }
    }

    /**
     * 線の座標を取得
     *
     * @returns {*[]}
     */
    getLineVertices()
    {
        let width = this.dom.offsetWidth / 5;
        let lineVertices = [];

        let lx = this.dom.offsetLeft;
        let ly = this.dom.offsetTop;
        this.addStraightLine(lx, ly, width, lineVertices);
        lx += width;
        this.addDiagonalLine(lx, ly, -5, lineVertices);
        lx += 5;
        ly -= 5;
        this.addStraightLine(lx, ly, width, lineVertices);
        lx += width;
        this.addDiagonalLine(lx, ly, 15, lineVertices);
        lx += 15;
        ly += 15;
        this.addStraightLine(lx, ly, width, lineVertices);
        lx += width;
        this.addDiagonalLine(lx, ly, -13, lineVertices);
        lx += 13;
        ly -= 13;
        this.addStraightLine(lx, ly, width, lineVertices);
        lx += width;
        this.addDiagonalLine(lx, ly, 3, lineVertices);
        lx += 3;
        ly += 3;
        this.addStraightLine(lx, ly, width, lineVertices);

        return lineVertices;
    }

    /**
     * 直線を追加
     *
     * @param lx
     * @param ly
     * @param width
     * @param lineVertices
     */
    addStraightLine(lx, ly, width, lineVertices)
    {
        let rx = lx + width;
        if (this.leftX < rx && lx < this.rightX) {
            if (lx < this.leftX) {
                lx = this.leftX;
            }
            if (rx > this.rightX) {
                rx = this.rightX;
            }

            if (lineVertices.length === 0) {
                lineVertices.push({x: lx, y: ly});
            }
            lineVertices.push({x: rx, y: ly});
        }
    }

    /**
     * 斜線を追加
     *
     * @param lx
     * @param ly
     * @param height
     * @param lineVertices
     */
    addDiagonalLine(lx, ly, height, lineVertices)
    {
        let absHeight = Math.abs(height);
        let rx = lx + absHeight;
        let ry = ly + height;
        if (this.leftX < rx && lx < this.rightX) {
            if (lx < this.leftX) {
                lx = this.leftX;
                ly = ly + Util.getMidpoint(0, height, (this.leftX - lx) / absHeight);
            }
            if (rx > this.rightX) {
                rx = this.rightX;
                ry = ly + Util.getMidpoint(0, height, 1 - (rx - this.rightX) / absHeight);
            }

            if (lineVertices.length === 0) {
                lineVertices.push({x: lx, y: ly});
            }
            lineVertices.push({x: rx, y: ry});
        }
    }

    /**
     * 更新
     */
    update()
    {
        if (this.animFunc !== null) {
            this.animFunc();
        }
    }

    /**
     * 出現
     */
    appear()
    {
        this.leftX = this.dom.offsetLeft;
        this.rightX = this.dom.offsetLeft;
        this.animFunc = this.appearAnimation;
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        if (window.hgn.animCnt < 20) {
            this.rightX = Util.getMidpoint(this.leftX, this.dom.offsetLeft + this.dom.offsetWidth,
                window.hgn.animCnt / 20);
        } else {
            this.leftX = this.dom.offsetLeft;
            this.rightX = this.dom.offsetLeft + this.dom.offsetWidth;
            this.animFunc = null;
        }
    }

    /**
     * 消える
     */
    disappear()
    {
        this.animFunc = this.disappearAnimation;
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
        if (window.hgn.animCnt < 20) {
            this.leftX = Util.getMidpoint(this.dom.offsetLeft, this.dom.offsetLeft + this.dom.offsetWidth,
                window.hgn.animCnt / 20);
        } else {
            this.leftX = 0;
            this.rightX = 0;
            this.animFunc = null;
        }
    }
}
