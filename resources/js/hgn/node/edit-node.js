import {Param} from '../param.js';
import {Util} from '../util.js';
import {DOMNode} from './octa-node.js';
import {PointNode} from './point-node.js';


export class EditNode extends DOMNode
{
    /**
     * インスタンス生成
     *
     * @param nodeData
     * @param networkPosition
     * @param isRemovable
     * @returns {EditNode}
     */
    static create(nodeData, networkPosition, isRemovable = true)
    {
        let DOM = document.createElement('div');
        DOM.classList.add('edit-node');
        DOM.innerHTML = nodeData.name;
        DOM.id = nodeData.id;
        window.networkEditor.editorDOM.appendChild(DOM);

        if (isRemovable) {
            let remove = document.createElement('span');
            remove.classList.add('edit-node-remove');
            remove.innerHTML = '×';
            DOM.appendChild(remove);
        }

        DOM.style.left = `${networkPosition.x + nodeData.x}px`;
        DOM.style.top = `${networkPosition.y + nodeData.y}px`;

        EditNode.appendEdgeSelect(nodeData, DOM);

        return new EditNode(nodeData.id, nodeData.x, nodeData.y, DOM);
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
     * @param id
     * @param x
     * @param y
     * @param DOM
     */
    constructor(id, x, y, DOM)
    {
        super(id, x, y, DOM);

        DOM.addEventListener('mousedown', (e) => {return this.mouseDown(e)});
        DOM.addEventListener('mouseenter', (e) => this.mouseEnter(e));
        DOM.addEventListener('mouseleave', (e) => this.mouseLeave(e));

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
     * ノード配置モード開始
     */
    startNodeMode()
    {
        this.DOM.classList.remove('edge-mode');
    }

    /**
     * エッジ選択モード開始
     */
    startEdgeMode()
    {
        this.DOM.classList.add('edge-mode');
        this.edgeSelectDOMs.forEach(edgeSelectDOM => {
            edgeSelectDOM.classList.remove('selected');
        });
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
     * マウス移動
     *
     * @param moveX
     * @param moveY
     * @param screenOffset
     */
    mouseMove(moveX, moveY, screenOffset)
    {
        this.x += moveX;
        this.y += moveY;
        this.DOM.style.left = `${this.x + screenOffset.x}px`;
        this.DOM.style.top = `${this.y + screenOffset.y}px`;

        this.reload();
    }

    /**
     * 再ロード
     */
    reload()
    {
        this.w = this.DOM.offsetWidth;
        this.h = this.DOM.offsetHeight;
        this.setRect();

        if (this.w > 0 && this.h > 0 && this.notchSize > 0) {
            this.setOctagon();
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
    }

    /**
     * 描画
     *
     * @param ctx
     * @param offsetX
     * @param offsetY
     */
    draw(ctx, offsetX, offsetY)
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

    /**
     * JSON化
     *
     * @returns {{id: (string), x: (number), y: (number)}}
     */
    toJson()
    {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
        };
    }

    /**
     * エッジ用のJSON
     *
     * @returns {*[]}
     */
    getConnectJsonArr()
    {
        let arr = [];
        this.connects.forEach((con, vertexNo) => {
            if (con !== null && con.type === Param.CONNECT_TYPE_OUTGOING) {
                if (con.node instanceof EditNode) {
                    arr.push({
                        from: this.id,
                        from_vn: vertexNo,
                        to: con.node.id,
                        to_vn: con.vertexNo,
                    });
                } else if (con.node instanceof EditPointNode) {
                    arr.push({
                        from: this.id,
                        from_vn: vertexNo,
                        to: con.node.id,
                    });
                }
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
     * @param screenOffset
     */
    constructor(id, x, y, screenOffset)
    {
        super(x, y, 6);

        this.id = id;

        // 移動用DOM
        this.DOM = document.createElement('div');
        this.DOM.id = id;
        this.DOM.classList.add('edit-pt-node');
        window.networkEditor.editorDOM.appendChild(this.DOM);

        this.setPos(x, y, screenOffset);

        this.DOM.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.DOM.addEventListener('mouseenter', (e) => this.mouseEnter(e));
        this.DOM.addEventListener('mouseleave', (e) => this.mouseLeave(e));
        this.DOM.addEventListener('click', (e) => this.click(e));

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
     * ノード配置モード開始
     */
    startNodeMode()
    {
        this.DOM.classList.remove('edge-mode');
    }

    /**
     * エッジ選択モード開始
     */
    startEdgeMode()
    {
        this.DOM.classList.add('edge-mode');
        this.DOM.classList.remove('selected');
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
     * @param moveX
     * @param moveY
     * @param screenOffset
     */
    mouseMove(moveX, moveY, screenOffset)
    {
        this.setPos(this.x + moveX, this.y + moveY, screenOffset);
    }

    setPos(x, y, screenOffset)
    {
        this.x = x;
        this.y = y;
        this.DOM.style.left = `${x + screenOffset.x - this.DOM.offsetWidth / 2}px`;
        this.DOM.style.top = `${y + screenOffset.y - this.DOM.offsetHeight / 2}px`;
    }

    /**
     * DOMクリック
     *
     * @param e
     */
    click(e)
    {
        if (window.networkEditor.isEdgeMode()) {
            e.target.classList.add('selected');

            window.networkEditor.edgeSelect(e.target.id, this.connects.length);

            e.preventDefault();
            e.stopPropagation();
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
     * マウスアップ
     *
     * @param e
     */
    mouseUp(e)
    {
        this.DOM.style.cursor = "grab";
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
     * エッジ選択のキャンセル
     */
    cancelEdgeSelect()
    {
        this.DOM.classList.remove('selected');
    }

    /**
     * JSON化
     *
     * @param parent
     * @returns {{x: (number|number), y: (number|number)}}
     */
    toJson()
    {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
        };
    }

    /**
     * エッジ用のJSON
     *
     * @returns {*[]}
     */
    getConnectJsonArr()
    {
        let arr = [];
        this.connects.forEach(con => {
            if (con !== null && con.type === Param.CONNECT_TYPE_OUTGOING) {
                if (con.node instanceof EditNode) {
                    arr.push({
                        from: this.id,
                        to: con.node.id,
                        to_vn: con.vertexNo,
                    });
                } else if (con.node instanceof EditPointNode) {
                    arr.push({
                        from: this.id,
                        to: con.node.id,
                    });
                }
            }
        });

        return arr;
    }
}

