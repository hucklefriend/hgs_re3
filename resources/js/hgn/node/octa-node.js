import {Vertex} from '../vertex.js';
import {Param} from '../param.js';
import {Network} from '../network.js';
import {PointNode} from './point-node.js';
import {OctaNodeConnect, PointNodeConnect, Bg2Connect} from './connect.js';
import {HorrorGameNetwork} from '../../hgn.js';

/**
 * 八角ノード
 */
export class OctaNode
{
    /**
     * コンストラクタ
     *
     * @param x
     * @param y
     * @param w
     * @param h
     * @param notchSize
     */
    constructor(x = 0, y = 0, w = 0, h = 0, notchSize = 0)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.notchSize = notchSize;
        this.vertices = [];
        this.connects = new Array(8).fill(null);

        if (this.w > 0 && this.h > 0 && this.notchSize > 0) {
            this.setOctagon();
        }
    }

    /**
     * 左辺
     *
     * @returns {number}
     */
    get left()
    {
        return this.x - this.w / 2;
    }

    /**
     * 右辺
     *
     * @returns {number}
     */
    get right()
    {
        return this.x + this.w / 2;
    }

    /**
     * 上辺
     *
     * @returns {number}
     */
    get top()
    {
        return this.y - this.h / 2;
    }

    /**
     * 下辺
     *
     * @returns {number}
     */
    get bottom()
    {
        return this.y + this.h / 2;
    }

    /**
     * 再ロード（再配置）
     *
     * @param x
     * @param y
     * @param w
     * @param h
     */
    reload(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        if (this.w > 0 && this.h > 0 && this.notchSize > 0) {
            this.setOctagon();
        }
    }

    /**
     * 八角形の挑戦を設定
     */
    setOctagon()
    {
        this.vertices = [
            new Vertex(this.x + this.notchSize, this.y),
            new Vertex(this.x + this.w - this.notchSize, this.y),
            new Vertex(this.x + this.w, this.y + this.notchSize),
            new Vertex(this.x + this.w, this.y + this.h - this.notchSize),
            new Vertex(this.x + this.w - this.notchSize, this.y + this.h),
            new Vertex(this.x + this.notchSize, this.y + this.h),
            new Vertex(this.x, this.y + this.h - this.notchSize),
            new Vertex(this.x, this.y +  this.notchSize),
        ];
    }

    /**
     * 図形のパスを設定
     *
     * @param ctx
     * @param offsetX
     * @param offsetY
     */
    setShapePath(ctx, offsetX = 0, offsetY = 0)
    {
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x + offsetX, this.vertices[0].y + offsetY);
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x + offsetX, this.vertices[i].y + offsetY);
        }
        ctx.closePath();
    }

    /**
     * 移動
     *
     * @param offsetX
     * @param offsetY
     */
    move(offsetX, offsetY)
    {
        this.x += offsetX;
        this.y += offsetY;
        this.setOctagon();
    }

    /**
     * LTTと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectLTT(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.LTT, targetNode, targetNodeVertexNo);
    }

    /**
     * RTTと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectRTT(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.RTT, targetNode, targetNodeVertexNo);
    }

    /**
     * RRTと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectRRT(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.RRT, targetNode, targetNodeVertexNo);
    }

    /**
     * RRBと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectRRB(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.RRB, targetNode, targetNodeVertexNo);
    }

    /**
     * RBBと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectRBB(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.RBB, targetNode, targetNodeVertexNo);
    }

    /**
     * LBBと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectLBB(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.LBB, targetNode, targetNodeVertexNo);
    }

    /**
     * LLBと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectLLB(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.LLB, targetNode, targetNodeVertexNo);
    }

    /**
     * LLTと接続
     *
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {*}
     */
    connectLLT(targetNode, targetNodeVertexNo = null)
    {
        return this.connect(Param.LLT, targetNode, targetNodeVertexNo);
    }

    /**
     * 別のノードと接続
     *
     * @param vertexNo
     * @param targetNode
     * @param targetNodeVertexNo
     */
    connect(vertexNo, targetNode, targetNodeVertexNo = null)
    {
        if (vertexNo === null) {
            vertexNo = this.getNearVertexNo(targetNode);
        }

        if (targetNode instanceof PointNode) {
            return this.connect2PointNode(vertexNo, targetNode);
        } else if (targetNode instanceof OctaNode) {
            if (targetNodeVertexNo === null) {
                targetNodeVertexNo = targetNode.getNearVertexNo(this.vertices[vertexNo]);
            }
            return this.connect2OctaNode(vertexNo, targetNode, targetNodeVertexNo);
        }

        return false;
    }

    /**
     * 点ノードへ接続
     *
     * @param vertexNo
     * @param targetNode
     * @returns {boolean}
     */
    connect2PointNode(vertexNo, targetNode)
    {
        if (this.isConnectedVertex(vertexNo)) {
            return false;
        }

        this.connects[vertexNo] = new PointNodeConnect(Param.CONNECT_TYPE_OUTGOING, targetNode);
        targetNode.connects.push(new OctaNodeConnect(Param.CONNECT_TYPE_INCOMING, this, vertexNo));

        return true;
    }

    /**
     * 八角ノードへ接続
     *
     * @param vertexNo
     * @param targetNode
     * @param targetNodeVertexNo
     * @returns {boolean}
     */
    connect2OctaNode(vertexNo, targetNode, targetNodeVertexNo)
    {
        if (this.isConnectedVertex(vertexNo) || targetNode.isConnectedVertex(targetNodeVertexNo)) {
            return false;
        }

        this.connects[vertexNo] = new OctaNodeConnect(Param.CONNECT_TYPE_OUTGOING, targetNode, targetNodeVertexNo);
        targetNode.connects[targetNodeVertexNo] = new OctaNodeConnect(Param.CONNECT_TYPE_INCOMING, this, vertexNo);

        return true;
    }

    /**
     * 接続済みの頂点か
     *
     * @param vertexNo
     * @returns {boolean}
     */
    isConnectedVertex(vertexNo)
    {
        return this.connects[vertexNo] !== null;
    }

    /**
     * 描画
     *
     * @param ctx
     * @param offsetX
     * @param offsetY
     */
    draw(ctx, offsetX = 0, offsetY = 0)
    {
        this.setShapePath(ctx, offsetX, offsetY);
        ctx.stroke();
    }

    /**
     * 指定した頂点から一番近い頂点番号を返す
     *
     * @param v
     * @returns {null}
     */
    getNearVertexNo(v)
    {
        let closestNo = null;
        let minDistance = Infinity;

        this.vertices.forEach((vertex, no) => {
            const distance = Math.sqrt((v.x - vertex.x) ** 2 + (v.y - vertex.y) ** 2);
            if (distance < minDistance) {
                closestNo = no;
                minDistance = distance;
            }
        });

        return closestNo;
    }

    /**
     * 幅から標準的なノッチサイズを取得
     *
     * @param w
     * @returns {number}
     */
    static standardNotchSize(w)
    {
        if (w <= 10) {
            return 5;
        } else if (w <= 25) {
            return 8;
        } else if (w <= 30) {
            return 10;
        } else if (w <= 35) {
            return 11;
        } else if (w <= 40) {
            return 12;
        }
    }
}

export class Bg2OctaNode extends OctaNode
{
    constructor(parent, vertexNo, offsetX, offsetY, w, h, notchSize, nearVertexNo)
    {
        super(parent.x + offsetX, parent.y + offsetY, w, h, notchSize);
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        if (nearVertexNo === null) {
            nearVertexNo = this.getNearVertexNo(parent);
        }
        this.connection = new Bg2Connect(parent, vertexNo, nearVertexNo);

        this.reload();
    }

    /**
     * 再ロード（再配置）
     */
    reload()
    {
        const v = this.connection.getVertex();
        this.x = v.x;
        this.y = v.y;

        // スクロール量に合わせて調整
        if (this.y > window.innerHeight) {
            this.y -= (this.y - (window.innerHeight / 2)) - ((this.y - (window.innerHeight / 2)) / Param.BG2_SCROLL_RATE);
        }

        this.x += this.offsetX;
        this.y += this.offsetY;

        if (this.w > 0 && this.h > 0 && this.notchSize > 0) {
            this.setOctagon();
        }
    }
}

export class DOMNode extends OctaNode
{
    constructor(DOM, notchSize)
    {
        super(DOM.offsetLeft, DOM.offsetTop, DOM.offsetWidth, DOM.offsetHeight, notchSize);

        this.DOM = DOM;
    }

    reload()
    {
        super.reload(this.DOM.offsetLeft, this.DOM.offsetTop, this.DOM.offsetWidth, this.DOM.offsetHeight);
    }
}

export class TitleNode extends DOMNode
{
    constructor(DOM)
    {
        super(DOM, 15);
    }

    draw(ctx)
    {
        super.setShapePath(ctx);

        ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 3; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル
        ctx.shadowColor = "lime"; // 影の色
        ctx.shadowBlur = 15; // 影のぼかし効果
        ctx.stroke();
    }
}

export class LinkNode extends DOMNode
{
    constructor(DOM, notchSize = 15)
    {
        super(DOM, notchSize);

        this.isHover = false;

        DOM.addEventListener('mouseenter', () => this.mouseEnter());
        DOM.addEventListener('mouseleave', () => this.mouseLeave());
        DOM.addEventListener('click', () => this.mouseClick());

        if (Param.IS_TOUCH_DEVICE) {
            DOM.addEventListener('touchstart', () => this.mouseEnter());
            DOM.addEventListener('touchend', () => this.mouseLeave());
        }

        this.subNodes = [];
    }

    mouseEnter()
    {
        this.isHover = true;
        this.DOM.classList.add('active');

        const hgn = HorrorGameNetwork.getInstance();
        hgn.setRedraw();
    }

    mouseLeave()
    {
        this.isHover = false;
        this.DOM.classList.remove('active');

        const hgn = HorrorGameNetwork.getInstance();
        hgn.setRedraw();
    }

    mouseClick()
    {
        const a = this.DOM.querySelector('a');
        if (a) {
            a.click();
        }
    }

    touchStart()
    {
        this.mouseEnter();
    }

    touchEnd()
    {
        this.mouseLeave();
    }

    draw(ctx)
    {
        if (this.isHover) {
            ctx.strokeStyle = "rgba(0, 180, 0, 0.4)"; // 線の色と透明度
            ctx.shadowColor = "lime"; // 影の色
            ctx.shadowBlur = 10; // 影のぼかし効果
            ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        } else {
            ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
            ctx.shadowColor = "rgb(0,150, 0)"; // 影の色
            ctx.shadowBlur = 8; // 影のぼかし効果
            ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
        }
        ctx.lineWidth = 2; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル

        super.setShapePath(ctx);
        ctx.stroke();
        ctx.fill();



    }
}

export class HgsTitleLinkNode extends LinkNode
{

    constructor(DOM)
    {
        super(DOM, 20);
    }

    draw(ctx)
    {
        if (this.isHover) {
            ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"; // 線の色と透明度
            ctx.shadowColor = "lime"; // 影の色
            ctx.shadowBlur = 15; // 影のぼかし効果
            ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        } else {
            ctx.strokeStyle = "rgba(0, 200, 0, 0.6)"; // 線の色と透明度
            ctx.shadowColor = "rgb(0,150, 0)"; // 影の色
            ctx.shadowBlur = 8; // 影のぼかし効果
            ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
        }
        ctx.lineWidth = 7; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル

        super.setShapePath(ctx);
        ctx.stroke();
        ctx.fill();
    }
}


export class BackNode extends LinkNode
{
    constructor(DOM)
    {
        super(DOM, 10);
    }
}

export class ContentNode extends DOMNode
{
    constructor(DOM) {
        super(DOM, 50);
    }

    draw(ctx)
    {
        super.setShapePath(ctx);

        // Set line color
        ctx.strokeStyle = "rgba(0, 180, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 2; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル
        ctx.shadowColor = "lime"; // 影の色
        ctx.shadowBlur = 10; // 影のぼかし効果
        ctx.stroke();
    }
}

export class TextNode extends DOMNode
{
    constructor(DOM)
    {
        super(DOM, 16);
    }

    draw(ctx)
    {
        super.setShapePath(ctx);

        ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 1; // 線の太さ
        ctx.lineJoin = "miter"; // 線の結合部分のスタイル
        ctx.lineCap = "butt"; // 線の末端のスタイル
        ctx.shadowColor = "black"; // 影の色
        ctx.shadowBlur = 0; // 影のぼかし効果
        ctx.fillStyle = "rgba(0,30,0,0.6)";
        ctx.fill();
    }
}
