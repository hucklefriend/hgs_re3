import {Vertex} from '../vertex.js';
import {Param} from '../param.js';
import {PointNode} from './point-node.js';
import {OctaNodeConnect, PointNodeConnect, Bg2Connect} from './connect.js';
import {HorrorGameNetwork} from '../../hgn.js';
import {Util} from "../util.js";
import {Bg2Network} from "../network.js";

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
        this.forceDraw = false;
        this.center = new Vertex(this.x + this.w / 2, this.y + this.h / 2);
        this.id = null;

        if (this.w > 0 && this.h > 0 && this.notchSize > 0) {
            this.setOctagon();
        }
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        this.vertices = null;
        this.connects.forEach((connect, vertexNo) => {
            if (connect !== null) {
                this.disconnect(vertexNo);
                connect.delete();
            }
        });
        this.connects = null;
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
        this.center.x = this.x + this.w / 2;
        this.center.y = this.y + this.h / 2;

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
     * 図形のパスを設定
     *
     * @param ctx
     * @param vertices
     * @param offsetX
     * @param offsetY
     */
    setShapePathByVertices(ctx, vertices, offsetX = 0, offsetY = 0)
    {
        ctx.beginPath();
        ctx.moveTo(vertices[0].x + offsetX, vertices[0].y + offsetY);
        for (let i = 1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i].x + offsetX, vertices[i].y + offsetY);
        }
        ctx.closePath();
    }

    /**
     * 範囲外でも描画を強制する
     */
    setForceDraw()
    {
        this.forceDraw = true;
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

        console.warn('Invalid target node');
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
            console.warn('Already connected');
            return false;
        }

        this.connects[vertexNo] = new OctaNodeConnect(Param.CONNECT_TYPE_OUTGOING, targetNode, targetNodeVertexNo);
        targetNode.connects[targetNodeVertexNo] = new OctaNodeConnect(Param.CONNECT_TYPE_INCOMING, this, vertexNo);

        return true;
    }

    /**
     * 接続解除
     *
     * @param vertexNo
     */
    disconnect(vertexNo)
    {
        if (this.connects[vertexNo] !== null) {
            let targetNode = this.connects[vertexNo].node;
            this.connects[vertexNo] = null;
            targetNode.disconnectByNode(this);
        }
    }

    /**
     * ノードを指定して接続解除
     *
     * @param node
     */
    disconnectByNode(node)
    {
        this.connects.forEach((connect, idx) => {
            if (connect !== null && connect.node === node) {
                this.disconnect(idx);
            }
        });
    }

    /**
     * 接続済みか
     *
     * @returns {boolean}
     */
    isConnected(vertexNo, targetNode, targetVertexNo)
    {
        let connect = this.connects[vertexNo];

        if (connect !== null) {
            if (targetNode instanceof PointNode) {
                return connect.node === targetNode;
            } else if (targetNode instanceof OctaNode) {
                return connect.node === targetNode && connect.vertexNo === targetVertexNo;
            }
        }

        return false;
    }

    /**
     * 接続済みのノードか
     *
     * @param targetNode
     * @returns {boolean}
     */
    isConnectedNode(targetNode)
    {
        return this.connects.some(connect => {
            return connect !== null && connect.node === targetNode;
        });
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
        if (!this.forceDraw) {
            const hgn = HorrorGameNetwork.getInstance();

            const drawTop = this.vertices[Param.LTT].y + offsetY;
            const drawBottom = this.vertices[Param.LBB].y + offsetY;
            if (drawBottom < hgn.getScrollY() - 100) {
                return;
            }
            if (drawTop > hgn.getScrollY() + window.innerHeight +100) {
                return;
            }
        }

        this.setShapePath(ctx, offsetX, offsetY);
        ctx.stroke();
        ctx.fill();
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
        if (w <= 20) {
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

/**
 * 背景2用の八角形ノード
 */
export class Bg2OctaNode extends OctaNode
{
    /**
     * コンストラクタ
     *
     * @param parent
     * @param vertexNo
     * @param offsetX
     * @param offsetY
     * @param w
     * @param h
     * @param notchSize
     * @param nearVertexNo
     */
    constructor(parent, vertexNo, offsetX, offsetY, w, h, notchSize, nearVertexNo)
    {
        let x = parent.x;
        let y = parent.y;
        if (parent instanceof OctaNode) {
            x = parent.vertices[vertexNo].x;
            y = parent.vertices[vertexNo].y;
        }

        super(x + offsetX, y + offsetY, w, h, notchSize);
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        if (nearVertexNo === null) {
            nearVertexNo = this.getNearVertexNo(parent);
        }
        this.connection = new Bg2Connect(parent, vertexNo, nearVertexNo);
        this.drawOffsetY = 0;

        if (this.connection.node.y > window.innerHeight) {
            let distance = this.connection.node.y - (window.innerHeight / 2);
            this.drawOffsetY = distance - (distance / Param.BG2_SCROLL_RATE);
        }

        if (this.w > 0 && this.h > 0 && this.notchSize > 0) {
            this.setOctagon();
        }

        this.depth = 0;
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        super.delete();
        this.connection.delete();
        this.connection = null;
    }

    /**
     * 再ロード（再配置）
     */
    reload()
    {
        super.reload(this.connection.getVertex().x + this.offsetX,
            this.connection.getVertex().y + this.offsetY, this.w, this.h);
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
        // ctx.fillStyleを未設定にする
        ctx.fillStyle = "rgba(0, 0, 0, 0)";

        super.draw(ctx, offsetX, offsetY);
    }
}

/**
 * DOMの要素サイズに合わせて配置するノード
 */
export class DOMNode extends OctaNode
{
    /**
     * DOMノードを生成
     *
     * @param containerDOM
     * @param containerWidth
     * @param containerHeight
     * @param id
     * @param html
     * @param x
     * @param y
     * @returns {DOMNode}
     */
    static create(containerDOM, containerWidth, containerHeight, id, html, x, y)
    {
        let DOM = document.createElement('div');
        DOM.innerHTML = html;
        DOM.classList.add('dom-node');

        containerDOM.appendChild(DOM);

        DOM.style.left = `${(containerWidth / 2) + x - DOM.offsetWidth / 2}px`;
        DOM.style.top = `${(containerHeight / 2) + y - DOM.offsetHeight / 2}px`;

        return new DOMNode(DOM, 13, id);
    }

    /**
     * コンストラクタ
     *
     * @param DOM
     * @param notchSize
     * @param id
     */
    constructor(DOM, notchSize, id = null)
    {
        super(DOM.offsetLeft, DOM.offsetTop, DOM.offsetWidth, DOM.offsetHeight, notchSize);

        this.id = id;
        this.DOM = DOM;

        // DOMからdata-subを取得
        if ('sub' in this.DOM.dataset) {
            this.subNetworkSize = this.DOM.dataset.sub;
        } else {
            this.subNetworkSize = 'n';
        }

        this.subNetwork = null;
        this.animFunc = null;
        this.skipAnim = false;
    }

    /**
     * サブネットワークの生成
     */
    createRandomSubNetwork()
    {
        if (this.subNetworkSize === 'n') {
            return;
        }
        let network = new Bg2Network(this);
        let maxDepth = 1;
        let appearRate = 0;
        switch (this.subNetworkSize) {
            case 's': maxDepth = 1; appearRate = 20; break;
            case 'm': maxDepth = 2; appearRate = 30; break;
            case 'l': maxDepth = 3; appearRate = 70; break;
        }

        let pattern = 1;//Math.floor((Math.random() * 2)) + 1;
        switch (pattern) {
            case 1:
                this.addRandomNodePatter1(network, this, maxDepth, appearRate);
                break;
        }

        this.subNetwork = network;
    }

    /**
     * サブネットワークのパターン1を生成
     *
     * @param network
     * @param node
     * @param maxDepth
     * @param appearRate
     */
    addRandomNodePatter1(network, node, maxDepth, appearRate)
    {
        let forceVertex = Util.getRandomInt(Param.LTT, Param.LLT);

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
     * 再配置
     */
    reload()
    {
        super.reload(this.DOM.offsetLeft, this.DOM.offsetTop, this.DOM.offsetWidth, this.DOM.offsetHeight);
    }

    /**
     * テキストのフェードイン
     */
    fadeInText()
    {
        if (this.DOM.classList.contains('fade')) {
            this.DOM.classList.remove('fade-in-text', 'fade-out-text');
            this.DOM.classList.add('fade-in-text');
        }

        this.DOM.querySelectorAll('.fade').forEach((e) => {
            e.classList.remove('fade-in-text', 'fade-out-text');
            e.classList.add('fade-in-text');
        });
    }

    /**
     * フェードインせずにテキストを表示
     */
    showText()
    {
        if (this.DOM.classList.contains('fade')) {
            this.DOM.classList.remove('fade-in-text', 'fade-out-text');
            this.DOM.classList.add('show-text');
        }

        this.DOM.querySelectorAll('.fade').forEach((e) => {
            e.classList.remove('fade-in-text', 'fade-out-text');
            e.classList.add('show-text');
        });
    }

    /**
     * テキストのフェードアウト
     */
    fadeOutText()
    {
        if (this.DOM.classList.contains('fade')) {
            this.DOM.classList.remove('show-text');
            this.DOM.classList.add('fade-out-text');
        }

        this.DOM.querySelectorAll('.fade').forEach((e) => {
            e.classList.remove('show-text');
            e.classList.add('fade-out-text');
        });
    }

    /**
     * テキストのフェードイン
     */
    hideText()
    {
        if (this.DOM.classList.contains('fade')) {
            this.DOM.classList.remove('fade-in-text', 'fade-out-text', 'show-text');
        }

        this.DOM.querySelectorAll('.fade').forEach((e) => {
            e.classList.remove('fade-in-text', 'fade-out-text', 'show-text');
        });
    }

    /**
     * 更新
     */
    update()
    {
        if (this.animFunc !== null) {
            this.animFunc();
        }
    }

    isSkipAnim()
    {
        const hgn = HorrorGameNetwork.getInstance();
        let rect = this.DOM.getBoundingClientRect();

        // 表示領域外にある場合はアニメーションをスキップ
        if (hgn.getScrollY() - 100 > this.y + this.h || hgn.getScrollY() + window.innerHeight + 100 < this.y) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 出現
     */
    appear()
    {
        this.animFunc = this.appearAnimation;
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
    }

    /**
     * 出現済み状態
     */
    appeared()
    {

    }

    /**
     * 消える
     */
    disappear()
    {
        this.animFunc = this.disappearAnimation;
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
    }
}

/**
 * テキストノード
 */
export class TextNode extends DOMNode
{
    /**
     * コンストラクタ
     *
     * @param DOM
     */
    constructor(DOM)
    {
        let notchSize = 16;
        // smallクラスがDOMのクラスリストに含まれている場合はnotchSizeを小さくする
        if (DOM.classList.contains('small')) {
            notchSize = 8;
        }

        super(DOM, notchSize);
        this.alpha = 0;

        if (DOM.classList.contains('text-node-a')) {
            this.backColor = "100,30,20";
        } else if (DOM.classList.contains('text-node-z')) {
            this.backColor = "30,5,0";
        } else {
            this.backColor = "0,30,0";
        }
    }

    /**
     * 描画
     *
     * @param ctx
     */
    draw(ctx)
    {
        super.setShapePath(ctx);

        ctx.lineWidth = 1; // 線の太さ
        ctx.lineJoin = "miter"; // 線の結合部分のスタイル
        ctx.lineCap = "butt"; // 線の末端のスタイル
        ctx.shadowColor = "black"; // 影の色
        ctx.shadowBlur = 0; // 影のぼかし効果

        ctx.fillStyle = "rgba(" + this.backColor + "," + this.alpha + ")";
        ctx.fill();
    }

    /**
     * 出現
     */
    appear()
    {
        if (this.isSkipAnim()) {
            this.appeared();
        } else {
            super.appear();
            this.alpha = 0;
        }
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        if (window.hgn.animCnt < 10) {
        } else if (window.hgn.animCnt === 10) {
            this.fadeInText();
        } else if (window.hgn.animCnt < 25) {
            this.alpha = Util.getMidpoint(0, 0.6, (window.hgn.animCnt - 10) / 15);
        } else if (window.hgn.animCnt === 25) {
            this.alpha = 0.6;
            this.animFunc = null;
        }
    }

    appeared()
    {
        this.alpha = 0.6;
        this.showText();
    }

    /**
     * 消える
     */
    disappear()
    {
        if (!this.isSkipAnim()) {
            super.disappear();
            this.fadeOutText();
        } else {
            this.alpha = 0;
            this.hideText();
        }
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
        if (window.hgn.animCnt < 15) {
            this.alpha = Util.getMidpoint(0, 0.6, 1 - (window.hgn.animCnt - 10) / 15);
        } else if (window.hgn.animCnt === 15) {
            this.alpha = 0.0;
            this.animFunc = null;
        }
    }
}
