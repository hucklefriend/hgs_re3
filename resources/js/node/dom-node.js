import { Vertex } from '../common/vertex.js';
import { Rect } from '../common/rect.js';
import { Param } from '../common/param.js';
import { OctaNode } from './octa-node.js';
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

        this._animFunc = null;
        this._isInsideViewRect = false;

        DOM.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // イベントの伝播を停止
        });
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
        if (this._animFunc !== null) {
            this._animFunc();
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

    update()
    {
        if (this.animFunc !== null) {
            this.animFunc();
        }
    }

    isInsideViewRect(viewRect, ...viewRects)
    {

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

    draw(ctx, viewRect)
    {
        const [isDraw, left, top] = this.isDraw(viewRect);
        if (!isDraw) {
            return;
        }

        ctx.strokeStyle = "rgba(0, 100, 0, 0.8)";
        ctx.lineWidth = 1;
        ctx.shadowColor = "lime";
        ctx.shadowBlur = 5;

        ctx.fillStyle = "black";

        super.draw(ctx, left, top);
    }
}
