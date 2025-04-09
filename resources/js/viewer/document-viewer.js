import { HorrorGameNetwork } from '../horror-game-network.js';
import { ViewerBase } from './viewer-base.js';
import { SubOctaNode } from '../node/octa-node.js';
import { DOMNode } from '../node/dom-node.js';
import { TextNode } from '../node/text-node.js';
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
    /**
     * タイプ
     */
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

        // ドキュメント用DOM
        this.DOM = document.querySelector('#document');
        this.mainDOM = document.querySelector('#document > main');

        // ノード
        this._entranceNode = null;
        this._domNodes = [];

        // hr
        this._hrList = [];

        // スクロール挙動
        this.scrollMode = HorrorGameNetwork.SCROLL_MODE_BODY;
        this.scrollX = 0;
        this.scrollModeStartPosX = 0;
        this.scrollY = 0;
        this.scrollModeStartPosY = 0;
        this.lastScrollX = 0;  // 前回のスクロール位置X
        this.lastScrollY = 0;  // 前回のスクロール位置Y

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
     * 
     * @param {boolean} isRenderCache
     * @param {boolean} isBack
     */
    start(isRenderCache)
    {
        this.isWait = false;

        if (isRenderCache) {
            this.mainDOM.innerHTML = this.dataCache.document;

            // windowタイトルの変更
            if (this.dataCache.title) {
                document.title = this.dataCache.title;
            }

            // 戻るで来てなければURLを更新
            if (!(this.dataCache.isBack ?? false)) {
                window.history.pushState({type: this.TYPE, title: this.dataCache.title}, null, this.dataCache.url);
            }

            // コンポーネントの作成
            Object.keys(this.dataCache.components).forEach(key => {
                window.hgn.createComponent(key, this.dataCache.components[key]);
            });

            this.dataCache = null;

            // すべての画像リソース読み込み完了後に再配置
            window.hgn.waitForImages(this.mainDOM).then(() => {
                this.resize();
                window.hgn.setDrawMain(true);
            });
        }

        this.scrollMode = HorrorGameNetwork.SCROLL_MODE_BODY;
        this.scrollX = 0;
        this.scrollModeStartPosX = 0;
        this.scrollY = 0;
        this.scrollModeStartPosY = 0;
        this.lastScrollX = 0;  // 前回のスクロール位置X
        this.lastScrollY = 0;  // 前回のスクロール位置Y

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
            this._entranceNode = EntranceNode.createFromDOM(elem);
            this.addNodeIdHash('#entrance-node', this._entranceNode);
        }

        // テキストノード
        let elems = document.querySelectorAll('.text-node');
        elems.forEach(elem => {
            this._domNodes.push(TextNode.createFromDOM(elem));
            if (elem.id.length > 0) {
                this.addNodeIdHash(elem.id, this._domNodes[this._domNodes.length - 1]);
                this.loadConnection(elem, connections);
            }
        });

        // リンクノード
        elems = document.querySelectorAll('.link-node');
        elems.forEach(elem => {
            let newNode = LinkNode.createFromDOM(elem);
            this._domNodes.push(newNode);
            if (elem.id.length > 0) {
                this.addNodeIdHash(elem.id, newNode);
                this.loadConnection(elem, connections);
            }
        });

        // コンテンツリンクノード
        elems = document.querySelectorAll('.content-link-node');
        elems.forEach(elem =>  {
            let newNode = ContentLinkNode.createFromDOM(elem);
            this._domNodes.push(newNode);
            if (elem.id.length > 0) {
                this.addNodeIdHash(elem.id, newNode);
                this.loadConnection(elem, connections);
            }
        });

        // ポップアップリンクノード
        elems = document.querySelectorAll('.popup-link-node');
        elems.forEach(elem =>  {
            let newNode = PopupLinkNode(elem).createFromDOM(elem);
            this._domNodes.push(newNode);
            if (elem.id.length > 0) {
                this.addNodeIdHash(elem.id, newNode);
                this.loadConnection(elem, connections);
            }
        });

        // DOMノード
        elems = document.querySelectorAll('.dom-node');
        elems.forEach(elem =>  {
            let newNode = DOMNode.createFromDOM(elem);
            this._domNodes.push(newNode);
            if (elem.id.length > 0) {
                this.addNodeIdHash(elem.id, newNode);
                this.loadConnection(elem, connections);
            }
        });

        // H1ノード
        elems = document.querySelectorAll('.head1');
        elems.forEach(elem =>  {
            this._domNodes.push(Head1Node.createFromDOM(elem));
        });

        // H2ノード
        elems = document.querySelectorAll('.head2');
        elems.forEach(elem =>  {
            this._domNodes.push(Head2Node.createFromDOM(elem));
        });

        // H3ノード
        elems = document.querySelectorAll('.head3');
        elems.forEach(elem =>  {
            this._domNodes.push(Head3Node.createFromDOM(elem));
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
            this._hrList.push(new HR(hrElem));
        });

        this._height = this.DOM.clientHeight;
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
        let left = 0;
        if (this.scrollMode === DocumentViewer.SCROLL_MODE_SCROLLER) {
            left = this.DOM.getBoundingClientRect().left;
        }


        this.reloadNodes(left, 0);
        this.updateViewRect();
    }

    /**
     * Windowサイズ変更などによるNodeの再読取り
     * 
     * @param {number} left
     * @param {number} top
     */
    reloadNodes(left = 0, top = 0)
    {
        if (this._entranceNode) {
            this._entranceNode.reload(left, top);
        }

        this._domNodes.forEach(node => {
            node.reload(left, top);
        });

        this._hrList.forEach(hr => {
            hr.reload(left, top);
        });

        if (this.scrollMode === DocumentViewer.SCROLL_MODE_SCROLLER) {
            this._height = this.mainDOM.scrollHeight - window.innerHeight;
        } else {
            this._height = this.mainDOM.scrollHeight;
        }
    }

    /**
     * ノードのクリア
     */
    clearNodes()
    {
        if (this._entranceNode) {
            this._entranceNode.delete();
            this._entranceNode = null;
        }

        this._domNodes.forEach((domNode, i) => {
            domNode.delete();
            this._domNodes[i] = null;
        });
        this._domNodes = [];

        this._hrList.forEach((hr, i) => {
            hr.delete();
            this._hrList[i] = null;
        });
        this._hrList = [];

        super.clearNodes();
    }

    /**
     * スクロール
     * 
     * @param {boolean} isNewViewer
     */
    scroll(isNewViewer = false)
    {
        let newScrollX, newScrollY;

        if (this.scrollMode === DocumentViewer.SCROLL_MODE_SCROLLER) {
            newScrollX = this.scrollModeStartPosX + (window.scrollX / 3);
            newScrollY = this.scrollModeStartPosY + (window.scrollY / 3);

            this.DOM.scrollTo(newScrollX, newScrollY);
            window.hgn.canvasContainer.scrollTo(newScrollX, newScrollY);
        } else {
            newScrollX = window.scrollX;
            newScrollY = window.scrollY;
        }

        if (!isNewViewer) {
            // 前回位置からの差分を計算して相対スクロール
            const deltaX = newScrollX - this.lastScrollX;
            const deltaY = newScrollY - this.lastScrollY;
            
            if (deltaX !== 0 || deltaY !== 0) {
                window.hgn.background.scrollBy(deltaX, deltaY);
            }
        }

        // 現在位置を更新
        this.scrollX = newScrollX;
        this.scrollY = newScrollY;
        this.lastScrollX = newScrollX;
        this.lastScrollY = newScrollY;

        this.updateViewRect();
    }

    /**
     * 指定位置へスクロール
     * 
     * @param {number} x 
     * @param {number} y 
     */
    scrollTo(x, y)
    {
        // 前回位置からの差分を計算
        const deltaX = x - this.lastScrollX;
        const deltaY = y - this.lastScrollY;

        this.scrollX = x;
        this.scrollY = y;
        this.lastScrollX = x;
        this.lastScrollY = y;

        this.DOM.scrollTo(x, y);
        window.hgn.canvasContainer.scrollTo(x, y);
        window.hgn.background.scrollBy(deltaX, deltaY);
        this.updateViewRect();
        window.hgn.setDrawSub();
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
        this.DOM.classList.remove('self-scroll');
        window.hgn.canvasContainer.classList.remove('self-scroll');
        window.scrollTo(x, y);

        document.querySelectorAll('.scroller-pad').forEach((pad) => {
            pad.style.display = 'none';
        });
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
        this.DOM.classList.add('self-scroll');
        window.hgn.canvasContainer.classList.add('self-scroll');

        // スクロール位置をリセット
        window.scrollTo(x, 0);
        this.DOM.scrollTo(x, y);
        window.hgn.canvasContainer.scrollTo(x, y);
        this.scrollModeStartPosX = x;
        this.scrollModeStartPosY = y;
        this.scroll();
        window.hgn.setCanvasSize(); 

        document.querySelectorAll('.scroller-pad').forEach((pad) => {
            pad.style.display = 'block';
            pad.style.height = '100vh';
        });
    }

    /**
     * ViewRectの更新
     */
    updateViewRect()
    {
        this.viewRect.left = this.scrollX;
        this.viewRect.right = this.scrollX + window.innerWidth;
        this.viewRect.top = this.scrollY;
        this.viewRect.bottom = this.scrollY + window.innerHeight;

        this.viewRect.calcSize();
    }

    /**
     * 描画
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @param {boolean} isDrawOutsideView
     */
    draw(ctx, isDrawOutsideView = false)
    {
        const offsetX = isDrawOutsideView ? 0 : -this.viewRect.left;
        const offsetY = isDrawOutsideView ? 0 : -this.viewRect.top;

        this.drawNodes(ctx, offsetX, offsetY, isDrawOutsideView);

        this._hrList.forEach(hr => {
            hr.draw(ctx, offsetX, offsetY, isDrawOutsideView);
        });
    }

    /**
     * ノードの描画
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} offsetX
     * @param {number} offsetY
     * @param {boolean} isDrawOutsideView
     */
    drawNodes(ctx, offsetX, offsetY, isDrawOutsideView)
    {
        if (this._entranceNode) {
            this._entranceNode.draw(ctx, offsetX, offsetY, isDrawOutsideView);
        }

        this._domNodes.forEach(node => {
            node.draw(ctx, offsetX, offsetY, isDrawOutsideView);
        });
    }

    /**
     * サブ描画
     * 
     * @param {CanvasRenderingContext2D} ctx
     */
    drawSub(ctx)
    {
        if (this._entranceNode) {
            this._entranceNode.drawSub(ctx, this.viewRect);
        }
/*
        this._domNodes.forEach(node => {
            node.drawSub(ctx, this.viewRect);
        });
*/
    }

    /**
     * 更新
     */
    update()
    {
        if (this._entranceNode) {
            this._entranceNode.update(this.viewRect);
        }

        this._domNodes.forEach(node => {
            node.update(this.viewRect);
        });
        this._hrList.forEach(hr => {
            hr.update(this.viewRect);
        });
    }

    /** 
     * サブ描画更新
     */
    updateSub()
    {
        if (this._entranceNode) {
            this._entranceNode.updateSub(this.viewRect, window.hgn.subNetworkViewer.viewRect);
        }

        this._domNodes.forEach(node => {
            node.updateSub(this.viewRect, window.hgn.subNetworkViewer.viewRect);
        });
    }

    /**
     * 出現
     */
    appear()
    {
        this.resetNodeCnt();
        this.edgeScale = 0;

        this._domNodes.forEach(node => {
            node.appear();
        });
        this._hrList.forEach(hr => {
            hr.appear();
        });

        if (this._entranceNode) {
            this._entranceNode.appear();
        }
    }

    /**
     * 消失
     */
    disappear()
    {
        this._domNodes.forEach(node => {
            node.disappear();
        });
        this._hrList.forEach(hr => {
            hr.disappear();
        });

        if (this._entranceNode) {
            this._entranceNode.disappear();
        }
    }

    /**
     * 高さを取得
     */
    get height()
    {
        return this._height;
    }
}
