import {Bg2OctaNode, OctaNode} from './node/octa-node.js';
import {Bg2PointNode, PointNode} from './node/point-node.js';
import {Param} from './param.js';

export class Background2
{
    /**
     * コンストラクタ
     *
     * @param network
     */
    constructor(network)
    {
        this.scrollRate = 1.3;

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
            this.ctx.fillStyle = "rgba(0, 150, 0, 0.8)";
            this.ctx.font = '20px Arial';
        }

        this.nodes = [];

        this.init(network);
    }

    init(network)
    {
        network.linkNodes.forEach(linkNode => {
            if (linkNode.DOM.id === 'n-HGS') {
                this.setupHGSNode(linkNode);
            } else {
                // for (let i = 0; i < 8; i++) {
                //     if (this.judge()) {
                //         this.addNode(i, linkNode);
                //     }
                // }
            }
        });
    }

    setupHGSNode(hgsNode)
    {
        this.addSubNode(hgsNode, Param.LTT, -80, -80, 40, 12);
        this.addSubNode(0, Param.LTT, -50, -80, 40, 12);
        this.addSubNode(1, Param.LTT, -40, -20, 5);
        this.addSubNode(2, null, -10, -40, 5);
        this.addSubNode(2, null, -70, 20, 30, 10);
        this.addSubNode(4, Param.LTT, -60, -60, 5);
        this.addSubNode(4, Param.LLB, -30, -20, 5);
        this.addSubNode(6, null, -60, -20, 30, 10);
        this.nodes[5].connect(this.nodes[7], Param.LTT);

        this.addSubNode(hgsNode, Param.RTT, 30, -80, 40, 12);
        this.addSubNode(8, Param.LTT, -70, -40, 35, 11);
        this.addSubNode(9, Param.LLB, -70, 40, 7);
        this.addSubNode(10, null, -90, -40, 35, 11);
        this.addSubNode(11, Param.LLT, -100, -40, 30, 10);
        this.nodes[12].connect(Param.LLB, this.nodes[0], Param.RRT);
        this.addSubNode(12, Param.LLT, -40, -80, 5);
        this.addSubNode(12, Param.RTT, 10, -40, 5);
        this.addSubNode(14, Param.RTT, -10, -70, 5);
        this.addSubNode(11, Param.LTT, -10, -40, 5);
        this.addSubNode(16, null, 30, -60, 40, 12);
        this.addSubNode(17, Param.RBB, 20, 20, 30, 10);
        this.addSubNode(17, Param.RTT, 60, -60, 30, 10);
        this.addSubNode(19, Param.RRT, -40, -120, 25, 9);
        this.addSubNode(17, Param.LLT, -30, -40, 6);
        this.addSubNode(17, Param.LLT, -30, -40, 6);
        // n = this.addSubNode(hgsNode, Param.RRT, 60, -40, 40, 40, 12);
        // n = this.addSubNode(hgsNode, Param.RRB, 60, 30, 40, 40, 12);
        // n = this.addSubNode(hgsNode, Param.RBB, 60, 80, 40, 40, 12);
        // n = this.addSubNode(hgsNode, Param.LBB, -20, 100, 40, 40, 12);
        // n = this.addSubNode(hgsNode, Param.LLB, -60, 40, 40, 40, 12);
        // n = this.addSubNode(hgsNode, Param.LLT, -90, 0, 40, 40, 12);
    }


    addSubNode(baseNode, vertexNo, offsetX, offsetY, whr, n = null)
    {
        if (Number.isInteger(baseNode)) {
            baseNode = this.nodes[baseNode];
        }

        let newNode = null;
        if (n !== null) {
            newNode = new Bg2OctaNode(baseNode, vertexNo, offsetX, offsetY, whr, whr, n, null);
        } else {
            newNode = new Bg2PointNode(baseNode, vertexNo, offsetX, offsetY, whr);
        }

        this.nodes.push(newNode);

        let targetVertexNo = null;
        if (newNode instanceof OctaNode) {
            targetVertexNo = newNode.getNearVertexNo(baseNode);
        }

        if (baseNode instanceof OctaNode) {
            baseNode.connect(vertexNo, newNode, targetVertexNo);
        } else {
            baseNode.connect(newNode, targetVertexNo);
        }

        return newNode;
    }

    judge(rate = 50) {
        return Math.random() * 100 <= rate;
    }

    addNode(i, linkNode)
    {
        let x = 0;//linkNode.vertices[i].x;
        let y = 0;//linkNode.vertices[i].y;
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

        let node = new Bg2OctaNode(linkNode, i, x, y, 40, 40, 12);
        this.nodes.push(node);

        linkNode.connect2OctaNode(i, node, vn);
    }

    reload()
    {
        this.nodes.forEach(node => {
            node.reload();
        });
    }

    draw(network)
    {
        let offsetX = window.scrollX - (window.scrollX / this.scrollRate);
        let offsetY = window.scrollY - (window.scrollY / this.scrollRate);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawEdge(network, offsetX, offsetY);
        this.drawNode(offsetX, offsetY);
    }

    drawNode(offsetX, offsetY)
    {
        this.nodes.forEach(node => {
            node.draw(this.ctx, offsetX, offsetY);
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

                    this.drawEdge2(connect.node, offsetX, offsetY);
                }
            });
        });

        if (Param.BG2_MAKE_NETWORK_MODE) {
            this.nodes.forEach((node, i) => {
                this.ctx.fillText(i.toString(), node.x, node.y);
            });
        }
    }

    drawEdge2(node, offsetX, offsetY) {
        node.connects.forEach((connect, vertexNo) => {
            if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING) {
                let targetVertex = connect.getVertex();

                let x = node.x;
                let y = node.y;
                if (node instanceof Bg2OctaNode) {
                    x = node.vertices[vertexNo].x;
                    y = node.vertices[vertexNo].y;
                }

                this.ctx.beginPath();
                this.ctx.moveTo(x + offsetX, y + offsetY);
                this.ctx.lineTo(targetVertex.x + offsetX, targetVertex.y + offsetY);
                this.ctx.stroke();

                this.drawEdge2(connect.node, offsetX, offsetY);
            }
        });
    }

    resize(network)
    {
        this.canvas.width = document.documentElement.scrollWidth;
        this.canvas.height = document.documentElement.scrollHeight;

        this.reload();
    }

    scroll(network)
    {
    }
}
