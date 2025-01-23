import {Param} from './param.js';
import {DOMNode, OctaNode} from './node/octa-node.js';
import {LinkNode} from './node/link-node.js';
import {PointNode} from "./node/point-node.js";
import {Vertex} from './vertex.js';
import {Network} from './network.js';
import {Rect} from "./rect.js";

/**
 * メインネットワークに表示する1つのフランチャイズネットワーク
 */
export class MainFranchiseNetwork extends Network
{
    static create(containerDOM, x, y, data, screenOffset)
    {
        let screenOffset2 = new Vertex(data.width /2, data.height / 2);

        // ネットワーク用divの生成
        let div = document.createElement('div');
        div.classList.add('franchise');
        div.style.width = data.width + 'px';
        div.style.height = data.height + 'px';
        div.style.left = screenOffset.x + x - (data.width / 2) + 'px';
        div.style.top = screenOffset.y + y - (data.height / 2) + 'px';
        containerDOM.appendChild(div);

        // 親ノードの生成
        let parent = MainFranchiseNetwork.createNode(div, x, y, data.parent, screenOffset2);

        // ネットワークのインスタンス
        let network = new MainFranchiseNetwork(div, x, y, data.width, data.height, parent, screenOffset2);

        if (data.nodes !== undefined) {
            Object.keys(data.nodes).forEach(id => {
                let node = MainFranchiseNetwork.createNode(div, x, y, data.nodes[id], screenOffset2);
                network.addNode(node);
            });
        }

        // ポイントノードの読み取り
        if (data.hasOwnProperty('points')) {
            data.points.forEach(point => {
                let node = new PointNode(point.x, point.y, 6, point.id);
                node.setForceDraw();
                network.addNode(node);
            });
        }

        // エッジの読み込み
        if (data.hasOwnProperty('connects')) {
            data.connects.forEach(connect => {
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

    static createNode(containerDOM, x, y, nodeData, screenOffset)
    {
        let node = null;

        // if (nodeData.type === 'dom') {
        //     node = DOMNode.create(containerDOM, screenOrigin, nodeData.id, nodeData.html, nodeData.x, nodeData.y);
        // } else if (nodeData.type === 'link') {
        //     node = LinkNode.create(containerDOM, screenOrigin, data.id, nodeData.html, nodeData.x, nodeData.y);
        // } else if (nodeData.type === 'pt') {
        //     node = PointNode.create(containerDOM, data.width, data.height, data.id, nodeData.html, nodeData.x, nodeData.y);
        // }

        node = DOMNode.create(containerDOM, nodeData.id, nodeData.html, nodeData.x, nodeData.y, screenOffset);

        if (node !== null) {
            node.setForceDraw();
        }

        return node;
    }

    /**
     * コンストラクタ
     */
    constructor(DOM, x, y, w, h, parentNode)
    {
        super(parentNode);

        this.DOM = DOM;
        this.viewRect = new Rect();
        this.screenOffset.x = w / 2;
        this.screenOffset.y = h / 2;

        this.setPos(x, y, w / 2, h / 2);
    }

    setPos(x, y, hw, hh)
    {
        this.pos.x = x;
        this.pos.y = y;

        this.viewRect.setRect(
            this.pos.x - hw,
            this.pos.x + hw,
            this.pos.y - hh,
            this.pos.y + hh
        );
    }

    /**
     * 描画
     *
     * @param ctx
     * @param {Vertex}screenOffset
     */
    draw(ctx, viewRect, screenOffset)
    {
        ctx.restore();

        ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 1; // 線の太さ
        ctx.shadowColor = "lime"; // 影の色
        ctx.shadowBlur = 5; // 影のぼかし効果

        let offsetX = screenOffset.x + this.pos.x;
        let offsetY = screenOffset.y + this.pos.y;

        this.parentNode.connects.forEach((connect, vertexNo) => {
            if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING){
                let targetVertex = connect.getVertex();

                ctx.beginPath();

                ctx.moveTo(this.parentNode.vertices[vertexNo].x + offsetX, this.parentNode.vertices[vertexNo].y + offsetY);
                ctx.lineTo(targetVertex.x + offsetX, targetVertex.y + offsetY);
                ctx.stroke();
            }
        });

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
        });

        if (this.parentNode !== null) {
            this.parentNode.draw(ctx, offsetX, offsetY);
        }
    }
}
