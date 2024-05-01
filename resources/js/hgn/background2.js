import {Bg2OctaNode, OctaNode} from './node/octa-node.js';
import {Bg2PointNode, PointNode} from './node/point-node.js';
import {Bg2Network} from './network.js';
import {Param} from './param.js';
import {HorrorGameNetwork} from "../hgn.js";

export class Background2
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        this.canvas = document.querySelector('#bg2');
        this.ctx = this.canvas.getContext('2d');

        this.networks = [];

        this.resize();

        if (Param.BG3_MAKE_NETWORK_MODE) {
            this.canvas.style.backdropFilter = "blur(0px)";
        }
    }

    /**
     * トップページのメインネットワーク背景を生成
     *
     * @param hgsNode
     * @returns {Bg2Network}
     */
    createHGSNetwork(hgsNode)
    {
        let network = new Bg2Network(hgsNode);
        let p = 0;
        network.addOctaNode(hgsNode, Param.LTT, -80, -80, 40);

        network.addOctaNode(0, Param.LTT, -50, -80, 40);
        network.addPointNode(1, Param.LTT, -40, -20);
        network.addPointNode(2, null, -10, -40);
        network.addOctaNode(2, null, -70, 20, 30);
        network.addPointNode(4, Param.LTT, -60, -60);
        network.addPointNode(4, Param.LLB, -30, -20);
        network.addOctaNode(6, null, -60, -20, 30);
        network.addNodeConnection(5, 7, null, Param.LTT)

        network.addOctaNode(hgsNode, Param.RTT, 30, -80, 40);
        network.addOctaNode(8, Param.LTT, -70, -40, 35);
        network.addPointNode(9, Param.LLB, -70, 40, 7);
        network.addOctaNode(10, null, -90, -40, 35);
        network.addOctaNode(11, Param.LLT, -100, -40, 30);
        network.addNodeConnection(12, 0, Param.LLB, Param.RRT);
        network.addPointNode(12, Param.LLT, -40, -80, 5);
        network.addPointNode(12, Param.RTT, 10, -40, 5);
        network.addPointNode(14, Param.RTT, -10, -70, 5);
        network.addPointNode(11, Param.LTT, -10, -40, 5);
        network.addOctaNode(16, null, 30, -60, 40);
        network.addOctaNode(17, Param.RBB, 20, 20, 30);
        network.addOctaNode(17, Param.RTT, 60, -60, 30);
        network.addOctaNode(19, Param.RRT, -40, -120, 25);
        network.addPointNode(17, Param.LLT, -30, -40, 5);
        network.addPointNode(17, Param.RRT, 40, -10, 5);
        network.addNodeConnection(9, 23, Param.LTT);
        network.addPointNode(9, Param.RTT, 70, -80, 5);
        network.addPointNode(8, Param.RTT, 60, -40, 5);
        network.addPointNode(24, Param.LLT, 60, -10, 5);
        network.addOctaNode(25, null, 30, -60, 35);
        network.addOctaNode(26, Param.RTT, 60, -40, 35);
        network.addOctaNode(27, Param.RRT, 30, -60, 35);
        network.addOctaNode(26, Param.LTT, -10, -80, 30);
        network.addPointNode(26, Param.RBB, -10, 40, 5);
        network.addOctaNode(30, null, 0, 80, 30);
        network.addOctaNode(28, Param.RRB, 40, 30, 35);
        network.addOctaNode(32, Param.RRT, 30, -50, 30);
        network.addOctaNode(32, Param.RBB, 25, 50, 30);
        network.addPointNode(34, Param.RRT, 60, -20, 5);
        network.addPointNode(31, Param.RRT, 30, -20, 5);
        network.addPointNode(36, Param.RRT, 5, -60, 5);
        network.addNodeConnection(32, 37, Param.LBB);
        network.addNodeConnection(34, 36, Param.LLB);
        network.addOctaNode(hgsNode, Param.RRT, 60, -40, 40);
        network.addOctaNode(hgsNode, Param.RRB, 60, 30, 40);
        network.addOctaNode(hgsNode, Param.RBB, 60, 80, 40);
        network.addOctaNode(hgsNode, Param.LBB, -20, 100, 40);
        network.addOctaNode(hgsNode, Param.LLB, -80, 0, 40);
        network.addNodeConnection(32, 39, Param.LLT, Param.RRT);

        network.addOctaNode(38, Param.RBB, 20, 50, 35);
        network.addOctaNode(39, Param.LTT, -30, -80, 30);
        network.addNodeConnection(38, 45, Param.LBB, Param.RTT);
        network.addNodeConnection(43, 45, Param.LLB, Param.RRT);

        network.addOctaNode(44-1, Param.RRT, 40, -40, 25);
        network.addOctaNode(46-1, Param.RRB, 30, 10, 25);
        network.addPointNode(44-1, Param.RBB, 40, 40, 6);
        network.addNodeConnection(35-1, 46, Param.LBB, Param.RTT);
        network.addNodeConnection(40-1, 48, Param.RRT);
        network.addOctaNode(40-1, Param.RRB, 40, 0, 25);
        network.addPointNode(49-1, Param.RTT, 60, -10, 5);
        network.addOctaNode(50-1, Param.RRB, 80, 10, 30);
        p--;
        network.addOctaNode(41+p, Param.RRB, 70, 10, 30);
        network.addOctaNode(52+p, Param.LLB, -60, 20, 30);
        network.addPointNode(52+p, Param.RRT, 60, -20);
        network.addPointNode(53+p, Param.LLB, -45, 40);
        network.addOctaNode(55+p, null, -120, -70, 40);
        network.addOctaNode(56+p, Param.LLT, -40, -120, 30);
        network.addOctaNode(57+p, Param.RRB, 50, 30, 30);
        network.addPointNode(57+p, Param.LLB, -45, -40);
        network.addNodeConnection(42+p, 59+p, Param.RRT);
        network.addOctaNode(42+p, Param.RRB, 40, 10, 35);
        network.addPointNode(60+p, Param.RRT, 40, -40);
        network.addPointNode(60+p, Param.RRB, 40, 30);
        network.addPointNode(60+p, Param.LLB, -40, 40);
        network.addPointNode(42+p, Param.LLT, -40, -40);
        network.addOctaNode(42+p, Param.LLB, -40, 40, 35);
        network.addOctaNode(65+p, Param.LLT, -70, -30, 35);
        network.addPointNode(66+p, Param.LBB, -70, 70);
        network.addPointNode(43+p, Param.LLB, -60, 30);
        network.addNodeConnection(64+p, 68+p);
        network.addOctaNode(68+p, null, -40, 40, 35);
        network.addPointNode(69+p, Param.LBB, -20, 60);
        network.addOctaNode(69+p, Param.LTT, -20, -60, 25);
        network.addOctaNode(43+p, Param.LTT, -20, -60, 25);
        network.addOctaNode(43+p, Param.LLT, -60, -20, 30);
        network.addOctaNode(72+p, Param.RRT, 30, -50, 30);
        network.addPointNode(72+p, Param.LTT, -30, -50);
        network.addNodeConnection(0, 75+p, Param.LBB);
        network.addOctaNode(75+p, null, -100, -5, 40);
        network.addOctaNode(76+p, Param.LTT, -100, -80, 25);
        network.addOctaNode(76+p, Param.LLT, -50, -20, 25);
        network.addOctaNode(76+p, Param.LBB, -50, 70, 25);
        network.addPointNode(79+p, Param.LBB, -50, 70);

        this.networks.push(network);
    }

    createRandomNetwork(node, maxDepth)
    {
        console.log(node.subNetworkSize);
        if (node.subNetworkSize === 0) {
            return;
        }
        let network = new Bg2Network(node);

        this.addRandomNode(network, node, maxDepth);

        this.networks.push(network);
    }

    addRandomNode(network, node, maxDepth)
    {
        let pattern = 1;//Math.floor((Math.random() * 2)) + 1;
        switch (pattern) {
            case 1:
                this.addRandomNodePatter1(network, node, maxDepth);
                break;
        }
    }

    addRandomNodePatter1(network, node, depth, maxDepth)
    {
        let newNode = null;
        let newNodeD1 = null;
        let newNodeD2 = null;
        let newNodeD3 = null;

        newNodeD1 = network.addOctaNode(node, Param.LTT, -30, -80, 30);
        //newNodeD2 = network.addOctaNode(newNodeD1, Param.LLT, -80, -60, 30);



        return;

        let forceVertexNo = Math.floor((Math.random() * 8));

        for (let vertexNo = 0; vertexNo < 8; vertexNo++) {
            let isCreate = true;
            if (depth === 1 && forceVertexNo === vertexNo) {
                isCreate = true;
            } else {
                isCreate = this.judge(40 / depth);
            }

            if (isCreate) {
                let x = 0; let y = 0;
                switch (vertexNo) {
                    case Param.LTT: x = -30; y = -80; break;
                    case Param.RTT: x = 40; y = -100; break;
                    case Param.RRT: x = 50; y = -30; break;
                    case Param.RRB: x = 40; y = 40; break;
                    case Param.RBB: x = 10; y = 40; break;
                    case Param.LBB: x = -40; y = 50; break;
                    case Param.LLB: x = -90; y = 20; break;
                    case Param.LLT: x = -80; y = -90; break;
                }

                let newNode = null;
                if (this.judge(60)) {
                    newNode = network.addOctaNode(node, vertexNo, x, y, 30);
                } else {
                    newNode = network.addPointNode(node, vertexNo, x, y);
                }

                if (depth + 1 <= maxDepth) {
                    this.addRandomNode(network, newNode, depth + 1, maxDepth);
                }
            }
        }
    }

    judge(rate)
    {
        return Math.random() * 100 <= rate;
    }

    reload()
    {
        this.networks.forEach(network => {
            network.reload();
        });
    }

    clear()
    {
        this.networks.forEach(network => {
            network.delete();
        });

        this.networks = [];
    }

    draw()
    {
        let offsetX = window.scrollX - (window.scrollX / Param.BG2_SCROLL_RATE);
        let offsetY = window.scrollY - (window.scrollY / Param.BG2_SCROLL_RATE);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.networks.forEach(network => {
            network.draw(this.ctx, offsetX, offsetY, Param.BG2_MAKE_NETWORK_MODE);
        });
    }

    resize()
    {


        this.canvas.width = document.documentElement.scrollWidth;
        this.canvas.height = document.documentElement.scrollHeight;


        this.ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
        this.ctx.lineWidth = 1; // 線の太さ
        this.ctx.shadowColor = "lime"; // 影の色
        this.ctx.shadowBlur = 5; // 影のぼかし効果
        this.ctx.fillStyle = "rgba(0, 150, 0, 0.8)";
        this.ctx.font = '20px Arial';

        this.reload();
    }

    scroll()
    {
    }
}
