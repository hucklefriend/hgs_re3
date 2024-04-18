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

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        this.node = null;
    }

    /**
     * 接続先の頂点を取得
     *
     * @returns {Vertex}
     */
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

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        this.node = null;
    }

    /**
     * 接続先の頂点を取得
     *
     * @returns {Vertex}
     */
    getVertex()
    {
        return new Vertex(this.node.x, this.node.y);
    }
}

/**
 * 背景2用のコネクション
 */
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

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        this.node = null;
    }

    /**
     * 接続先の頂点を取得
     *
     * @returns {Vertex}
     */
    getVertex()
    {
        if (this.node instanceof OctaNode) {
            return this.node.vertices[this.vertexNo];
        } else if (this.node instanceof PointNode) {
            return new Vertex(this.node.x, this.node.y);
        }
    }
}
