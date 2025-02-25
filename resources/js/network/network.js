import { OctaNode, SubOctaNode } from '../node/octa-node.js';
import { Param} from '../common/param.js';
import { PointNode, SubPointNode } from "../node/point-node.js";
import { Vertex } from '../common/vertex.js';
import { HorrorGameNetwork } from '../horror-game-network.js';
/**
 * @type {HorrorGameNetwork}
 */
window.hgn;

/**
 * ネットワーク
 */
export class Network
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        this.nodes = {};

        this.x = 0;
        this.y = 0;
        this.screenOffset = new Vertex(0, 0);
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        Object.values(this.nodes).forEach(node => {
            node.delete();
        });
        this.nodes = null;
    }

    /**
     * 配置座標の設定
     *
     * @param x
     * @param y
     */
    setPos(x, y)
    {
        this.x = x;
        this.y = y;
    }

    /**
     * リロード
     */
    reload()
    {
        Object.values(this.nodes).forEach(node => {
            if (!(node instanceof PointNode)) {
                node.reload();
            }
        });
    }

    /**
     * ノードの追加
     *
     * @param node
     */
    addNode(node)
    {
        this.nodes[node.id] = node;
    }

    /**
     * ノードの取得
     *
     * @param id
     * @returns {*|null}
     */
    getNodeById(id)
    {
        return this.nodes[id] ?? null;
    }

    update()
    {
        Object.values(this.nodes).forEach(node => {
            node.update();
        });
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
        this.nodes.forEach((node, i) => {
            let offsetY1 = offsetY;
            if (node instanceof OctaNode || node instanceof PointNode) {
                offsetY1 -= node.drawOffsetY;
            }

            this.drawEdge(ctx, node, offsetX, offsetY1, offsetX, offsetY);

            node.draw(ctx, offsetX, offsetY1);
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
                let targetVertex = connect.getVertex();

                let x = node.x;
                let y = node.y;
                if (node instanceof OctaNode) {
                    x = node.vertices[vertexNo].x;
                    y = node.vertices[vertexNo].y;
                }

                let drawOffsetY2 = 0;
                if (connect.node instanceof SubOctaNode || connect.node instanceof SubPointNode) {
                    drawOffsetY2 = connect.node.drawOffsetY;
                }

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
        });
    }
}

