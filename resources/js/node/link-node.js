import { Param } from '../common/param.js';
import { Util } from '../common/util.js';
import { SimpleNode } from './simple-node.js';

export class LinkNode extends SimpleNode
{
    /**
     * コンストラクタ
     *
     * @param {string} id
     * @param {number} x
     * @param {number} y
     * @param {HTMLElement} DOM
     * @param {number} [notchSize=13]
     */
    constructor(id, x, y, DOM, notchSize = 13)
    {
        // smallクラスがDOMのクラスリストに含まれている場合はnotchSizeを小さくする
        if (DOM.classList.contains('small')) {
            notchSize = 8;
        }

        super(id, x, y, DOM, notchSize);

        this.isEnableMouse = true;

        this.createSubNetwork();

        this.url = null;
        this.refType = null;
        const a = this.DOM.querySelector('a');
        if (a && !a.classList.contains('outside-link')) {
            this.url = a.getAttribute('href');
            this.refType = a.getAttribute('data-ref-type') ?? 'doc';
            // aのクリックイベントを無効化
            a.addEventListener('click', (e) => e.preventDefault());
        }

        this.scale = 0;
        this.appearAnimTime = Util.getRandomInt(1, 100);
        this.animMaxTime = Util.getRandomInt(100, 150);
        this.hoverAnimStartTime = 0;
        this.hoverAnimFunc = null;

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

        this.hoverAnimStartTime = window.hgn.animElapsedTime;
        this.hoverAnimFunc = this.hoverAnimation;
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

        this.hoverAnimStartTime = window.hgn.animElapsedTime;
        this.hoverAnimFunc = this.leaveAnimation;
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
            if (this.refType === 'map') {
                window.hgn.navigateToMap(this.url);
            } else {
                window.hgn.navigateToDocument(this.url);
            }
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
     * 更新
     * 
     * @param {Rect} viewRect
     */
    update(viewRect)
    {
        super.update(viewRect);

        if (this.hoverAnimFunc !== null) {
            this.hoverAnimFunc();
        }
    }

    /**
     * ホバーアニメーション
     */
    hoverAnimationNormal()
    {
        const animElapsedTime = window.hgn.animElapsedTime - this.hoverAnimStartTime;
        if (animElapsedTime < 100) {
            let ratio = animElapsedTime / 100;
            this.ctxParams.strokeStyle = "rgba(0, " + Util.lerp(100, 180, ratio) + ", 0," + Util.lerp(0.4, 0.8, ratio) + ")";
            this.ctxParams.shadowColor = "rgb(" + Util.lerp(0, 90, ratio) + ", " + Util.lerp(150, 255, ratio) + ", " + Util.lerp(0, 25, ratio) + ")";
            this.ctxParams.shadowBlur = Util.lerp(4, 8, ratio);

            window.hgn.setDrawMain(false);
        } else {
            this.hoverAnimFunc = null;
            this.ctxParams.strokeStyle = "rgba(0, 180, 0, 0.4)";
            this.ctxParams.shadowColor = "rgb(90, 255, 25)";
            this.ctxParams.shadowBlur = 8;

            window.hgn.setDrawMain(true);
        }
    }

    /**
     * ホバーアニメーション
     */
    hoverAnimationAdult()
    {
        const animElapsedTime = window.hgn.animElapsedTime - this.hoverAnimStartTime;
        if (animElapsedTime < 100) {
            let ratio = animElapsedTime / 100;
            this.ctxParams.strokeStyle = "rgba(" + Util.lerp(240, 249, ratio) + ", " + Util.lerp(103, 193, ratio) + ", " + Util.lerp(166, 207, ratio) + "," + Util.lerp(0.4, 0.8, ratio) + ")";
            this.ctxParams.shadowColor = "rgb(" + Util.lerp(240, 249, ratio) + ", " + Util.lerp(103, 193, ratio) + ", " + Util.lerp(166, 207, ratio) + ")";
            this.ctxParams.shadowBlur = Util.lerp(4, 8, ratio);

            window.hgn.setDrawMain(false);
        } else {
            this.hoverAnimFunc = null;
            this.ctxParams.strokeStyle = "rgba(249, 193, 207, 0.4)";
            this.ctxParams.shadowColor = "rgb(249, 193, 207)";
            this.ctxParams.shadowBlur = 8;

            window.hgn.setDrawMain(true);
        }
    }

    /**
     * リーブアニメーション
     */
    leaveAnimationNormal()
    {
        const animElapsedTime = window.hgn.animElapsedTime - this.hoverAnimStartTime;
        if (animElapsedTime < 100) {
            let ratio = 1 - animElapsedTime / 100;
            this.ctxParams.strokeStyle = "rgba(0, " + Util.lerp(100, 180, ratio) + ", 0," + Util.lerp(0.4, 0.8, ratio) + ")";
            this.ctxParams.shadowColor = "rgb(" + Util.lerp(0, 90, ratio) + ", " + Util.lerp(150, 255, ratio) + ", " + Util.lerp(0, 25, ratio) + ")";
            this.ctxParams.shadowBlur = Util.lerp(4, 8, ratio);

            window.hgn.setDrawMain(false);
        } else {
            this.hoverAnimFunc = null;
            this.ctxParams.strokeStyle = "rgba(0, 100, 0, 0.8)";
            this.ctxParams.shadowColor = "rgb(0, 150, 0)";
            this.ctxParams.shadowBlur = 4;

            window.hgn.setDrawMain(true);
        }
    }

    /**
     * リーブアニメーション
     */
    leaveAnimationAdult()
    {
        const animElapsedTime = window.hgn.animElapsedTime - this.hoverAnimStartTime;
        if (animElapsedTime < 100) {
            let ratio = 1 - animElapsedTime / 100;
            this.ctxParams.strokeStyle = "rgba(" + Util.lerp(240, 249, ratio) + ", " + Util.lerp(103, 193, ratio) + ", " + Util.lerp(166, 207, ratio) + "," + Util.lerp(0.4, 0.8, ratio) + ")";
            this.ctxParams.shadowColor = "rgb(" + Util.lerp(240, 249, ratio) + ", " + Util.lerp(103, 193, ratio) + ", " + Util.lerp(166, 207, ratio) + ")";
            this.ctxParams.shadowBlur = Util.lerp(4, 8, ratio);

            window.hgn.setDrawMain(false);
        } else {
            this.hoverAnimFunc = null;
            this.ctxParams.strokeStyle = "rgba(240, 103, 166, 0.8)";
            this.ctxParams.shadowColor = "rgb(240, 103, 166)";
            this.ctxParams.shadowBlur = 4;

            window.hgn.setDrawMain(true);
        }
    }

    /**
     * 描画
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} offsetX
     * @param {number} offsetY
     * @param {boolean} isDrawOutsideView
     */
    draw(ctx, offsetX, offsetY, isDrawOutsideView)
    {
        if (this.scale === 0) {
            // 何もしない
            return;
        }
        if (!this.isDraw(isDrawOutsideView)) {
            return;
        }
        
        if (this.scale === 1) {
            ctx.strokeStyle = this.ctxParams.strokeStyle;
            ctx.shadowColor = this.ctxParams.shadowColor;
            ctx.shadowBlur = this.ctxParams.shadowBlur;
            ctx.fillStyle = this.ctxParams.fillStyle;
            ctx.lineWidth = 2;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";

            super.setShapePath(ctx, offsetX, offsetY);
            ctx.stroke();
            ctx.fill();
        } else if (this.scale < 0.3) {
            ctx.fillStyle = this.ctxParams.fillStyle;
            ctx.beginPath();
            ctx.arc(this.center.x + offsetX, this.center.y + offsetY, 30 * this.scale, 0, Param.MATH_PI_2, false);
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
            ctx.moveTo(
                this.center.x + offsetX + (this.center.x - this.vertices[0].x) * this.scale, 
                this.center.y + offsetY + (this.center.y - this.vertices[0].y) * this.scale);
            for (let i = 1; i < this.vertices.length; i++) {
                ctx.lineTo(
                    this.center.x + offsetX + (this.center.x - this.vertices[i].x) * this.scale, 
                    this.center.y + offsetY + (this.center.y - this.vertices[i].y) * this.scale
                );
            }
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    }

    /**
     * 出現
     */
    appear()
    {
        super.appear();
        this.isEnableMouse = false;
        this.scale = 0;
    }

    /**
     * 出現アニメーション
     * 出現タイミングまで待つ
     */
    appearAnimation()
    {
        if (window.hgn.animElapsedTime >= this.appearAnimTime) {
            this._animFunc = this.appearAnimation2;
        }
    }

    /**
     * 出現アニメーション2
     * 拡大
     */
    appearAnimation2()
    {
        const elapsedTime = window.hgn.animElapsedTime - this.appearAnimTime;
        if (elapsedTime < this.animMaxTime) {
            this.scale = elapsedTime / this.animMaxTime;
        } else {
            this.isEnableMouse = true;
            this.scale = 1;
            this.fadeInText();
            this._animFunc = this.appearAnimation3;
        }
    }

    /**
     * 出現アニメーション3
     * サブネットワークの出現
     */
    appearAnimation3()
    {
        if (this.subNetwork === null) {
            this._animFunc = null;
            this.appeared();
        } else {
            const elapsedTime = window.hgn.animElapsedTime - this.appearAnimTime - this.animMaxTime;
            let depth = Math.ceil(elapsedTime / 200);
            
            if (this.subNetwork.maxDepth === depth) {
                this._animFunc = null;
                this.appeared();
            } else if (this.subNetwork.maxDrawDepth !== depth) {
                this.subNetwork.setMaxDrawDepth(depth);
                window.hgn.setDrawSub();
            }
        }
    }

    /**
     * 出現完了
     */
    appeared()
    {
        this.showText();
        this.scale = 1;
        this.isEnableMouse = true;
        if (this.subNetwork !== null) {
            this.subNetwork.setMaxDrawDepth(this.subNetwork.maxDepth);
            window.hgn.setDrawSub();
        }

        super.appeared();
        window.hgn.setDrawMain(true);

        this.DOM.addEventListener('mouseenter', () => this.mouseEnter());
        this.DOM.addEventListener('mouseleave', () => this.mouseLeave());
        this.DOM.addEventListener('click', () => this.mouseClick());

        if (Param.IS_TOUCH_DEVICE) {
            this.DOM.addEventListener('touchstart', () => this.mouseEnter());
            this.DOM.addEventListener('touchend', () => this.mouseLeave());
        }
    }

    /**
     * 消える
     */
    disappear()
    {
        this.isEnableMouse = false;
        this.fadeOutText();
        super.disappear();
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
        if (window.hgn.animElapsedTime >= this.appearAnimTime) {
            this._animFunc = this.disappearAnimation2;
        }
    }

    /**
     * 消えるアニメーション2
     * 縮小
     */
    disappearAnimation2()
    {
        const elapsedTime = window.hgn.animElapsedTime - this.appearAnimTime;
        if (elapsedTime < this.animMaxTime) {
            this.scale = 1 - (elapsedTime / this.animMaxTime);
        } else {
            this.scale = 0;
            this.fadeOutText();
            if (this.subNetwork === null) {
                this._animFunc = this.disappeared;
            }
        }

        if (this.subNetwork !== null) {
            if (this.subNetwork.maxDrawDepth !== 0) {
                let depth = Math.ceil(elapsedTime / 200) + 1;
                if (depth > this.subNetwork.maxDepth) {
                    this.subNetwork.setDrawDepth(0, 0);
                } else {
                    this.subNetwork.setMinDrawDepth(depth);
                    window.hgn.setDrawSub();
                }
            } else if (this.scale === 0) {
                this._animFunc = this.disappeared;
            }
        }
    }
}
