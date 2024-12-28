import {Param} from '../param.js';
import {Util} from '../util.js';
import {DOMNode} from './octa-node.js';


export class EditNode extends DOMNode
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

        this.offsetX = 0;
        this.offsetY = 0;

        DOM.addEventListener('mousedown', (e) => {return this.mouseDown(e)});

        if (DOM.classList.contains('link-node-a')) {
            this.ctxParams = {
                strokeStyle: "rgba(240, 103, 166, 0.8)",
                shadowColor: "rgb(240, 103, 166)",
                shadowBlur: 4,
                fillStyle: "black",
            };
        } else {
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
    }

    /**
     * マウスダウン
     *
     * @param e
     */
    mouseDown(e)
    {
        this.isDragging = true;
        this.DOM.style.cursor = "grabbing";

        window.networkEditor.mouseDownInEditNode(e, this);
    }

    /**
     * オフセットX取得
     *
     * @param e
     * @returns {number}
     */
    getOffsetX(e)
    {
        return e.clientX - this.DOM.offsetLeft;
    }

    /**
     * オフセットY取得
     *
     * @param e
     * @returns {number}
     */
    getOffsetY(e)
    {
        return e.clientY - this.DOM.offsetTop;
    }

    /**
     * マウス移動
     *
     * @param e
     * @param offsetX
     * @param offsetY
     */
    mouseMove(e, offsetX, offsetY)
    {
        this.DOM.style.left = `${e.clientX - offsetX}px`;
        this.DOM.style.top = `${e.clientY - offsetY}px`;

        this.reload();
    }

    /**
     * マウスアップ
     *
     * @param e
     */
    mouseUp(e)
    {
        this.DOM.style.cursor = "grab";
    }

    /**
     * 描画
     *
     * @param ctx
     * @param offsetX
     * @param offsetY
     */
    draw(ctx, offsetX = 0, offsetY = 0)
    {
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
    }
}
