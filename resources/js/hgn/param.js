export class Param
{
    static MATH_PI_2 = Math.PI * 2;

    // 八角形の各頂点のインデックス番号
    // LTT=LeftTopTop 左上の上側の頂点
    static LTT = 0;
    static RTT = 1;
    static RRT = 2;
    static RRB = 3;
    static RBB = 4;
    static LBB = 5;
    static LLB = 6;
    static LLT = 7;

    static setLinkNodeCtx(ctx)
    {
        ctx.strokeStyle = "rgba(0, 180, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 2; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル
        ctx.shadowColor = "lime"; // 影の色
        ctx.shadowBlur = 10; // 影のぼかし効果
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    }

    static CONNECT_TYPE_OUTGOING = 1;
    static CONNECT_TYPE_INCOMING = 2;
}
