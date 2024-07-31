import {DOMNode} from './octa-node.js';
import {Param} from '../param.js';
import {Util} from '../util.js';
import {Vertex} from "../vertex.js";

export class Head1Node extends DOMNode
{
    /**
     * コンストラクタ
     *
     * @param DOM
     * @param notchSize
     */
    constructor(DOM, notchSize = 15)
    {
        super(DOM, notchSize);

        this.animOffset = 0;
        this.animWidth = notchSize * 4;
        this.animVertices = null;
        this.minVertices = null;
        this.isUseAnimVertices = false;
        this.alpha1 = 0.4;
        this.alpha2 = 0.7;
        this.alpha3 = 0.8;
    }

    /**
     * 描画
     *
     * @param ctx
     */
    draw(ctx)
    {
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
        ctx.moveTo(vertices[Param.LTT].x + this.notchSize, vertices[Param.LTT].y - this.animOffset);
        ctx.lineTo(vertices[Param.LTT].x - this.animOffset, vertices[Param.LTT].y - this.animOffset);
        ctx.lineTo(vertices[Param.LLT].x - this.animOffset, vertices[Param.LLT].y - this.animOffset);
        ctx.lineTo(vertices[Param.LLT].x - this.animOffset, vertices[Param.LLT].y + this.notchSize);
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(vertices[Param.RTT].x - this.notchSize, vertices[Param.RTT].y - this.animOffset);
        ctx.lineTo(vertices[Param.RTT].x + this.animOffset, vertices[Param.RTT].y - this.animOffset);
        ctx.lineTo(vertices[Param.RRT].x + this.animOffset, vertices[Param.RRT].y - this.animOffset);
        ctx.lineTo(vertices[Param.RRT].x + this.animOffset, vertices[Param.RRT].y + this.notchSize);
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(vertices[Param.RRB].x + this.animOffset, vertices[Param.RRB].y - this.notchSize);
        ctx.lineTo(vertices[Param.RRB].x + this.animOffset, vertices[Param.RRB].y + this.animOffset);
        ctx.lineTo(vertices[Param.RBB].x + this.animOffset, vertices[Param.RBB].y + this.animOffset);
        ctx.lineTo(vertices[Param.RBB].x - this.notchSize, vertices[Param.RBB].y + this.animOffset);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(vertices[Param.LBB].x + this.notchSize, vertices[Param.LBB].y + this.animOffset);
        ctx.lineTo(vertices[Param.LBB].x - this.animOffset, vertices[Param.LBB].y + this.animOffset);
        ctx.lineTo(vertices[Param.LLB].x - this.animOffset, vertices[Param.LLB].y + this.animOffset);
        ctx.lineTo(vertices[Param.LLB].x - this.animOffset, vertices[Param.LLB].y - this.notchSize);
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
            this.animOffset = 5
            this.animFunc = null;
            this.animVertices = null;
            this.minVertices = null;
        }
    }

    /**
     * 消える
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
}



export class Head2Node extends DOMNode
{
    static FADE_CNT = 10;
    static SCALE_CNT = 20;

    /**
     * コンストラクタ
     *
     * @param DOM
     * @param notchSize
     */
    constructor(DOM, notchSize = 15)
    {
        super(DOM, notchSize);
        this.animAlpha1 = 1;
        this.animAlpha2 = 0.7;
        this.animAlpha3 = 0.5;
        this.animWidth = 0;
        this.setAnimOctagon(0);
    }

    /**
     * 描画
     *
     * @param ctx
     */
    draw(ctx)
    {
        ctx.lineWidth = 0; // 線の太さ
        ctx.shadowBlur = 0; // 影のぼかし効果

        // 中央から外に向かってグラデーション
        let center = this.center;
        let grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, this.animWidth / 2);
        grad.addColorStop(0, "rgba(0, 70, 0, " + this.animAlpha2 + ")");
        grad.addColorStop(1, "rgba(0, 50, 0, " + this.animAlpha3 + ")");
        ctx.fillStyle = grad;

        super.setShapePath(ctx);
        ctx.fill();

        ctx.strokeStyle = "rgba(0, 180, 0, " + this.animAlpha1 + ")"; // 線の色と透明度
        ctx.lineWidth = 1; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル

        ctx.beginPath();
        ctx.moveTo(this.vertices[Param.LTT].x + this.notchSize, this.vertices[Param.LTT].y);
        ctx.lineTo(this.vertices[Param.LTT].x, this.vertices[Param.LTT].y);
        ctx.lineTo(this.vertices[Param.LLT].x, this.vertices[Param.LLT].y);
        ctx.lineTo(this.vertices[Param.LLB].x, this.vertices[Param.LLB].y);
        ctx.lineTo(this.vertices[Param.LBB].x, this.vertices[Param.LBB].y);
        ctx.lineTo(this.vertices[Param.LBB].x + this.notchSize, this.vertices[Param.LBB].y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.vertices[Param.RTT].x - this.notchSize, this.vertices[Param.RTT].y);
        ctx.lineTo(this.vertices[Param.RTT].x, this.vertices[Param.RTT].y);
        ctx.lineTo(this.vertices[Param.RRT].x, this.vertices[Param.RRT].y);
        ctx.lineTo(this.vertices[Param.RRB].x, this.vertices[Param.RRB].y);
        ctx.lineTo(this.vertices[Param.RBB].x, this.vertices[Param.RBB].y);
        ctx.lineTo(this.vertices[Param.RBB].x - this.notchSize, this.vertices[Param.RBB].y);
        ctx.stroke();
    }

    appear()
    {
        super.appear();
        this.setAnimOctagon(0);
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

    disappear()
    {
        super.disappear();
        this.fadeOutText();
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
        }
    }
}


export class Head3Node extends DOMNode
{
    /**
     * コンストラクタ
     *
     * @param DOM
     * @param notchSize
     */
    constructor(DOM, notchSize = 5)
    {
        super(DOM, notchSize);
    }

    /**
     * 描画
     *
     * @param ctx
     */
    draw(ctx)
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

