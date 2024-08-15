import {Vertex} from '../vertex.js';
import {OctaNode} from './octa-node.js';
import {PointNode} from './point-node.js';

export class NodeMap
{
    /**
     * コンストラクタ
     *
     * @param DOM
     */
    constructor(DOM)
    {
        this.DOM = DOM;
        this.nodes = [];
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        this.node = null;
    }
}
