
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

        this.parentNodes = [];
        this.networks = [];

        this.fadeCnt = 7;

        this.resize();

        if (Param.BG3_MAKE_NETWORK_MODE) {
            this.canvas.style.backdropFilter = "blur(0px)";
        }
    }

    addParentNode(node)
    {
        this.parentNodes.push(node);
    }

    createRandomNetwork(node)
    {
        if (node.subNetworkSize === 'n') {
            return;
        }
        let network = new Bg2Network(node);
        let maxDepth = 1;
        let appearRate = 0;
        switch (node.subNetworkSize) {
            case 's': maxDepth = 1; appearRate = 20; break;
            case 'm': maxDepth = 2; appearRate = 30; break;
            case 'l': maxDepth = 3; appearRate = 70; break;
        }

        let pattern = 1;//Math.floor((Math.random() * 2)) + 1;
        switch (pattern) {
            case 1:
                this.addRandomNodePatter1(network, node, maxDepth, appearRate);
                break;
        }

        this.networks.push(network);
    }

    addRandomNodePatter1(network, node, maxDepth, appearRate)
    {
        let forceVertex = this.getRandomInt(Param.LTT, Param.LLT);

        if (forceVertex === Param.LTT || this.judge(appearRate)) {
            network.addOctaNode(node, Param.LTT, 101, -50, -60, 30);
            if (maxDepth >= 2) {
                if (this.judge(appearRate)) {
                    network.addPointNode(101, Param.LTT, 111, -40, -30, 4);
                    if (maxDepth >= 3) {
                        if (this.judge(appearRate)) {
                            network.addOctaNode(111, Param.RTT, 121, -40, -60, 25);
                        }

                        if (this.judge(appearRate)) {
                            network.addOctaNode(111, Param.RTT, 122, 20, -60, 25);
                        }
                    }
                }

                if (this.judge(appearRate)) {
                    network.addOctaNode(101, Param.RTT, 113, 20, -40, 25);
                }
            }
        }

        if (forceVertex === Param.RTT || this.judge(appearRate)) {
            network.addOctaNode(node, Param.RTT, 201, 30, -60, 30);
            if (maxDepth >= 2) {
                if (this.judge(appearRate)) {
                    network.addPointNode(201, Param.LTT, 211, -10, -30, 4);

                    if (maxDepth >= 3) {
                        if (this.judge(appearRate)) {
                            network.addOctaNode(211, Param.RTT, 221, -30, -60, 30);
                        }
                        if (this.judge(appearRate)) {
                            network.addOctaNode(211, Param.RTT, 222, 30, -60, 30);
                        }
                    }
                }
            }
        }

        if (forceVertex === Param.RRT || this.judge(appearRate)) {
            network.addOctaNode(node, Param.RRT, 301, 30, -30, 30);
            if (maxDepth >= 2) {
                if (this.judge(appearRate)) {
                    network.addOctaNode(301, Param.RTT, 311, 40, -60, 25);

                    if (maxDepth >= 3) {
                        if (this.judge(appearRate)) {
                            network.addOctaNode(311, Param.RRT, 321, 30, -30, 20);
                        }
                    }
                }

                if (this.judge(appearRate)) {
                    network.addOctaNode(301, Param.RRB, 312, 30, 0, 30);
                }
            }
        }

        if (forceVertex === Param.RBB || this.judge(appearRate)) {
            network.addOctaNode(node, Param.RRB, 401, 30, 0, 30);
            if (maxDepth >= 2) {
                if (this.judge(appearRate)) {
                    network.addPointNode(401, Param.RRB, 411, 40, 30, 4);

                    if (maxDepth >= 3) {
                        if (this.judge(appearRate)) {
                            network.addOctaNode(411, null, 421, 30, -10, 30);
                        }
                        if (this.judge(appearRate)) {
                            network.addOctaNode(411, null, 422, 10, 60, 30);
                        }
                    }
                }
            }
        }

        if (forceVertex === Param.RBB || this.judge(appearRate)) {
            network.addOctaNode(node, Param.RBB, 501, 10, 10, 30, null, null, Param.LTT);
            if (maxDepth >= 2) {
                if (this.judge(appearRate)) {
                    network.addPointNode(501, Param.LLB, 511, -30, 40, 3);

                    if (maxDepth >= 3) {
                        if (this.judge(appearRate)) {
                            network.addOctaNode(511, null, 521, 10, 30, 30);
                        }

                        if (this.judge(appearRate)) {
                            network.addOctaNode(511, null, 522, -40, 60, 30);
                        }
                    }
                }

                if (this.judge(appearRate)) {
                    network.addOctaNode(501, Param.RBB, 512, 25, 50, 35);

                    if (maxDepth >= 3) {
                        if (this.judge(appearRate)) {
                            network.addOctaNode(512, Param.LBB, 523, -10, 50, 35);
                        }
                    }
                }
            }
        }

        if (forceVertex === Param.LBB || this.judge(appearRate)) {
            network.addOctaNode(node, Param.LBB, 601, -30, 40, 30);
            if (maxDepth >= 2 && this.judge(appearRate)) {
                network.addOctaNode(601, Param.LLB, 611, -45, 30, 35);
            }
        }

        if (forceVertex === Param.LLB || this.judge(appearRate)) {
            network.addOctaNode(node, Param.LLB, 701, -40, 10, 35);
            if (maxDepth >= 2) {
                if (this.judge(appearRate)) {
                    network.addOctaNode(701, Param.LLB, 711, -45, 30, 20);

                    if (maxDepth >= 3) {
                        if (this.judge(appearRate)) {
                            network.addOctaNode(711, Param.LLT, 721, -50, -10, 25);
                        }

                        if (this.judge(appearRate)) {
                            network.addOctaNode(711, Param.LLB, 722, -45, 30, 25);
                        }
                    }
                }
            }
        }

        if (forceVertex === Param.LLT || this.judge(appearRate)) {
            network.addPointNode(node, Param.LLT, 801, -30, 0, 4);
            if (maxDepth >= 2) {
                if (this.judge(appearRate)) {
                    network.addOctaNode(801, null, 811, -50, -40, 30);

                    if (maxDepth >= 3 && this.judge(appearRate)) {
                        network.addOctaNode(811, Param.LLT, 821, -45, -10, 25);
                    }
                }

                if (this.judge(appearRate)) {
                    network.addOctaNode(801, null, 812, -45, 20, 25);
                }
            }
        }
    }

    judge(rate)
    {
        return Math.random() * 100 <= rate;
    }

    /**
     * ランダムな整数を生成
     *
     * @param min
     * @param max
     * @returns {number}
     */
    getRandomInt(min, max)
    {
        // minとmaxが整数であることを保証
        min = Math.ceil(min);
        max = Math.floor(max);

        // minからmaxまでの範囲の整数をランダムに生成して返す
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * リロード
     */
    reload()
    {
        // TODO これは各ノード側がやるべきで、いずれは消す
        this.networks.forEach(network => {
            network.reload();
        });
    }

    /**
     * 表示クリア
     */
    clear()
    {
        this.parentNodes = [];

        // TODO これは各ノード側がやるべきで、いずれは消す
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
        const hgn = HorrorGameNetwork.getInstance();

        let offsetX = hgn.getScrollX() - (hgn.getScrollX() / Param.BG2_SCROLL_RATE);
        let offsetY = hgn.getScrollY() - (hgn.getScrollY() / Param.BG2_SCROLL_RATE);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.parentNodes.forEach(node => {
            node.drawSubNetwork(this.ctx, offsetX, offsetY);
        });

        // TODO これは各ノード側がやるべきで、いずれは消す
        this.networks.forEach(network => {
            network.draw(this.ctx, offsetX, offsetY, Param.BG2_MAKE_NETWORK_MODE);
        });
    }

    addFadeCnt(addCnt)
    {
        this.fadeCnt += addCnt;
        if (this.fadeCnt > 7) {
            this.fadeCnt = 7;
        } else if (this.fadeCnt < 0) {
            this.fadeCnt = 0;
        }

        this.setStrokeStyle();
    }

    setStrokeStyle()
    {
        let alpha = this.fadeCnt / 10;
        this.ctx.strokeStyle = "rgba(0, 70, 0, " + alpha + ")"; // 線の色と透明度
    }

    /**
     * ウィンドウサイズの変更
     */
    resize()
    {
        const hgn = HorrorGameNetwork.getInstance();

        this.canvas.width = document.documentElement.scrollWidth;
        this.canvas.height = hgn.getHeight();

        let alpha = this.fadeCnt / 10;
        this.ctx.strokeStyle = "rgba(0, 70, 0, " + alpha + ")"; // 線の色と透明度
        this.ctx.lineWidth = 3; // 線の太さ
        // this.ctx.shadowColor = "lime"; // 影の色
        // this.ctx.shadowBlur = 5; // 影のぼかし効果
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
