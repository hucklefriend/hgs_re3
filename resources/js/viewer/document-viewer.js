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

            // TODO: ポップアップはHorrorGameNetwork側へ渡す

            // windowタイトルの変更
            if (this.dataCache.title) {
                document.title = this.dataCache.title;
            }

            // 戻るで来てなければURLを更新
            if (!(this.dataCache.isBack ?? false)) {
                window.history.pushState({type: this.TYPE, title: this.dataCache.title}, null, this.dataCache.url);
            }

            this.dataCache = null;

            // すべての画像リソース読み込み完了後に再配置
            window.hgn.waitForImages(this.mainDOM).then(() => {
                this.resize();
                window.hgn.setDrawMain(true);
            });
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
        this.reloadNodes();
        this.updateViewRect();
    }

    /**
     * Windowサイズ変更などによるNodeの再読取り
     */
    reloadNodes()
    {
        if (this._entranceNode) {
            this._entranceNode.reload();
        }

        this._domNodes.forEach(node => {
            node.reload();
        });

        this._hrList.forEach(hr => {
            hr.reload();
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
     */
    scroll()
    {
        if (this.scrollMode === DocumentViewer.SCROLL_MODE_SCROLLER) {
            this.scrollX = this.scrollModeStartPosX + (window.scrollX / 3);
            this.scrollY = this.scrollModeStartPosY + (window.scrollY / 3);

            this.DOM.scrollTo(this.scrollX, this.scrollY);
            window.hgn.canvasContainer.scrollTo(this.scrollX, this.scrollY);
        } else {
            this.scrollX = window.scrollX;
            this.scrollY = window.scrollY;
        }

        window.hgn.background.scroll(this.scrollX, this.scrollY);

        this.updateViewRect();
    }

    /**
     * 指定位置へスクロール
     * 
     * @param {*} x 
     * @param {*} y 
     */
    scrollTo(x, y)
    {
        this.scrollX = x;
        this.scrollY = y;
        this.DOM.scrollTo(x, y);
        window.hgn.canvasContainer.scrollTo(x, y);
        window.hgn.background.scroll(this.scrollX, this.scrollY);
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
