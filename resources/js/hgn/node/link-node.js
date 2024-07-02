import {Param} from '../param.js';
import {Util} from '../util.js';
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
        this.isEnableMouse = true;

        DOM.addEventListener('mouseenter', () => this.mouseEnter());
        DOM.addEventListener('mouseleave', () => this.mouseLeave());
        DOM.addEventListener('click', () => this.mouseClick());

        if (Param.IS_TOUCH_DEVICE) {
            DOM.addEventListener('touchstart', () => this.mouseEnter());
            DOM.addEventListener('touchend', () => this.mouseLeave());
        }

        this.subNetwork = null;

        this.url = null;
        const a = this.DOM.querySelector('a');
        if (a) {
            this.url = a.getAttribute('href');
            // aのクリックイベントを無効化
            a.addEventListener('click', (e) => e.preventDefault());
        }

        this.scale = 0;
        this.appearAnimCnt = Util.getRandomInt(1, 10);
        this.animMaxCnt = Util.getRandomInt(10, 15);
    }

    delete()
    {
        super.delete();
        if (this.subNetwork !== null) {
            this.subNetwork.delete();
            this.subNetwork = null;
        }
    }

    /**
     * マウスが乗った時の処理
     */
    mouseEnter()
    {
        if (!this.isEnableMouse) {
            return;
        }

        this.isHover = true;
        this.DOM.classList.add('active');

        HorrorGameNetwork.getInstance().setRedraw();
    }

    /**
     * マウスが離れた時の処理
     */
    mouseLeave()
    {
        if (!this.isEnableMouse) {
            return;
        }

        this.isHover = false;
        this.DOM.classList.remove('active');

        HorrorGameNetwork.getInstance().setRedraw();
    }

    /**
     * マウスクリック時の処理
     */
    mouseClick()
    {
        if (!this.isEnableMouse) {
            return;
        }

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
        if (this.scale === 0) {
            // 何もしない
        } else if (this.scale === 1) {
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
            ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, 30 * this.scale, 0, Param.MATH_PI_2, false);
            ctx.fill();
        } else {
            ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
            ctx.shadowColor = "rgb(0,150, 0)"; // 影の色
            ctx.shadowBlur = 8; // 影のぼかし効果
            ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
            ctx.lineWidth = 2; // 線の太さ
            ctx.lineJoin = "round"; // 線の結合部分のスタイル
            ctx.lineCap = "round"; // 線の末端のスタイル

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

    reload()
    {
        super.reload();
        if (this.subNetwork !== null) {
            this.subNetwork.reload();
        }
    }

    /**
     * サブネットワークの描画
     *
     * @param ctx
     * @param offsetX
     * @param offsetY
     */
    drawSubNetwork(ctx, offsetX = 0, offsetY = 0)
    {
        this.subNetwork.draw(ctx, offsetX, offsetY, Param.BG2_MAKE_NETWORK_MODE);
    }

    appear()
    {
        super.appear();
        this.isEnableMouse = false;
        this.scale = 0;
    }

    appearAnimation()
    {
        if (window.hgn.animCnt >= this.appearAnimCnt) {
            if (window.hgn.animCnt === this.appearAnimCnt + this.animMaxCnt) {
                this.isEnableMouse = true;
                this.scale = 1;
                this.fadeInText();
                this.animFunc = null;
            } else {
                let animCnt = window.hgn.animCnt - this.appearAnimCnt;
                this.scale = animCnt / this.animMaxCnt;
            }
        }
    }

    disappear()
    {
        this.fadeOutText();
        super.disappear();
    }

    disappearAnimation()
    {
        if (window.hgn.animCnt >= this.appearAnimCnt) {
            if (window.hgn.animCnt === this.appearAnimCnt + this.animMaxCnt) {
                this.isEnableMouse = true;
                this.scale = 0;
                this.fadeOutText();
                this.animFunc = null;
            } else {
                let animCnt = window.hgn.animCnt - this.appearAnimCnt;
                this.scale = 1 - animCnt / this.animMaxCnt;
            }
        }
    }
}
