import {DOMNode} from './octa-node.js';
import {Param} from '../param.js';


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
    }

    /**
     * 描画
     *
     * @param ctx
     */
    draw(ctx)
    {
        ctx.lineWidth = 0; // 線の太さ
        ctx.strokeStyle = "rgba(0, 180, 0, 0.4)"; // 線の色と透明度
        ctx.shadowBlur = 0; // 影のぼかし効果

        ctx.fillStyle = "rgba(0, 70, 0, 0.7)";

        super.setShapePath(ctx);
        ctx.fill();


        ctx.strokeStyle = "rgba(0, 140, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 2; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル

        ctx.beginPath();
        ctx.moveTo(this.vertices[Param.LTT].x + this.notchSize, this.vertices[Param.LTT].y - 5);
        ctx.lineTo(this.vertices[Param.LTT].x - 5, this.vertices[Param.LTT].y - 5);
        ctx.lineTo(this.vertices[Param.LLT].x - 5, this.vertices[Param.LLT].y - 5);
        ctx.lineTo(this.vertices[Param.LLT].x - 5, this.vertices[Param.LLT].y + this.notchSize);
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(this.vertices[Param.RTT].x - this.notchSize, this.vertices[Param.RTT].y - 5);
        ctx.lineTo(this.vertices[Param.RTT].x + 5, this.vertices[Param.RTT].y - 5);
        ctx.lineTo(this.vertices[Param.RRT].x + 5, this.vertices[Param.RRT].y - 5);
        ctx.lineTo(this.vertices[Param.RRT].x + 5, this.vertices[Param.RRT].y + this.notchSize);
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(this.vertices[Param.RRB].x + 5, this.vertices[Param.RRB].y - this.notchSize);
        ctx.lineTo(this.vertices[Param.RRB].x + 5, this.vertices[Param.RRB].y + 5);
        ctx.lineTo(this.vertices[Param.RBB].x + 5, this.vertices[Param.RBB].y + 5);
        ctx.lineTo(this.vertices[Param.RBB].x - this.notchSize, this.vertices[Param.RBB].y + 5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.vertices[Param.LBB].x + this.notchSize, this.vertices[Param.LBB].y + 5);
        ctx.lineTo(this.vertices[Param.LBB].x - 5, this.vertices[Param.LBB].y + 5);
        ctx.lineTo(this.vertices[Param.LLB].x - 5, this.vertices[Param.LLB].y + 5);
        ctx.lineTo(this.vertices[Param.LLB].x - 5, this.vertices[Param.LLB].y - this.notchSize);
        ctx.stroke();



    }
}



export class Head2Node extends DOMNode
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
    }

    /**
     * 描画
     *
     * @param ctx
     */
    draw(ctx)
    {
        ctx.lineWidth = 0; // 線の太さ
        ctx.strokeStyle = "rgba(0, 180, 0, 0.4)"; // 線の色と透明度
        ctx.shadowBlur = 0; // 影のぼかし効果

        // 中央から外に向かってグラデーション
        let center = this.center;
        let grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, this.w / 2);
        grad.addColorStop(0, "rgba(0, 70, 0, 0.7)");
        grad.addColorStop(1, "rgba(0, 50, 0, 0.5)");
        ctx.fillStyle = grad;

        super.setShapePath(ctx);
        ctx.fill();


        ctx.strokeStyle = "rgba(0, 180, 0)"; // 線の色と透明度
        ctx.lineWidth = 3; // 線の太さ
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
}
