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

    static IS_TOUCH_DEVICE = window ? ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) : false;

    static SUB_NETWORK_SCROLL_RATE = 1.2;
    static BG_SCROLL_RATE = 20;
    static BG_SIZE_RATE = 4;
    static BG_OFFSET = 25;

    static CONTENT_NODE_NOTCH_SIZE = 70;

    // フリック関連のパラメータ（マウス操作用）
    static MOUSE_DRAG_FLICK_RATE = 0.9;    // 減速率（大きいほどゆっくり減速）
    static MOUSE_DRAG_FLICK_SPEED_SCALE = 3; // フリックの初速スケール（大きいほど速く動く）
    static MOUSE_MIN_FLICK_SPEED = 1.0;     // マウス操作での最小フリック速度

    // フリック関連のパラメータ（タッチ操作用）
    static TOUCH_DRAG_FLICK_RATE = 0.85;    // タッチ操作用の減速率（マウスより早く減速）
    static TOUCH_DRAG_FLICK_SPEED_SCALE = 4; // タッチ操作用の初速スケール（マウスより速く）
    static TOUCH_MIN_FLICK_SPEED = 0.5;     // タッチ操作での最小フリック速度（マウスより小さい値）

    // 後方互換性のため残す（非推奨）
    static DRAG_FLICK_RATE = 0.9;
    static DRAG_FLICK_SPEED_SCALE = 3;

    // ホイール操作のスクロール量
    static WHEEL_SCROLL_AMOUNT = 50;    // 上下スクロール量
    static WHEEL_TILT_AMOUNT = 50;      // 左右チルトスクロール量

    /**
     * 描画するかを決める表示領域のマージン
     *
     * @type {number}
     */
    static VIEW_RECT_MARGIN = 10;

    static SHOW_DEBUG = false;
}
