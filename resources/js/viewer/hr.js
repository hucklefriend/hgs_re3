import { Rect } from '../common/rect.js';
import { Util } from '../common/util.js';

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
        this.lineVertices = [];
        this.rect = new Rect();
        this.animFunc = null;
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        this.dom = null;
        this.lineVertices = null;
        this.rect = null;
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
    draw(ctx, viewRect)
    {
        if (this.leftX === this.rightX) {
            return;
        }

        const [isDraw, left, top] = this.isDraw(viewRect);
        if (!isDraw) {
            return;
        }

        if (this.lineVertices.length > 0) {
            ctx.beginPath();
            this.lineVertices.forEach((v, i) => {
                if (i === 0) {
                    ctx.moveTo(v.x + left, v.y + top);
                } else {
                    ctx.lineTo(v.x + left, v.y + top);
                }
            });
            ctx.stroke();
        }
    }
    

    isDraw(viewRect)
    {
        let left = 0;
        let top = 0;
        let isDraw = true;
        if (viewRect !== null) {
            if (!viewRect.overlapWith(this.rect)) {
                // 描画領域内に入っていないなら描画しない
                isDraw = false;
            }

            left = -viewRect.left;
            top = -viewRect.top;
        }

        return [isDraw, left, top];
    }

    /**
     * 線の座標を取得
     */
    setLineVertices()
    {
        let width = this.dom.offsetWidth / 5;
        this.lineVertices = [];

        let lx = this.dom.offsetLeft;
        let ly = this.dom.offsetTop;
        this.rect.left = lx;
        this.rect.top = ly;
        if (this.addStraightLine(lx, ly, width)) {
            lx += width;
            if (this.addDiagonalLine(lx, ly, -5)) {
                lx += 5;
                ly -= 5;
                if (this.addStraightLine(lx, ly, width)) {
                    lx += width;
                    if (this.addDiagonalLine(lx, ly, 15)) {
                        lx += 15;
                        ly += 15;
                        if (this.addStraightLine(lx, ly, width)) {
                            lx += width;
                            if (this.addDiagonalLine(lx, ly, -13)) {
                                lx += 13;
                                ly -= 13;
                                if (this.addStraightLine(lx, ly, width)) {
                                    lx += width;
                                    if (this.addDiagonalLine(lx, ly, 3)) {
                                        lx += 3;
                                        ly += 3;
                                        if (this.addStraightLine(lx, ly, width)) {
                                            lx = this.dom.offsetLeft + this.dom.offsetWidth;
                                            ly = this.dom.offsetTop;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        this.rect.right = lx;
        this.rect.bottom = ly;
        this.rect.calcSize();
    }

    /**
     * 直線を追加
     *
     * @param lx
     * @param ly
     * @param width
     */
    addStraightLine(lx, ly, width)
    {
        let rx = lx + width;
        if (this.leftX < rx && lx < this.rightX) {
            if (lx < this.leftX) {
                lx = this.leftX;
            }
            if (rx > this.rightX) {
                rx = this.rightX;
            }

            if (this.lineVertices.length === 0) {
                this.lineVertices.push({x: lx, y: ly});
            }
            this.lineVertices.push({x: rx, y: ly});

            return true;
        }

        return false;
    }

    /**
     * 斜線を追加
     *
     * @param lx
     * @param ly
     * @param height
     */
    addDiagonalLine(lx, ly, height)
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

            if (this.lineVertices.length === 0) {
                this.lineVertices.push({x: lx, y: ly});
            }
            this.lineVertices.push({x: rx, y: ry});

            return true;
        }
        
        return false;
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
        this.animFunc = this.appearAnimation;
        this.leftX = this.dom.offsetLeft;
        this.rightX = this.dom.offsetLeft;
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        if (window.hgn.animElapsedTime < 300) {
            this.rightX = Util.getMidpoint(this.leftX, this.dom.offsetLeft + this.dom.offsetWidth,
                window.hgn.animElapsedTime / 300);
            this.setLineVertices();

            window.hgn.setDrawMain(false);
        } else {
            this.leftX = this.dom.offsetLeft;
            this.rightX = this.dom.offsetLeft + this.dom.offsetWidth;
            this.setLineVertices();
            this.animFunc = null;
            window.hgn.setDrawMain(true);
        }
    }

    disappear()
    {
        this.animFunc = this.disappearAnimation;
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
        if (window.hgn.animElapsedTime < 300) {
            this.leftX = Util.getMidpoint(this.dom.offsetLeft, this.dom.offsetLeft + this.dom.offsetWidth,
                window.hgn.animElapsedTime / 300);
            this.setLineVertices();
            window.hgn.setDrawMain(false);
        } else {
            this.leftX = 0;
            this.rightX = 0;
            this.animFunc = null;
            window.hgn.setDrawMain(true);
        }
    }
}
