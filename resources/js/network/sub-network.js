import { OctaNode, SubOctaNode } from '../node/octa-node.js';
import { Param} from '../common/param.js';
import { SubPointNode } from "../node/point-node.js";
import { Network } from './network.js';

/**
 * サブネットワーク
 */
export class SubNetwork extends Network
{
    /**
     * コンストラクタ
     */
    constructor(parentNode)
    {
        super();

        this.parentNode = parentNode;
        this.drawParent = true;

        this.minDrawDepth = 0;
        this.maxDrawDepth = 0;
        this.drawRateInDepth = 0;
        this.maxDepth = 0;
        this.nodes = [];    // こっちは配列で管理
    }

    /**
     * 削除
     */
    delete()
    {
        this.nodes.forEach((node, i) => {
            node.delete();
            this.nodes[i] = null;
        });
        this.nodes = null;
        this.parentNode = null;
    }

    /**
     * 八角ノードの追加
     *
     * @param baseNode
     * @param vertexNo
     * @param offsetX
     * @param myNo
     * @param offsetY
     * @param w
     * @param h
     * @param n
     * @param newNodeVertexNo
     * @returns {SubOctaNode}
     */
    addOctaNode(baseNode, vertexNo, myNo, offsetX, offsetY, w, h = null, n = null, newNodeVertexNo = null)
    {
        if (Number.isInteger(baseNode)) {
            baseNode = this.nodes[baseNode];
        }

        if (h === null) {
            h = w;
        }
        if (n === null) {
            n = OctaNode.standardNotchSize(w);
        }

        let depth = this.getDepth(baseNode);
        let newNode = new SubOctaNode(baseNode, vertexNo, offsetX, offsetY, w, h, n, newNodeVertexNo);
        newNode.depth = depth;
        this.nodes[myNo] = newNode;
        this.addNodeConnection(baseNode, newNode, vertexNo, newNodeVertexNo);

        return newNode;
    }

    /**
     * 点ノードの追加
     *
     * @param baseNode
     * @param vertexNo
     * @param myNo
     * @param offsetX
     * @param offsetY
     * @param r
     * @param newNodeClass
     * @returns {SubPointNode}
     */
    addPointNode(baseNode, vertexNo, myNo, offsetX, offsetY, r = 5, newNodeClass = null)
    {
        if (Number.isInteger(baseNode)) {
            baseNode = this.nodes[baseNode];
        }

        let depth = this.getDepth(baseNode);
        let newNode = new SubPointNode(baseNode, vertexNo, offsetX, offsetY, r, newNodeClass);
        newNode.depth = depth;
        this.nodes[myNo] = newNode;
        this.addNodeConnection(baseNode, newNode, vertexNo);

        return newNode;
    }

    /**
     * ノード間コネクションの追加
     *
     * @param node1
     * @param node2
     * @param node1VertexNo
     * @param node2VertexNo
     */
    addNodeConnection(node1, node2, node1VertexNo = null, node2VertexNo = null)
    {
        if (Number.isInteger(node1)) {
            node1 = this.nodes[node1];
        }

        if (Number.isInteger(node2)) {
            node2 = this.nodes[node2];
        }

        if (node1 instanceof OctaNode && node1VertexNo === null) {
            node1VertexNo = node1.getNearVertexNo(node2);
        }
        if (node2 instanceof OctaNode && node2VertexNo === null) {
            node2VertexNo = node2.getNearVertexNo(node1);
        }

        if (node1 instanceof OctaNode) {
            node1.connect(node1VertexNo, node2, node2VertexNo);
        } else {
            node1.connect(node2, node2VertexNo);
        }
    }

    /**
     * 親ノードから指定ノードの深さを取得
     *
     * @param baseNode
     * @returns {number}
     */
    getDepth(baseNode)
    {
        let depth;
        if (this.parentNode === baseNode) {
            depth = 1;
        } else {
            depth = baseNode.depth + 1;
        }
        if (this.maxDepth < depth) {
            this.maxDepth = depth;
        }

        return depth;
    }

    /**
     * 描画する深さを設定
     *
     * @param min
     * @param max
     */
    setDrawDepth(min, max)
    {
        // 上限や下限を超えたかのチェックはしない
        this.minDrawDepth = min;
        this.maxDrawDepth = max;
    }

    /**
     * 秒化するかどうかを深さから判定
     *
     * @returns {boolean}
     */
    isNotDraw()
    {
        return this.minDrawDepth === 0 && this.maxDrawDepth === 0;
    }

    /**
     * リロード
     */
    reload()
    {
        // サブノードだけリロードされる
        Object.values(this.nodes).forEach(node => {
            if (node instanceof SubOctaNode || node instanceof SubPointNode) {
                node.reload();
            }
        });
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
        if (this.isNotDraw()) {
            return;
        }

        this.drawEdge(ctx, this.parentNode, 0, 0, offsetX, offsetY);

        this.nodes.forEach((node, i) => {
            if (this.minDrawDepth <= node.depth && node.depth <= this.maxDrawDepth) {
                let offsetY1 = offsetY - node.drawOffsetY;
                this.drawEdge(ctx, node, offsetX, offsetY1, offsetX, offsetY);

                node.draw(ctx, offsetX, offsetY1);
            }
        });
    }

    /**
     * エッジの描画
     *
     * @param ctx
     * @param node
     * @param offsetX1
     * @param offsetY1
     * @param offsetX2
     * @param offsetY2
     */
    drawEdge(ctx, node, offsetX1, offsetY1, offsetX2, offsetY2)
    {
        const maxY = window.hgn.getScrollY() + window.innerHeight;
        node.connects.forEach((connect, vertexNo) => {
            if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING) {
                if (this.minDrawDepth <= connect.node.depth && connect.node.depth <= this.maxDrawDepth) {
                    let targetVertex = connect.getVertex();

                    let x = node.x;
                    let y = node.y;
                    if (node instanceof OctaNode) {
                        x = node.vertices[vertexNo].x;
                        y = node.vertices[vertexNo].y;
                    }

                    let drawOffsetY2 = connect.node.drawOffsetY;
                    const drawY1 = y + offsetY1;
                    const drawY2 = targetVertex.y + offsetY2 - drawOffsetY2;

                    if (drawY1 < window.hgn.getScrollY() && drawY2 < window.hgn.getScrollY()) {
                        return;
                    }
                    if (drawY1 > maxY && drawY2 > maxY) {
                        return;
                    }

                    ctx.beginPath();
                    ctx.moveTo(x + offsetX1, drawY1);
                    ctx.lineTo(targetVertex.x + offsetX2, drawY2);
                    ctx.stroke();
                }
            }
        });
    }

    toObj()
    {
        let nodes = {};
        this.nodes.forEach((node, i) => {
            nodes[i] = node.toObj();
        });

        return {
            id: this.parentNode.id,
            parent: this.parentNode.toObj(),
            minDrawDepth: this.minDrawDepth,
            maxDrawDepth: 9,//this.maxDrawDepth,
            nodes: nodes
        };
    }
}
