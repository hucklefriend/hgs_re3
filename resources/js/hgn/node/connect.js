import {Vertex} from '../vertex.js';
import {OctaNode} from './octa-node.js';
import {PointNode} from './point-node.js';

export class OctaNodeConnect
{
    /**
     * コンストラクタ
     *
     * @param type
     * @param node
     * @param vertexNo
     */
    constructor(type, node, vertexNo)
    {
        this.type = type;
        this.node = node;
        this.vertexNo = vertexNo;
    }

    getVertex()
    {
        return this.node.vertices[this.vertexNo];
    }
}

export class PointNodeConnect
{
    /**
     * コンストラクタ
     *
     * @param type
     * @param node
     */
    constructor(type, node)
    {
        this.type = type;
        this.node = node;
    }

    getVertex()
    {
        return new Vertex(this.node.x, this.node.y);
    }
}

export class Bg2Connect
{
    /**
     * コンストラクタ
     *
     * @param node
     * @param vertexNo
     * @param myVertexNo
     */
    constructor(node, vertexNo = null, myVertexNo = null)
    {
        this.node = node;
        this.vertexNo = vertexNo;
        this.myVertexNo = myVertexNo;
    }

    getVertex()
    {
        if (this.node instanceof OctaNode) {
            return this.node.vertices[this.vertexNo];
        } else if (this.node instanceof PointNode) {
            return new Vertex(this.node.x, this.node.y);
        }
    }
}
