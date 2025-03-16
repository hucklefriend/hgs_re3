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
        this._animFunc = null;
        this._isInViewRect = false;
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
        if (this._animFunc === null) {
            this.leftX = this.dom.offsetLeft;
            this.rightX = this.dom.offsetLeft + this.dom.offsetWidth;
        }
    }

    /**
     * 描画
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} offsetX
     * @param {number} offsetY
     * @param {boolean} isDrawOutsideView
     */
    draw(ctx, offsetX, offsetY, isDrawOutsideView)
    {
        if (this.leftX === this.rightX) {
            return;
        }

        if (!this.isDraw(isDrawOutsideView)) {
            return;
        }

        if (this.lineVertices.length > 0) {
            ctx.beginPath();
            this.lineVertices.forEach((v, i) => {
                if (i === 0) {
                    ctx.moveTo(v.x + offsetX, v.y + offsetY);
                } else {
                    ctx.lineTo(v.x + offsetX, v.y + offsetY);
                }
            });
            ctx.stroke();
        }
    }
    
    /**
     * 描画するかどうか
     * 
     * @param {boolean} isDrawOutsideView 
     * @returns {boolean}
     */
    isDraw(isDrawOutsideView)
    {
        return this._isInViewRect || isDrawOutsideView;
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
                ly = ly + Util.lerp(0, height, (this.leftX - lx) / absHeight);
            }
            if (rx > this.rightX) {
                rx = this.rightX;
                ry = ly + Util.lerp(0, height, 1 - (rx - this.rightX) / absHeight);
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
     * 
     * @param {Rect} viewRect
     */
    update(viewRect)
    {
        this._isInViewRect = true;
        if (viewRect !== null && !viewRect.overlapWith(this.rect)) {
            this._isInViewRect = false;
        }

        if (this._animFunc !== null) {
            this._animFunc();
        }
    }

    /**
     * 出現
     */
    appear()
    {
        this._animFunc = this.appearAnimation;
        this.leftX = this.dom.offsetLeft;
        this.rightX = this.dom.offsetLeft;
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        if (window.hgn.animElapsedTime < 300) {
            if (this._isInViewRect) {
                this.rightX = Util.lerp(this.leftX, this.dom.offsetLeft + this.dom.offsetWidth,
                    window.hgn.animElapsedTime / 300);
                this.setLineVertices();
    
                window.hgn.setDrawMain(false);
            }
        } else {
            this.leftX = this.dom.offsetLeft;
            this.rightX = this.dom.offsetLeft + this.dom.offsetWidth;
            this.setLineVertices();
            this._animFunc = null;
            window.hgn.setDrawMain(true);
        }
    }

    /**
     * 消失開始
     */
    disappear()
    {
        this._animFunc = this.disappearAnimation;
    }

    /**
     * 消失アニメーション
     */
    disappearAnimation()
    {
        if (window.hgn.animElapsedTime < 300) {
            if (this._isInViewRect) {
                this.leftX = Util.lerp(this.dom.offsetLeft, this.dom.offsetLeft + this.dom.offsetWidth,
                    window.hgn.animElapsedTime / 300);
                this.setLineVertices();
                window.hgn.setDrawMain(false);
            }
        } else {
            this.leftX = 0;
            this.rightX = 0;
            this._animFunc = null;
            window.hgn.setDrawMain(true);
        }
    }
}
