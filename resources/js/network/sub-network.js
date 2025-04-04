import { OctaNode, SubOctaNode } from '../node/octa-node.js';
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
        let newNode = new SubOctaNode(myNo, baseNode, vertexNo, offsetX, offsetY, w, h, n, newNodeVertexNo);
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
        let newNode = new SubPointNode(myNo, baseNode, vertexNo, offsetX, offsetY, r, newNodeClass);
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

        this.postSetDrawDepth();
    }

    /**
     * 描画する最小深さを設定
     *
     * @param min
     */
    setMinDrawDepth(min)
    {
        this.minDrawDepth = min;
        this.postSetDrawDepth();
    }

    /**
     * 描画する最大深さを設定
     *
     * @param max
     */
    setMaxDrawDepth(max)
    {
        this.maxDrawDepth = max;
        this.postSetDrawDepth();
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
     * サブネットワークワーカーへネットワーク登録をポスト
     */
    postAdd()
    {
        let nodes = {};
        this.nodes.forEach((node, no) => {
            nodes[no] = node.toObj();
        });

        // サブネットワークワーカーへデータを転送
        window.hgn.subNetworkViewer.postMessage({
            type: 'add-network',
            subNetwork: {
                id: this.parentNode.id,
                parent: this.parentNode.toObj(),
                minDrawDepth: this.minDrawDepth,
                maxDrawDepth: this.maxDrawDepth,
                nodes: nodes
            }
        });
    }
    
    /**
     * サブネットワークワーカーへノードの配置情報更新をポスト
     */
    postSetNodePos()
    {
        let nodes = {};
        this.nodes.forEach((node, no) => {
            nodes[no] = node.toPosObj();
        });

        // サブネットワークワーカーへ更新データを転送
        window.hgn.subNetworkViewer.postMessage({
            type: 'set-node-pos',
            subNetwork: {
                id: this.parentNode.id,
                parent: this.parentNode.toPosObj(),
                nodes: nodes
            }
        });
    }

    /**
     * サブネットワークワーカーへ描画深さの更新をポスト
     */
    postSetDrawDepth()
    {
        window.hgn.subNetworkViewer.postMessage({
            type: 'set-draw-depth', 
            id: this.parentNode.id,
            min: this.minDrawDepth,
            max: this.maxDrawDepth
        });
    }
}
