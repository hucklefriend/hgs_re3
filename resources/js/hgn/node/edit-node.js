import {Param} from '../param.js';
import {Util} from '../util.js';
import {DOMNode} from './octa-node.js';
import {PointNode} from './point-node.js';


export class EditNode extends DOMNode
{
    /**
     * インスタンス生成
     *
     * @param node
     * @param networkPosition
     * @param isRemovable
     * @returns {EditNode}
     */
    static create(node, networkPosition, isRemovable = true)
    {
        let DOM = document.createElement('div');
        DOM.classList.add('edit-node');
        DOM.innerHTML = node.name;
        DOM.id = node.id;
        window.networkEditor.editorDOM.appendChild(DOM);

        if (isRemovable) {
            let remove = document.createElement('span');
            remove.classList.add('edit-node-remove');
            remove.innerHTML = '×';
            DOM.appendChild(remove);
        }

        DOM.style.left = `${networkPosition.x + node.x - (DOM.offsetWidth / 2)}px`;
        DOM.style.top = `${networkPosition.y + node.y - (DOM.offsetHeight / 2)}px`;

        EditNode.appendEdgeSelect(node, DOM);

        return new EditNode(DOM);
    }

    /**
     * エッジ選択DOM追加
     *
     * @param node
     * @param DOM
     */
    static appendEdgeSelect(node, DOM)
    {
        let edge = document.createElement('span');
        edge.classList.add('edit-node-edge-select');
        edge.id = node.id + '_0';
        edge.style.left = `5px`;
        edge.style.top = `-8px`;
        DOM.appendChild(edge);

        edge = document.createElement('span');
        edge.classList.add('edit-node-edge-select');
        edge.id = node.id + '_1';
        edge.style.right = `5px`;
        edge.style.top = `-8px`;
        DOM.appendChild(edge);

        edge = document.createElement('span');
        edge.classList.add('edit-node-edge-select');
        edge.id = node.id + '_2';
        edge.style.right = `-8px`;
        edge.style.top = `5px`;
        DOM.appendChild(edge);

        edge = document.createElement('span');
        edge.classList.add('edit-node-edge-select');
        edge.id = node.id + '_3';
        edge.style.right = `-8px`;
        edge.style.bottom = `4px`;
        DOM.appendChild(edge);

        edge = document.createElement('span');
        edge.classList.add('edit-node-edge-select');
        edge.id = node.id + '_4';
        edge.style.right = `5px`;
        edge.style.bottom = `-8px`;
        DOM.appendChild(edge);

        edge = document.createElement('span');
        edge.classList.add('edit-node-edge-select');
        edge.id = node.id + '_5';
        edge.style.left = `5px`;
        edge.style.bottom = `-8px`;
        DOM.appendChild(edge);

        edge = document.createElement('span');
        edge.classList.add('edit-node-edge-select');
        edge.id = node.id + '_6';
        edge.style.left = `-8px`;
        edge.style.bottom = `4px`;
        DOM.appendChild(edge);

        edge = document.createElement('span');
        edge.classList.add('edit-node-edge-select');
        edge.id = node.id + '_7';
        edge.style.left = `-8px`;
        edge.style.top = `6px`;
        DOM.appendChild(edge);
    }

    /**
     * コンストラクタ
     *
     * @param DOM
     */
    constructor(DOM)
    {
        super(DOM, 13);

        DOM.addEventListener('mousedown', (e) => {return this.mouseDown(e)});
        DOM.addEventListener('mouseenter', (e) => this.mouseEnter(e));
        DOM.addEventListener('mouseleave', (e) => this.mouseLeave(e));

        // DOMのidを取得
        this.id = DOM.id;

        this.removeDOM = DOM.querySelector('.edit-node-remove');
        if (this.removeDOM !== null) {
            this.removeDOM.addEventListener('click', (e) => this.mouseClickRemoveDOM(e));
        }
        this.edgeSelectDOMs = DOM.querySelectorAll('.edit-node-edge-select');
        this.edgeSelectDOMs.forEach(edgeSelectDOM => {
            edgeSelectDOM.addEventListener('click', (e) => this.mouseClickEdgeSelectDOM(e));
        });

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
        if (window.networkEditor.isNodeMode()) {
            this.isDragging = true;
            this.DOM.style.cursor = "grabbing";

            window.networkEditor.mouseDownInEditNode(e, this);
        } else {
            this.DOM.style.cursor = "unset";
        }
    }

    /**
     * マウスエンター
     *
     * @param e
     */
    mouseEnter(e)
    {
        if (window.networkEditor.isNodeMode()) {
            this.DOM.style.cursor = "grab";
            if (this.removeDOM !== null) {
                this.removeDOM.style.display = 'inline';
            }
        } else {
            this.DOM.style.cursor = "unset";
        }
    }

    /**
     * マウスリーブ
     *
     * @param e
     */
    mouseLeave(e)
    {
        if (window.networkEditor.isNodeMode()) {
            if (this.removeDOM !== null) {
                this.removeDOM.style.display = 'none';
            }
        }
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
     * edge-select DOMクリック
     *
     * @param e
     */
    mouseClickEdgeSelectDOM(e)
    {
        // idの最後の_の後ろの数字を取得
        let vertexNo = e.target.id.slice(-1);
        // intに変換
        vertexNo = parseInt(vertexNo);

        // idの最後の_から後ろを除去
        let nodeId = e.target.id.slice(0, -2);

        e.target.classList.add('selected');

        window.networkEditor.edgeSelect(nodeId, vertexNo);

        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * エッジ選択のキャンセル
     *
     * @param vertexNo
     */
    cancelEdgeSelect(vertexNo)
    {
        this.edgeSelectDOMs[vertexNo].classList.remove('selected');
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
     * 中心X取得
     *
     * @returns {number}
     */
    getCenterX()
    {
        return parseInt(this.DOM.style.left) + (this.DOM.offsetWidth / 2);
    }

    /**
     * 中心Y取得
     *
     * @returns {number}
     */
    getCenterY()
    {
        return parseInt(this.DOM.style.top) + (this.DOM.offsetHeight / 2);
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

        this.x = parseInt(this.DOM.style.left) + (this.DOM.offsetWidth / 2);
        this.y = parseInt(this.DOM.style.top) + (this.DOM.offsetHeight / 2);
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

    /**
     * JSON化
     *
     * @param parent
     * @returns {{x: (number|number), y: (number|number)}}
     */
    toJson(parent)
    {
        return {
            id: this.id,
            x: parent === null ? 0 : this.getCenterX() - parent.getCenterX(),
            y: parent === null ? 0 : this.getCenterY() - parent.getCenterY(),
        };
    }

    getConnectJsonArr()
    {
        let arr = [];
        this.connects.forEach((con, vertexNo) => {
            if (con !== null && con.type === Param.CONNECT_TYPE_OUTGOING) {
                arr.push({
                    from: this.id,
                    from_vn: vertexNo,
                    to: con.node.id,
                    to_vn: con.vertexNo,
                });
            }
        });

        return arr;
    }
}

export class EditPointNode extends PointNode
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
        super(x, y, 6);

        this.id = id;

        // 移動用DOM
        this.DOM = document.createElement('div');
        this.DOM.classList.add('edit-pt-node');
        window.networkEditor.editorDOM.appendChild(this.DOM);

        this.DOM.style.left = `${x - (this.DOM.offsetWidth / 2)}px`;
        this.DOM.style.top = `${y - (this.DOM.offsetHeight / 2)}px`;

        this.DOM.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.DOM.addEventListener('mouseenter', (e) => this.mouseEnter(e));
        this.DOM.addEventListener('mouseleave', (e) => this.mouseLeave(e));

        // 削除用DOM
        this.removeDOM = document.createElement('span');
        this.removeDOM.classList.add('edit-pt-node-remove');
        this.removeDOM.innerHTML = '×';
        this.DOM.appendChild(this.removeDOM);
        this.removeDOM.addEventListener('click', (e) => this.mouseClickRemoveDOM(e));


        this.setForceDraw();
    }

    /**
     * 削除
     */
    delete()
    {
        super.delete();
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
     * リロード
     */
    reload()
    {
        this.x = parseInt(this.DOM.style.left) + (this.DOM.offsetWidth / 2);
        this.y = parseInt(this.DOM.style.top) + (this.DOM.offsetHeight / 2);
    }

    /**
     * マウスダウン
     *
     * @param e
     */
    mouseDown(e)
    {
        if (window.networkEditor.isNodeMode()) {
            this.isDragging = true;
            this.DOM.style.cursor = "grabbing";

            window.networkEditor.mouseDownInEditNode(e, this);
        } else {
            this.DOM.style.cursor = "unset";
        }
    }

    /**
     * マウスエンター
     *
     * @param e
     */
    mouseEnter(e)
    {
        if (window.networkEditor.isNodeMode()) {
            this.DOM.style.cursor = "grab";
            if (this.removeDOM !== null) {
                this.removeDOM.style.display = 'inline';
            }
        } else {
            this.DOM.style.cursor = "unset";
        }
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
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        this.DOM.style.left = `${x}px`;
        this.DOM.style.top = `${y}px`;

        this.reload();
    }

    /**
     * マウスリーブ
     *
     * @param e
     */
    mouseLeave(e)
    {
        if (window.networkEditor.isNodeMode()) {
            if (this.removeDOM !== null) {
                this.removeDOM.style.display = 'none';
            }
        }
    }

    /**
     * マウスアップ
     *
     * @param e
     */
    mouseUp(e)
    {
        this.DOM.style.cursor = "grab";
        this.reload();
    }

    /**
     * removeDOMクリック
     *
     * @param e
     */
    mouseClickRemoveDOM(e)
    {
        window.networkEditor.removePointNode(this.id);
    }

    /**
     * edge-select DOMクリック
     *
     * @param e
     */
    mouseClickEdgeSelectDOM(e)
    {
        // idの最後の_の後ろの数字を取得
        let vertexNo = e.target.id.slice(-1);
        // intに変換
        vertexNo = parseInt(vertexNo);

        // idの最後の_から後ろを除去
        let nodeId = e.target.id.slice(0, -2);

        e.target.classList.add('selected');

        window.networkEditor.edgeSelect(nodeId, vertexNo);

        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * エッジ選択のキャンセル
     *
     * @param vertexNo
     */
    cancelEdgeSelect(vertexNo)
    {
        this.edgeSelectDOMs[vertexNo].classList.remove('selected');
    }

    /**
     * JSON化
     *
     * @param parent
     * @returns {{x: (number|number), y: (number|number)}}
     */
    toJson(parent)
    {
        return {
            id: this.id,
            x: parent === null ? 0 : this.x - parent.getCenterX(),
            y: parent === null ? 0 : this.y - parent.getCenterY(),
        };
    }
}

