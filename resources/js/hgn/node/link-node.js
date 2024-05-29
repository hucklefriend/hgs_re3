import {Vertex} from '../vertex.js';
import {Param} from '../param.js';
import {Network} from '../network.js';
import {PointNode} from './point-node.js';
import {OctaNodeConnect, PointNodeConnect, Bg2Connect} from './connect.js';
import {HorrorGameNetwork} from '../../hgn.js';
import {DOMNode} from './octa-node.js';


export class LinkNode extends DOMNode
{
    /**
     * コンストラクタ
     *
     * @param DOM
     * @param notchSize
     */
    constructor(DOM, notchSize = 13)
    {
        super(DOM, notchSize);

        this.isHover = false;

        DOM.addEventListener('mouseenter', () => this.mouseEnter());
        DOM.addEventListener('mouseleave', () => this.mouseLeave());
        DOM.addEventListener('click', () => this.mouseClick());

        if (Param.IS_TOUCH_DEVICE) {
            DOM.addEventListener('touchstart', () => this.mouseEnter());
            DOM.addEventListener('touchend', () => this.mouseLeave());
        }

        this.subNodes = [];

        this.url = null;
        const a = this.DOM.querySelector('a');
        if (a) {
            this.url = a.getAttribute('href');
            // aのクリックイベントを無効化
            a.addEventListener('click', (e) => e.preventDefault());
        }
    }

    /**
     * マウスが乗った時の処理
     */
    mouseEnter()
    {
        this.isHover = true;
        this.DOM.classList.add('active');

        const hgn = HorrorGameNetwork.getInstance();
        hgn.setRedraw();
    }

    /**
     * マウスが離れた時の処理
     */
    mouseLeave()
    {
        this.isHover = false;
        this.DOM.classList.remove('active');

        const hgn = HorrorGameNetwork.getInstance();
        hgn.setRedraw();
    }

    /**
     * マウスクリック時の処理
     */
    mouseClick()
    {
        if (this.url) {
            HorrorGameNetwork.getInstance()
                .changeNetwork(this.url);
        }
    }

    /**
     * タッチ開始時の処理
     */
    touchStart()
    {
        this.mouseEnter();
    }

    /**
     * タッチ終了時の処理
     */
    touchEnd()
    {
        this.mouseLeave();
    }

    /**
     * 描画
     *
     * @param ctx
     */
    draw(ctx)
    {
        if (this.isHover) {
            ctx.strokeStyle = "rgba(0, 180, 0, 0.4)"; // 線の色と透明度
            ctx.shadowColor = "lime"; // 影の色
            ctx.shadowBlur = 10; // 影のぼかし効果
            ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        } else {
            ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
            ctx.shadowColor = "rgb(0,150, 0)"; // 影の色
            ctx.shadowBlur = 8; // 影のぼかし効果
            ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
        }
        ctx.lineWidth = 2; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル

        super.setShapePath(ctx);
        ctx.stroke();
        ctx.fill();
    }
}

/**
 * トップページの特別なリンクノード
 */
export class HgsTitleLinkNode extends LinkNode
{
    /**
     * コンストラクタ
     *
     * @param DOM
     */
    constructor(DOM)
    {
        super(DOM, 20);
    }

    /**
     * 描画
     *
     * @param ctx
     */
    draw(ctx)
    {
        if (this.isHover) {
            ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"; // 線の色と透明度
            ctx.shadowColor = "lime"; // 影の色
            ctx.shadowBlur = 15; // 影のぼかし効果
            ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        } else {
            ctx.strokeStyle = "rgba(0, 200, 0, 0.6)"; // 線の色と透明度
            ctx.shadowColor = "rgb(0,150, 0)"; // 影の色
            ctx.shadowBlur = 8; // 影のぼかし効果
            ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
        }
        ctx.lineWidth = 7; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル

        super.setShapePath(ctx);
        ctx.stroke();
        ctx.fill();
    }
}

/**
 * 戻るノード
 */
export class BackNode extends LinkNode
{
    /**
     * コンストラクタ
     *
     * @param DOM
     */
    constructor(DOM)
    {
        super(DOM, 13);
    }
}
