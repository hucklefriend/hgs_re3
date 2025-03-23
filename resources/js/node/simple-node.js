import { Param } from '../common/param.js';
import { Util } from '../common/util.js';
import { DOMNode } from './dom-node.js';
import { MapViewer } from '../viewer/map-viewer.js';
import { HorrorGameNetwork } from '../horror-game-network.js';
/**
 * @type {HorrorGameNetwork}
 */
window.hgn;

export class SimpleNode extends DOMNode
{
    /**
     * コンストラクタ
     *
     * @param id
     * @param x
     * @param y
     * @param DOM
     * @param notchSize
     */
    constructor(id, x, y, DOM, notchSize = 13)
    {
        super(id, x, y, DOM, notchSize);

        this._animVertices = this.vertices;
    }

    /*
     * 出現
     */
    appear()
    {
        super.appear();

        if (!this._isInViewRect && window.hgn.viewer instanceof MapViewer) {
            this._animVertices = this.vertices;
            this._animFunc = this.appeared;
        } else {
            this._animVertices = Util.cloneVertices(this.vertices);
            this._animFunc = this.appearAnimation;
        }
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        this.fadeInText();
        this._animFunc = this.appearAnimation2;
    }

    /**
     * 出現アニメーション
     */
    appearAnimation2()
    {
        if (window.hgn.animElapsedTime < 350) {
            const ratio = (window.hgn.animElapsedTime / 350);
            for (let i = 0; i < this.vertices.length; i++) {
                this._animVertices[i].x = Util.lerp(this.center.x, this.vertices[i].x, ratio);
                this._animVertices[i].y = Util.lerp(this.center.y, this.vertices[i].y, ratio);
            }

            window.hgn.setDrawMain(false);
        } else {
            this._animVertices = this.vertices;
            this._animFunc = this.appeared;
        }
    }

    /**
     * 出現済み状態
     */
    appeared()
    {
        this._animFunc = null;
        this.showText();
        window.hgn.viewer.addAppearedNode(this.id);
    }

    /**
     * 消える
     */
    disappear()
    {
        super.disappear();

        if (!this._isInViewRect && window.hgn.viewer instanceof MapViewer) {
            this._animVertices = this.vertices;
            this._animFunc = this.disappeared;
        } else {
            this._animVertices = Util.cloneVertices(this.vertices);
            this._animFunc = this.disappearAnimation;
        }
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
        if (window.hgn.animElapsedTime < 300) {
            const ratio = 1 - (window.hgn.animElapsedTime / 300);
            for (let i = 0; i < this.vertices.length; i++) {
                this._animVertices[i].x = Util.lerp(this.center.x, this.vertices[i].x, ratio);
                this._animVertices[i].y = Util.lerp(this.center.y, this.vertices[i].y, ratio);
            }

            window.hgn.setDrawMain(false);
        } else {
            this._animVertices = this.vertices;
            this._animFunc = this.disappeared;
        }
    }

    /**
     * 消えた
     */
    disappeared()
    {
        super.disappeared();
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
        if (!this.isDraw(isDrawOutsideView)) {
            return;
        }

        this.setDefaultNodeStyle(ctx);

        super.setShapePathByVertices(ctx, this._animVertices, offsetX, offsetY);
        ctx.stroke();
        ctx.fill();
    }
}