import { DOMNode } from './dom-node.js';
import { LinkNode } from './link-node.js';

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
     * @param {string} id
     * @param {number} x
     * @param {number} y
     * @param {HTMLElement} DOM
     */
    constructor(id, x, y, DOM)
    {
        super(id, x, y, DOM);

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
     * @param {HTMLElement} DOM
     */
    constructor(DOM)
    {
        // この時点では正しく作成しない
        super(DOM.id, 0, 0, DOM, 8);

        this.state = PopupNode.STATE_CLOSED;

        this.DOM = DOM;

        this.DOM.querySelectorAll('.popup-node-close').forEach((closer) => {
            closer.addEventListener('click', () => {
                this.close();
            });
        });

        this.width = 0;
        this.height = 0;
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        window.hgn.popupViewer.close(this.id);
        super.delete();
        this.DOM = null;
    }

    /**
     * 再配置
     */
    reload()
    {
        super.reload(0, 0, this.DOM.offsetWidth, this.DOM.offsetHeight);
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
        // 一瞬bodyのスクロールを表示させなくする
        //window.hgn.body.style.overflow = 'hidden';

        // visibility: hiddenで表示することで、幅と高さを取れる
        this.DOM.style.display = 'block';
        this.DOM.style.visibility = 'visible';
        this.DOM.style.opacity = 1;

        
        //window.hgn.body.style.overflow = 'auto';

        // 幅と高さを取る
        this.width = this.DOM.offsetWidth;
        this.height = this.DOM.offsetHeight;
    }

    /**
     * 閉じる
     */
    close()
    {
        this.state = PopupNode.STATE_CLOSED;
        this.DOM.classList.remove('fade-in-text');
        this.DOM.classList.add('fade-out-text');
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
