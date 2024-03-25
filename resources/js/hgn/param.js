/**
 * 定数とかをまとめるクラス
 */
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

    static CONNECT_TYPE_OUTGOING = 1;
    static CONNECT_TYPE_INCOMING = 2;

    static IS_TOUCH_DEVICE = ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);
}
