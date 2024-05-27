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
        network.addOctaNode(hgsNode, Param.LTT, 0, -80, -80, 40);

        network.addOctaNode(0, Param.LTT, 1, -50, -80, 40);
        network.addPointNode(1, Param.LTT, 2, -40, -20);
        network.addOctaNode(2, null, 3, -70, 20, 30);
        network.addOctaNode(2, null, 4, -10, -60, 30);
        network.addPointNode(3, Param.LTT, 5, -40, -30);
        network.addOctaNode(5, null, 6, -30, -60, 25);
        network.addOctaNode(5, null, 7, -70, 30, 20);

        network.addOctaNode(hgsNode, Param.RTT, 8, 30, -80, 40);
        network.addOctaNode(8, Param.LTT, 9, -60, -60, 35);
        network.addPointNode(9, Param.LLB, 10, -70, 40, 7);
        network.addOctaNode(10, null, 11, -90, -40, 35);
        network.addOctaNode(11, Param.LLT, 12, -50, -40, 30);
        network.addPointNode(11, Param.RTT, 13, 10, -30, 5);
        network.addOctaNode(13, null, 14, -30, -60, 25);
        network.addOctaNode(13, null, 15, 50, -40, 35);
        network.addOctaNode(9, Param.RRT, 16, 50, -40, 35);

        network.addOctaNode(hgsNode, Param.RRT, 101, 50, -20, 35);
        network.addPointNode(101, Param.RTT, 102, 40, -40, 7);
        network.addOctaNode(102, null, 103, 10, -80, 20);
        network.addOctaNode(102, null, 104, 50, -20, 35);
        network.addOctaNode(104, Param.RTT, 105, 50, -40, 35);
        network.addOctaNode(104, Param.RRB, 106, 60, 20, 35);


        network.addOctaNode(hgsNode, Param.RRB, 201, 50, -20, 35);
        network.addOctaNode(201, Param.RTT, 202, 50, -40, 25);
        network.addPointNode(201, Param.RRB, 203, 60, 20, 5);
        network.addOctaNode(203, Param.RTT, 204, 50, -40, 25);
        network.addOctaNode(203, Param.RBB, 205, 10, 80, 35);
        network.addOctaNode(205, Param.RRT, 206, 50, -20, 30);
        network.addOctaNode(205, Param.LBB, 207, -40, 60, 30);

        network.addOctaNode(hgsNode, Param.RBB, 301, 20, 60, 30, null, null, Param.LTT);
        network.addOctaNode(301, Param.LLT, 302, -80, -20, 30);
        network.addOctaNode(302, Param.LLT, 303, -80, -20, 25);
        network.addOctaNode(302, Param.LBB, 304, -60, 40, 30);
        network.addPointNode(302, Param.RBB, 305, 40, 80, 5);
        network.addOctaNode(305, null, 306, 40, 10, 25);
        network.addOctaNode(305, null, 307, -30, 70, 30);

        network.addOctaNode(hgsNode, Param.LBB, 401, -40, 60, 30);
        network.addOctaNode(401, Param.LLT, 402, -80, -20, 30);
        network.addOctaNode(401, Param.RRB, 403, 40, 60, 30);
        network.addPointNode(401, Param.LBB, 404, -20, 40, 5);
        network.addOctaNode(404, Param.RRB, 405, 20, 60, 20);
        network.addOctaNode(404, Param.RRB, 406, -50, 30, 25, null, null, Param.RTT);

        network.addPointNode(hgsNode, Param.LLB, 501, -40, 20, 5);
        network.addOctaNode(501, null, 502, -80, 0, 30);
        network.addOctaNode(501, null, 503, -80, -80, 35, null, null, Param.RBB);
        network.addOctaNode(502, Param.LBB, 504, -80, 60, 30);
        network.addOctaNode(502, Param.LLT, 505, -50, -30, 25);
        network.addOctaNode(505, Param.LLT, 506, -70, -10, 25);


        network.addOctaNode(hgsNode, Param.LLT, 601, -60, 0, 25);
        network.addOctaNode(601, Param.LLB, 602, -80, 0, 30);
        network.addPointNode(602, Param.LTT, 603, -5, -50, 5);
        network.addPointNode(602, Param.LLT, 604, -50, -10, 5);
        network.addOctaNode(603, null, 605, 30, -30, 25);
        network.addOctaNode(603, null, 606, -50, -60, 25);
        network.addOctaNode(604, null, 607, -80, -80, 30);
        network.addOctaNode(604, null, 608, -120, 10, 25);





        this.networks.push(network);
    }

    createRandomNetwork(node, maxDepth)
    {
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

    /**
     * リロード
     */
    reload()
    {
        this.networks.forEach(network => {
            network.reload();
        });
    }

    /**
     * 表示クリア
     */
    clear()
    {
        this.networks.forEach(network => {
            network.delete();
        });

        this.networks = [];
    }

    /**
     * 描画
     */
    draw()
    {
        let offsetX = window.scrollX - (window.scrollX / Param.BG2_SCROLL_RATE);
        let offsetY = window.scrollY - (window.scrollY / Param.BG2_SCROLL_RATE);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.networks.forEach(network => {
            network.draw(this.ctx, offsetX, offsetY, Param.BG2_MAKE_NETWORK_MODE);
        });
    }

    /**
     * ウィンドウサイズの変更
     */
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

    /**
     * スクロール
     */
    scroll()
    {
    }
}
