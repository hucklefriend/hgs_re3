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

        this.scale = 1;
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
        if (this.scale === 1) {
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
        } else if (this.scale < 0.3) {
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, 30 * this.scale, 0, Param.MATH_PI_2, false);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.center.x + (this.center.x - this.vertices[0].x) * this.scale, this.center.y + (this.center.y - this.vertices[0].y) * this.scale);
            for (let i = 1; i < this.vertices.length; i++) {
                ctx.lineTo(this.center.x + (this.center.x - this.vertices[i].x) * this.scale, this.center.y + (this.center.y - this.vertices[i].y) * this.scale);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
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
        super(DOM, 50);

        this.lightCanvas = document.querySelector('#n-HGS-c');
        this.lightCanvas.width = 300;
        this.lightCanvas.height = 300;
        this.lightCtx = this.lightCanvas.getContext('2d');


        this.drawLight();
    }

    drawLight()
    {
        var radius = 70;
        var startAngle = 0;
        var endAngle = Math.PI * 2;

// 新しいパスを開始
        this.lightCtx.beginPath();

// 円を描画
        this.lightCtx.arc(150, 150, radius, startAngle, endAngle);

// 光る効果を追加
        this.lightCtx.shadowColor = 'rgb(0, 255, 0)';
        this.lightCtx.shadowBlur = 70;

// 円を塗りつぶす
        const gradient = this.lightCtx.createRadialGradient(150, 150, 0, 150, 150, radius);
        gradient.addColorStop(0, "rgba(0, 200, 0, 1)"); // 中心は白
        gradient.addColorStop(0.5, "rgba(0, 100, 0, 0.8)"); // 外側は黒
        gradient.addColorStop(1, "rgba(0, 70, 0, 0.7)"); // 外側は黒
        this.lightCtx.fillStyle = gradient;
        this.lightCtx.fill();
    }

    /**
     * 描画
     *
     * @param ctx
     * @param fillStyle
     */
    draw(ctx, fillStyle = 'black')
    {
        if (this.isHover) {
            ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"; // 線の色と透明度
            ctx.shadowColor = "lime"; // 影の色
            ctx.shadowBlur = 15; // 影のぼかし効果
        } else {
            ctx.strokeStyle = "rgba(0, 200, 0, 0.6)"; // 線の色と透明度
            ctx.shadowColor = "rgb(0,150, 0)"; // 影の色
            ctx.shadowBlur = 8; // 影のぼかし効果
        }
        ctx.lineWidth = 5; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル

        super.setShapePath(ctx);
        ctx.stroke();

        ctx.fillStyle = fillStyle;
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
