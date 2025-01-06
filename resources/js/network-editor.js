import {EditNode} from './hgn/node/edit-node.js';
import {Bg2PointNode, PointNode} from './hgn/node/point-node.js';
import {Param} from './hgn/param.js';
import {Bg2OctaNode} from "./hgn/node/octa-node.js";
import {Util} from "./hgn/util.js";
// import {Util} from './hgn/util.js';

/**
 * ネットワークエディタ
 */
export class NetworkEditor
{
    static MODE_NODE = 1;
    static MODE_EDGE = 2;

    /**
     * コンストラクタ
     */
    constructor()
    {
        // #network-editor
        this.editorDOM = document.querySelector('#network-editor');

        // #network-editor-canvas
        this.canvas = document.querySelector('#network-editor-canvas');
        this.ctx = null;
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
        }
        this.canvas.width = this.editorDOM.offsetWidth;
        this.canvas.height = this.editorDOM.offsetHeight;

        // #network-editor-container なければ body
        this.containerDOM = document.querySelector('#network-editor-container');
        if (this.containerDOM === null) {
            this.containerDOM = document.body;
        }

        // ノード
        this.parent = null;
        this.nodes = {};
        this.points = [];
        this.connections = [];

        // ノードモード用変数
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.draggingNode = null;

        // エッジモード用変数
        this.edgeFromNode = null;
        this.edgeFromVertexNo = null;

        this.center = {x: 0, y: 0};

        this.mode = NetworkEditor.MODE_NODE;
    }

    /**
     * エディタ起動
     */
    start(data)
    {
        // containerDOMのスクロール位置をeditorDOMの中央に
        this.containerDOM.scrollTop = this.editorDOM.offsetTop - (this.containerDOM.offsetHeight - this.editorDOM.offsetHeight) / 2;
        this.containerDOM.scrollLeft = this.editorDOM.offsetLeft - (this.containerDOM.offsetWidth - this.editorDOM.offsetWidth) / 2;
        this.center.x = this.editorDOM.offsetWidth / 2;
        this.center.y = this.editorDOM.offsetHeight / 2;

        this.editorDOM.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.editorDOM.addEventListener('mousemove', (e) => this.mouseMove(e));
        this.editorDOM.addEventListener('mouseup', (e) => this.mouseUp(e));
        this.editorDOM.addEventListener('click', (e) => this.mouseClick(e));
        this.containerDOM.addEventListener('mouseleave', (e) => this.mouseUp(e));

        // ノードの読み込み
        this.parent = EditNode.create(data.parent, this.center, false);
        if (data.nodes !== undefined) {
            Object.keys(data.nodes).forEach(id => {
                let node = data.nodes[id];
                node.id = id;
                this.nodes[node.id] = EditNode.create(node, this.center);
            });
        }

        this.draw();

        this.nodeModeBtn = document.querySelector('#mode_select_node');
        this.edgeModeBtn = document.querySelector('#mode_select_edge');

        this.nodeModeBtn.addEventListener('click', () => {
            this.mode = NetworkEditor.MODE_NODE;
            this.nodeModeBtn.classList.add('active');
            this.edgeModeBtn.classList.remove('active');

            this.parent.DOM.classList.remove('edge-mode');
            Object.values(this.nodes).forEach(node => {
                node.DOM.classList.remove('edge-mode');
            });

            this.draw();
        });

        this.edgeModeBtn.addEventListener('click', () => {
            this.mode = NetworkEditor.MODE_EDGE;
            this.edgeModeBtn.classList.add('active');
            this.nodeModeBtn.classList.remove('active');

            this.parent.DOM.classList.add('edge-mode');
            Object.values(this.nodes).forEach(node => {
                node.DOM.classList.add('edge-mode');
            });

            this.draw();
        });

        this.setJson();
    }

    mouseDown(e)
    {
        if (this.isNodeMode()) {
            this.startDrag(e);
        }
    }

    mouseClick(e)
    {
        if (this.isEdgeMode()) {
            if (this.edgeFromNode !== null) {
                this.edgeFromNode.cancelEdgeSelect(this.edgeFromVertexNo);

                this.edgeFromNode = null;
                this.edgeFromVertexNo = null;

                this.draw();
            }
        }
    }

    edgeSelect(nodeId, vertexNo)
    {
        let node = this.getNodeById(nodeId);
        if (node === null) {
            return;
        }

        if (this.edgeFromNode === null) {
            this.edgeFromNode = node;
            this.edgeFromVertexNo = vertexNo;
        } else {
            node.cancelEdgeSelect(vertexNo);
            if (this.edgeFromNode.id === node.id) {
                // 同じノードを選択した場合はキャンセル
                return;
            }

            this.edgeFromNode.connect(this.edgeFromVertexNo, node, vertexNo);

            this.edgeFromNode.cancelEdgeSelect(this.edgeFromVertexNo);

            this.edgeFromNode = null;
            this.edgeFromVertexNo = null;

            this.setJson();
        }
    }

    /**
     * エディットノードからドラッグ開始
     *
     * @param e
     * @param node
     */
    mouseDownInEditNode(e, node)
    {
        this.draggingNode = node;
        this.startDrag(e);
    }

    /**
     * ドラッグ開始
     *
     * @param e
     */
    startDrag(e)
    {
        if (this.isNodeMode() && !this.isDragging) {
            this.isDragging = true;

            if (this.draggingNode !== null) {
                this.offsetX = this.draggingNode.getOffsetX(e);
                this.offsetY = this.draggingNode.getOffsetY(e);
            } else {
                // ノードがドラッグされない場合はスクロール
                this.offsetX = e.clientX - this.containerDOM.scrollLeft;
                this.offsetY = e.clientY - this.containerDOM.scrollTop;
            }
        }
    }

    /**
     * ドラッグ中
     *
     * @param e
     */
    mouseMove(e)
    {
        if (this.isNodeMode()) {
            if (this.isDragging) {
                if (this.draggingNode !== null) {
                    // ノードの移動
                    this.draggingNode.mouseMove(e, this.offsetX, this.offsetY);
                } else {
                    // スクロール
                    this.containerDOM.scrollLeft = e.clientX - this.offsetX;
                    this.containerDOM.scrollTop = e.clientY - this.offsetY;
                }

                this.draw();
            }
        } else if (this.isEdgeMode()) {
            if (this.edgeFromNode !== null) {
                this.draw();
                this.ctx.beginPath();
                let vertex = this.edgeFromNode.vertices[this.edgeFromVertexNo];
                this.ctx.moveTo(vertex.x, vertex.y);

                let rect = this.containerDOM.getBoundingClientRect();
                let x = e.clientX - rect.left + this.containerDOM.scrollLeft; // スクロール量を考慮
                let y = e.clientY - rect.top + this.containerDOM.scrollTop;  // スクロール量を考慮
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            }
        }
    }

    /**
     * ドラッグ終了
     *
     * @param e
     */
    mouseUp(e)
    {
        this.isDragging = false;

        if (this.draggingNode !== null) {
            this.draggingNode.mouseUp(e);
            this.draggingNode = null;

            this.setJson();
        }
    }

    /**
     * 高さの取得
     *
     * @returns {number}
     */
    getHeight()
    {
        return this.containerDOM.offsetHeight;
    }

    /**
     * Windowサイズ変更などによるNodeの再読取り
     */
    reloadNodes()
    {

    }

    /**
     * ノードのクリア
     */
    clearNodes()
    {
        Object.values(this.nodes).forEach(node => {
            this.editorDOM.removeChild(node.DOM);
            node.delete();
        });
        this.nodes = {};
    }

    /**
     * ノードの取得
     *
     * @param id
     * @returns {*|null}
     */
    getNodeById(id)
    {
        if (this.parent.id === id) {
            return this.parent;
        }

        if (!this.nodes.hasOwnProperty(id)) {
            console.error(`Node ${id} not found.`);
            return null;
        }

        return this.nodes[id];
    }

    /**
     * ノードの追加
     *
     * @param id
     * @param name
     */
    appendNode(id, name)
    {
        if (this.nodes.hasOwnProperty(id)) {
            alert("すでに登録されています。");
            return;
        }

        let x = this.containerDOM.scrollLeft - this.center.x + 60;
        let y = this.containerDOM.scrollTop - this.center.y + 60;
        this.nodes[id] = EditNode.create({id: id, name: name, x: x, y: y}, this.center);
        this.editorDOM.appendChild(this.nodes[id].DOM);
        this.draw();

        this.setJson();
    }

    /**
     * ノードの削除
     *
     * @param id
     */
    removeNode(id)
    {
        if (this.nodes.hasOwnProperty(id)) {
            this.editorDOM.removeChild(this.nodes[id].DOM);

            this.nodes[id].delete();
            delete this.nodes[id];

            this.draw();

            this.setJson();
        }
    }

    /**
     * 描画
     */
    draw()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawNode(this.parent);

        Object.values(this.nodes).forEach(node => {
            this.drawNode(node);
        });
    }

    drawNode(node)
    {
        this.ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
        this.ctx.lineWidth = 1; // 線の太さ
        this.ctx.shadowColor = "lime"; // 影の色
        this.ctx.shadowBlur = 5; // 影のぼかし効果

        node.connects.forEach((connect, vertexNo) => {
            if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING){
                let targetVertex = connect.getVertex();

                this.ctx.beginPath();

                this.ctx.moveTo(node.vertices[vertexNo].x, node.vertices[vertexNo].y);
                this.ctx.lineTo(targetVertex.x, targetVertex.y);
                this.ctx.stroke();
            }
        });

        node.draw(this.ctx, this.center.x, this.center.y);
    }

    /**
     * 更新
     */
    update()
    {

    }

    /**
     * ウィンドウサイズの変更
     */
    changeSize()
    {

    }

    /**
     * スクロール
     */
    scroll()
    {

    }

    isNodeMode()
    {
        return this.mode === NetworkEditor.MODE_NODE;
    }

    isEdgeMode()
    {
        return this.mode === NetworkEditor.MODE_EDGE;
    }

    setJson()
    {
        document.querySelector('#json').value = JSON.stringify(this.toJson());
    }

    toJson()
    {
        let nodes = {};
        Object.values(this.nodes).forEach(node => {
            nodes[node.id] = node.toJson(this.parent);
        });

        return {
            parent: this.parent.toJson(null),
            nodes: nodes,
        };
    }
}

window.networkEditor = new NetworkEditor();
window.hgn = window.networkEditor;
