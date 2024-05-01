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
        this.blurDOM = document.querySelector('#content-node-blur');
        this.openScrollY = 0;

        this.url = null;
        const a = this.DOM.querySelector('a');
        if (a) {
            this.url = a.getAttribute('href');
            // aのクリックイベントを無効化
            a.addEventListener('click', (e) => e.preventDefault());
        }
    }

    /**
     * マウスクリック
     */
    mouseClick()
    {
        if (this.url) {
            HorrorGameNetwork.getInstance()
                .openContentNode(this.url);
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
        this.titleDOM = this.DOM.querySelector('#content-node-title');
        this.bodyDOM = this.DOM.querySelector('#content-node-body');

        document.querySelectorAll('.content-node-close').forEach((close) => {
            close.addEventListener('click', () => {
                this.close();
            });
        });

        this.historyUrl = null;
        this.historyState = null;
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
        const height = this.DOM.offsetHeight;//this.bodyDOM.offsetHeight + Param.CONTENT_NODE_NOTCH_SIZE * 2;
        super.reload(0, 0, this.DOM.offsetWidth, height);

        this.canvas.width = this.DOM.offsetWidth;
        this.canvas.height = height;
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
     */
    open(data)
    {
        this.state = ContentNode.STATE_OPENED;
        this.openScrollY = window.scrollY;

        this.DOM.classList.add('content-node-opened');
        this.DOM.classList.remove('content-node-closed');

        document.querySelector('#content-node-blur').style.display = 'block';

        window.scrollTo(0, 0);

        this.titleDOM.innerHTML = data.title;
        this.bodyDOM.innerHTML = data.body;
        this.draw();
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

        window.scrollTo(0, this.openScrollY);

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

    /**
     * 描画
     */
    draw()
    {
        this.reload();
        super.setShapePath(this.ctx, 0, 0);

        // Set line color
        this.ctx.strokeStyle = "rgba(0, 180, 0, 0.8)"; // 線の色と透明度
        this.ctx.lineWidth = 5; // 線の太さ
        this.ctx.lineJoin = "round"; // 線の結合部分のスタイル
        this.ctx.lineCap = "round"; // 線の末端のスタイル
        this.ctx.shadowColor = "lime"; // 影の色
        this.ctx.shadowBlur = 10; // 影のぼかし効果
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
