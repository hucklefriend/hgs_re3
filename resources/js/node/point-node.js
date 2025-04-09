import { Param } from '../common/param.js';
import { Vertex } from '../common/vertex.js';
import { OctaNode, SubOctaNode } from './octa-node.js';
import { OctaNodeConnect, PointNodeConnect, SubConnect } from './connect.js';

/**
 * 点ノード
 */
export class PointNode extends Vertex
{
    /**
     * コンストラクタ
     *
     * @param x
     * @param y
     * @param r
     * @param id
     */
    constructor(x = 0, y = 0, r = 5, id = null)
    {
        super(x, y);
        this.r = r;
        this.id = id;
        this.connects = [];
        this.forceDraw = false;

        this.depth = 0;
        this._animFunc = null;
        this._isInViewRect = true;
    }

    /**
     * 表示するかどうか設定
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
        this.connects.forEach((connect, idx) => {
            this.disconnect(idx);
        });
        this.connects = null;
    }

    /**
     * 範囲外でも強制的に描画する
     */
    setForceDraw()
    {
        this.forceDraw = true;
    }

    /**
     * オフセット移動
     * 何もしない
     *
     * @param offsetX
     * @param offsetY
     */
    moveOffset(offsetX, offsetY)
    {

    }

    /**
     * 別のノードと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     */
    connect(targetNode, targetNodeVertexNo = null)
    {

        if (targetNode instanceof PointNode) {
            return this.connect2PointNode(targetNode);
        } else if (targetNode instanceof OctaNode) {
            if (targetNodeVertexNo === null) {
                targetNodeVertexNo = targetNode.getNearVertexNo(this);
            }

            return this.connect2OctaNode(targetNode, targetNodeVertexNo);
        }

        return false;
    }

    /**
     * 点ノードへ接続
     *
     * @param targetNode
     * @returns {boolean}
     */
    connect2PointNode(targetNode)
    {
        this.connects.push(new PointNodeConnect(Param.CONNECT_TYPE_OUTGOING, targetNode));
        targetNode.connects.push(new PointNodeConnect(Param.CONNECT_TYPE_INCOMING, this));

        return true;
    }

    /**
     * 八角ノードへ接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {boolean}
     */
    connect2OctaNode(targetNode, targetNodeVertexNo)
    {
        if (targetNode.isConnectedVertex(targetNodeVertexNo)) {
            console.warn('Already connected');
            return false;
        }

        this.connects.push(new OctaNodeConnect(Param.CONNECT_TYPE_OUTGOING, targetNode, targetNodeVertexNo));
        targetNode.connects[targetNodeVertexNo] = new PointNodeConnect(Param.CONNECT_TYPE_INCOMING, this);

        return true;
    }

    /**
     * 接続解除
     *
     * @param idx
     */
    disconnect(idx)
    {
        if (this.connects[idx] !== null) {
            let targetNode = this.connects[idx].node;
            let targetNodeVertexNo = this.connects[idx].vertexNo;
            this.connects[idx] = null;
            targetNode.disconnectByNode(this, targetNodeVertexNo);
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
    isConnected(node, vertexNo)
    {
        let result = false;

        if (node instanceof PointNode) {
            result = this.connects.some(connect => {
                return connect !== null && connect.node === node;
            });
        } else if (node instanceof OctaNode) {
            result = this.connects.some(connect => {
                return connect !== null && connect.node === node && connect.vertexNo === vertexNo;
            });
        }

        return result;
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
     * 更新
     * 
     * @param {Rect} viewRect
     * @param {boolean} isInViewRectDefault
     */
    update(viewRect, isInViewRectDefault = true)
    {
        this._isInViewRect = isInViewRectDefault;
        if (viewRect !== null && !viewRect.containsVertex(this)) {
            this._isInViewRect = false;
        }

        if (this._animFunc !== null) {
            this._animFunc();
        }
    }

    /**
     * 描画するか
     * 
     * @param {boolean} isDrawOutsideView
     * @return {boolean}
     */
    isDraw(isDrawOutsideView)
    {
        return this._isInViewRect || isDrawOutsideView;
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

        this.setCtxParam(ctx);

        ctx.beginPath();
        ctx.arc(this.x + offsetX, this.y + offsetY, this.r, 0, Param.MATH_PI_2, false);
        ctx.fill();
    }

    /**
     * コンテキストのパラメータを設定
     * 
     * @param {CanvasRenderingContext2D} ctx
     */
    setCtxParam(ctx)
    {
        ctx.fillStyle = "rgba(0, 100, 0, 0.8)"; // 塗りつぶしの色と透明度
        ctx.shadowColor = "lime"; // 影の色
        ctx.shadowBlur = 5; // 影のぼかし効果
    }
}

/**
 * サブネットワーク用の点ノード
 */
export class SubPointNode extends PointNode
{
    /**
     * コンストラクタ
     *
     * @param parent
     * @param vertexNo
     * @param offsetX
     * @param offsetY
     * @param r
     */
    constructor(no, parent, vertexNo, offsetX, offsetY, r)
    {
        let x = parent.x;
        let y = parent.y;
        if (parent instanceof OctaNode) {
            x = parent.vertices[vertexNo].x;
            y = parent.vertices[vertexNo].y;
        }

        super(x + offsetX, y + offsetY, r);

        this.no = no;
        this.connection = new SubConnect(parent, vertexNo);
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.depth = 0;
        this._isInDrawDepth = false;

        // スクロールして画面中央に来た時にあるべき配置にするため、あらかじめずらしておく量
        this.centerOffsetY = 0;
        if (this.connection.node.y > window.innerHeight) {
            let distance = this.connection.node.y - (window.innerHeight / 2);
            this.centerOffsetY = distance - (distance / Param.SUB_NETWORK_SCROLL_RATE);
        }

        this.y -= this.centerOffsetY;

        this.originX = this.x;
        this.originY = this.y;
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
        const v = this.connection.getVertex();
        this.x = v.x + this.offsetX;
        this.y = v.y + this.offsetY - this.centerOffsetY;

        this.originX = this.x;
        this.originY = this.y;
    }

    /**
     * 更新
     * 
     * @param {Rect} viewRect
     * @param {number} minDrawDepth
     * @param {number} maxDrawDepth
     */
    update(viewRect, subViewRect, minDrawDepth, maxDrawDepth)
    {
        // 描画対象の深さではない場合は描画されない
        this._isInDrawDepth = this.depth >= minDrawDepth && this.depth <= maxDrawDepth;

        // スクロールに合わせて表示位置をずらす
        this.y = this.originY;

        this._isInViewRect = true;
        if (subViewRect !== null) {
            if (this.x < subViewRect.left || this.x > subViewRect.right ||
                this.y < subViewRect.top || this.y > subViewRect.bottom) {
                this._isInViewRect = false;
            }
        }

        this.y -= subViewRect.top;
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
     * 描画するか
     */
    isDraw()
    {
        return this._isInViewRect && this._isInDrawDepth;
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
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Param.MATH_PI_2, false);
            ctx.fill();
        }
    }

    /**
     * エッジを描画
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Rect} viewRect
     */
    drawEdge(ctx, viewRect)
    {
        // 接続先が描画されているなら自分が画面外にあったとしてもエッジを描画
        if (this._isInDrawDepth) {
            this.connects.forEach(connect => {
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
                        ctx.moveTo(this.x, this.y);

                        const targetVertex = connect.getVertex();
                        if (targetNode instanceof SubPointNode || targetNode instanceof SubOctaNode) {
                            ctx.lineTo(targetVertex.x, targetVertex.y);
                        } else {
                            ctx.lineTo(targetVertex.x - viewRect.left, targetVertex.y - viewRect.top);
                        }
                        
                        ctx.stroke();
                    }
                }
            });
        }
    }


    /**
     * 初期登録用オブジェクト化
     */
    toObj()
    {
        let connects = [];
        this.connects.forEach(connect => {
            if (connect !== null && connect.type === Param.CONNECT_TYPE_INCOMING) {
                let no = -1;
                if (connect.node instanceof SubOctaNode || connect.node instanceof SubPointNode) {
                    no = connect.node.no;
                }

                connects.push([no, connect.vertexNo]);
            }
        });

        return {
            type: 'pt',
            x: this.x,
            y: this.y,
            r: this.r,
            depth: this.depth,
            connects: connects,
            parentConnect: this.connection.toObj(),
        };
    }
    
    /**
     * 表示位置更新用オブジェクト化
     */
    toPosObj()
    {
        return {
            x: this.x,
            y: this.y,
        };
    }
}
