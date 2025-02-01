import {Param} from '../param.js';
import {Util} from '../util.js';
import {DOMNode} from './octa-node.js';
import {PointNode} from "./point-node.js";
import {EditNetwork} from "../edit-network.js";


export class EditNetworkNode extends DOMNode
{
    /**
     * DOMノードを生成
     *
     * @param {EditNetwork}parentNetwork
     * @param containerDOM
     * @param data
     * @param {Vertex}screenOffset
     * @returns {DOMNode}
     */
    static create(parentNetwork, containerDOM, data, screenOffset)
    {
        let DOM = document.createElement('div');
        DOM.innerHTML = data.html;
        DOM.classList.add('dom-node');
        // idがs_で始まる場合smallにする
        if (data.id.startsWith('s_')) {
            DOM.classList.add('small');
        }

        containerDOM.appendChild(DOM);

        DOM.style.left = `${data.x + screenOffset.x - DOM.offsetWidth / 2}px`;
        DOM.style.top = `${data.y + screenOffset.y - DOM.offsetHeight / 2}px`;

        return new this(parentNetwork, data, DOM);
    }

    /**
     * コンストラクタ
     *
     * @param {EditNetwork}parentNetwork
     * @param data
     * @param DOM
     * @param notchSize
     */
    constructor(parentNetwork, data, DOM, notchSize = 13)
    {
        super(data.id, data.x, data.y, DOM, notchSize);

        this.parentNetwork = parentNetwork;
        this.nodeType = data.type;
        this.href = data.href;

        this.reload();  // スクリーン座標配置になっているので、リロードしとく

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

        this.DOM.addEventListener('mousedown', (e) => this.mouseDown(e));
    }

    /**
     * 再ロード
     */
    reload()
    {
        this.w = this.DOM.offsetWidth;
        this.h = this.DOM.offsetHeight;
        this.setCenterRect();

        if (this.w > 0 && this.h > 0 && this.notchSize > 0) {
            this.setOctagon();
        }
    }

    /**
     * マウスダウン
     *
     * @param e
     */
    mouseDown(e)
    {
        this.parentNetwork.mouseDownInNode(e);
    }

    /**
     * 描画
     *
     * @param ctx
     * @param offsetX
     * @param offsetY
     * @param viewRect
     */
    draw(ctx, offsetX = 0, offsetY = 0, viewRect = null)
    {
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
    }

    toJsonForMainNetwork(offsetX, offsetY)
    {
        return {
            id: this.id,
            x: this.x + offsetX - this.DOM.offsetWidth / 2,
            y: this.y + offsetY - this.DOM.offsetHeight / 2,
            type: this.nodeType,
            html: this.DOM.innerHTML,
            href: this.href ?? null
        };
    }
}


export class EditNetworkPointNode extends PointNode
{
    /**
     * コンストラクタ
     *
     * @param id
     * @param x
     * @param y
     */
    constructor(id, x, y)
    {
        super(x, y, 6, id);
    }

    /**
     * JSON化
     *
     * @returns {{x: (number|number), y: (number|number)}}
     */
    toJsonForMainNetwork(offsetX, offsetY)
    {
        return {
            id: this.id,
            x: this.x + offsetX,
            y: this.y + offsetY,
            type: 'pt'
        };
    }
}
