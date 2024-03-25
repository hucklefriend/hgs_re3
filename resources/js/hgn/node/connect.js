import {Vertex} from '../vertex.js';

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
