import { Vertex } from '../common/vertex.js';
import { Rect } from '../common/rect.js';
import { Param } from '../common/param.js';
import { PointNode, SubPointNode } from './point-node.js';
import { OctaNodeConnect, PointNodeConnect, SubConnect } from './connect.js';
import { Util } from "../common/util.js";
import { SubNetwork } from "../network/sub-network.js";
import { HorrorGameNetwork } from '../horror-game-network.js';
/**
 * @type {HorrorGameNetwork}
 */
window.hgn;

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
        this.rect = new Rect();
        this.notchSize = notchSize;
        this.vertices = [];
        this.connects = new Array(8).fill(null);
        this.forceDraw = false;
        this.id = null;

        this.setRect();

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
        this.setRect();

        if (this.w > 0 && this.h > 0 && this.notchSize > 0) {
            this.setOctagon();
        }
    }

    /**
     * 矩形を設定
     */
    setRect()
    {
        this.rect.setRect(this.x, this.x + this.w, this.y, this.y + this.h);
    }

    /**
     * x, yが中央座標として短径を設定
     */
    setCenterRect()
    {
        let x = this.x - this.w / 2;
        let y = this.y - this.h / 2;
        this.rect.setRect(x, x + this.w, y, y + this.h);
    }

    /**
     * 八角形の頂点を設定
     */
    setOctagon()
    {
        this.vertices = [
            new Vertex(this.rect.left + this.notchSize, this.rect.top),
            new Vertex(this.rect.right - this.notchSize, this.rect.top),
            new Vertex(this.rect.right, this.rect.top + this.notchSize),
            new Vertex(this.rect.right, this.rect.bottom - this.notchSize),
            new Vertex(this.rect.right - this.notchSize, this.rect.bottom),
            new Vertex(this.rect.left + this.notchSize, this.rect.bottom),
            new Vertex(this.rect.left, this.rect.bottom - this.notchSize),
            new Vertex(this.rect.left, this.rect.top + this.notchSize),
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
        this.setRect();
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
     * @param {Rect|null}viewRect
     */
    draw(ctx, offsetX = 0, offsetY = 0, viewRect = null)
    {
        if (viewRect !== null) {
            // 表示領域外にあったら描画しない
            const drawLeft = this.vertices[Param.LLT].x + offsetX;
            const drawRight = this.vertices[Param.RRB].x + offsetX;
            const drawTop = this.vertices[Param.LTT].y + offsetY;
            const drawBottom = this.vertices[Param.LBB].y + offsetY;

            if (drawRight < viewRect.left - Param.VIEW_RECT_MARGIN) {
                return;
            }
            if (drawLeft > viewRect.right + Param.VIEW_RECT_MARGIN) {
                return;
            }
            if (drawBottom < viewRect.top - Param.VIEW_RECT_MARGIN) {
                return;
            }
            if (drawTop > viewRect.bottom + Param.VIEW_RECT_MARGIN) {
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

    /**
     * verticesのオブジェクトに変換
     */
    toObj()
    {
        return {
            type: 'octa',
            vertices: [
                this.vertices[0].toObj(),
                this.vertices[1].toObj(),
                this.vertices[2].toObj(),
                this.vertices[3].toObj(),
                this.vertices[4].toObj(),
                this.vertices[5].toObj(),
                this.vertices[6].toObj(),
                this.vertices[7].toObj(),
            ],
        };
    }

    /**
     * verticesのオブジェクトに変換
     */
    toPosObj()
    {
        return {
            vertices: [
                this.vertices[0].toObj(),
                this.vertices[1].toObj(),
                this.vertices[2].toObj(),
                this.vertices[3].toObj(),
                this.vertices[4].toObj(),
                this.vertices[5].toObj(),
                this.vertices[6].toObj(),
                this.vertices[7].toObj(),
            ],
        };
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
     * @param id
     * @param html
     * @param x
     * @param y
     * @param {Vertex}screenOffset
     * @returns {DOMNode}
     */
    static create(containerDOM, id, html, x, y, screenOffset)
    {
        let DOM = document.createElement('div');
        DOM.innerHTML = html;
        DOM.classList.add('dom-node');

        containerDOM.appendChild(DOM);

        DOM.style.left = `${x + screenOffset.x}px`;
        DOM.style.top = `${y + screenOffset.y}px`;

        return new this(id, x, y, DOM);
    }

    /**
     * DOMからインスタンスを生成
     *
     * @param containerDOM
     * @param DOM
     * @param notchSize
     * @returns {DOMNode}
     */
    static createFromDOM(containerDOM, DOM, notchSize = 13)
    {
        return new this(DOM.id, DOM.offsetLeft, DOM.offsetTop, DOM, notchSize);
    }

    /**
     * DOMから配置情報を取得
     *
     * @param containerDOM
     * @param DOM
     * @returns {Vertex}
     */
    static getPosByDOM(containerDOM, DOM)
    {
        let containerRect = containerDOM.getBoundingClientRect();
        let rect = DOM.getBoundingClientRect();

        return new Vertex(
            (containerRect.width / 2) - rect.left - containerRect.left + rect.width / 2,
            (containerRect.height / 2) - rect.top - containerRect.top + rect.height / 2
        );
    }

    /**
     * コンストラクタ
     *
     * @param id
     * @param x
     * @param y
     * @param DOM
     * @param notchSize
     */
    constructor(id, x, y, DOM, notchSize = 13)
    {
        if (DOM.classList.contains('small')) {
            notchSize = 8;
        }

        super(x, y, DOM.offsetWidth, DOM.offsetHeight, notchSize);

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

        this.center = new Vertex(this.x + this.w / 2, this.y + this.h / 2);
    }

    /**
     * サブネットワークの生成
     */
    createSubNetwork()
    {
        if (this.subNetworkSize === 'n') {
            return;
        }
        let network = new SubNetwork(this);
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
            case 99:
                this.addRandomNodePatterTest(network, this, maxDepth, appearRate);
                break;

        }

        this.subNetwork = network;
        this.subNetwork.postAdd();
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

    /**
     * サブネットワークのテストパターンを生成
     *
     * @param network
     * @param node
     * @param maxDepth
     * @param appearRate
     */
    addRandomNodePatterTest(network, node, maxDepth, appearRate)
    {
        network.addOctaNode(node, Param.LLT, 101, -100, -100, 30);
        network.addOctaNode(node, Param.RRB, 102, 100, 100, 30);
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
        super.reload(
            this.DOM.offsetLeft,
            this.DOM.offsetTop,
            this.DOM.offsetWidth,
            this.DOM.offsetHeight
        );

        this.center = new Vertex(this.x + this.w / 2, this.y + this.h / 2);

        if (this.subNetwork !== null) {
            this.subNetwork.reload();
            this.subNetwork.postSetNodePos();
        }
    }

    /**
     * 表示位置の設定
     *
     * @param x
     * @param y
     * @param screenOffset
     */
    setPos(x, y, screenOffset)
    {
        this.x = x;
        this.y = y;
        this.DOM.style.left = `${x + screenOffset.x}px`;
        this.DOM.style.top = `${y + screenOffset.y}px`;

        this.reload();
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
        // TODO: mapにあったviewRectを使う
        return false;

        // let rect = this.DOM.getBoundingClientRect();

        // // 表示領域外にある場合はアニメーションをスキップ
        // if (window.hgn.viewer.getScrollY() - 100 > this.y + this.h || window.hgn.viewer.getScrollY() + window.innerHeight + 100 < this.y) {
        //     return true;
        // } else {
        //     return false;
        // }
    }

    /**
     * 出現
     */
    appear()
    {
        window.hgn.viewer.incrementNodeCnt();
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
        this.animFunc = null;
        window.hgn.viewer.addAppearedNode(this.id);
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

    disappeared()
    {
        this.animFunc = null;
        window.hgn.viewer.delAppearedNode(this.id);
    }

    isDraw(viewRect)
    {
        let left = 0;
        let top = 0;
        let isDraw = true;
        if (viewRect !== null) {
            if (!viewRect.overlapWith(this.rect)) {
                // 描画領域内に入っていないなら描画しない
                isDraw = false;
            }

            left = -viewRect.left;
            top = -viewRect.top;
        }

        return [isDraw, left, top];
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
     * @param id
     * @param x
     * @param y
     * @param DOM
     */
    constructor(id, x, y, DOM)
    {
        let notchSize = 16;
        // smallクラスがDOMのクラスリストに含まれている場合はnotchSizeを小さくする
        if (DOM.classList.contains('small')) {
            notchSize = 8;
        }

        super(id, x, y, DOM, notchSize);
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
     * @param {Rect}viewRect
     */
    draw(ctx, viewRect)
    {
        const [isDraw, left, top] = this.isDraw(viewRect);
        if (!isDraw) {
            return;
        }
        
        super.setShapePath(ctx, left, top);

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
        super.appear();
        this.alpha = 0;
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        if (window.hgn.animElapsedTime > 250) {
            this.animFunc = this.appearAnimation2;
            this.fadeInText();
        }
    }

    appearAnimation2()
    {
        this.fadeInText();

        const elapsedTime = window.hgn.animElapsedTime - 50;
        this.alpha = Util.getMidpoint(0, 0.6, elapsedTime / 100);
        if (this.alpha >= 0.6) {
            this.alpha = 0.6;
            this.appeared();
        }
    }

    appeared()
    {
        super.appeared();
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
            this.disappeared();
        }
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
        const elapsedTime = window.hgn.animElapsedTime - 50;
        this.alpha = Util.getMidpoint(0.6, 0, elapsedTime / 100);
        if (this.alpha <= 0) {
            this.disappeared();
        }
    }

    disappeared()
    {
        super.disappeared();
        this.alpha = 0;
        this.hideText();
    }
}

/**
 * サブネットワーク用の八角形ノード
 */
export class SubOctaNode extends OctaNode
{
    /**
     * コンストラクタ
     *
     * @param no
     * @param parent
     * @param vertexNo
     * @param offsetX
     * @param offsetY
     * @param w
     * @param h
     * @param notchSize
     * @param nearVertexNo
     */
    constructor(no, parent, vertexNo, offsetX, offsetY, w, h, notchSize, nearVertexNo)
    {
        let x = parent.x;
        let y = parent.y;
        if (parent instanceof OctaNode) {
            x = parent.vertices[vertexNo].x;
            y = parent.vertices[vertexNo].y;
        }

        super(x + offsetX, y + offsetY, w, h, notchSize);

        this.no = no;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        if (nearVertexNo === null) {
            nearVertexNo = this.getNearVertexNo(parent);
        }

        // 頂点によって距離が違うため、接続頂点を決めたところで親ノードとの位置を補正
        let moveX = this.x - this.vertices[nearVertexNo].x;
        let moveY = this.y - this.vertices[nearVertexNo].y;
        this.move(moveX, moveY);

        this.connection = new SubConnect(parent, vertexNo, nearVertexNo);

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
     * verticesのオブジェクトに変換
     */
    toObj()
    {
        let obj = super.toObj();
        obj.no = this.no;
        let connects = [];
        let no = -1;

        this.connects.forEach((connect, vertexNo) => {
            if (connect !== null && connect.type === Param.CONNECT_TYPE_INCOMING) {
                no = -1;
                if (connect.node instanceof SubOctaNode || connect.node instanceof SubPointNode) {
                    no = connect.node.no;
                }

                connects.push([vertexNo, no, connect.vertexNo]);
            }
        });

        obj.connects = connects;
        obj.depth = this.depth;
        obj.parentConnect = this.connection.toObj();

        return obj;
    }
}
