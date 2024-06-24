import {Param} from '../param.js';
import {Vertex} from '../vertex.js';
import {OctaNode} from './octa-node.js';
import {OctaNodeConnect, PointNodeConnect, Bg2Connect} from './connect.js';
import {HorrorGameNetwork} from "../../hgn.js";

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
     */
    constructor(x = 0, y = 0, r = 0)
    {
        super(x, y);
        this.r = r;
        this.connects = [];
        this.forceDraw = false;
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
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
            return false;
        }

        this.connects.push(new OctaNodeConnect(Param.CONNECT_TYPE_OUTGOING, targetNode, targetNodeVertexNo));
        targetNode.connects[targetNodeVertexNo] = new PointNodeConnect(Param.CONNECT_TYPE_INCOMING, this);

        return true;
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
        if (!this.forceDraw) {
            const hgn = HorrorGameNetwork.getInstance();

            const drawY = this.y + offsetY;
            if (drawY < hgn.getScrollY() - 100) {
                return;
            }
            if (drawY > hgn.getScrollY() + window.innerHeight + 100) {
                return;
            }
        }

        ctx.beginPath();
        ctx.arc(this.x + offsetX, this.y + offsetY, this.r, 0, Param.MATH_PI_2, false);
        ctx.fill();
    }
}

/**
 * 背景2用の点ノード
 */
export class Bg2PointNode extends PointNode
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
    constructor(parent, vertexNo, offsetX, offsetY, r)
    {

        let x = parent.x;
        let y = parent.y;
        if (parent instanceof OctaNode) {
            x = parent.vertices[vertexNo].x;
            y = parent.vertices[vertexNo].y;
        }

        super(x + offsetX, y + offsetY, r);
        this.connection = new Bg2Connect(parent, vertexNo);
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.drawOffsetY = 0;

        if (this.connection.node.y > window.innerHeight) {
            let distance = this.connection.node.y - (window.innerHeight / 2);
            this.drawOffsetY = distance - (distance / Param.BG2_SCROLL_RATE);
        }
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
        this.y = v.y + this.offsetY;
    }
}


/**
 * 背景3用の点ノード
 */
export class Bg3PointNode extends PointNode
{
    /**
     * 描画
     *
     * @param ctx
     * @param offsetX
     * @param offsetY
     */
    draw(ctx, offsetX, offsetY)
    {
        // 見えないので背景3は点ノードを描画しない
    }
}
