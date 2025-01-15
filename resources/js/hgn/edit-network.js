import {Network} from './network.js';
import {Param} from './param.js';
import {OctaNode, DOMNode} from "./node/octa-node.js";
import {PointNode} from "./node/point-node.js";


/**
 * ネットワーク
 */
export class EditNetwork extends Network
{
    static create(data)
    {
        let containerDOM = document.createElement('div');
        containerDOM.classList.add('edit-network');
        containerDOM.style.width = data.width + 'px';
        containerDOM.style.height = data.height + 'px';
        window.mainNetworkEditor.editorDOM.appendChild(containerDOM);

        let canvasDOM = document.createElement('canvas');
        containerDOM.appendChild(canvasDOM);

        // 親ノードの生成
        let parent = DOMNode.create(containerDOM, data.width, data.height, data.id, data.parent.name, 0, 0);
        parent.setForceDraw();

        // ネットワークのインスタンス
        let network = new EditNetwork(containerDOM, canvasDOM, parent);

        if (data.nodes !== undefined) {
            Object.keys(data.nodes).forEach(id => {
                let nodeData = data.nodes[id];
                let node = DOMNode.create(containerDOM, data.width, data.height, id, nodeData.name, nodeData.x, nodeData.y)
                node.setForceDraw();
                network.addNode(node);
            });
        }

        // ポイントノードの読み取り
        if (data.hasOwnProperty('points')) {
            data.points.forEach(point => {
                let x = point.x + data.width / 2;
                let y = point.y + data.height / 2;
                let node = new PointNode(x, y, 10, point.id);
                node.setForceDraw();
                network.addNode(node);
            });
        }

        // エッジの読み込み
        if (data.connects !== undefined) {
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
        network.draw();

        return network;
    }

    constructor(containerDOM, canvas, parentNode)
    {
        super(parentNode);

        this.containerDOM = containerDOM;
        this.canvas = canvas;

        this.ctx = null;
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
            this.ctx.save();
        }
    }

    setPos(x, y)
    {
        this.containerDOM.style.left = (x - this.containerDOM.clientWidth / 2) + 'px';
        this.containerDOM.style.top = (y - this.containerDOM.clientHeight / 2) + 'px';
    }

    reload()
    {
        super.reload();
        this.canvas.width = this.containerDOM.clientWidth;
        this.canvas.height = this.containerDOM.clientHeight;
    }

    draw()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        this.ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
        this.ctx.lineWidth = 1; // 線の太さ
        this.ctx.shadowColor = "lime"; // 影の色
        this.ctx.shadowBlur = 5; // 影のぼかし効果

        this.parentNode.connects.forEach((connect, vertexNo) => {
            if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING){
                let targetVertex = connect.getVertex();

                this.ctx.beginPath();

                this.ctx.moveTo(node.vertices[vertexNo].x, node.vertices[vertexNo].y);
                this.ctx.lineTo(targetVertex.x, targetVertex.y);
                this.ctx.stroke();
            }
        });

        this.parentNode.draw(this.ctx, 0, 0);

        Object.values(this.nodes).forEach(node => {
            node.connects.forEach((connect, vertexNo) => {
                if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING){
                    let targetVertex = connect.getVertex();

                    this.ctx.beginPath();

                    if (node instanceof OctaNode) {
                        this.ctx.moveTo(node.vertices[vertexNo].x, node.vertices[vertexNo].y);
                    } else if (node instanceof PointNode) {
                        this.ctx.moveTo(node.x, node.y);
                    }
                    this.ctx.lineTo(targetVertex.x, targetVertex.y);
                    this.ctx.stroke();
                }
            });

            node.draw(this.ctx, 0, 0);
        });

        this.ctx.restore();

        //this.ctx.fillStyle = "rgba(0, 200, 0, 0.8)"; // 線の色と透明度
    }
}
