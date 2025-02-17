import { DOMNode } from './octa-node.js';
import { Param } from '../common/param.js';
import { Util } from '../common/util.js';
import { Vertex } from "../common/vertex.js";
import { HorrorGameNetwork } from '../horror-game-network.js';
/**
 * @type {HorrorGameNetwork}
 */
window.hgn;


export class Head1Node extends DOMNode
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
     * @param ctx
     * @param {Rect} viewRect
     */
    draw(ctx, viewRect)
    {
        const [isDraw, left, top] = this.isDraw(viewRect);
        if (!isDraw) {
            return;
        }

        ctx.lineWidth = 0; // 線の太さ
        ctx.strokeStyle = "rgba(0, 180, 0, " + this.alpha1 + ")"; // 線の色と透明度
        ctx.shadowBlur = 0; // 影のぼかし効果

        ctx.fillStyle = "rgba(0, 70, 0, " + this.alpha2 + ")";

        let vertices = this.isUseAnimVertices ? this.animVertices : this.vertices;

        super.setShapePathByVertices(ctx, vertices);
        ctx.fill();

        ctx.strokeStyle = "rgba(0, 140, 0, " + this.alpha3 + ")"; // 線の色と透明度
        ctx.lineWidth = 2; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル

        ctx.beginPath();
        ctx.moveTo(vertices[Param.LTT].x + this.notchSize + left, vertices[Param.LTT].y - this.animOffset + top);
        ctx.lineTo(vertices[Param.LTT].x - this.animOffset + left, vertices[Param.LTT].y - this.animOffset + top);
        ctx.lineTo(vertices[Param.LLT].x - this.animOffset + left, vertices[Param.LLT].y - this.animOffset + top);
        ctx.lineTo(vertices[Param.LLT].x - this.animOffset + left, vertices[Param.LLT].y + this.notchSize + top);
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(vertices[Param.RTT].x - this.notchSize + left, vertices[Param.RTT].y - this.animOffset + top);
        ctx.lineTo(vertices[Param.RTT].x + this.animOffset + left, vertices[Param.RTT].y - this.animOffset + top);
        ctx.lineTo(vertices[Param.RRT].x + this.animOffset + left, vertices[Param.RRT].y - this.animOffset + top);
        ctx.lineTo(vertices[Param.RRT].x + this.animOffset + left, vertices[Param.RRT].y + this.notchSize + top);
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(vertices[Param.RRB].x + this.animOffset + left, vertices[Param.RRB].y - this.notchSize + top);
        ctx.lineTo(vertices[Param.RRB].x + this.animOffset + left, vertices[Param.RRB].y + this.animOffset + top);
        ctx.lineTo(vertices[Param.RBB].x + this.animOffset + left, vertices[Param.RBB].y + this.animOffset + top);
        ctx.lineTo(vertices[Param.RBB].x - this.notchSize + left, vertices[Param.RBB].y + this.animOffset + top);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(vertices[Param.LBB].x + this.notchSize + left, vertices[Param.LBB].y + this.animOffset + top);
        ctx.lineTo(vertices[Param.LBB].x - this.animOffset + left, vertices[Param.LBB].y + this.animOffset + top);
        ctx.lineTo(vertices[Param.LLB].x - this.animOffset + left, vertices[Param.LLB].y + this.animOffset + top);
        ctx.lineTo(vertices[Param.LLB].x - this.animOffset + left, vertices[Param.LLB].y - this.notchSize + top);
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
     * @param ratio
     */
    setAnimOctagon(ratio)
    {
        for (let vertexNo = 0; vertexNo < this.vertices.length; vertexNo++) {
            this.animVertices[vertexNo].x = Util.getMidpoint(this.minVertices[vertexNo].x, this.vertices[vertexNo].x, ratio);
            this.animVertices[vertexNo].y = Util.getMidpoint(this.minVertices[vertexNo].y, this.vertices[vertexNo].y, ratio);
        }
    }

    /**
     * 出現
     */
    appear()
    {
        if (this.isSkipAnim()) {
            this.appeared();
        } else {
            super.appear();
            this.initAnimation();
            this.setAnimOctagon(0.0);
            this.alpha1 = 0.0;
            this.alpha2 = 0.0;
            this.alpha3 = 0.0;
        }
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        if (window.hgn.animCnt < 5) {
            let ratio = window.hgn.animCnt / 5;
            this.animAlpha1 = Util.getMidpoint(0, 0.4, ratio);
            this.animAlpha2 = Util.getMidpoint(0, 0.7, ratio);
            this.animAlpha3 = Util.getMidpoint(0, 0.8, ratio);
        } else if (window.hgn.animCnt === 5) {
            this.alpha1 = 0.4;
            this.alpha2 = 0.7;
            this.alpha3 = 0.8;
        }

        if (window.hgn.animCnt < 15) {
            this.setAnimOctagon(window.hgn.animCnt / 15);
        } else if (window.hgn.animCnt === 15) {
            this.isUseAnimVertices = false;
            this.setOctagon();
            this.fadeInText();
        } else if (window.hgn.animCnt < 25) {
        } else if (window.hgn.animCnt < 30) {
            this.animOffset++;
        } else {
            this.alpha1 = 0.4;
            this.alpha2 = 0.7;
            this.alpha3 = 0.8;
            this.animOffset = 5
            this.animFunc = null;
            this.animVertices = null;
            this.minVertices = null;
        }
    }

    appeared()
    {
        this.alpha1 = 0.4;
        this.alpha2 = 0.7;
        this.alpha3 = 0.8;
        this.animOffset = 5
        this.setOctagon();
    }

    /**
     * 消える
     */
    disappear()
    {
        if (this.isSkipAnim()) {
            this.disappeared();
        } else {
            super.disappear();
            this.initAnimation();
            this.setAnimOctagon(1);
            this.fadeOutText();
        }
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
        if (window.hgn.animCnt < 5) {
            this.animOffset--;
        } else if (window.hgn.animCnt === 5) {
            this.animOffset = 0;
        } else if (window.hgn.animCnt < 15) {
        } else if (window.hgn.animCnt < 30) {
            this.setAnimOctagon(1 - ((window.hgn.animCnt - 15) / 15));

            if (window.hgn.animCnt >= 25) {
                let ratio = 1 - (window.hgn.animCnt - 25) / 5;
                this.animAlpha1 = Util.getMidpoint(0, 0.4, ratio);
                this.animAlpha2 = Util.getMidpoint(0, 0.7, ratio);
                this.animAlpha3 = Util.getMidpoint(0, 0.8, ratio);
            }
        } else {
            this.animFunc = null;
            this.animVertices = this.minVertices;
            this.alpha1 = 0.0;
            this.alpha2 = 0.0;
            this.alpha3 = 0.0;
        }
    }

    disappeared()
    {
        this.hideText();
        this.animVertices = this.minVertices;
        this.alpha1 = 0.0;
        this.alpha2 = 0.0;
        this.alpha3 = 0.0;
    }
}

export class Head2Node extends DOMNode
{
    static FADE_CNT = 10;
    static SCALE_CNT = 20;

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
     * @param ctx
     * @param {Rect} viewRect
     */
    draw(ctx, viewRect)
    {
        if (!this.isAppeared) {
            return;
        }

        const [isDraw, left, top] = this.isDraw(viewRect);
        if (!isDraw) {
            return;
        }

        ctx.lineWidth = 0; // 線の太さ
        ctx.shadowBlur = 0; // 影のぼかし効果

        // 中央から外に向かってグラデーション
        let grad = ctx.createRadialGradient(
            this.center.x + left, this.center.y + top, 0,
            this.center.x + left, this.center.y + top, this.animWidth / 2
        );
        grad.addColorStop(0, "rgba(0, 70, 0, " + this.animAlpha2 + ")");
        grad.addColorStop(1, "rgba(0, 50, 0, " + this.animAlpha3 + ")");
        ctx.fillStyle = grad;

        super.setShapePath(ctx, left, top);
        ctx.fill();

        ctx.strokeStyle = "rgba(0, 180, 0, " + this.animAlpha1 + ")"; // 線の色と透明度
        ctx.lineWidth = 1; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル

        ctx.beginPath();
        ctx.moveTo(this.vertices[Param.LTT].x + this.notchSize + left, this.vertices[Param.LTT].y + top);
        ctx.lineTo(this.vertices[Param.LTT].x + left, this.vertices[Param.LTT].y + top);
        ctx.lineTo(this.vertices[Param.LLT].x + left, this.vertices[Param.LLT].y + top);
        ctx.lineTo(this.vertices[Param.LLB].x + left, this.vertices[Param.LLB].y + top);
        ctx.lineTo(this.vertices[Param.LBB].x + left, this.vertices[Param.LBB].y + top);
        ctx.lineTo(this.vertices[Param.LBB].x + this.notchSize + left, this.vertices[Param.LBB].y + top);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.vertices[Param.RTT].x - this.notchSize + left, this.vertices[Param.RTT].y + top);
        ctx.lineTo(this.vertices[Param.RTT].x + left, this.vertices[Param.RTT].y + top);
        ctx.lineTo(this.vertices[Param.RRT].x + left, this.vertices[Param.RRT].y + top);
        ctx.lineTo(this.vertices[Param.RRB].x + left, this.vertices[Param.RRB].y + top);
        ctx.lineTo(this.vertices[Param.RBB].x + left, this.vertices[Param.RBB].y + top);
        ctx.lineTo(this.vertices[Param.RBB].x - this.notchSize + left, this.vertices[Param.RBB].y + top);
        ctx.stroke();
    }

    appear()
    {
        if (this.isSkipAnim()) {
            this.appeared();
        } else {
            this.isAppeared = true;
            super.appear();
            this.setAnimOctagon(0);
        }
    }

    appearAnimation()
    {
        // 最初の10Cntはフェードイン
        /*if (window.hgn.animCnt < Head2Node.FADE_CNT) {
            let ratio = window.hgn.animCnt / Head2Node.FADE_CNT;
            this.animAlpha1 = Util.getMidpoint(0, 1, ratio);
            this.animAlpha2 = Util.getMidpoint(0, 0.7, ratio);
            this.animAlpha3 = Util.getMidpoint(0, 0.5, ratio);
            this.setAnimOctagon(0);
        } else if (window.hgn.animCnt < (Head2Node.FADE_CNT + Head2Node.SCALE_CNT - 1)) {*/
        if (window.hgn.animCnt < 15) {
            //let ratio = (window.hgn.animCnt - Head2Node.FADE_CNT) / Head2Node.SCALE_CNT;
            this.setAnimOctagon(window.hgn.animCnt / 15);
        } else {
            // アニメーション終了
            this.setOctagon();
            this.animWidth = this.w;
            this.animFunc = null;
            this.fadeInText();
        }
    }

    setAnimOctagon(ratio)
    {
        this.animWidth = Util.getMidpoint(this.notchSize * 4, this.w, ratio);
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

    appeared()
    {
        this.isAppeared = true;
        this.animWidth = this.w;
        this.setOctagon();
        this.showText();
    }

    disappear()
    {
        if (this.isSkipAnim()) {
            this.isAppeared = false;
            this.setAnimOctagon(0);
            this.hideText();
        } else {
            super.disappear();
            this.fadeOutText();
        }
    }

    disappearAnimation()
    {
        // 最初は縮小
        if (window.hgn.animCnt < Head2Node.SCALE_CNT) {
            let ratio = 1 - window.hgn.animCnt / Head2Node.SCALE_CNT;
            this.setAnimOctagon(ratio);
        } else if (window.hgn.animCnt === Head2Node.SCALE_CNT) {
            this.setAnimOctagon(0);
        } else if (window.hgn.animCnt < (Head2Node.FADE_CNT + Head2Node.SCALE_CNT)) {
            let ratio = 1 - (window.hgn.animCnt - Head2Node.FADE_CNT) / Head2Node.SCALE_CNT;
            this.animAlpha1 = Util.getMidpoint(0, 1, ratio);
            this.animAlpha2 = Util.getMidpoint(0, 0.7, ratio);
            this.animAlpha3 = Util.getMidpoint(0, 0.5, ratio);
        } else {
            // アニメーション終了
            this.animFunc = null;
            this.isAppeared = false;
        }
    }
}


export class Head3Node extends DOMNode
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
    constructor(id, x, y, DOM, notchSize = 5)
    {
        super(id, x, y, DOM, notchSize);
    }

    /**
     * 描画
     *
     * @param ctx
     * @param {Rect} viewRect
     */
    draw(ctx, viewRect)
    {
    }

    appear()
    {
        super.appear();
        this.fadeInText();
    }

    appearAnimation()
    {
        // アニメーション終了
        this.animFunc = null;
    }

    disappear()
    {
        super.disappear();
        this.fadeOutText();
    }

    disappearAnimation()
    {
        // アニメーション終了
        this.animFunc = null;
    }
}

