import {OctaNode, LinkNode} from '../hgn/node.js';
import {Param} from '../hgn/param.js';
import {Vertex} from '../hgn/vertex.js';

export class Background2
{
    /**
     * コンストラクタ
     *
     * @param network
     */
    constructor(network)
    {
        this.scrollRate = 1.5;

        this.canvas = document.querySelector('#bg2');
        this.canvas.width = document.documentElement.scrollWidth;
        this.canvas.height = document.documentElement.scrollHeight;

        this.ctx = null;
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');

            this.ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
            this.ctx.lineWidth = 1; // 線の太さ
            this.ctx.shadowColor = "lime"; // 影の色
            this.ctx.shadowBlur = 5; // 影のぼかし効果
        }

        this.nodes = [];

        this.init(network);

    }

    init(network)
    {
        network.linkNodes.forEach(linkNode => {
            for (let i = 0; i < 8; i++) {
                if (this.judge()) {
                    this.addNode(i, linkNode);
                }
            }
        });
    }

    judge(rate = 50) {
        return Math.random() * 100 <= rate;
    }

    addNode(i, linkNode)
    {
        let x = linkNode.vertices[i].x;
        let y = linkNode.vertices[i].y;
        let vn = 0;

        switch (i) {
            case 0:
                x -= 80;
                y -= 80;
                vn = 4
                break;
            case 1:
                x += 80;
                y -= 80;
                vn = 6;
                break;
            case 2:
                x += 80;
                y -= 40;
                vn = 7;
                break;
            case 3:
                x += 100;
                y += 30;
                vn = 0;
                break;
            case 4:
                x += 10;
                y += 40;
                vn = 0;
                break;
            case 5:
                x -= 10;
                y += 40;
                vn = 2;
                break;
            case 6:
                x -= 30;
                y += 70;
                vn = 2;
                break;
            case 7:
                x -= 40;
                y += 40;
                vn = 1;
                break;
        }

        let node = new OctaNode(x, y, 40, 40, 12);
        this.nodes.push(node);

        linkNode.connect2OctaNode(i, node, vn);
    }

    draw(network)
    {
        let offsetX = window.scrollX / this.scrollRate;
        let offsetY = window.scrollY / this.scrollRate;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawEdge(network, offsetX, offsetY);
        this.drawNode(offsetX, offsetY);
    }

    drawNode(offsetX, offsetY)
    {
        this.nodes.forEach(node => {
            node.setShapePath(this.ctx, offsetX, offsetY);
            this.ctx.stroke();
        });
    }

    drawEdge(network, offsetX, offsetY)
    {
        network.linkNodes.forEach(linkNode => {
            linkNode.connects.forEach((connect, vertexNo) => {
                if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING) {
                    let targetVertex = connect.getVertex();

                    this.ctx.beginPath();
                    this.ctx.moveTo(linkNode.vertices[vertexNo].x, linkNode.vertices[vertexNo].y);
                    this.ctx.lineTo(targetVertex.x + offsetX, targetVertex.y + offsetY);
                    this.ctx.stroke();
                }
            });
        });
    }

    resize(network)
    {
        this.canvas.width = document.documentElement.scrollWidth;
        this.canvas.height = document.documentElement.scrollHeight;
    }

    scroll(network)
    {
    }
}
