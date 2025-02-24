import { HorrorGameNetwork } from '../horror-game-network.js';
import { ViewerBase } from './viewer-base.js';
import { DOMNode, TextNode, SubOctaNode } from '../node/octa-node.js';
import { SubPointNode } from '../node/point-node.js';
import { LinkNode } from '../node/link-node.js';
import { EntranceNode } from '../node/entrance-node.js';
import { ContentLinkNode } from '../node/content-node.js';
import { Head1Node, Head2Node, Head3Node } from '../node/head-node.js';
import { PopupLinkNode } from '../node/popup-node.js';
import { Param } from '../common/param.js';
import { Util } from '../common/util.js';
import { HR } from './hr.js';
import { Rect } from '../common/rect.js';
/**
 * @type {HorrorGameNetwork}
 */
window.hgn;

/**
 * ドキュメントビューア
 */
export class DocumentViewer extends ViewerBase
{
    get TYPE()
    {
        return 'doc';
    }

    static SCROLL_MODE_BODY = 1;
    static SCROLL_MODE_SCROLLER = 2;

    static ANIMATION_MODE_NONE = 0;
    static ANIMATION_MODE_APPEAR = 1;
    static ANIMATION_MODE_DISAPPEAR = 2;

    /**
     * コンストラクタ
     */
    constructor()
    {
        super();

        this.mainDOM = document.querySelector('#document > div > main');

        // ノード
        this.entranceNode = null;
        this.domNodes = [];
        this.nodesIdHash = {};

        // hr
        this.hrList = [];

        this.isLoaded = false;

        this.edgeScale = 0;

        this.changeNetworkAppearTimer = null;

        // スクロール挙動
        this.scrollMode = HorrorGameNetwork.SCROLL_MODE_BODY;
        this.scroller = document.querySelector('#document > div');
        this.scrollX = 0;
        this.scrollModeStartPosX = 0;
        this.scrollY = 0;
        this.scrollModeStartPosY = 0;

        this.viewRect = new Rect(0, 0, 0, 0);

        this.isWait = false;
        this.dataCache = null;
    }

    /**
     * ビュー切り替えの準備
     */
    prepare(data)
    {
        this.dataCache = data;
        this.isWait = true;
    }

    /**
     * 開始
     */
    start(isRenderCache)
    {
        this.isWait = false;

        if (isRenderCache) {
            this.mainDOM.innerHTML = this.dataCache.document;

            // TODO: ポップアップはHorrorGameNetwork側へ渡す

            // windowタイトルの変更
            if (this.dataCache.title) {
                document.title = this.dataCache.title;
            }

            window.history.pushState({type:'document', title:this.dataCache.title}, null, this.dataCache.url);

            this.dataCache = null;
        }

        // ノードの読み取り
        this.loadNodes();
        this.scroll();
    }

    /**
     * 終了
     */
    end()
    {
        this.clearNodes();
        this.mainDOM.innerHTML = '';
    }

    /**
     * DOMからノードの読み取り
     */
    loadNodes()
    {
        let connections = [];

        // エントランスノード
        let elem = document.querySelector('#entrance-node');
        if (elem) {
            this.entranceNode = EntranceNode.createFromDOM(this.mainDOM, elem);
            this.nodesIdHash['#entrance-node'] = this.entranceNode;
        }

        // テキストノード
        let elems = document.querySelectorAll('.text-node');
        elems.forEach(elem => {
            this.domNodes.push(TextNode.createFromDOM(this.mainDOM, elem));
            if (elem.id.length > 0) {
                this.nodesIdHash[elem.id] = this.domNodes[this.domNodes.length - 1];
                this.loadConnection(elem, connections);
            }
        });

        // リンクノード
        elems = document.querySelectorAll('.link-node');
        elems.forEach(elem => {
            let newNode = LinkNode.createFromDOM(this.mainDOM, elem);
            this.domNodes.push(newNode);
            if (elem.id.length > 0) {
                this.nodesIdHash[elem.id] = newNode;
                this.loadConnection(elem, connections);
            }
        });

        // コンテンツリンクノード
        elems = document.querySelectorAll('.content-link-node');
        elems.forEach(elem =>  {
            let newNode = ContentLinkNode.createFromDOM(this.mainDOM, elem);
            this.domNodes.push(newNode);
            if (elem.id.length > 0) {
                this.nodesIdHash[elem.id] = newNode;
                this.loadConnection(elem, connections);
            }
        });

        // ポップアップリンクノード
        elems = document.querySelectorAll('.popup-link-node');
        elems.forEach(elem =>  {
            let newNode = PopupLinkNode(elem).createFromDOM(this.mainDOM, elem);
            this.domNodes.push(newNode);
            if (elem.id.length > 0) {
                this.nodesIdHash[elem.id] = newNode;
                this.loadConnection(elem, connections);
            }
        });

        // DOMノード
        elems = document.querySelectorAll('.dom-node');
        elems.forEach(elem =>  {
            let newNode = DOMNode.createFromDOM(this.mainDOM, elem);
            this.domNodes.push(newNode);
            if (elem.id.length > 0) {
                this.nodesIdHash[elem.id] = this.domNodes[this.domNodes.length - 1];
                this.loadConnection(elem, connections);
            }
        });

        // H1ノード
        elems = document.querySelectorAll('.head1');
        elems.forEach(elem =>  {
            this.domNodes.push(Head1Node.createFromDOM(this.mainDOM, elem));
        });

        // H2ノード
        elems = document.querySelectorAll('.head2');
        elems.forEach(elem =>  {
            this.domNodes.push(Head2Node.createFromDOM(this.mainDOM, elem));
        });

        // H3ノード
        elems = document.querySelectorAll('.head3');
        elems.forEach(elem =>  {
            this.domNodes.push(Head3Node.createFromDOM(this.mainDOM, elem));
        });

        // 接続の設定
        connections.forEach((c) => {
            let node1 = this.nodesIdHash[c[0]];
            let node2 = this.nodesIdHash[c[1]];
            if (node1 && node2) {
                node1.connect(null, node2);
            }
        });

        // HR
        let hrElems = document.querySelectorAll('hr');
        hrElems.forEach(hrElem =>  {
            this.hrList.push(new HR(hrElem));
        });

        this.isLoaded = true;
    }

    /**
     * メインネットワーク間のノード接続
     * 接続先のidの配列がdata-connectにJSON形式で入っている
     *
     * @param nodeElem
     * @param connections
     */
    loadConnection(nodeElem, connections)
    {
        if (nodeElem.dataset.connect) {
            // カンマ区切り文字列を配列に分解
            let connect = JSON.parse(nodeElem.dataset.connect);
            connect.forEach((c)=> {
                connections.push([nodeElem.id, c]);
            });
        }
    }

    /**
     * ウィンドウサイズの変更
     */
    resize()
    {
        this.reloadNodes();
        this.setViewRect();
    }

    /**
     * Windowサイズ変更などによるNodeの再読取り
     */
    reloadNodes()
    {
        if (this.entranceNode) {
            this.entranceNode.reload();
        }

        this.domNodes.forEach(node => {
            node.reload();
        });

        this.hrList.forEach(hr => {
            hr.reload();
        });

        this.isLoaded = true;
    }

    /**
     * ノードのクリア
     */
    clearNodes()
    {
        this.nodesIdHash = {};

        if (this.entranceNode) {
            this.entranceNode.delete();
            this.entranceNode = null;
        }

        this.domNodes.forEach((domNode, i) => {
            domNode.delete();
            this.domNodes[i] = null;
        });
        this.domNodes = [];

        this.hrList.forEach((hr, i) => {
            hr.delete();
            this.hrList[i] = null;
        });
        this.hrList = [];
    }

    /**
     * スクロール
     */
    scroll(force = false)
    {
        // if (!force && this.prevScrollX === window.scrollX &&
        //     this.prevScrollY === window.scrollY) {
        //     return;
        // }

        if (this.scrollMode === DocumentViewer.SCROLL_MODE_SCROLLER) {
            this.scrollX = this.scrollModeStartPosX + (window.scrollX / 3);
            this.scrollY = this.scrollModeStartPosY + (window.scrollY / 3);

            this.scroller.scrollTo(this.scrollX, this.scrollY);
        } else {
            this.scrollX = window.scrollX;
            this.scrollY = window.scrollY;
        }

        window.hgn.background.scroll(this.scrollX, this.scrollY);

        this.setViewRect();
    }

    /**
     * ViewRectの設定
     */
    setViewRect()
    {
        this.viewRect.left = this.scrollX;
        this.viewRect.right = this.scrollX + window.innerWidth;
        this.viewRect.top = this.scrollY;
        this.viewRect.bottom = this.scrollY + window.innerHeight;

        // スクロール時の描画遅延を考慮し、上下は少し余裕を持たせる
        // ドキュメントビューでは左右スクロールは基本発生しない想定
        // this.viewRect.top -= 30;
        // if (this.viewRect.top < 0) {
        //     this.viewRect.top = 0;
        // }
        // this.viewRect.bottom += 30;
        // if (this.viewRect.bottom > window.hgn.body.offsetHeight) {
        //     this.viewRect.bottom = window.hgn.body.offsetHeight;
        // }

        this.viewRect.calcSize();
    }

    /**
     * 描画
     */
    draw(ctx, isDrawOutsideView = false)
    {
        const viewRect = isDrawOutsideView ? null : this.viewRect;

        this.drawEdge(ctx, viewRect);
        this.drawNodes(ctx, viewRect);

        this.hrList.forEach(hr => {
            hr.draw(ctx, viewRect);
        });
    }

    /**
     * エッジの描画
     */
    drawEdge(ctx)
    {
        if (this.edgeScale === 0) {
            return;
        }

        let keys = Object.keys(this.nodesIdHash);
        if (keys.length > 0) {
            ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
            ctx.lineWidth = 1; // 線の太さ
            ctx.shadowColor = "lime"; // 影の色
            ctx.shadowBlur = 5; // 影のぼかし効果

            keys.forEach((key) => {
                let node = this.nodesIdHash[key];
                node.connects.forEach((connect, vertexNo) => {
                    if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING &&
                        !(connect.node instanceof SubOctaNode) && !(connect.node instanceof SubPointNode)){
                        let targetVertex = connect.getVertex();

                        ctx.beginPath();

                        let x1 = node.vertices[vertexNo].x;
                        let y1 = node.vertices[vertexNo].y;
                        let x2 = targetVertex.x;
                        let y2 = targetVertex.y;

                        let centerX = (x1 + x2) / 2;
                        let centerY = (y1 + y2) / 2;

                        // centerXとx1のthis.scaleに合わせた中間点
                        let midX1 = Util.getMidpoint(centerX, x1, this.edgeScale);
                        let midY1 = Util.getMidpoint(centerY, y1, this.edgeScale);
                        ctx.moveTo(midX1, midY1);

                        // centerXとx2のthis.scaleに合わせた中間点
                        let midX2 = Util.getMidpoint(centerX, x2, this.edgeScale);
                        let midY2 = Util.getMidpoint(centerY, y2, this.edgeScale);
                        ctx.lineTo(midX2, midY2);


                        // ctx.moveTo(node.vertices[vertexNo].x, node.vertices[vertexNo].y);
                        // ctx.lineTo(targetVertex.x, targetVertex.y);
                        ctx.stroke();
                    }
                });
            });
        }
    }

    /**
     * ノードの描画
     */
    drawNodes(ctx, viewRect)
    {
        if (this.entranceNode) {
            this.entranceNode.draw(ctx, viewRect);
        }

        this.domNodes.forEach(domNode => {
            domNode.draw(ctx, viewRect);
        });
    }

    /**
     * 更新
     */
    update()
    {
        if (this.entranceNode) {
            this.entranceNode.update();
        }

        this.domNodes.forEach(node => {
            node.update();
        });
        this.hrList.forEach(hr => {
            hr.update();
        });
    }

    /**
     * 出現
     */
    appear()
    {
        //this.animationMode = DocumentViewer.ANIMATION_MODE_APPEAR;
        this.resetNodeCnt();
        this.edgeScale = 0;

        this.domNodes.forEach(node => {
            node.appear();
        });
        this.hrList.forEach(hr => {
            hr.appear();
        });

        if (this.entranceNode) {
            this.entranceNode.appear();
        }

        // 0.2秒後に背景の描画を開始
        // this.changeNetworkAppearTimer = setTimeout(() => {
        //     this.setBodyScrollMode(0, 0);
        // }, 500);
    }

    /**
     * 消失
     */
    disappear()
    {
        this.domNodes.forEach(node => {
            node.disappear();
        });
        this.hrList.forEach(hr => {
            hr.disappear();
        });

        if (this.entranceNode) {
            this.entranceNode.disappear();
        }
    }

    /**
     * Bodyでスクロールさせるモード
     *
     * @param x
     * @param y
     */
    setBodyScrollMode(x, y)
    {
        this.scrollMode = DocumentViewer.SCROLL_MODE_BODY;
        this.scroller.classList.remove('self-scroll');
        window.scrollTo(x, y);
    }

    /**
     * 独自スクローラーでスクロールさせるモード
     *
     * @param x
     * @param y
     */
    setContainerScrollMode(x, y)
    {
        this.scrollMode = DocumentViewer.SCROLL_MODE_SCROLLER;
        this.scroller.classList.add('self-scroll');

        // スクロール位置をリセット
        window.scrollTo(x, 0);
        this.scroller.scrollTo(x, y);
        this.scrollModeStartPosX = x;
        this.scrollModeScrollPosX = x;
        this.scrollModeStartPosY = y;
        this.scrollModeScrollPosY = y;
    }
}
