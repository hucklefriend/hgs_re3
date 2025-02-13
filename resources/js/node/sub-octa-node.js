
/**
 * サブネットワーク用八角ノード
 */
export class SubOctaNode
{
    /**
     * コンストラクタ
     *
     * @param x
     * @param y
     * @param w
     * @param h
     * @param notchSize
     */
    constructor(x = 0, y = 0, w = 0, h = 0, notchSize = 0)
    {
        this.vertices = [];
        this.connects = new Array(8).fill(null);
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        this.vertices = null;
        this.connects.forEach((connect, vertexNo) => {
            if (connect !== null) {
                this.disconnect(vertexNo);
                connect.delete();
            }
        });
        this.connects = null;
    }

    /**
     * 図形のパスを設定
     *
     * @param ctx
     * @param offsetX
     * @param offsetY
     */
    setShapePath(ctx, offsetX = 0, offsetY = 0)
    {
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x + offsetX, this.vertices[0].y + offsetY);
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x + offsetX, this.vertices[i].y + offsetY);
        }
        ctx.closePath();
    }

    /**
     * 図形のパスを設定
     *
     * @param ctx
     * @param vertices
     * @param offsetX
     * @param offsetY
     */
    setShapePathByVertices(ctx, vertices, offsetX = 0, offsetY = 0)
    {
        ctx.beginPath();
        ctx.moveTo(vertices[0].x + offsetX, vertices[0].y + offsetY);
        for (let i = 1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i].x + offsetX, vertices[i].y + offsetY);
        }
        ctx.closePath();
    }


    /**
     * LTTと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectLTT(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.LTT, targetNode, targetNodeVertexNo);
    }

    /**
     * RTTと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectRTT(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.RTT, targetNode, targetNodeVertexNo);
    }

    /**
     * RRTと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectRRT(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.RRT, targetNode, targetNodeVertexNo);
    }

    /**
     * RRBと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectRRB(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.RRB, targetNode, targetNodeVertexNo);
    }

    /**
     * RBBと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectRBB(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.RBB, targetNode, targetNodeVertexNo);
    }

    /**
     * LBBと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectLBB(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.LBB, targetNode, targetNodeVertexNo);
    }

    /**
     * LLBと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectLLB(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.LLB, targetNode, targetNodeVertexNo);
    }

    /**
     * LLTと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectLLT(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.LLT, targetNode, targetNodeVertexNo);
    }

    /**
     * 別のノードと接続
     *
     * @param vertexNo
     * @param targetNode
     * @param targetNodeVertexNo
     */
    connect(vertexNo, targetNode, targetNodeVertexNo = null)
    {
        if (vertexNo === null) {
            vertexNo = this.getNearVertexNo(targetNode);
        }

        if (targetNode instanceof PointNode) {
            return this.connect2PointNode(vertexNo, targetNode);
        } else if (targetNode instanceof OctaNode) {
            if (targetNodeVertexNo === null) {
                targetNodeVertexNo = targetNode.getNearVertexNo(this.vertices[vertexNo]);
            }

            return this.connect2OctaNode(vertexNo, targetNode, targetNodeVertexNo);
        }

        console.warn('Invalid target node');
        return false;
    }

    /**
     * 点ノードへ接続
     *
     * @param vertexNo
     * @param targetNode
     * @returns {boolean}
     */
    connect2PointNode(vertexNo, targetNode)
    {
        if (this.isConnectedVertex(vertexNo)) {
            return false;
        }

        this.connects[vertexNo] = new PointNodeConnect(Param.CONNECT_TYPE_OUTGOING, targetNode);
        targetNode.connects.push(new OctaNodeConnect(Param.CONNECT_TYPE_INCOMING, this, vertexNo));

        return true;
    }

    /**
     * 八角ノードへ接続
     *
     * @param vertexNo
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {boolean}
     */
    connect2OctaNode(vertexNo, targetNode, targetNodeVertexNo)
    {
        if (this.isConnectedVertex(vertexNo) || targetNode.isConnectedVertex(targetNodeVertexNo)) {
            console.warn('Already connected');
            return false;
        }

        this.connects[vertexNo] = new OctaNodeConnect(Param.CONNECT_TYPE_OUTGOING, targetNode, targetNodeVertexNo);
        targetNode.connects[targetNodeVertexNo] = new OctaNodeConnect(Param.CONNECT_TYPE_INCOMING, this, vertexNo);

        return true;
    }

    /**
     * 接続解除
     *
     * @param vertexNo
     */
    disconnect(vertexNo)
    {
        if (this.connects[vertexNo] !== null) {
            let targetNode = this.connects[vertexNo].node;
            this.connects[vertexNo] = null;
            targetNode.disconnectByNode(this);
        }
    }

    /**
     * ノードを指定して接続解除
     *
     * @param node
     */
    disconnectByNode(node)
    {
        this.connects.forEach((connect, idx) => {
            if (connect !== null && connect.node === node) {
                this.disconnect(idx);
            }
        });
    }

    /**
     * 接続済みか
     *
     * @returns {boolean}
     */
    isConnected(vertexNo, targetNode, targetVertexNo)
    {
        let connect = this.connects[vertexNo];

        if (connect !== null) {
            if (targetNode instanceof PointNode) {
                return connect.node === targetNode;
            } else if (targetNode instanceof OctaNode) {
                return connect.node === targetNode && connect.vertexNo === targetVertexNo;
            }
        }

        return false;
    }

    /**
     * 接続済みのノードか
     *
     * @param targetNode
     * @returns {boolean}
     */
    isConnectedNode(targetNode)
    {
        return this.connects.some(connect => {
            return connect !== null && connect.node === targetNode;
        });
    }

    /**
     * 接続済みの頂点か
     *
     * @param vertexNo
     * @returns {boolean}
     */
    isConnectedVertex(vertexNo)
    {
        return this.connects[vertexNo] !== null;
    }

    /**
     * 描画
     *
     * @param ctx
     * @param offsetX
     * @param offsetY
     * @param {Rect|null}viewRect
     */
    draw(ctx, offsetX = 0, offsetY = 0, viewRect = null)
    {
        if (viewRect !== null) {
            // 表示領域外にあったら描画しない
            const drawLeft = this.vertices[Param.LLT].x + offsetX;
            const drawRight = this.vertices[Param.RRB].y + offsetX;
            const drawTop = this.vertices[Param.LTT].y + offsetY;
            const drawBottom = this.vertices[Param.LBB].y + offsetY;

            if (drawRight < viewRect.left - Param.VIEW_RECT_MARGIN) {
                return;
            }
            if (drawLeft > viewRect.right + Param.VIEW_RECT_MARGIN) {
                return;
            }
            if (drawBottom < viewRect.top - Param.VIEW_RECT_MARGIN) {
                return;
            }
            if (drawTop > viewRect.bottom + Param.VIEW_RECT_MARGIN) {
                return;
            }
        }

        this.setShapePath(ctx, offsetX, offsetY);
        ctx.stroke();
        ctx.fill();
    }
}