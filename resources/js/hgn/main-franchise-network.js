import {Param} from './param.js';
import {DOMNode, OctaNode} from './node/octa-node.js';
import {LinkNode} from './node/link-node.js';
import {PointNode} from "./node/point-node.js";
import {Vertex} from './vertex.js';
import {Network} from './network.js';
import {Rect} from "./rect.js";

/**
 * メインネットワークに表示する1つのフランチャイズネットワーク
 * スクリーン座標
 */
export class MainFranchiseNetwork extends Network
{
    static create(containerDOM, networkData)
    {
        // ネットワーク用divの生成
        let div = document.createElement('div');
        div.classList.add('franchise');
        // div.style.width = networkData.width + 'px';
        // div.style.height = networkData.height + 'px';
        // div.style.left = networkData.x + 'px';
        // div.style.top = networkData.y + 'px';
        containerDOM.appendChild(div);

        // ネットワークのインスタンス
        let network = new MainFranchiseNetwork(div, networkData.x, networkData.y,
            networkData.width, networkData.height);

        // ノードの読み込み
        if (networkData.nodes !== undefined) {
            networkData.nodes.forEach(nodeData => {
                let node = null;
                if (nodeData.type === 'pt') {
                    node = new PointNode(nodeData.x, nodeData.y, 6, nodeData.id);
                } else {
                    node = MainFranchiseNetwork.createNode(div, nodeData);
                }

                network.addNode(node);
            });
        }

        // エッジの読み込み
        if (networkData.hasOwnProperty('con')) {
            networkData.con.forEach(connect => {
                let fromNode = network.getNodeById(connect.from);
                let toNode = network.getNodeById(connect.to);

                if (fromNode !== null && toNode !== null) {
                    if (fromNode instanceof DOMNode) {
                        fromNode.connect(connect.from_vn ?? null, toNode, connect.to_vn ?? null);
                    } else if (fromNode instanceof PointNode) {
                        fromNode.connect(toNode, connect.to_vn ?? null);
                    }
                }
            });
        }

        network.reload();

        return network;
    }

    static createNode(containerDOM, nodeData)
    {
        let DOM = document.createElement('div');
        DOM.id = nodeData.id;

        // idがs_で始まる場合smallにする
        if (nodeData.id.startsWith('s_')) {
            DOM.classList.add('small');
        }

        DOM.classList.add('dom-node');
        //DOM.classList.add('fade');

        // if (nodeData.hasOwnProperty('href')) {
        //     let a = document.createElement('a');
        //     a.href = nodeData.href;
        //     a.innerHTML = nodeData.html;
        //     a.appendChild(DOM);
        // } else {
        //     DOM.innerHTML = nodeData.html;
        // }

        DOM.innerHTML = nodeData.html;

        DOM.style.left = `${nodeData.x}px`;
        DOM.style.top = `${nodeData.y}px`;

        containerDOM.appendChild(DOM);

        let node = null;
        // switch (nodeData.type) {
        //     case 'dom-node':
        //         node = DOMNode.createFromDOM(containerDOM, DOM);
        //         break;
        //     case 'link-node':
        //     case 'link-node-a':
        //     case 'link-node-z':
        //         node = LinkNode.createFromDOM(containerDOM, DOM);
        //         break;
        // }
        node = DOMNode.createFromDOM(containerDOM, DOM);
        node.setForceDraw();

        return node;
    }

    /**
     * コンストラクタ
     */
    constructor(DOM, x, y, w, h)
    {
        super();

        this.DOM = DOM;
        this.viewRect = new Rect();
        this.w = w;
        this.h = h;

        this.setPos(x, y);
    }

    /**
     * 配置
     *
     * @param x
     * @param y
     */
    setPos(x, y)
    {
        this.x = x;
        this.y = y;

        this.viewRect.setRect(
            this.x,
            this.x + this.w,
            this.y,
            this.y + this.h
        );
    }

    /**
     * 描画
     *
     * @param ctx
     * @param {Rect|null}viewRect
     */
    draw(ctx, viewRect, viewRectNo)
    {
        ctx.restore();

        ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 1; // 線の太さ
        ctx.shadowColor = "lime"; // 影の色
        ctx.shadowBlur = 5; // 影のぼかし効果

        let offsetX = -viewRect.left;
        let offsetY = -viewRect.top;

        Object.values(this.nodes).forEach(node => {
            node.connects.forEach((connect, vertexNo) => {
                if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING){
                    let targetVertex = connect.getVertex();

                    ctx.beginPath();

                    if (node instanceof OctaNode) {
                        ctx.moveTo(node.vertices[vertexNo].x + offsetX, node.vertices[vertexNo].y + offsetY);
                    } else if (node instanceof PointNode) {
                        ctx.moveTo(node.x + offsetX, node.y + offsetY);
                    }
                    ctx.lineTo(targetVertex.x + offsetX, targetVertex.y + offsetY);
                    ctx.stroke();
                }
            });
        });

        ctx.restore();

        Object.values(this.nodes).forEach(node => {
            node.draw(ctx, offsetX, offsetY);
            if (node instanceof DOMNode) {
                node.DOM.classList.remove('view1', 'view2', 'view3', 'view4');
                node.DOM.classList.add('view' + viewRectNo);
            }
        });

        //this.DOM.style.transform = 'translate(' + (-viewRect.left) + 'px, ' + (-viewRect.top) + 'px)';
    }

    show()
    {
        this.DOM.style.display = 'block';
    }

    hide()
    {
        this.DOM.style.display = 'none';
    }
}
