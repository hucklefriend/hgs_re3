import {Bg2OctaNode, OctaNode} from './node/octa-node.js';
import {Param} from './param.js';
import {PointNode, Bg2PointNode, Bg3PointNode} from "./node/point-node.js";
import {HorrorGameNetwork} from "@/hgn.js";

const NodeClasses = {
    'OctaNode': OctaNode,
    'Bg2OctaNode': Bg2OctaNode,
    'PointNode': PointNode,
    'Bg2PointNode': Bg2PointNode,
    'Bg3PointNode': Bg3PointNode,
};

/**
 * ネットワーク
 */
export class Network
{
    /**
     * コンストラクタ
     */
    constructor(parentNode, drawParent = false)
    {
        this.parentNode = parentNode;
        this.drawParent = drawParent;
        this.nodes = [];
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        this.parentNode = null;
        this.nodes.forEach(node => {
            node.delete();
        });
        this.nodes = null;
    }

    /**
     * 八角ノードの追加
     *
     * @param baseNode
     * @param vertexNo
     * @param offsetX
     * @param offsetY
     * @param w
     * @param h
     * @param n
     * @param newNodeVertexNo
     * @param newNodeClass
     * @returns {*}
     */
    addOctaNode(baseNode, vertexNo, offsetX, offsetY, w, h = null, n = null, newNodeVertexNo = null, newNodeClass = null)
    {
        if (Number.isInteger(baseNode)) {
            baseNode = this.nodes[baseNode];
        }

        if (newNodeClass === null) {
            newNodeClass = 'OctaNode';
        }

        if (h === null) {
            h = w;
        }
        if (n === null) {
            n = OctaNode.standardNotchSize(w);
        }

        let newNode = new NodeClasses[newNodeClass](baseNode.x + offsetX, baseNode.y + offsetY, w, h, n);
        this.nodes.push(newNode);
        this.addNodeConnection(baseNode, newNode, vertexNo, newNodeVertexNo);

        return newNode;
    }

    /**
     * 点ノードの追加
     *
     * @param baseNode
     * @param vertexNo
     * @param offsetX
     * @param offsetY
     * @param r
     * @param newNodeClass
     * @returns {*}
     */
    addPointNode(baseNode, vertexNo, offsetX, offsetY, r = 5, newNodeClass = null)
    {
        if (Number.isInteger(baseNode)) {
            baseNode = this.nodes[baseNode];
        }

        if (newNodeClass === null) {
            newNodeClass = 'PointNode';
        }

        let newNode = new NodeClasses[newNodeClass](baseNode.x + offsetX, baseNode.y + offsetY, r);
        this.nodes.push(newNode);
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
     * リロード
     */
    reload()
    {
        this.nodes.forEach(node => {
            node.reload();
        });
    }

    /**
     * 描画
     *
     * @param ctx
     * @param offsetX
     * @param offsetY
     * @param drawIdxText
     */
    draw(ctx, offsetX, offsetY, drawIdxText = false)
    {
        if (this.drawParent) {
            this.parentNode.draw(ctx, offsetX, offsetY);
        }

        if (this.parentNode !== null) {
            this.drawEdge(ctx, this.parentNode, 0, 0, offsetX, offsetY);
        }

        this.nodes.forEach((node, i) => {
            let offsetY1 = offsetY;
            if (node instanceof Bg2OctaNode || node instanceof Bg2PointNode) {
                offsetY1 -= node.drawOffsetY;
            }

            this.drawEdge(ctx, node, offsetX, offsetY1, offsetX, offsetY);

            node.draw(ctx, offsetX, offsetY1);

            if (drawIdxText) {
                ctx.fillText(i.toString(), node.x, node.y);
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
        const hgn = HorrorGameNetwork.getInstance();

        const maxY = hgn.getScrollY() + window.innerHeight;
        node.connects.forEach((connect, vertexNo) => {
            if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING) {
                let targetVertex = connect.getVertex();

                let x = node.x;
                let y = node.y;
                if (node instanceof OctaNode) {
                    x = node.vertices[vertexNo].x;
                    y = node.vertices[vertexNo].y;
                }

                let drawOffsetY2 = 0;
                if (connect.node instanceof Bg2OctaNode || connect.node instanceof Bg2PointNode) {
                    drawOffsetY2 = connect.node.drawOffsetY;
                }

                const drawY1 = y + offsetY1;
                const drawY2 = targetVertex.y + offsetY2 - drawOffsetY2;

                if (drawY1 < hgn.getScrollY() && drawY2 < hgn.getScrollY()) {
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
        });
    }
}


/**
 * 背景2用ネットワーク
 */
export class Bg2Network extends Network
{
    /**
     * コンストラクタ
     */
    constructor(parentNode)
    {
        super(parentNode);

        this.drawDepth = 0;
        this.drawRateInDepth = 0;
        this.maxDepth = 0;
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
     * @returns {Bg2OctaNode}
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
        let newNode = new Bg2OctaNode(baseNode, vertexNo, offsetX, offsetY, w, h, n, newNodeVertexNo);
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
     * @returns {Bg2PointNode}
     */
    addPointNode(baseNode, vertexNo, myNo, offsetX, offsetY, r = 5, newNodeClass = null)
    {
        if (Number.isInteger(baseNode)) {
            baseNode = this.nodes[baseNode];
        }

        let depth = this.getDepth(baseNode);
        let newNode = new Bg2PointNode(baseNode, vertexNo, offsetX, offsetY, r, newNodeClass);
        newNode.depth = depth;
        this.nodes[myNo] = newNode;
        this.addNodeConnection(baseNode, newNode, vertexNo);

        return newNode;
    }

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
     * 描画
     *
     * @param ctx
     * @param offsetX
     * @param offsetY
     * @param drawIdxText
     */
    draw(ctx, offsetX, offsetY, drawIdxText = false)
    {
        this.drawEdge(ctx, this.parentNode, 0, 0, offsetX, offsetY);

        this.nodes.forEach((node, i) => {
            if (node.depth <= this.drawDepth) {
                let offsetY1 = offsetY;
                if (node instanceof Bg2OctaNode || node instanceof Bg2PointNode) {
                    offsetY1 -= node.drawOffsetY;
                }

                this.drawEdge(ctx, node, offsetX, offsetY1, offsetX, offsetY);

                node.draw(ctx, offsetX, offsetY1);

                if (drawIdxText) {
                    ctx.fillText(i.toString(), node.x, node.y);
                }
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
        const hgn = HorrorGameNetwork.getInstance();

        const maxY = hgn.getScrollY() + window.innerHeight;
        node.connects.forEach((connect, vertexNo) => {
            if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING) {
                if (connect.node.depth <= this.drawDepth) {
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

                    if (drawY1 < hgn.getScrollY() && drawY2 < hgn.getScrollY()) {
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
}
