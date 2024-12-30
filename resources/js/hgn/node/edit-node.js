import {Param} from '../param.js';
import {Util} from '../util.js';
import {DOMNode} from './octa-node.js';


export class EditNode extends DOMNode
{
    /**
     * インスタンス生成
     *
     * @param node
     * @param networkPosition
     * @returns {EditNode}
     */
    static create(node, networkPosition)
    {
        console.log(node);
        let DOM = document.createElement('div');
        DOM.classList.add('edit-node');
        DOM.innerHTML = node.name;
        DOM.id = node.id;
        window.networkEditor.editorDOM.appendChild(DOM);


        let remove = document.createElement('span');
        remove.classList.add('edit-node-remove');
        remove.innerHTML = '×';
        DOM.appendChild(remove);

        DOM.style.left = `${networkPosition.x + node.x - (DOM.offsetWidth / 2)}px`;
        DOM.style.top = `${networkPosition.y + node.y - (DOM.offsetHeight / 2)}px`;

        return new EditNode(DOM);
    }

    /**
     * コンストラクタ
     *
     * @param DOM
     * @param posX
     * @param posY
     */
    constructor(DOM, posX, posY)
    {
        super(DOM, 13);

        this.positionInNetwork = {x: posX, y: posY};

        DOM.addEventListener('mousedown', (e) => {return this.mouseDown(e)});
        DOM.addEventListener('mouseenter', (e) => this.mouseEnter(e));
        DOM.addEventListener('mouseleave', (e) => this.mouseLeave(e));

        // DOMのidを取得
        this.id = DOM.id;

        this.removeDOM = DOM.querySelector('.edit-node-remove');
        this.removeDOM.addEventListener('click', (e) => this.mouseClickRemoveDOM(e));


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
     * マウスエンター
     *
     * @param e
     */
    mouseEnter(e)
    {
        this.removeDOM.style.display = 'inline';
    }

    /**
     * マウスリーブ
     *
     * @param e
     */
    mouseLeave(e)
    {
        this.removeDOM.style.display = 'none';
    }

    /**
     * removeDOMクリック
     *
     * @param e
     */
    mouseClickRemoveDOM(e)
    {
        window.networkEditor.removeNode(this.id);
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
