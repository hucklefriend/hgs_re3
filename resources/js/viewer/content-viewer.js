import { HorrorGameNetwork } from '../horror-game-network.js';
import { ContentLinkNode, ContentNode } from '../node/content-node.js';
import { Param } from '../common/param.js';
/**
 * @type {HorrorGameNetwork}
 */
window.hgn;

/**
 * コンテンツビューア
 */
export class ContentViewer
{
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
        this.node = new ContentNode();

        this.state = ContentViewer.STATE_CLOSED;

        this.canvas = document.querySelector('#content-node-canvas');
        this.ctx = this.canvas.getContext('2d');

        // あらかじめ線のスタイルを設定
        this.ctx.lineWidth = 3; // 線の太さ
        this.ctx.lineJoin = "round"; // 線の結合部分のスタイル
        this.ctx.lineCap = "round"; // 線の末端のスタイル
        this.ctx.shadowBlur = 5; // 影のぼかし効果

        this.DOM = document.querySelector('#content-node');
        this.containerDOM = this.DOM.querySelector('#content-node-container');
        this.titleDOM = this.DOM.querySelector('#content-node-title');
        this.bodyDOM = this.DOM.querySelector('#content-node-body');
        this.blurDOM = document.querySelector('#content-node-blur');

        this.node = new ContentNode(this.DOM);

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

        this.dataChache = null;
        this.contentLoaded = false;
        this.prevTitle = document.title;
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
     * 再配置
     */
    reload()
    {
        this.node.reload(3, 3, this.containerDOM.offsetWidth - 6, this.containerDOM.offsetHeight - 6);

        this.canvas.width = this.containerDOM.offsetWidth;
        this.canvas.height = this.containerDOM.offsetHeight;
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
     * 開く
     *
     * @param linkNode
     */
    open(linkNode)
    {
        this.reload();
        this.setOctagon();
        this.linkNode = linkNode;
        this.state = ContentViewer.STATE_OPENING;
        this.openScrollY = window.scrollY;
        this.mode = ContentViewer.MODE_NORMAL;
        this.prevTitle = document.title;

        window.hgn.setContainerScrollMode(0, this.openScrollY);

        this.animationFrame = 0;
        if (this.linkNode !== null) {
            this.linkNode.startAnimation();
        }

        this.DOM.classList.add('content-node-hide', 'content-node-opened');
        this.DOM.classList.remove('content-node-closed');
    }

    /**
     * データの設定
     *
     * @param data
     */
    setContent(data)
    {
        this.dataChache = data;
        this.contentLoaded = true;
    }

    /**
     * オープンアニメーション
     */
    opening()
    {
        if (this.linkNode === null) {
            // リンクノードがないなら一気にオープン
            this.state = ContentViewer.STATE_OPENED;
            this.DOM.classList.remove('content-node-hide');
            this.blurDOM.style.display = 'block';
        } else {
            this.animationFrame++;

            if (this.animationFrame <= 9) {
                this.linkNode.animation(this, this.animationFrame);
            } else {
                this.state = ContentViewer.STATE_OPENED;
                this.linkNode.endAnimation();
                this.linkNode.hide();
                this.DOM.classList.remove('content-node-hide');
                this.blurDOM.style.display = 'block';
            }
        }
    }

    /**
     * 閉じる
     */
    close(isPopState = false)
    {
        this.state = ContentViewer.STATE_CLOSING;
        this.blurDOM.style.display = 'none';
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

        this.DOM.classList.add('content-node-hide');
        if (this.linkNode === null) {
            this.animationFrame = 0;
        } else {
            this.animationFrame = 10;
            this.linkNode.startAnimation();
        }

        document.title = this.prevTitle;
    }

    /**
     * 閉じてる最中
     *
     * @returns {boolean}
     */
    closing()
    {
        this.animationFrame--;

        if (this.animationFrame > 0) {
            // 縮小アニメーション
            this.linkNode.animation(this, this.animationFrame);
        } else {
            this.state = ContentViewer.STATE_CLOSED;
            if (this.linkNode !== null) {
                this.linkNode.endAnimation();
                this.linkNode.setOctagon();
                this.linkNode.show();
            }

            window.hgn.setBodyScrollMode(0, this.openScrollY);
            this.DOM.classList.add('content-node-closed');
            this.DOM.classList.remove('content-node-opened');
        }
    }

    /**
     * 更新
     */
    update()
    {
        if (this.state === ContentViewer.STATE_OPENING) {
            isDraw = this.opening();
            window.hgn.setDrawMain();
        } else if (this.state === ContentViewer.STATE_CLOSING) {
            this.closing();
            window.hgn.setDrawMain();
        } else if (this.state === ContentViewer.STATE_OPENED) {
            if (this.dataChache !== null) {
                if (this.dataChache.hasOwnProperty('mode')) {
                    this.mode = this.dataChache.mode;
                }

                this.titleDOM.innerHTML = this.dataChache.title;
                this.bodyDOM.innerHTML = this.dataChache.body;
                document.title = this.dataChache.documentTitle;
                this.dataChache = null;
            }
        }
    }

    /**
     * ウィンドウサイズの変更
     */
    resize()
    {
        if (this.isOpened()) {
            this.reload();
            this.drawFrame();
        }
    }

    /**
     * フレームを描画
     * フレームはアニメーションしないので、update外でも呼び出される
     */
    drawFrame()
    {
        super.setShapePath(this.ctx, 0, 0);

        // Set line color
        if (this.mode === ContentViewer.MODE_ERROR) {
            this.ctx.strokeStyle = "rgba(180, 0, 0, 0.8)"; // 線の色と透明度
            this.ctx.shadowColor = "red"; // 影の色
        } else if (this.mode === ContentViewer.MODE_WARNING) {
            this.ctx.strokeStyle = "rgba(180, 180, 0, 0.8)";
            this.ctx.shadowColor = "yellow"; // 影の色
        } else {
            this.ctx.strokeStyle = "rgba(0, 180, 0, 0.8)";
            this.ctx.shadowColor = "lime"; // 影の色
        }

        this.ctx.stroke();
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
