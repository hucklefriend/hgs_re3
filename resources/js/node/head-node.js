import { DOMNode } from './dom-node.js';
import { Param } from '../common/param.js';
import { Util } from '../common/util.js';
import { Vertex } from "../common/vertex.js";

export class Head1Node extends DOMNode
{
    /**
     * コンストラクタ
     *
     * @param {string} id
     * @param {number} x
     * @param {number} y
     * @param {HTMLElement} DOM
     * @param {number} notchSize
     */
    constructor(id, x, y, DOM, notchSize = 15)
    {
        super(id, x, y, DOM, notchSize);

        this.animOffset = 0;
        this.animWidth = notchSize * 4;
        this.animVertices = null;
        this.minVertices = null;
        this.isUseAnimVertices = false;
        this.alpha1 = 0.4;
        this.alpha2 = 0.7;
        this.alpha3 = 0.8;

        this.initAnimation();
    }

    /**
     * 描画
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} offsetX
     * @param {number} offsetY
     * @param {boolean} isDrawOutside
     */
    draw(ctx, offsetX, offsetY, isDrawOutsideView)
    {
        if (!this.isDraw(isDrawOutsideView)) {
            return;
        }

        ctx.lineWidth = 0; // 線の太さ
        ctx.strokeStyle = "rgba(0, 180, 0, " + this.alpha1 + ")"; // 線の色と透明度
        ctx.shadowBlur = 0; // 影のぼかし効果

        ctx.fillStyle = "rgba(0, 70, 0, " + this.alpha2 + ")";

        let vertices = this.isUseAnimVertices ? this.animVertices : this.vertices;
        super.setShapePathByVertices(ctx, vertices, offsetX, offsetY);
        ctx.fill();

        ctx.strokeStyle = "rgba(0, 140, 0, " + this.alpha3 + ")"; // 線の色と透明度
        ctx.lineWidth = 2; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル

        ctx.beginPath();
        ctx.moveTo(vertices[Param.LTT].x + this.notchSize + offsetX, vertices[Param.LTT].y - this.animOffset + offsetY);
        ctx.lineTo(vertices[Param.LTT].x - this.animOffset + offsetX, vertices[Param.LTT].y - this.animOffset + offsetY);
        ctx.lineTo(vertices[Param.LLT].x - this.animOffset + offsetX, vertices[Param.LLT].y - this.animOffset + offsetY);
        ctx.lineTo(vertices[Param.LLT].x - this.animOffset + offsetX, vertices[Param.LLT].y + this.notchSize + offsetY);
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(vertices[Param.RTT].x - this.notchSize + offsetX, vertices[Param.RTT].y - this.animOffset + offsetY);
        ctx.lineTo(vertices[Param.RTT].x + this.animOffset + offsetX, vertices[Param.RTT].y - this.animOffset + offsetY);
        ctx.lineTo(vertices[Param.RRT].x + this.animOffset + offsetX, vertices[Param.RRT].y - this.animOffset + offsetY);
        ctx.lineTo(vertices[Param.RRT].x + this.animOffset + offsetX, vertices[Param.RRT].y + this.notchSize + offsetY);
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(vertices[Param.RRB].x + this.animOffset + offsetX, vertices[Param.RRB].y - this.notchSize + offsetY);
        ctx.lineTo(vertices[Param.RRB].x + this.animOffset + offsetX, vertices[Param.RRB].y + this.animOffset + offsetY);
        ctx.lineTo(vertices[Param.RBB].x + this.animOffset + offsetX, vertices[Param.RBB].y + this.animOffset + offsetY);
        ctx.lineTo(vertices[Param.RBB].x - this.notchSize + offsetX, vertices[Param.RBB].y + this.animOffset + offsetY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(vertices[Param.LBB].x + this.notchSize + offsetX, vertices[Param.LBB].y + this.animOffset + offsetY);
        ctx.lineTo(vertices[Param.LBB].x - this.animOffset + offsetX, vertices[Param.LBB].y + this.animOffset + offsetY);
        ctx.lineTo(vertices[Param.LLB].x - this.animOffset + offsetX, vertices[Param.LLB].y + this.animOffset + offsetY);
        ctx.lineTo(vertices[Param.LLB].x - this.animOffset + offsetX, vertices[Param.LLB].y - this.notchSize + offsetY);
        ctx.stroke();
    }

    /**
     * アニメーション用の八角形の座標を初期化
     */
    initAnimation()
    {
        this.animVertices = [
            new Vertex(0, 0),
            new Vertex(0, 0),
            new Vertex(0, 0),
            new Vertex(0, 0),
            new Vertex(0, 0),
            new Vertex(0, 0),
            new Vertex(0, 0),
            new Vertex(0, 0),
        ];
        this.minVertices = [
            new Vertex(this.center.x - this.notchSize, this.center.y - this.notchSize * 2),
            new Vertex(this.center.x + this.notchSize, this.center.y - this.notchSize * 2),
            new Vertex(this.center.x + this.notchSize * 2, this.center.y - this.notchSize),
            new Vertex(this.center.x + this.notchSize * 2, this.center.y + this.notchSize),
            new Vertex(this.center.x + this.notchSize, this.center.y + this.notchSize * 2),
            new Vertex(this.center.x - this.notchSize, this.center.y + this.notchSize * 2),
            new Vertex(this.center.x - this.notchSize * 2, this.center.y + this.notchSize),
            new Vertex(this.center.x - this.notchSize * 2, this.center.y - this.notchSize),
        ];
        this.isUseAnimVertices = true;
    }

    /**
     * アニメーション用の八角形の座標を設定
     *
     * @param {number} ratio
     */
    setAnimOctagon(ratio)
    {
        for (let vertexNo = 0; vertexNo < this.vertices.length; vertexNo++) {
            this.animVertices[vertexNo].x = Util.lerp(this.minVertices[vertexNo].x, this.vertices[vertexNo].x, ratio);
            this.animVertices[vertexNo].y = Util.lerp(this.minVertices[vertexNo].y, this.vertices[vertexNo].y, ratio);
        }
    }

    /**
     * 出現アニメーション開始
     */
    appear()
    {
        super.appear();
        this.initAnimation();
        this.setAnimOctagon(0.0);
        this.alpha1 = 0.0;
        this.alpha2 = 0.0;
        this.alpha3 = 0.0;
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        if (window.hgn.animElapsedTime < 100) {
            if (this._isInViewRect) {
                let ratio = window.hgn.animElapsedTime / 100;
                this.animAlpha1 = Util.lerp(0, 0.4, ratio);
                this.animAlpha2 = Util.lerp(0, 0.7, ratio);
                this.animAlpha3 = Util.lerp(0, 0.8, ratio);
                window.hgn.setDrawMain(false);
            }
        } else if (window.hgn.animElapsedTime >= 100) {
            this.alpha1 = 0.4;
            this.alpha2 = 0.7;
            this.alpha3 = 0.8;
            window.hgn.setDrawMain(false);
        }

        if (window.hgn.animElapsedTime < 300) {
            this.setAnimOctagon(window.hgn.animElapsedTime / 300);
            window.hgn.setDrawMain(false);
        } else if (window.hgn.animElapsedTime >= 300) {
            this.isUseAnimVertices = false;
            this.setOctagon();
            this.fadeInText();
            this._animFunc = this.appearAnimation2;
            window.hgn.setDrawMain(false);
        }
    }

    /**
     * 出現アニメーション2
     */
    appearAnimation2()
    {
        if (window.hgn.animElapsedTime >= 400) {
            this.animOffset++;
            if (this.animOffset >= 5) {
                this._animFunc = this.appeared;
            }
            window.hgn.setDrawMain(false);
        }
    }

    /**
     * 出現アニメーション完了
     */
    appeared()
    {
        super.appeared();

        this.alpha1 = 0.4;
        this.alpha2 = 0.7;
        this.alpha3 = 0.8;
        this.animOffset = 5
        this.setOctagon();
        this.minVertices = null;
        window.hgn.setDrawMain(false);
    }

    /**
     * 消失アニメーション開始
     */
    disappear()
    {
        super.disappear();
        this.initAnimation();
        this.setAnimOctagon(1);
        this.fadeOutText();
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
        if (this.animOffset > 0) {
            this.animOffset--;
            
            window.hgn.setDrawMain(false);
        }

        if (window.hgn.animElapsedTime > 200) {
            const animElapsedTime = window.hgn.animElapsedTime - 200;
            this.setAnimOctagon(1 - (animElapsedTime / 300));

            if (animElapsedTime >= 200) {
                let ratio = 1 - (animElapsedTime - 200) / 50;
                this.animAlpha1 = Util.lerp(0, 0.4, ratio);
                this.animAlpha2 = Util.lerp(0, 0.7, ratio);
                this.animAlpha3 = Util.lerp(0, 0.8, ratio);
                if (this.animAlpha1 === 0) {
                    this._animFunc = this.disappeared;
                }
            }

            window.hgn.setDrawMain(false);
        }
    }

    /**
     * 消失アニメーション完了
     */
    disappeared()
    {
        super.disappeared();
        this.hideText();
        this.animVertices = this.minVertices;
        this.alpha1 = 0.0;
        this.alpha2 = 0.0;
        this.alpha3 = 0.0;
    }
}

export class Head2Node extends DOMNode
{
    /**
     * コンストラクタ
     *
     * @param id
     * @param x
     * @param y
     * @param DOM
     * @param notchSize
     */
    constructor(id, x, y, DOM, notchSize = 15)
    {
        super(id, x, y, DOM, notchSize);
        this.animAlpha1 = 1;
        this.animAlpha2 = 0.7;
        this.animAlpha3 = 0.5;
        this.animWidth = 0;
        this.setAnimOctagon(0);
        this.isAppeared = false;
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
        if (!this.isAppeared) {
            return;
        }

        if (!this.isDraw(isDrawOutsideView)) {
            return;
        }

        ctx.lineWidth = 0; // 線の太さ
        ctx.shadowBlur = 0; // 影のぼかし効果

        // 中央から外に向かってグラデーション
        let grad = ctx.createRadialGradient(
            this.center.x + offsetX, this.center.y + offsetY, 0,
            this.center.x + offsetX, this.center.y + offsetY, this.animWidth / 2
        );
        grad.addColorStop(0, "rgba(0, 70, 0, " + this.animAlpha2 + ")");
        grad.addColorStop(1, "rgba(0, 50, 0, " + this.animAlpha3 + ")");
        ctx.fillStyle = grad;

        super.setShapePath(ctx, offsetX, offsetY);
        ctx.fill();

        ctx.strokeStyle = "rgba(0, 180, 0, " + this.animAlpha1 + ")"; // 線の色と透明度
        ctx.lineWidth = 1; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル

        ctx.beginPath();
        ctx.moveTo(this.vertices[Param.LTT].x + this.notchSize + offsetX, this.vertices[Param.LTT].y + offsetY);
        ctx.lineTo(this.vertices[Param.LTT].x + offsetX, this.vertices[Param.LTT].y + offsetY);
        ctx.lineTo(this.vertices[Param.LLT].x + offsetX, this.vertices[Param.LLT].y + offsetY);
        ctx.lineTo(this.vertices[Param.LLB].x + offsetX, this.vertices[Param.LLB].y + offsetY);
        ctx.lineTo(this.vertices[Param.LBB].x + offsetX, this.vertices[Param.LBB].y + offsetY);
        ctx.lineTo(this.vertices[Param.LBB].x + this.notchSize + offsetX, this.vertices[Param.LBB].y + offsetY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.vertices[Param.RTT].x - this.notchSize + offsetX, this.vertices[Param.RTT].y + offsetY);
        ctx.lineTo(this.vertices[Param.RTT].x + offsetX, this.vertices[Param.RTT].y + offsetY);
        ctx.lineTo(this.vertices[Param.RRT].x + offsetX, this.vertices[Param.RRT].y + offsetY);
        ctx.lineTo(this.vertices[Param.RRB].x + offsetX, this.vertices[Param.RRB].y + offsetY);
        ctx.lineTo(this.vertices[Param.RBB].x + offsetX, this.vertices[Param.RBB].y + offsetY);
        ctx.lineTo(this.vertices[Param.RBB].x - this.notchSize + offsetX, this.vertices[Param.RBB].y + offsetY);
        ctx.stroke();
    }

    /**
     * 出現開始
     */
    appear()
    {
        this.isAppeared = true;
        super.appear();
        this.setAnimOctagon(0);
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        // 最初の10Cntはフェードイン
        if (window.hgn.animElapsedTime < 300) {
            this.setAnimOctagon(window.hgn.animElapsedTime / 300);
        } else {
            // アニメーション終了
            this.setOctagon();
            this.animWidth = this.w;
            this._animFunc = null;
            this.fadeInText();
        }
    }

    /**
     * アニメーション用六角形の座標設定
     * 
     * @param {number} ratio 
     */
    setAnimOctagon(ratio)
    {
        this.animWidth = Util.lerp(this.notchSize * 4, this.w, ratio);
        let offsetX = this.w / 2;
        let moveX = this.animWidth / 2;
        this.vertices[Param.LTT].x = this.x + this.notchSize + offsetX - moveX;
        this.vertices[Param.RTT].x = this.x + moveX - this.notchSize + offsetX;
        this.vertices[Param.RRT].x = this.x + moveX + offsetX;
        this.vertices[Param.RRB].x = this.x + moveX + offsetX;
        this.vertices[Param.RBB].x = this.x + moveX - this.notchSize + offsetX;
        this.vertices[Param.LBB].x = this.x + this.notchSize + offsetX - moveX;
        this.vertices[Param.LLB].x = this.x + offsetX - moveX;
        this.vertices[Param.LLT].x = this.x + offsetX - moveX;
    }

    /**
     * 出現アニメーション完了
     */
    appeared()
    {
        this.isAppeared = true;
        this.animWidth = this.w;
        this.setOctagon();
        this.showText();
    }

    /**
     * 消失開始
     */
    disappear()
    {
        super.disappear();
        this.fadeOutText();
    }

    /**
     * 消失アニメーション
     */
    disappearAnimation()
    {
        // 最初は縮小
        if (window.hgn.animElapsedTime < 200) {
            let ratio = 1 - window.hgn.animElapsedTime / 200;
            this.setAnimOctagon(ratio);
        } else if (window.hgn.animElapsedTime >= 200) {
            this.setAnimOctagon(0);
            this._animFunc = this.disappearAnimation2;
        }
    }

    /**
     * 消失アニメーション2
     */
    disappearAnimation2()
    {
        if (window.hgn.animElapsedTime < 500) {
            let ratio = 1 - (window.hgn.animElapsedTime / (500 - 200));
            this.animAlpha1 = Util.lerp(0, 1, ratio);
            this.animAlpha2 = Util.lerp(0, 0.7, ratio);
            this.animAlpha3 = Util.lerp(0, 0.5, ratio);
        } else {
            // アニメーション終了
            this._animFunc = this.disappeared;
        }
    }
}


export class Head3Node extends DOMNode
{
    /**
     * コンストラクタ
     *
     * @param {string} id
     * @param {number} x
     * @param {number} y
     * @param {HTMLElement} DOM
     * @param {number} notchSize
     */
    constructor(id, x, y, DOM, notchSize = 5)
    {
        super(id, x, y, DOM, notchSize);
    }

    /**
     * 出現開始
     */
    appear()
    {
        super.appear();
        this.fadeInText();
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        this.appeared();
    }

    /**
     * 消失開始
     */
    disappear()
    {
        super.disappear();
        this.fadeOutText();
    }

    /**
     * 消失アニメーション
     */
    disappearAnimation()
    {
        this.disappeared();
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
        // 何も描画しない
    }
}

