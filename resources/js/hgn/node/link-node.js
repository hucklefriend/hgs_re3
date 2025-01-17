import {Param} from '../param.js';
import {Util} from '../util.js';
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
        // smallクラスがDOMのクラスリストに含まれている場合はnotchSizeを小さくする
        if (DOM.classList.contains('small')) {
            notchSize = 8;
        }

        super(DOM, notchSize);

        this.isEnableMouse = true;

        DOM.addEventListener('mouseenter', () => this.mouseEnter());
        DOM.addEventListener('mouseleave', () => this.mouseLeave());
        DOM.addEventListener('click', () => this.mouseClick());

        if (Param.IS_TOUCH_DEVICE) {
            DOM.addEventListener('touchstart', () => this.mouseEnter());
            DOM.addEventListener('touchend', () => this.mouseLeave());
        }

        this.createRandomSubNetwork();
        if (this.subNetwork !== null) {
            window.hgn.bg2.addParentNode(this);
        }

        this.url = null;
        const a = this.DOM.querySelector('a');
        if (a && !a.classList.contains('outside-link')) {
            this.url = a.getAttribute('href');
            // aのクリックイベントを無効化
            a.addEventListener('click', (e) => e.preventDefault());
        }

        this.scale = 0;
        this.appearAnimCnt = Util.getRandomInt(1, 10);
        this.animMaxCnt = Util.getRandomInt(10, 15);
        this.hoverOffsetAnimCnt = 0;

        if (DOM.classList.contains('link-node-a')) {
            this.hoverAnimation = this.hoverAnimationAdult;
            this.leaveAnimation = this.leaveAnimationAdult;
            this.ctxParams = {
                strokeStyle: "rgba(240, 103, 166, 0.8)",
                shadowColor: "rgb(240, 103, 166)",
                shadowBlur: 4,
                fillStyle: "black",
            };
        } else {
            this.hoverAnimation = this.hoverAnimationNormal;
            this.leaveAnimation = this.leaveAnimationNormal;
            this.ctxParams = {
                strokeStyle: "rgba(0, 100, 0, 0.8)",
                shadowColor: "rgb(0, 150, 0)",
                shadowBlur: 4,
                fillStyle: "black",
            };

            if (DOM.classList.contains('link-node-z')) {
                this.ctxParams.fillStyle = "rgb(40, 0, 0)";
            }
        }
    }

    /**
     * 削除
     */
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

        this.hoverOffsetAnimCnt = window.hgn.animCnt;
        this.animFunc = this.hoverAnimation;
        this.DOM.classList.add('active');
    }

    /**
     * マウスが離れた時の処理
     */
    mouseLeave()
    {
        if (!this.isEnableMouse) {
            return;
        }

        this.hoverOffsetAnimCnt = window.hgn.animCnt;
        this.animFunc = this.leaveAnimation;
        this.DOM.classList.remove('active');
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
            window.hgn.changeNetwork(this.url);
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
     * ホバーアニメーション
     */
    hoverAnimationNormal()
    {
        const animCnt = window.hgn.getOffsetAnimCnt(this.hoverOffsetAnimCnt);
        if (animCnt < 5) {
            let ratio = animCnt / 5;
            this.ctxParams.strokeStyle = "rgba(0, " + Util.getMidpoint(100, 180, ratio) + ", 0," + Util.getMidpoint(0.4, 0.8, ratio) + ")";
            this.ctxParams.shadowColor = "rgb(" + Util.getMidpoint(0, 90, ratio) + ", " + Util.getMidpoint(150, 255, ratio) + ", " + Util.getMidpoint(0, 25, ratio) + ")";
            this.ctxParams.shadowBlur = Util.getMidpoint(4, 8, ratio);
        } else {
            this.animFunc = null;
            this.ctxParams.strokeStyle = "rgba(0, 180, 0, 0.4)";
            this.ctxParams.shadowColor = "rgb(90, 255, 25)";
            this.ctxParams.shadowBlur = 8;
        }

        window.hgn.setRedrawMain();
    }

    /**
     * ホバーアニメーション
     */
    hoverAnimationAdult()
    {
        const animCnt = window.hgn.getOffsetAnimCnt(this.hoverOffsetAnimCnt);
        if (animCnt < 5) {
            let ratio = animCnt / 5;
            this.ctxParams.strokeStyle = "rgba(" + Util.getMidpoint(240, 249, ratio) + ", " + Util.getMidpoint(103, 193, ratio) + ", " + Util.getMidpoint(166, 207, ratio) + "," + Util.getMidpoint(0.4, 0.8, ratio) + ")";
            this.ctxParams.shadowColor = "rgb(" + Util.getMidpoint(240, 249, ratio) + ", " + Util.getMidpoint(103, 193, ratio) + ", " + Util.getMidpoint(166, 207, ratio) + ")";
            this.ctxParams.shadowBlur = Util.getMidpoint(4, 8, ratio);
        } else {
            this.animFunc = null;
            this.ctxParams.strokeStyle = "rgba(249, 193, 207, 0.4)";
            this.ctxParams.shadowColor = "rgb(249, 193, 207)";
            this.ctxParams.shadowBlur = 8;
        }

        window.hgn.setRedrawMain();
    }

    /**
     * リーブアニメーション
     */
    leaveAnimationNormal()
    {
        const animCnt = window.hgn.getOffsetAnimCnt(this.hoverOffsetAnimCnt);
        if (animCnt < 5) {
            let ratio = 1 - animCnt / 5;
            this.ctxParams.strokeStyle = "rgba(0, " + Util.getMidpoint(100, 180, ratio) + ", 0," + Util.getMidpoint(0.4, 0.8, ratio) + ")";
            this.ctxParams.shadowColor = "rgb(" + Util.getMidpoint(0, 90, ratio) + ", " + Util.getMidpoint(150, 255, ratio) + ", " + Util.getMidpoint(0, 25, ratio) + ")";
            this.ctxParams.shadowBlur = Util.getMidpoint(4, 8, ratio);
        } else {
            this.animFunc = null;
            this.ctxParams.strokeStyle = "rgba(0, 100, 0, 0.8)";
            this.ctxParams.shadowColor = "rgb(0, 150, 0)";
            this.ctxParams.shadowBlur = 4;
        }

        window.hgn.setRedrawMain();
    }

    /**
     * リーブアニメーション
     */
    leaveAnimationAdult()
    {
        const animCnt = window.hgn.getOffsetAnimCnt(this.hoverOffsetAnimCnt);
        if (animCnt < 5) {
            let ratio = 1 - animCnt / 5;
            this.ctxParams.strokeStyle = "rgba(" + Util.getMidpoint(240, 249, ratio) + ", " + Util.getMidpoint(103, 193, ratio) + ", " + Util.getMidpoint(166, 207, ratio) + "," + Util.getMidpoint(0.4, 0.8, ratio) + ")";
            this.ctxParams.shadowColor = "rgb(" + Util.getMidpoint(240, 249, ratio) + ", " + Util.getMidpoint(103, 193, ratio) + ", " + Util.getMidpoint(166, 207, ratio) + ")";
            this.ctxParams.shadowBlur = Util.getMidpoint(4, 8, ratio);
        } else {
            this.animFunc = null;
            // strokeStyle: "rgba(240, 103, 166, 0.8)",
            //     shadowColor: "rgb(240, 103, 166)",
            this.ctxParams.strokeStyle = "rgba(240, 103, 166, 0.8)";
            this.ctxParams.shadowColor = "rgb(240, 103, 166)";
            this.ctxParams.shadowBlur = 4;
        }

        window.hgn.setRedrawMain();
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
            ctx.strokeStyle = this.ctxParams.strokeStyle;
            ctx.shadowColor = this.ctxParams.shadowColor;
            ctx.shadowBlur = this.ctxParams.shadowBlur;
            ctx.fillStyle = this.ctxParams.fillStyle;
            ctx.lineWidth = 2;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";

            super.setShapePath(ctx);
            ctx.stroke();
            ctx.fill();
        } else if (this.scale < 0.3) {
            ctx.fillStyle = this.ctxParams.fillStyle;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 30 * this.scale, 0, Param.MATH_PI_2, false);
            ctx.fill();
        } else {
            ctx.strokeStyle = this.ctxParams.strokeStyle;
            ctx.shadowColor = this.ctxParams.shadowColor;
            ctx.shadowBlur = this.ctxParams.shadowBlur;
            ctx.fillStyle = this.ctxParams.fillStyle;
            ctx.lineWidth = 2; // 線の太さ
            ctx.lineJoin = "round"; // 線の結合部分のスタイル
            ctx.lineCap = "round"; // 線の末端のスタイル

            ctx.beginPath();
            ctx.moveTo(this.x + (this.x - this.vertices[0].x) * this.scale, this.y + (this.y - this.vertices[0].y) * this.scale);
            for (let i = 1; i < this.vertices.length; i++) {
                ctx.lineTo(this.x + (this.x - this.vertices[i].x) * this.scale, this.y + (this.y - this.vertices[i].y) * this.scale);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    }

    /**
     * 再読み込み
     */
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

    /**
     * 出現
     */
    appear()
    {
        if (this.isSkipAnim()) {
            this.appeared();
        } else {
            super.appear();
            this.isEnableMouse = false;
            this.scale = 0;
        }
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        if (window.hgn.animCnt >= this.appearAnimCnt) {
            let maxAnimCnt = this.appearAnimCnt + this.animMaxCnt;
            if (window.hgn.animCnt < maxAnimCnt) {
                let animCnt = window.hgn.animCnt - this.appearAnimCnt;
                this.scale = animCnt / this.animMaxCnt;
            } else if (window.hgn.animCnt === maxAnimCnt) {
                this.isEnableMouse = true;
                this.scale = 1;
                this.fadeInText();
                if (this.subNetwork === null) {
                    this.animFunc = null;
                }
            } else if (this.subNetwork !== null) {
                let animCnt = window.hgn.animCnt - maxAnimCnt;
                let depth = Math.ceil(animCnt / 5);
                this.subNetwork.maxDrawDepth = depth;
                if (this.subNetwork.maxDepth === depth) {
                    this.animFunc = null;
                }

                window.hgn.setRedrawBg2();
            }
        }
    }

    appeared()
    {
        this.showText();
        this.scale = 1;
        if (this.subNetwork !== null) {
            this.subNetwork.maxDrawDepth = 3;
            window.hgn.setRedrawBg2();
        }

        super.appeared();

    }

    /**
     * 消える
     */
    disappear()
    {
        this.isEnableMouse = false;
        if (!this.isSkipAnim()) {
            this.fadeOutText();
            super.disappear();
        } else {
            this.scale = 0;
        }
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
        if (window.hgn.animCnt >= this.appearAnimCnt) {
            if (window.hgn.animCnt === this.appearAnimCnt + this.animMaxCnt) {
                this.isEnableMouse = true;
                this.scale = 0;
                this.fadeOutText();
                if (this.subNetwork === null || this.subNetwork.isNotDraw()) {
                    this.animFunc = null;
                }
            } else if (this.scale > 0) {
                let animCnt = window.hgn.animCnt - this.appearAnimCnt;
                this.scale = 1 - animCnt / this.animMaxCnt;
            }

            if (this.subNetwork !== null) {
                let animCnt = window.hgn.animCnt - this.appearAnimCnt;
                let depth = Math.ceil(animCnt / 5);
                if (depth > this.subNetwork.maxDepth) {
                    this.subNetwork.setDrawDepth(0, 0);
                    if (this.scale === 0) {
                        this.animFunc = null;
                    }
                } else {
                    this.subNetwork.minDrawDepth = depth;
                }
                window.hgn.setRedrawBg2();
            }
        }
    }
}
