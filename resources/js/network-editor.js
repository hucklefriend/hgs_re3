import {EditNode, EditPointNode} from './hgn/node/edit-node.js';
import {Param} from './hgn/param.js';
import {Util} from "./hgn/util.js";

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
            this.ctx.save();
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
        this.pointsIndex = 0;
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
        this.editorDOM.addEventListener('click', (e) => this.click(e));
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

        // ポイントの読み取り
        if (data.hasOwnProperty('ptIdx')) {
            this.pointsIndex = data.ptIdx;
        }
        if (data.hasOwnProperty('points')) {
            data.points.forEach(point => {
                this.points[point.id] = new EditPointNode(point.id, point.x + this.center.x, point.y + this.center.y);
            });
        }

        // エッジの読み込み
        if (data.connects !== undefined) {
            data.connects.forEach(connect => {
                let fromNode = this.getNodeById(connect.from);
                let toNode = this.getNodeById(connect.to);

                if (fromNode !== null && toNode !== null) {
                    if (fromNode instanceof EditNode) {
                        fromNode.connect(connect.from_vn ?? null, toNode, connect.to_vn ?? null);
                    } else if (fromNode instanceof EditPointNode) {
                        fromNode.connect(toNode, connect.to_vn ?? null);
                    }
                }
            });
        }

        this.draw();

        this.nodeModeBtn = document.querySelector('#mode_select_node');
        this.edgeModeBtn = document.querySelector('#mode_select_edge');

        this.nodeModeBtn.addEventListener('click', () => {
            if (this.mode === NetworkEditor.MODE_NODE) {
                return;
            }
            this.mode = NetworkEditor.MODE_NODE;
            this.nodeModeBtn.classList.add('active');
            this.edgeModeBtn.classList.remove('active');

            this.parent.startNodeMode();
            Object.values(this.nodes).forEach(node => {
                node.startNodeMode();
            });
            Object.values(this.points).forEach(node => {
                node.startNodeMode();
            });

            this.draw();
        });

        this.edgeModeBtn.addEventListener('click', () => {
            if (this.mode === NetworkEditor.MODE_EDGE) {
                return;
            }
            this.mode = NetworkEditor.MODE_EDGE;
            this.edgeModeBtn.classList.add('active');
            this.nodeModeBtn.classList.remove('active');

            this.parent.startEdgeMode();
            Object.values(this.nodes).forEach(node => {
                node.startEdgeMode();
            });
            Object.values(this.points).forEach(node => {
                node.startEdgeMode();
            });

            this.draw();
        });

        this.writeJson();
    }

    /**
     * マウスダウン
     *
     * @param e
     */
    mouseDown(e)
    {
        if (this.isNodeMode()) {
            this.startDrag(e);
        }
    }

    /**
     * マウスクリック
     *
     * @param e
     */
    click(e)
    {
        if (this.isEdgeMode()) {
            if (this.edgeFromNode !== null) {
                this.edgeFromNode.cancelEdgeSelect(this.edgeFromVertexNo);

                this.edgeFromNode = null;
                this.edgeFromVertexNo = null;

                this.writeJson();

                this.draw();
            }
        }
    }

    /**
     * エッジ選択
     *
     * @param nodeId
     * @param vertexNo
     */
    edgeSelect(nodeId, vertexNo)
    {
        let node = this.getNodeById(nodeId);
        if (node === null) {
            console.error(nodeId + " Node not found.");
            return;
        }

        if (this.edgeFromNode === null) {
            this.edgeFromNode = node;
            this.edgeFromVertexNo = vertexNo;
        } else {
            node.cancelEdgeSelect(vertexNo);
            this.edgeFromNode.cancelEdgeSelect(this.edgeFromVertexNo);
            if (this.edgeFromNode === node) {
                // 自分自身を選択した場合は何もしない
                return;
            }

            if (this.edgeFromNode instanceof EditNode) {
                if (this.edgeFromNode.isConnected(this.edgeFromVertexNo, node, vertexNo)) {
                    this.edgeFromNode.disconnectByNode(node, vertexNo);
                } else {
                    if (this.edgeFromNode.isConnectedNode(node)) {
                        // 対象ノードに対して1つでも接続済みであれば、接続を全部切る
                        this.edgeFromNode.disconnectByNode(node);
                    }

                    // 未接続のエッジを選択した場合は接続
                    if (node instanceof EditNode) {
                        node.disconnect(vertexNo);  // 別のノードとの接続があれば切る
                    }
                    this.edgeFromNode.connect(this.edgeFromVertexNo, node, vertexNo);
                }
            } else if (this.edgeFromNode instanceof EditPointNode) {
                if (this.edgeFromNode.isConnected(node, vertexNo)) {
                    this.edgeFromNode.disconnectByNode(node, vertexNo);
                } else {
                    if (this.edgeFromNode.isConnectedNode(node)) {
                        // 対象ノードに対して1つでも接続済みであれば、接続を全部切る
                        this.edgeFromNode.disconnectByNode(node);
                    }

                    if (node instanceof EditNode) {
                        node.disconnect(vertexNo);  // 別のノードとの接続があれば切る
                    }
                    this.edgeFromNode.connect(node, vertexNo);
                }
            }

            this.edgeFromNode = null;
            this.edgeFromVertexNo = null;

            this.writeJson();

            this.draw();
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
                this.offsetX = e.clientX;
                this.offsetY = e.clientY;
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
                    this.containerDOM.scrollLeft -= e.clientX - this.offsetX;
                    this.containerDOM.scrollTop -= e.clientY - this.offsetY;
                    this.offsetX = e.clientX;
                    this.offsetY = e.clientY;
                }

                this.draw();
            }
        } else if (this.isEdgeMode()) {
            if (this.edgeFromNode !== null) {
                this.draw();
                this.ctx.beginPath();
                if (this.edgeFromNode instanceof EditNode) {
                    let vertex = this.edgeFromNode.vertices[this.edgeFromVertexNo];
                    this.ctx.moveTo(vertex.x, vertex.y);
                } else if (this.edgeFromNode instanceof EditPointNode) {
                    this.ctx.moveTo(this.edgeFromNode.x, this.edgeFromNode.y);
                }

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

            this.writeJson();
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

        if (this.nodes.hasOwnProperty(id)) {
            return this.nodes[id];
        }

        if (this.points.hasOwnProperty(id)) {
            return this.points[id];
        }

        console.error(`Node ${id} not found.`);
        return null;
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

        if (this.isEdgeMode()) {
            this.nodes[id].startEdgeMode();
        }

        this.writeJson();
    }

    /**
     * ポイントノードの追加
     */
    appendPointNode()
    {
        let x = this.containerDOM.scrollLeft + 30;
        let y = this.containerDOM.scrollTop + 30;

        let id = "pt" + this.pointsIndex;
        this.pointsIndex++;

        this.points[id] = new EditPointNode(id, x, y);

        this.draw();

        this.writeJson();
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

            this.writeJson();
        }
    }

    /**
     * ポイントノードの削除
     *
     * @param id
     */
    removePointNode(id)
    {
        if (this.points.hasOwnProperty(id)) {
            this.editorDOM.removeChild(this.points[id].DOM);

            this.points[id].delete();
            delete this.points[id];

            this.draw();

            this.writeJson();
        }
    }

    /**
     * 描画
     */
    draw()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        this.drawNode(this.parent);

        Object.values(this.nodes).forEach(node => {
            this.drawNode(node);
        });

        this.ctx.restore();

        this.ctx.fillStyle = "rgba(0, 200, 0, 0.8)"; // 線の色と透明度

        Object.values(this.points).forEach(point => {
            point.connects.forEach(connect => {
                if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING){
                    let targetVertex = connect.getVertex();

                    this.ctx.beginPath();

                    this.ctx.moveTo(point.x, point.y);
                    this.ctx.lineTo(targetVertex.x, targetVertex.y);
                    this.ctx.stroke();
                }
            });

            point.draw(this.ctx, 0, 0);
        });
    }

    /**
     * ノードの描画
     *
     * @param node
     */
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
     * ノードモードか
     *
     * @returns {boolean}
     */
    isNodeMode()
    {
        return this.mode === NetworkEditor.MODE_NODE;
    }

    /**
     * エッジモードか
     *
     * @returns {boolean}
     */
    isEdgeMode()
    {
        return this.mode === NetworkEditor.MODE_EDGE;
    }

    /**
     * JSONを書き込み
     */
    writeJson()
    {
        document.querySelector('#json').value = JSON.stringify(this.toJson());
    }

    /**
     * JSON化
     *
     * @returns {{parent: *, nodes: {}, connects: *[]}}
     */
    toJson()
    {
        let nodes = {};
        let connects = [];
        let w = this.parent.DOM.offsetWidth / 2;
        let h = this.parent.DOM.offsetHeight / 2;

        connects.push(...this.parent.getConnectJsonArr());
        Object.values(this.nodes).forEach(node => {
            let json = node.toJson(this.parent);
            nodes[node.id] = json;
            connects.push(...node.getConnectJsonArr());

            let l = Math.abs(json.x - node.DOM.offsetWidth / 2);
            let t = Math.abs(json.y - node.DOM.offsetHeight / 2);
            let r = Math.abs(json.x + node.DOM.offsetWidth / 2);
            let b = Math.abs(json.y + node.DOM.offsetHeight / 2);
            if (w < l) {
                w = l;
            }
            if (h < t) {
                h = t;
            }
            if (w < r) {
                w = r;
            }
            if (h < b) {
                h = b;
            }
        });

        let points = [];
        Object.values(this.points).forEach(point => {
            let json = point.toJson(this.parent);
            points.push(json);
            connects.push(...point.getConnectJsonArr());

            let l = Math.abs(json.x - 10);
            let t = Math.abs(json.y - 10);
            let r = Math.abs(json.x + 10);
            let b = Math.abs(json.y + 10);
            if (w < l) {
                w = l;
            }
            if (h < t) {
                h = t;
            }
            if (w < r) {
                w = r;
            }
            if (h < b) {
                h = b;
            }
        });

        return {
            parent: this.parent.toJson(null),
            nodes: nodes,
            connects: connects,
            ptIdx: this.pointsIndex,
            points: points,
            width: w*2 + 20,
            height: h*2 + 20,
        };
    }
}

window.networkEditor = new NetworkEditor();
window.hgn = window.networkEditor;
