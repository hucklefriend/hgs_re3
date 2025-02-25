import { Rect } from '../common/rect.js';
import { Util } from "../common/util.js";
import { DOMNode } from "./dom-node.js";
import { HorrorGameNetwork } from '../horror-game-network.js';
/**
 * @type {HorrorGameNetwork}
 */
window.hgn;


/**
 * テキストノード
 */
export class TextNode extends DOMNode
{
    /**
     * コンストラクタ
     *
     * @param id
     * @param x
     * @param y
     * @param DOM
     */
    constructor(id, x, y, DOM)
    {
        let notchSize = 16;
        // smallクラスがDOMのクラスリストに含まれている場合はnotchSizeを小さくする
        if (DOM.classList.contains('small')) {
            notchSize = 8;
        }

        super(id, x, y, DOM, notchSize);
        this.alpha = 0;

        if (DOM.classList.contains('text-node-a')) {
            this.backColor = "100,30,20";
        } else if (DOM.classList.contains('text-node-z')) {
            this.backColor = "30,5,0";
        } else {
            this.backColor = "0,30,0";
        }
    }

    /**
     * 描画
     *
     * @param ctx
     * @param {Rect}viewRect
     */
    draw(ctx, viewRect)
    {
        const [isDraw, left, top] = this.isDraw(viewRect);
        if (!isDraw) {
            return;
        }
        
        super.setShapePath(ctx, left, top);

        ctx.lineWidth = 1; // 線の太さ
        ctx.lineJoin = "miter"; // 線の結合部分のスタイル
        ctx.lineCap = "butt"; // 線の末端のスタイル
        ctx.shadowColor = "black"; // 影の色
        ctx.shadowBlur = 0; // 影のぼかし効果

        ctx.fillStyle = "rgba(" + this.backColor + "," + this.alpha + ")";
        ctx.fill();
    }

    /**
     * 出現
     */
    appear()
    {
        super.appear();
        this.alpha = 0;
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        if (window.hgn.animElapsedTime > 250) {
            this.animFunc = this.appearAnimation2;
            this.fadeInText();
        }
    }

    appearAnimation2()
    {
        this.fadeInText();

        const elapsedTime = window.hgn.animElapsedTime - 50;
        this.alpha = Util.getMidpoint(0, 0.6, elapsedTime / 100);
        if (this.alpha >= 0.6) {
            this.alpha = 0.6;
            this.appeared();
        }
    }

    appeared()
    {
        super.appeared();
        this.alpha = 0.6;
        this.showText();
    }

    /**
     * 消える
     */
    disappear()
    {
        if (!this.isSkipAnim()) {
            super.disappear();
            this.fadeOutText();
        } else {
            this.disappeared();
        }
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
        const elapsedTime = window.hgn.animElapsedTime - 50;
        this.alpha = Util.getMidpoint(0.6, 0, elapsedTime / 100);
        if (this.alpha <= 0) {
            this.disappeared();
        }
    }

    disappeared()
    {
        super.disappeared();
        this.alpha = 0;
        this.hideText();
    }
}
