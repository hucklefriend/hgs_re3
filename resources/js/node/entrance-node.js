import { Vertex } from '../common/vertex.js';
import { Param } from '../common/param.js';
import { SubNetwork } from '../network/sub-network.js';
import { LinkNode } from './link-node.js';
import { Util} from '../common/util.js';
import { HorrorGameNetwork } from '../horror-game-network.js';
import { Rect } from '../common/rect.js';
/**
 * @type {HorrorGameNetwork}
 */
window.hgn;

/**
 * トップページの特別なリンクノード
 */
export class EntranceNode extends LinkNode
{
    /**
     * コンストラクタ
     *
     * @param id
     * @param x
     * @param y
     * @param DOM
     */
    constructor(id, x, y, DOM)
    {
        super(id, x, y, DOM, 50);

        this.lightCanvas = document.querySelector('#entrance-node-canvas');
        this.lightCanvas.width = 300;
        this.lightCanvas.height = 300;
        this.lightCtx = this.lightCanvas.getContext('2d');

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

        this.isEnableMouse = false;
        this.isHover = false;
        this.isUseAnimVertices = false;
        this.isDrawLight = true;
    }

    /**
     * サブネットワーク背景を生成
     *
     * @returns {SubNetwork}
     */
    createSubNetwork()
    {
        let network = new SubNetwork(this);

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
        this.subNetwork.postAdd();
    }

    /**
     * 削除
     */l
    delete()
    {
        if (this.animVertices !== null) {
            for (let i = 0; i < this.animVertices.length; i++) {
                this.animVertices[i] = null;
            }
            this.animVertices = null;
        }

        this.lightCtx = null;
        this.lightCanvas = null;

        this.ctxParams = null;

        super.delete();
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
        this.hoverAnimStartTime = window.hgn.time;
        this.hoverAnimFunc = this.hoverAnim;
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
        this.hoverAnimStartTime = window.hgn.time;
        this.hoverAnimFunc = this.leaveAnim;
        this.DOM.classList.remove('active');
    }

    /**
     * ホバーアニメーション
     */
    hoverAnim()
    {
        const animElapsedTime = window.hgn.time - this.hoverAnimStartTime;
        if (animElapsedTime < 100) {
            let ratio = animElapsedTime / 100;
            this.ctxParams.strokeStyle = "rgba(0, " + Util.lerp(100, 180, ratio) + ", 0," + Util.lerp(0.4, 0.8, ratio) + ")";
            this.ctxParams.shadowColor = "rgb(" + Util.lerp(0, 90, ratio) + ", " + Util.lerp(150, 255, ratio) + ", " + Util.lerp(0, 25, ratio) + ")";
            this.ctxParams.shadowBlur = Util.lerp(0, 10, ratio);
            window.hgn.setDrawMain(false);
        } else {
            this.hoverAnimFunc = null;
            this.ctxParams.strokeStyle = "rgba(0, 180, 0, 0.4)";
            this.ctxParams.shadowColor = "rgb(90, 255, 25)";
            this.ctxParams.shadowBlur = 10;
            window.hgn.setDrawMain(true);
        }
    }

    /**
     * りーブアニメーション
     */
    leaveAnim()
    {
        const animElapsedTime = window.hgn.time - this.hoverAnimStartTime;
        if (animElapsedTime < 100) {
            let ratio = 1 - animElapsedTime / 100;
            this.ctxParams.strokeStyle = "rgba(0, " + Util.lerp(100, 180, ratio) + ", 0," + Util.lerp(0.4, 0.8, ratio) + ")";
            this.ctxParams.shadowColor = "rgb(" + Util.lerp(0, 90, ratio) + ", " + Util.lerp(150, 255, ratio) + ", " + Util.lerp(0, 25, ratio) + ")";
            this.ctxParams.shadowBlur = Util.lerp(0, 10, ratio);
            window.hgn.setDrawMain(false);
        } else {
            this.hoverAnimFunc = null;
            this.ctxParams.strokeStyle = "rgba(0, 100, 0, 0.8)";
            this.ctxParams.shadowColor = "rgb(0, 150, 0)";
            this.ctxParams.shadowBlur = 0;
            window.hgn.setDrawMain(true);
        }
    }

    /**
     * 描画
     *
     * @param ctx
     */
    draw(ctx, offsetX, offsetY, isDrawOutsideView)
    {
        if (this.isDrawLight) {
            this.drawLight();
            this.isDrawLight = false;
        }

        if (!this.isDraw(isDrawOutsideView)) {
            return;
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
            super.setShapePathByVertices(ctx, this.animVertices, offsetX, offsetY);
        } else {
            super.setShapePath(ctx, offsetX, offsetY);
        }

        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.fill();
    }

    /**
     * 出現開始
     */
    appear()
    {
        super.appear();
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
        if (window.hgn.animElapsedTime < 300) {
            let ratio = window.hgn.animElapsedTime / 300;
            
            this.ctxParams.lineWidth = Util.lerp(0, 8, ratio, true);

            this.setAnimSize(ratio);
            this.isDrawLight = true;
            window.hgn.setDrawMain();
        } else {
            this.ctxParams.lineWidth = 8;
            this.isUseAnimVertices = false;
            this.isEnableMouse = true;
            this.fadeInText();
    
            this.lightRadius = 70;
            this.isDrawLight = true;
            this._animFunc = this.appearAnimation2;
            window.hgn.setDrawMain(true);
            this.appeared();
        }
    }

    /**
     * サブネットワークの出現アニメーション
     */
    appearAnimation2()
    {
        let ratio = (window.hgn.animElapsedTime - 330) / 300;
        let depth = Util.lerp(1, 6, ratio, true);
        
        if (this.subNetwork.maxDrawDepth !== depth) {
            this.subNetwork.setMaxDrawDepth(depth);
            window.hgn.setDrawSub();
        }

        if (this.subNetwork.maxDrawDepth === this.subNetwork.maxDepth) {
            this._animFunc = null;
        }
    }

    /**
     * 出現完了
     */
    appeared()
    {
        this.DOM.addEventListener('mouseenter', () => this.mouseEnter());
        this.DOM.addEventListener('mouseleave', () => this.mouseLeave());
        this.DOM.addEventListener('click', () => this.mouseClick());

        if (Param.IS_TOUCH_DEVICE) {
            this.DOM.addEventListener('touchstart', () => this.mouseEnter());
            this.DOM.addEventListener('touchend', () => this.mouseLeave());
        }

        this.isEnableMouse = true;
    }


    /**
     * 消失開始
     */
    disappear()
    {
        super.disappear();
        this.fadeOutText();

        this.isEnableMouse = false;
        this.isUseAnimVertices = true;

        this._animFunc = this.disappearAnimation;
    }

    /**
     * 消失アニメーション
     */
    disappearAnimation()
    {
        if (window.hgn.animElapsedTime < 300) {
            let ratio = window.hgn.animElapsedTime / 300;

            if (this.ctxParams.lineWidth > 0) {
                this.ctxParams.lineWidth--;
            }

            this.setAnimSize(1 - ratio);
            this.isDrawLight = true;
            window.hgn.setDrawMain(false);
        } else if (window.hgn.animElapsedTime >= 300) {
            this.lightRadius = 0;
            this.animVertices = null;
            this.isDrawLight = true;
            window.hgn.setDrawMain(true);
        }

        if (window.hgn.animElapsedTime >= 30) {
            let ratio = (window.hgn.animElapsedTime - 30) / 500;
            let depth = Util.lerp(1, 6, ratio, true);
            if (depth >= this.subNetwork.maxDepth) {
                this.subNetwork.setDrawDepth(0, 0);
                window.hgn.setDrawSub();

                this._animFunc = this.disappeared;
            } else if (depth != this.subNetwork.minDrawDepth) {
                this.subNetwork.setMinDrawDepth(depth);
                window.hgn.setDrawSub();
            }
        }
    }

    /**
     * アニメーションのサイズを設定
     *
     * @param ratio
     */
    setAnimSize(ratio)
    {
        this.lightRadius = Util.lerp(1, 70, ratio);
        for (let i = 0; i < this.animVertices.length; i++) {
            this.animVertices[i].x = Util.lerp(this.center.x, this.vertices[i].x, ratio);
            this.animVertices[i].y = Util.lerp(this.center.y, this.vertices[i].y, ratio);
        }
    }
}
