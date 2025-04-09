import { Vertex } from '../common/vertex.js';
import { Rect } from '../common/rect.js';
import { Param } from '../common/param.js';
import { PointNode, SubPointNode } from './point-node.js';
import { OctaNodeConnect, PointNodeConnect, SubConnect } from './connect.js';

/**
 * 八角ノード
 */
export class OctaNode
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
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.rect = new Rect();
        this.notchSize = notchSize;
        this.vertices = [
            new Vertex(0, 0),
            new Vertex(0, 0),
            new Vertex(0, 0),
            new Vertex(0, 0),
            new Vertex(0, 0),
            new Vertex(0, 0),
            new Vertex(0, 0),
            new Vertex(0, 0)
        ];
        this.connects = new Array(8).fill(null);
        this.forceDraw = false;
        this._id = null;
        this._isDraw = true;
        this._isInViewRect = false;

        this.setRect();

        if (this.w > 0 && this.h > 0 && this.notchSize > 0) {
            this.setOctagon();
        }
    }

    /**
     * IDを取得
     */
    get id()
    {
        return this._id;
    }

    /**
     * ViewRectに含まれるかどうかを設定
     *
     * @param isInViewRect
     */
    setIsInViewRect(isInViewRect)
    {
        this._isInViewRect = isInViewRect;
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
        this._isDraw = false;
    }

    /**
     * 再ロード（再配置）
     *
     * @param x
     * @param y
     * @param w
     * @param h
     */
    reload(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.setRect();

        if (this.w > 0 && this.h > 0 && this.notchSize > 0) {
            this.setOctagon();
        }
    }

    /**
     * 矩形を設定
     */
    setRect()
    {
        this.rect.setRect(this.x, this.x + this.w, this.y, this.y + this.h);
    }

    /**
     * x, yが中央座標として短径を設定
     */
    setCenterRect()
    {
        let x = this.x - this.w / 2;
        let y = this.y - this.h / 2;
        this.rect.setRect(x, x + this.w, y, y + this.h);
    }

    /**
     * 八角形の頂点を設定
     */
    setOctagon()
    {
        this.vertices[0].x = this.rect.left + this.notchSize;
        this.vertices[0].y = this.rect.top;
        this.vertices[1].x = this.rect.right - this.notchSize;
        this.vertices[1].y = this.rect.top;
        this.vertices[2].x = this.rect.right;
        this.vertices[2].y = this.rect.top + this.notchSize;
        this.vertices[3].x = this.rect.right;
        this.vertices[3].y = this.rect.bottom - this.notchSize;
        this.vertices[4].x = this.rect.right - this.notchSize;
        this.vertices[4].y = this.rect.bottom;
        this.vertices[5].x = this.rect.left + this.notchSize;
        this.vertices[5].y = this.rect.bottom;
        this.vertices[6].x = this.rect.left;
        this.vertices[6].y = this.rect.bottom - this.notchSize;
        this.vertices[7].x = this.rect.left;
        this.vertices[7].y = this.rect.top + this.notchSize;
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
     * 範囲外でも描画を強制する
     */
    setForceDraw()
    {
        this.forceDraw = true;
    }

    /**
     * 移動
     *
     * @param offsetX
     * @param offsetY
     */
    move(offsetX, offsetY)
    {
        this.x += offsetX;
        this.y += offsetY;
        this.setRect();
        this.setOctagon();
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
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} offsetX
     * @param {number} offsetY
     */
    draw(ctx, offsetX = 0, offsetY = 0)
    {
        if (!this._isDraw) {
            return;
        }

        this.setShapePath(ctx, offsetX, offsetY);
        ctx.stroke();
        ctx.fill();
    }

    /**
     * 指定した頂点から一番近い頂点番号を返す
     *
     * @param v
     * @returns {null}
     */
    getNearVertexNo(v)
    {
        let closestNo = null;
        let minDistance = Infinity;

        this.vertices.forEach((vertex, no) => {
            const distance = Math.sqrt((v.x - vertex.x) ** 2 + (v.y - vertex.y) ** 2);
            if (distance < minDistance) {
                closestNo = no;
                minDistance = distance;
            }
        });

        return closestNo;
    }

    /**
     * 幅から標準的なノッチサイズを取得
     *
     * @param w
     * @returns {number}
     */
    static standardNotchSize(w)
    {
        if (w <= 20) {
            return 5;
        } else if (w <= 25) {
            return 8;
        } else if (w <= 30) {
            return 10;
        } else if (w <= 35) {
            return 11;
        } else if (w <= 40) {
            return 12;
        }
    }

    /**
     * verticesのオブジェクトに変換
     */
    toObj()
    {
        return {
            type: 'octa',
            vertices: [
                this.vertices[0].toObj(),
                this.vertices[1].toObj(),
                this.vertices[2].toObj(),
                this.vertices[3].toObj(),
                this.vertices[4].toObj(),
                this.vertices[5].toObj(),
                this.vertices[6].toObj(),
                this.vertices[7].toObj(),
            ],
        };
    }

    /**
     * verticesのオブジェクトに変換
     */
    toPosObj()
    {
        return {
            vertices: [
                this.vertices[0].toObj(),
                this.vertices[1].toObj(),
                this.vertices[2].toObj(),
                this.vertices[3].toObj(),
                this.vertices[4].toObj(),
                this.vertices[5].toObj(),
                this.vertices[6].toObj(),
                this.vertices[7].toObj(),
            ],
        };
    }
}

/**
 * サブネットワーク用の八角形ノード
 */
export class SubOctaNode extends OctaNode
{
    /**
     * コンストラクタ
     *
     * @param no
     * @param parent
     * @param vertexNo
     * @param offsetX
     * @param offsetY
     * @param w
     * @param h
     * @param notchSize
     * @param nearVertexNo
     */
    constructor(no, parent, vertexNo, offsetX, offsetY, w, h, notchSize, nearVertexNo)
    {
        let x = parent.x;
        let y = parent.y;
        if (parent instanceof OctaNode) {
            x = parent.vertices[vertexNo].x;
            y = parent.vertices[vertexNo].y;
        }

        super(x + offsetX, y + offsetY, w, h, notchSize);

        this.no = no;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        if (nearVertexNo === null) {
            nearVertexNo = this.getNearVertexNo(parent);
        }

        this.connection = new SubConnect(parent, vertexNo, nearVertexNo);

        this.centerOffsetY = 0;
        if (this.connection.node.y > window.innerHeight) {
            let distance = this.connection.node.y - (window.innerHeight / 2);
            this.centerOffsetY = distance - (distance / Param.SUB_NETWORK_SCROLL_RATE);
        }

        // 頂点によって距離が違うため、接続頂点を決めたところで親ノードとの位置を補正
        // 頂点を決めるのにあらかじめ配置情報が必要だったので、後から補正している
        let moveX = this.x - this.vertices[nearVertexNo].x;
        let moveY = this.y - this.vertices[nearVertexNo].y;
        this.move(moveX, moveY - this.centerOffsetY);

        this.offsetX += moveX;
        this.offsetY += moveY;

        this.depth = 0;
        this._isInDrawDepth = false;

        if (this.w > 0 && this.h > 0 && this.notchSize > 0) {
            this.setOctagon();
        }
        this.originX = this.x;
        this.originY = this.y;
    }

    

    get isInDrawDepth()
    {
        return this._isInDrawDepth;
    }

    get isInViewRect()
    {
        return this._isInViewRect;
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        super.delete();
        this.connection.delete();
        this.connection = null;
    }

    /**
     * 再ロード（再配置）
     */
    reload()
    {
        super.reload(this.connection.getVertex().x + this.offsetX,
            this.connection.getVertex().y + this.offsetY - this.centerOffsetY, this.w, this.h);

        this.originX = this.x;
        this.originY = this.y;
    }

    /**
     * 更新
     * 
     * @param {Rect} subViewRect
     * @param {number} minDrawDepth
     * @param {number} maxDrawDepth
     */
    update(viewRect, subViewRect, minDrawDepth, maxDrawDepth)
    {
        // 描画対象の深さに含まれているか
        this._isInDrawDepth = (this.depth >= minDrawDepth && this.depth <= maxDrawDepth);

        super.reload(this.originX, this.originY, this.w, this.h);

        // ViewRectの中に入っているか
        this._isInViewRect = subViewRect.overlapWith(this.rect);

        this.move(0, -subViewRect.top);
    }
    
    /**
     * 描画するか
     */
    isDraw()
    {
        return this._isInDrawDepth && this._isInViewRect;
    }
    

    /**
     * 描画
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {Rect} viewRect
     */
    draw(ctx, viewRect)
    {
        if (this.isDraw()) {
            this.setShapePath(ctx);
            ctx.stroke();
        }
    }

    drawEdge(ctx, viewRect)
    {
        // 接続先が描画されているなら自分が画面外にあったとしてもエッジを描画
        if (this._isInDrawDepth) {
            this.connects.forEach((connect, vertexNo) => {
                if (connect !== null && connect.type === Param.CONNECT_TYPE_INCOMING) {
                    const targetNode = connect.node;
                
                    if (targetNode) {
                        if (targetNode instanceof SubPointNode || targetNode instanceof SubOctaNode) {
                            if (!targetNode.isInDrawDepth) {
                                return;
                            }
                        }

                        if (!this.isDraw() && !targetNode.isDraw()) {
                            return;
                        }

                        ctx.beginPath();

                        const targetVertex = connect.getVertex();
                        if (targetNode instanceof SubPointNode || targetNode instanceof SubOctaNode) {
                            ctx.moveTo(targetVertex.x, targetVertex.y);
                        } else {
                            ctx.moveTo(targetVertex.x - viewRect.left, targetVertex.y - viewRect.top);
                        }

                        let x = this.vertices[vertexNo].x;
                        let y = this.vertices[vertexNo].y;
                        ctx.lineTo(x, y);
                        ctx.stroke();
                    }
                }
            });
        }
    }

    /**
     * verticesのオブジェクトに変換
     */
    toObj()
    {
        let obj = super.toObj();
        obj.no = this.no;
        let connects = [];
        let no = -1;

        this.connects.forEach((connect, vertexNo) => {
            if (connect !== null && connect.type === Param.CONNECT_TYPE_INCOMING) {
                no = -1;
                if (connect.node instanceof SubOctaNode || connect.node instanceof SubPointNode) {
                    no = connect.node.no;
                }

                connects.push([vertexNo, no, connect.vertexNo]);
            }
        });

        obj.connects = connects;
        obj.depth = this.depth;
        obj.parentConnect = this.connection.toObj();

        return obj;
    }
}
