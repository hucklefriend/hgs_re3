import { HorrorGameNetwork } from '../horror-game-network.js';
import { ContentLinkNode, ContentNode } from '../node/content-node.js';
import { Param } from '../common/param.js';
import { Util } from '../common/util.js';
/**
 * @type {HorrorGameNetwork}
 */
window.hgn;

/**
 * コンテンツビューア
 */
export class ContentViewer
{
    /**
     * タイプ
     */
    get TYPE()
    {
        return 'content';
    }
    
    
    static STATE_CLOSED = 0;
    static STATE_OPENED = 1;
    static STATE_OPENING = 10;
    static STATE_CLOSING = 20;

    static MODE_NORMAL = 1;
    static MODE_WARNING = 2;
    static MODE_ERROR = 3;

    /**
     * コンストラクタ
     */
    constructor()
    {
        this.state = ContentViewer.STATE_CLOSED;

        this.canvas = document.querySelector('#content-node-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.DOM = document.querySelector('#content-node');
        this.containerDOM = this.DOM.querySelector('#content-node-container');
        this.titleDOM = this.DOM.querySelector('#content-node-title');
        this.bodyDOM = this.DOM.querySelector('#content-node-body');
        this.footerDOM = this.DOM.querySelector('#content-node-footer');
        
        this.node = ContentNode.createFromDOM(this.DOM, 50);

        document.querySelectorAll('.content-node-close').forEach((close) => {
            close.addEventListener('click', () => {
                this.close();
            });
        });

        this.historyUrl = null;
        this.historyState = null;

        this.mode = ContentViewer.MODE_NORMAL;
        this.linkNode = null;
        this.animationFrame = 0;

        this.dataCache = null;
        this.contentLoaded = false;
        this.prevTitle = document.title;

        this.offsetX = 0;
        this.offsetY = 0;

        this._isDraw = false;
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        this.node.delete();
        this.node = null;
        this.canvas = null;
        this.ctx = null;
        this.DOM = null;
        this.titleDOM = null;
        this.bodyDOM = null;
        this.dataChache = null;
        this.linkNode = null;
    }

    /**
     * 描画するか
     */
    setDraw()
    {
        this._isDraw = true;
    }

    /**
     * 再配置
     */
    reload()
    {
        this.node.reload();

        this.canvas.width = this.DOM.offsetWidth;
        this.canvas.height = this.DOM.offsetHeight;

        const rect = this.DOM.getBoundingClientRect();
        this.offsetX = -rect.left;
        this.offsetY = -rect.top;
    }

    /**
     * 閉じているか
     *
     * @returns {boolean}
     */
    isClosed()
    {
        return this.state === ContentViewer.STATE_CLOSED;
    }

    /**
     * 開いているか
     *
     * @returns {boolean}
     */
    isOpened()
    {
        return this.state === ContentViewer.STATE_OPENED;
    }

    /**
     * データの設定
     *
     * @param data
     */
    setContent(data)
    {
        this.titleDOM.innerHTML = data.title;
        this.bodyDOM.innerHTML = data.body;
        document.title = data.documentTitle;
        this.mode = data.mode ?? ContentViewer.MODE_NORMAL;
        this.contentLoaded = true;

        this.containerDOM.classList.remove('hide');
        this.containerDOM.classList.add('show');

        this.reload();
    }

    /**
     * 開く
     *
     * @param linkNode
     */
    open(linkNode)
    {
        this.contentLoaded = false;
        this.linkNode = linkNode;
        this.state = ContentViewer.STATE_OPENING;
        this.openScrollY = window.scrollY;
        this.mode = ContentViewer.MODE_NORMAL;
        this.prevTitle = document.title;

        window.hgn.viewer.setContainerScrollMode(0, this.openScrollY);

        this.titleDOM.classList.remove('content-node-hide');
        this.bodyDOM.classList.remove('content-node-hide');
        this.footerDOM.classList.remove('content-node-hide');
        this.DOM.classList.remove('content-node-closed');

        this.reload();

        if (this.linkNode !== null) {
            this.linkNode.hide();
        }

        this.node.appear(this.linkNode);
        window.hgn.setDrawMain(true);
    }

    opened()
    {
        this.state = ContentViewer.STATE_OPENED;
    }

    /**
     * 閉じる
     */
    close(isPopState = false)
    {
        this.containerDOM.classList.remove('show');
        this.containerDOM.classList.add('hide');

        // 背景のスクロールを戻す
        if (window.hgn.viewer.scrollX !== this.openScrollX
            || window.hgn.viewer.scrollY !== this.openScrollY) {
            
            
        }

        this.node.disappear();
    }

    /**
     * 閉じる
     */
    closed(isPopState = false)
    {
        this.state = ContentViewer.STATE_CLOSED;
        this.titleDOM.innerHTML = '';
        this.bodyDOM.innerHTML = '';

        if (!isPopState) {
            if (this.historyUrl) {
                window.history.pushState(this.historyState, null, this.historyUrl);
                this.historyUrl = null;
                this.historyState = null;
            } else {
                window.history.pushState({type:'network', title:this.prevTitle}, null, window.baseUrl);
            }
        }

        this.titleDOM.classList.add('content-node-hide');
        this.bodyDOM.classList.add('content-node-hide');
        this.footerDOM.classList.add('content-node-hide');
        this.DOM.classList.add('content-node-closed');

        document.title = this.prevTitle;

        if (this.linkNode !== null) {
            this.linkNode.show();
            this.linkNode = null;
        }

        window.hgn.viewer.setBodyScrollMode(0, this.openScrollY);
        window.hgn.setDrawMain(true);
    }

    restoreScrollPosition(ratio)
    {
        const y = Util.getMidpoint(this.openScrollY, window.hgn.viewer.scrollY, ratio, true);
        
        window.hgn.viewer.scrollTo(window.hgn.viewer.scrollX, y);
    }

    /**
     * 更新
     */
    update()
    {
        if (this.isClosed()) {
            return;
        }

        this.node.update();
        
        if (this._isDraw) {
            // コンテンツノードはViewRectを使わない（常に全部描画）
            this.draw();
            this._isDraw = false;
        }
    }

    /**
     * ウィンドウサイズの変更
     */
    resize()
    {
        if (this.isClosed()) {
            return;
        }

        this.reload();
    }

    /**
     * 描画
     */
    draw()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // あらかじめ線のスタイルを設定
        //this.ctx.lineWidth = 3; // 線の太さ
        this.ctx.lineJoin = "round"; // 線の結合部分のスタイル
        this.ctx.lineCap = "round"; // 線の末端のスタイル
        this.ctx.shadowBlur = 5; // 影のぼかし効果

        // Set line color
        switch (this.mode) {
            case ContentViewer.MODE_ERROR:        // エラー表示
                this.ctx.strokeStyle = "rgba(180, 0, 0, 0.8)"; // 線の色と透明度
                this.ctx.shadowColor = "red"; // 影の色
                break;
            case ContentViewer.MODE_WARNING:      // ワーニング表示
                this.ctx.strokeStyle = "rgba(180, 180, 0, 0.8)";
                this.ctx.shadowColor = "yellow"; // 影の色
                break;
            case ContentViewer.MODE_NORMAL:       // 通常表示
                this.ctx.strokeStyle = "rgba(0, 180, 0, 0.8)";
                this.ctx.shadowColor = "lime"; // 影の色
                break;
        }

        this.node.draw(this.ctx, this.offsetX, 0);
    }

    /**
     * スクロール
     */
    scroll()
    {
        // let rect = this.DOM.getBoundingClientRect();
        // let y = rect.top + window.scrollY;
        //
        // // contentNodeDOMのy座標を現在のスクロール位置のy座標に設定
        // if (y > window.scrollY) {
        //     this.DOM.style.top = window.scrollY + 'px';
        // }
        // //this.DOM.style.top = -(this.DOM.offsetTop - window.scrollY) + 'px';
    }
}
