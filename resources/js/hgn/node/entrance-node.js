import {Vertex} from '../vertex.js';
import {Param} from '../param.js';
import {Bg2Network} from '../network.js';
import {LinkNode} from './link-node.js';
import {Util} from '../util.js';

/**
 * トップページの特別なリンクノード
 */
export class EntranceNode extends LinkNode
{
    /**
     * コンストラクタ
     *
     * @param DOM
     */
    constructor(DOM)
    {
        super(DOM, 50);

        this.lightCanvas = document.querySelector('#entrance-node-canvas');
        this.lightCanvas.width = 300;
        this.lightCanvas.height = 300;
        this.lightCtx = this.lightCanvas.getContext('2d');

        this.createNetwork();
        window.hgn.bg2.addParentNode(this);

        this.animCnt2 = 0;  // エントランスノードは自前のアニメーションカウンターを持つ
        this.animVertices = [];
        for (let i = 0; i < 8; i++) {
            this.animVertices.push(new Vertex(0, 0));
        }

        this.lightRadius = 0;

        this.ctxParams = {
            strokeStyle: "rgba(0, 200, 0, 0.8)",
            shadowColor: "lime",
            shadowBlur: 15,
            lineWidth: 8
        };

        this.isHover = false;
        this.isUseAnimVertices = false;
        this.isDrawLight = true;
    }

    /**
     * トップページのメインネットワーク背景を生成
     *
     * @returns {Bg2Network}
     */
    createNetwork()
    {
        let network = new Bg2Network(this);
        network.addOctaNode(this, Param.LTT, 0, -80, -80, 40);

        network.addOctaNode(0, Param.LTT, 1, -50, -80, 40);
        network.addPointNode(1, Param.LTT, 2, -40, -20);
        network.addOctaNode(2, null, 3, -70, 20, 30);
        network.addOctaNode(2, null, 4, -10, -60, 30);
        network.addPointNode(3, Param.LTT, 5, -40, -30);
        network.addOctaNode(5, null, 6, -30, -60, 25);
        network.addOctaNode(5, null, 7, -70, 30, 20);

        network.addOctaNode(this, Param.RTT, 8, 30, -80, 40);
        network.addOctaNode(8, Param.LTT, 9, -60, -60, 35);
        network.addPointNode(9, Param.LLB, 10, -70, 40, 7);
        network.addOctaNode(10, null, 11, -90, -40, 35);
        network.addOctaNode(11, Param.LLT, 12, -50, -40, 30);
        network.addPointNode(11, Param.RTT, 13, 10, -30, 5);
        network.addOctaNode(13, null, 14, -30, -60, 25);
        network.addOctaNode(13, null, 15, 50, -40, 35);
        network.addOctaNode(9, Param.RRT, 16, 50, -40, 35);

        network.addOctaNode(this, Param.RRT, 101, 50, -20, 35);
        network.addPointNode(101, Param.RTT, 102, 40, -40, 7);
        network.addOctaNode(102, null, 103, 10, -80, 20);
        network.addOctaNode(102, null, 104, 50, -20, 35);
        network.addOctaNode(104, Param.RTT, 105, 50, -40, 35);
        network.addOctaNode(104, Param.RRB, 106, 60, 20, 35);


        network.addOctaNode(this, Param.RRB, 201, 50, -20, 35);
        network.addOctaNode(201, Param.RTT, 202, 50, -40, 25);
        network.addPointNode(201, Param.RRB, 203, 60, 20, 5);
        network.addOctaNode(203, Param.RTT, 204, 50, -40, 25);
        network.addOctaNode(203, Param.RBB, 205, 10, 80, 35);
        network.addOctaNode(205, Param.RRT, 206, 50, -20, 30);
        network.addOctaNode(205, Param.LBB, 207, -40, 60, 30);

        network.addOctaNode(this, Param.RBB, 301, 20, 60, 30, null, null, Param.LTT);
        network.addOctaNode(301, Param.LLT, 302, -80, -20, 30);
        network.addOctaNode(302, Param.LLT, 303, -80, -20, 25);
        network.addOctaNode(302, Param.LBB, 304, -60, 40, 30);
        network.addPointNode(302, Param.RBB, 305, 40, 80, 5);
        network.addOctaNode(305, null, 306, 40, 10, 25);
        network.addOctaNode(305, null, 307, -30, 70, 30);

        network.addOctaNode(this, Param.LBB, 401, -40, 60, 30);
        network.addOctaNode(401, Param.LLT, 402, -80, -20, 30);
        network.addOctaNode(401, Param.RRB, 403, 40, 60, 30);
        network.addPointNode(401, Param.LBB, 404, -20, 40, 5);
        network.addOctaNode(404, Param.RRB, 405, 20, 60, 20);
        network.addOctaNode(404, Param.RRB, 406, -50, 30, 25, null, null, Param.RTT);

        network.addPointNode(this, Param.LLB, 501, -40, 20, 5);
        network.addOctaNode(501, null, 502, -80, 0, 30);
        network.addOctaNode(501, null, 503, -80, -80, 35, null, null, Param.RBB);
        network.addOctaNode(502, Param.LBB, 504, -80, 60, 30);
        network.addOctaNode(502, Param.LLT, 505, -50, -30, 25);
        network.addOctaNode(505, Param.LLT, 506, -70, -10, 25);

        network.addOctaNode(this, Param.LLT, 601, -60, 0, 25);
        network.addOctaNode(601, Param.LLB, 602, -80, 0, 30);
        network.addPointNode(602, Param.LTT, 603, -5, -50, 5);
        network.addPointNode(602, Param.LLT, 604, -50, -10, 5);
        network.addOctaNode(603, null, 605, 30, -30, 25);
        network.addOctaNode(603, null, 606, -50, -60, 25);
        network.addOctaNode(604, null, 607, -80, -80, 30);
        network.addOctaNode(604, null, 608, -120, 10, 25);

        this.subNetwork = network;
    }

    /**
     * 光の描画
     */
    drawLight()
    {
        this.lightCtx.clearRect(0, 0, this.lightCanvas.width, this.lightCanvas.height);

        if (this.lightRadius > 0) {
            this.lightCtx.beginPath();
            this.lightCtx.arc(150, 150, this.lightRadius, 0, Param.MATH_PI_2);
            this.lightCtx.shadowColor = 'rgb(0, 255, 0)';
            this.lightCtx.shadowBlur = 70;

            const gradient = this.lightCtx.createRadialGradient(150, 150, 0, 150, 150, this.lightRadius);
            gradient.addColorStop(0, "rgba(0, 200, 0, 1)"); // 中心は白
            gradient.addColorStop(0.5, "rgba(0, 100, 0, 0.8)"); // 外側は黒
            gradient.addColorStop(1, "rgba(0, 70, 0, 0.7)"); // 外側は黒
            this.lightCtx.fillStyle = gradient;
            this.lightCtx.fill();
        }
    }

    /**
     * マウスが乗った時の処理
     */
    mouseEnter()
    {
        if (!this.isEnableMouse) {
            return;
        }

        this.isHover = true;
        this.ctxParams.strokeStyle = "rgba(0, 180, 0, 0.4)"; // 線の色と透明度
        this.ctxParams.shadowColor = "lime"; // 影の色
        this.ctxParams.shadowBlur = 10; // 影のぼかし効果
        this.hoverOffsetAnimCnt = window.hgn.animCnt;
        this.animFunc = this.hoverAnimation;
        this.DOM.classList.add('active');
    }

    /**
     * マウスが離れた時の処理
     */
    mouseLeave()
    {
        if (!this.isEnableMouse) {
            return;
        }

        this.isHover = false;
        this.ctxParams.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
        this.ctxParams.shadowColor = "rgb(0, 150, 0)"; // 影の色
        this.ctxParams.shadowBlur = 0; // 影のぼかし効果
        this.hoverOffsetAnimCnt = window.hgn.animCnt;
        this.animFunc = this.leaveAnimation;
        this.DOM.classList.remove('active');
    }

    /**
     * ホバーアニメーション
     */
    hoverAnimation()
    {
        const animCnt = window.hgn.getOffsetAnimCnt(this.hoverOffsetAnimCnt);
        if (animCnt < 5) {
            let ratio = animCnt / 5;
            this.ctxParams.strokeStyle = "rgba(0, " + Util.getMidpoint(100, 180, ratio) + ", 0," + Util.getMidpoint(0.4, 0.8, ratio) + ")";
            this.ctxParams.shadowColor = "rgb(" + Util.getMidpoint(0, 90, ratio) + ", " + Util.getMidpoint(150, 255, ratio) + ", " + Util.getMidpoint(0, 25, ratio) + ")";
            this.ctxParams.shadowBlur = Util.getMidpoint(0, 10, ratio);
        } else {
            this.animFunc = null;
            this.ctxParams.strokeStyle = "rgba(0, 180, 0, 0.4)";
            this.ctxParams.shadowColor = "rgb(90, 255, 25)";
            this.ctxParams.shadowBlur = 10;
        }

        window.hgn.setRedrawMain();
    }

    /**
     * りーブアニメーション
     */
    leaveAnimation()
    {
        const animCnt = window.hgn.getOffsetAnimCnt(this.hoverOffsetAnimCnt);
        if (animCnt < 5) {
            let ratio = 1 - animCnt / 5;
            this.ctxParams.strokeStyle = "rgba(0, " + Util.getMidpoint(100, 180, ratio) + ", 0," + Util.getMidpoint(0.4, 0.8, ratio) + ")";
            this.ctxParams.shadowColor = "rgb(" + Util.getMidpoint(0, 90, ratio) + ", " + Util.getMidpoint(150, 255, ratio) + ", " + Util.getMidpoint(0, 25, ratio) + ")";
            this.ctxParams.shadowBlur = Util.getMidpoint(0, 10, ratio);
        } else {
            this.animFunc = null;
            this.ctxParams.strokeStyle = "rgba(0, 100, 0, 0.8)";
            this.ctxParams.shadowColor = "rgb(0, 150, 0)";
            this.ctxParams.shadowBlur = 0;
        }

        window.hgn.setRedrawMain();
    }


    /**
     * 描画
     *
     * @param ctx
     * @param fillStyle
     */
    draw(ctx, fillStyle = 'black')
    {
        if (this.isDrawLight) {
            this.drawLight();
            this.isDrawLight = false;
        }

        ctx.strokeStyle = this.ctxParams.strokeStyle;
        ctx.shadowColor = this.ctxParams.shadowColor;
        ctx.shadowBlur = this.ctxParams.shadowBlur;
        ctx.lineWidth = this.ctxParams.lineWidth;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        if (this.isUseAnimVertices) {
            if (this.animVertices === null) {
                return;
            }
            super.setShapePathByVertices(ctx, this.animVertices);
        } else {
            super.setShapePath(ctx);
        }

        ctx.stroke();

        ctx.fillStyle = fillStyle;
        ctx.fill();
    }

    /**
     * 更新
     */
    update()
    {
        if (this.animFunc !== null) {
            this.animCnt2++;
            this.animFunc();
        }
    }

    /**
     * 出現
     */
    appear()
    {
        super.appear();
        this.animCnt2 = 0;
        this.isUseAnimVertices = true;
        this.subNetwork.setDrawDepth(0, 0);

        this.ctxParams.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
        this.ctxParams.shadowColor = "rgb(0,150, 0)"; // 影の色
        this.ctxParams.shadowBlur = 0; // 影のぼかし効果
        this.ctxParams.lineWidth = 1; // 線の太さ

        if (this.animVertices === null) {
            this.animVertices = [];
            for (let i = 0; i < 8; i++) {
                this.animVertices.push(new Vertex(0, 0));
            }
        }
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        if (this.animCnt2 < 15) {
            if (this.ctxParams.lineWidth < 8) {
                this.ctxParams.lineWidth++;
            }

            this.setAnimSize(this.animCnt2 / 15);
            this.isDrawLight = true;
        } else if (this.animCnt2 === 15) {
            this.isUseAnimVertices = false;
            this.isEnableMouse = true;
            this.fadeInText();

            this.lightRadius = 70;
            this.isDrawLight = true;
        } else {
            let animCnt = this.animCnt2 - 15;
            let depth = Math.ceil(animCnt / 5);
            this.subNetwork.maxDrawDepth = depth;
            if (this.subNetwork.maxDepth === depth) {
                this.animFunc = null;
            }

            window.hgn.setRedrawBg2();
        }
    }

    /**
     * 消える
     */
    disappear()
    {
        super.disappear();
        this.animCnt2 = 0;
        this.isUseAnimVertices = true;
        this.fadeOutText();
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
        if (this.animCnt2 < 15) {
            if (this.ctxParams.lineWidth > 0) {
                this.ctxParams.lineWidth--;
            }

            this.setAnimSize(1 - (this.animCnt2 / 15));
            this.isDrawLight = true;
        } else if (this.animCnt2 === 15) {
            this.lightRadius = 0;
            this.animVertices = null;
            this.isDrawLight = true;
        }

        let depth = Math.ceil(this.animCnt2 / 5);
        if (depth > this.subNetwork.maxDepth) {
            this.subNetwork.setDrawDepth(0, 0);
            this.animFunc = null;
        } else {
            this.subNetwork.minDrawDepth = depth;
        }
        window.hgn.setRedrawBg2();
    }

    /**
     * アニメーションのサイズを設定
     *
     * @param ratio
     */
    setAnimSize(ratio)
    {
        this.lightRadius = Util.getMidpoint(1, 70, ratio);
        for (let i = 0; i < this.animVertices.length; i++) {
            this.animVertices[i].x = Util.getMidpoint(this.center.x, this.vertices[i].x, ratio);
            this.animVertices[i].y = Util.getMidpoint(this.center.y, this.vertices[i].y, ratio);
        }
    }
}
