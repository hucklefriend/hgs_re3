import {Param} from '../param.js';
import {OctaNode} from './octa-node.js';
import {OctaNodeConnect, PointNodeConnect} from './connect.js';

export class PointNode
{
    constructor(x = 0, y = 0, r = 0)
    {
        this.x = x;
        this.y = y;
        this.r = r;
        this.connects = [];
    }

    reload(x, y)
    {
        this.x = x;
        this.y = y;
    }

    move(offsetX, offsetY)
    {
        this.x += offsetX;
        this.y += offsetY;
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
        } else if (targetNode instanceof OctaNode && targetNodeVertexNo !== null) {
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

    draw(ctx)
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Param.MATH_PI_2, false);
        ctx.fill();
    }
}
