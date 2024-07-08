import {DOMNode} from './octa-node.js';
import {LinkNode} from './link-node.js';
import {HorrorGameNetwork} from '../../hgn.js';

/**
 * ポップアップノードへのリンクノード
 */
export class PopupLinkNode extends LinkNode
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

        this.state = PopupLinkNode.STATE_CLOSED;
        this.openScrollY = 0;

        this.popup = this.DOM.dataset.target;
    }

    /**
     * マウスクリック
     */
    mouseClick()
    {
        HorrorGameNetwork.getInstance()
            .openPopupNode(this.popup);
    }
}

/**
 * ポップアップノード
 */
export class PopupNode extends DOMNode
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
        super(DOM, 8);

        this.state = PopupNode.STATE_CLOSED;

        this.canvas = this.DOM.querySelector('.popup-node-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.DOM = DOM;

        document.querySelectorAll('.popup-node-close').forEach((close) => {
            close.addEventListener('click', () => {
                this.close();
            });
        });

        this.DOM.addEventListener('click', () => {
            //this.close();
        });

        this.timer = null;
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        this.close();
        super.delete();
        this.canvas = null;
        this.ctx = null;
        this.DOM = null;
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
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
        return this.state === PopupNode.STATE_CLOSED;
    }

    /**
     * 開いているか
     *
     * @returns {boolean}
     */
    isOpened()
    {
        return this.state === PopupNode.STATE_OPENED;
    }

    /**
     * 開く
     */
    open()
    {
        this.state = PopupNode.STATE_OPENED;
        this.openScrollY = window.scrollY;

        this.DOM.classList.remove('popup-node-closed', 'fade-out-text');
        this.DOM.classList.add('popup-node-opened', 'fade-in-text');

        window.hgn.setContainerScrollMode(0, this.openScrollY);
        this.draw();
    }

    /**
     * 閉じる
     */
    close()
    {
        this.state = PopupNode.STATE_CLOSED;
        this.DOM.classList.remove('fade-in-text');
        this.DOM.classList.add('fade-out-text');
        this.timer = setTimeout(() => {
            this.DOM.classList.add('popup-node-closed');
        }, 200);

        window.hgn.setBodyScrollMode(0, this.openScrollY);
    }

    /**
     * 描画
     */
    draw()
    {
        this.reload();
        // super.setShapePath(this.ctx, 0, 0);
        //
        // // Set line color
        // this.ctx.strokeStyle = "rgba(0, 180, 0, 0.8)"; // 線の色と透明度
        // this.ctx.lineWidth = 3; // 線の太さ
        // this.ctx.lineJoin = "round"; // 線の結合部分のスタイル
        // this.ctx.lineCap = "round"; // 線の末端のスタイル
        // this.ctx.shadowColor = ""; // 影の色
        // this.ctx.shadowBlur = 0; // 影のぼかし効果
        // this.ctx.stroke();
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
