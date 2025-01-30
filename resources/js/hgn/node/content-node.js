import {Vertex} from '../vertex.js';
import {Param} from '../param.js';
import {Network} from '../network.js';
import {DOMNode, OctaNode} from './octa-node.js';
import {LinkNode} from './link-node.js';
import {HorrorGameNetwork} from '../../hgn.js';

/**
 * コンテンツノードへのリンクノード
 */
export class ContentLinkNode extends LinkNode
{
    static STATE_CLOSED = 0;
    static STATE_OPENED = 1;

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
        super(id, x, y, DOM);

        this.state = ContentLinkNode.STATE_CLOSED;
        this.openScrollY = 0;

        this.url = null;
        const a = this.DOM.querySelector('a');
        if (a) {
            this.url = a.getAttribute('href');
            // aのクリックイベントを無効化
            a.addEventListener('click', (e) => e.preventDefault());
        }

        this.id = DOM.getAttribute('id');

        this.isAnimation = false;
        this.isHide = false;
        this.originalVertices = [...this.vertices];
        this.animationFrame = 0;
    }

    /**
     * マウスクリック
     */
    mouseClick()
    {
        if (this.url) {
            HorrorGameNetwork.getInstance()
                .openContentNode(this.url, this.id, false);
        }
    }

    /**
     * アニメーション開始
     */
    startAnimation()
    {
        this.isAnimation = true;
    }

    /**
     * アニメーション
     *
     * @param contentNode
     * @param frameCnt
     */
    animation(contentNode, frameCnt)
    {
        const hgn = HorrorGameNetwork.getInstance();
        let rect = contentNode.DOM.getBoundingClientRect();
        let rate = frameCnt / 10;

        for (let i = 0; i < 8; i++) {
            let cx = hgn.getScrollX() + contentNode.vertices[i].x + rect.left;
            let cy = hgn.getScrollY() + contentNode.vertices[i].y;

            this.vertices[i] = new Vertex(
                Math.ceil(this.originalVertices[i].x + ((cx - this.originalVertices[i].x) * rate)),
                Math.ceil(this.originalVertices[i].y + ((cy - this.originalVertices[i].y) * rate))
            );
        }
    }

    /**
     * アニメーション終了
     */
    endAnimation()
    {
        this.isAnimation = false;
        this.animationFrame = 0;
    }

    /**
     * 表示を消す
     */
    hide()
    {
        this.DOM.style.visibility = 'hidden';
        this.isHide = true;
    }

    /**
     * 表示する
     */
    show()
    {
        this.DOM.style.visibility = 'visible';
        this.isHide = false;
    }

    /**
     * 再配置
     */
    reload()
    {
        if (!this.isAnimation) {
            super.reload();
        }
    }

    /**
     * 描画
     *
     * @param ctx
     */
    draw(ctx)
    {
        if (!this.isHide || this.isAnimation) {
            super.draw(ctx, this.isAnimation ? 'rgba(0,0,0,0.5)' : 'black');
        }
    }
}

/**
 * コンテンツノード
 */
export class ContentNode extends OctaNode
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
     *
     * @param DOM
     */
    constructor(DOM)
    {
        // この時点では正しく作成しない
        super(0, 0, 0, 0, Param.CONTENT_NODE_NOTCH_SIZE);

        this.state = ContentNode.STATE_CLOSED;

        this.canvas = document.querySelector('#content-node-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.DOM = DOM;
        this.containerDOM = this.DOM.querySelector('#content-node-container');
        this.titleDOM = this.DOM.querySelector('#content-node-title');
        this.bodyDOM = this.DOM.querySelector('#content-node-body');
        this.blurDOM = document.querySelector('#content-node-blur');

        document.querySelectorAll('.content-node-close').forEach((close) => {
            close.addEventListener('click', () => {
                this.close();
            });
        });

        this.historyUrl = null;
        this.historyState = null;

        this.mode = ContentNode.MODE_NORMAL;
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
        super.delete();
        this.canvas = null;
        this.ctx = null;
        this.DOM = null;
        this.titleDOM = null;
        this.bodyDOM = null;
    }

    /**
     * 再配置
     */
    reload()
    {
        super.reload(3, 3, this.containerDOM.offsetWidth - 6, this.containerDOM.offsetHeight - 6);

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
        return this.state === ContentNode.STATE_CLOSED;
    }

    /**
     * 開いているか
     *
     * @returns {boolean}
     */
    isOpened()
    {
        return this.state === ContentNode.STATE_OPENED;
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
        this.state = ContentNode.STATE_OPENING;
        this.openScrollY = window.scrollY;
        this.mode = ContentNode.MODE_NORMAL;
        this.prevTitle = document.title;

        HorrorGameNetwork.getInstance().setContainerScrollMode(0, this.openScrollY);

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
            this.state = ContentNode.STATE_OPENED;
            this.DOM.classList.remove('content-node-hide');
            this.blurDOM.style.display = 'block';
            return true;
        } else {
            this.animationFrame++;

            if (this.animationFrame <= 9) {
                this.linkNode.animation(this, this.animationFrame);
            } else {
                this.state = ContentNode.STATE_OPENED;
                this.linkNode.endAnimation();
                this.linkNode.hide();
                this.DOM.classList.remove('content-node-hide');
                this.blurDOM.style.display = 'block';
                return true;
            }

            return false;
        }
    }

    /**
     * 閉じる
     */
    close(isPopState = false)
    {
        this.state = ContentNode.STATE_CLOSING;
        this.blurDOM.style.display = 'none';
        this.titleDOM.innerHTML = '';
        this.bodyDOM.innerHTML = '';

        // こうやっとけばメモリ節約になるかな？
        this.canvas.width = 1;
        this.canvas.height = 1;

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
            this.state = ContentNode.STATE_CLOSED;
            if (this.linkNode !== null) {
                this.linkNode.endAnimation();
                this.linkNode.setOctagon();
                this.linkNode.show();
            }

            HorrorGameNetwork.getInstance().setBodyScrollMode(0, this.openScrollY);
            this.DOM.classList.add('content-node-closed');
            this.DOM.classList.remove('content-node-opened');

            return true;
        }

        return false;
    }

    /**
     * 更新
     */
    update()
    {
        const hgn = HorrorGameNetwork.getInstance();
        let isDraw = false;

        if (this.state === ContentNode.STATE_OPENED) {
            isDraw = this.changeSize();
        }

        if (this.state === ContentNode.STATE_OPENING) {
            isDraw = this.opening();
            hgn.setRedraw();
        } else if (this.state === ContentNode.STATE_CLOSING) {
            this.closing();
            hgn.setRedraw();
        } else if (this.state === ContentNode.STATE_OPENED) {
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

        if (isDraw) {
            this.draw();
        }
    }

    /**
     * ウィンドウサイズの変更
     */
    changeSize()
    {
        if (this.isClosed()) {
            return false;
        }

        this.reload();

        return true;
    }

    /**
     * 描画
     */
    draw()
    {
        super.setShapePath(this.ctx, 0, 0);

        // Set line color
        if (this.mode === ContentNode.MODE_ERROR) {
            this.ctx.strokeStyle = "rgba(180, 0, 0, 0.8)"; // 線の色と透明度
            this.ctx.shadowColor = "red"; // 影の色
        } else if (this.mode === ContentNode.MODE_WARNING) {
            this.ctx.strokeStyle = "rgba(180, 180, 0, 0.8)";
            this.ctx.shadowColor = "yellow"; // 影の色
        } else {
            this.ctx.strokeStyle = "rgba(0, 180, 0, 0.8)";
            this.ctx.shadowColor = "lime"; // 影の色
        }

        this.ctx.lineWidth = 3; // 線の太さ
        this.ctx.lineJoin = "round"; // 線の結合部分のスタイル
        this.ctx.lineCap = "round"; // 線の末端のスタイル
        this.ctx.shadowBlur = 5; // 影のぼかし効果
        this.ctx.stroke();

        return true;
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
