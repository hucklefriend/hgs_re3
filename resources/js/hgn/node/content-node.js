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
     * @param DOM
     */
    constructor(DOM)
    {
        super(DOM);

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
    }

    /**
     * マウスクリック
     */
    mouseClick()
    {
        if (this.url) {
            HorrorGameNetwork.getInstance()
                .openContentNode(this.url, this.id);
        }
    }

    /**
     * データの取得
     *
     * @param url
     */
    fetch(url)
    {
        fetch(url, {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON形式のレスポンスを取得
        }).then((data) => {
            // データの取得が成功した場合の処理
            this.state = ContentNode.STATE_OPENED;
            const hgn = HorrorGameNetwork.getInstance();
            hgn.openContentNode(data);
            hgn.setRedraw();
        }).catch((error) => {
            // エラーが発生した場合の処理
            console.error('There was a problem with the fetch operation:');
            console.error(error);
        });
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

        document.querySelectorAll('.content-node-close').forEach((close) => {
            close.addEventListener('click', () => {
                this.close();
            });
        });

        this.historyUrl = null;
        this.historyState = null;

        this.mode = ContentNode.MODE_NORMAL;
        this.linkNodeId = null;
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
     * @param data
     * @param linkNodeId
     */
    open(data, linkNodeId)
    {
        this.linkNodeId = linkNodeId;
        this.state = ContentNode.STATE_OPENED;
        this.openScrollY = window.scrollY;
        this.mode = ContentNode.MODE_NORMAL;

        HorrorGameNetwork.getInstance().setContainerScrollMode(0, this.openScrollY);

        this.DOM.classList.add('content-node-opened');
        this.DOM.classList.remove('content-node-closed');

        this.draw();
    }

    setContent(data)
    {
        if (data.hasOwnProperty('mode')) {
            this.mode = data.mode;
        }

        this.titleDOM.innerHTML = data.title;
        this.bodyDOM.innerHTML = data.body;
    }

    /**
     * 閉じる
     */
    close(isPopState = false)
    {
        this.state = ContentNode.STATE_CLOSED;
        this.DOM.classList.add('content-node-closed');
        this.DOM.classList.remove('content-node-opened');
        //this.blurDOM.style.display = 'none';
        document.querySelector('#content-node-blur').style.display = 'none';
        this.titleDOM.innerHTML = '';
        this.bodyDOM.innerHTML = '';

        // こうやっとけばメモリ節約になるかな？
        this.canvas.width = 1;
        this.canvas.height = 1;

        HorrorGameNetwork.getInstance().setBodyScrollMode(0, this.openScrollY);

        if (!isPopState) {
            if (this.historyUrl) {
                window.history.pushState(this.historyState, null, this.historyUrl);
                this.historyUrl = null;
                this.historyState = null;
            } else {
                window.history.pushState({type: 'network'}, null, window.baseUrl);
            }
        }
    }

    update()
    {
        if (this.changeSize()) {
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

        if (this.canvas.width === this.containerDOM.offsetWidth &&
            this.canvas.height === this.containerDOM.offsetHeight) {
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
        if (this.isClosed()) {
            return false;
        }

        this.reload();
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
