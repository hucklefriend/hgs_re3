import { Vertex } from '../common/vertex.js';
import { OctaNode, SubOctaNode } from './octa-node.js';
import { PointNode, SubPointNode } from './point-node.js';

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
 * サブネットワーク用のコネクション
 */
export class SubConnect
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

    getTargetY()
    {
        if (this.node instanceof OctaNode) {
            return this.node.vertices[this.vertexNo].y;
        } else if (this.node instanceof PointNode) {
            return this.node.y;
        }
    }

    /**
     * オブジェクトに変換
     * 
     * @returns 
     */
    toObj()
    {
        let no = -1;
        if (this.node instanceof SubOctaNode || this.node instanceof SubPointNode) {
            no = this.node.no;
        } else {
            no = -1;
        }

        return {
            no: no,
            vertexNo: this.vertexNo,
            myVertexNo: this.myVertexNo
        };
    }
}
