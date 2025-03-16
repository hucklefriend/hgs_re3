import { HorrorGameNetwork } from '../horror-game-network.js';
import { PopupNode } from '../node/popup-node.js';
import { Param } from '../common/param.js';
import { Util } from '../common/util.js';
/**
 * @type {HorrorGameNetwork}
 */
window.hgn;

/**
 * ポップアップビューア
 */
export class PopupViewer
{
    /**
     * タイプ
     */
    get TYPE()
    {
        return 'popup';
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
        this.state = PopupViewer.STATE_CLOSED;

        this.popupNodes = {};
        this.currentNode = null;

        this.DOM = document.querySelector('#popups');

        this._isDraw = false;
    }

    /**
     * HTMLをレンダリング
     * 
     * @param {string} html
     */
    render(html)
    {
        this.DOM.innerHTML = html;
    }

    /**
     * ノードを読み込む
     */
    loadNodes()
    {
        let popupNodes = document.querySelectorAll('.popup-node');

        popupNodes.forEach((popupNode) => {
            this.popupNodes[popupNode.id] = new PopupNode(popupNode);
        });
    }

    /**
     * ノードをクリア
     */
    clearNodes()
    {
        if (this.currentNode !== null) {
            this.currentNode.close();
            this.currentNode = null;
        }

        Object.keys(this.popupNodes).forEach((key) => {
            this.popupNodes[key].delete();
            delete this.popupNodes[key];
        });

        this.popupNodes = {};

        this.DOM.innerHTML = '';
    }

    /**
     * 描画するか
     */
    setDraw()
    {
        this._isDraw = true;
    }

    /**
     * 閉じているか
     *
     * @returns {boolean}
     */
    isClosed()
    {
        if (this.currentNode !== null) {
            return this.currentNode.isClosed();
        }

        return true;
    }

    /**
     * 開いているか
     *
     * @returns {boolean}
     */
    isOpened()
    {
        if (this.currentNode !== null) {
            return this.currentNode.isOpened();
        }
        
        return false;
    }


    /**
     * 開く
     * 
     * @param {string} id
     */
    open(id)
    {
        if (!this.popupNodes.hasOwnProperty(id)) {
            console.error('ポップアップノードが見つかりません', id);
            return;
        }

        this.currentNode = this.popupNodes[id];

        this.openScrollX = window.hgn.viewer.scrollX;
        this.openScrollY = window.hgn.viewer.scrollY;
        window.hgn.viewer.setContainerScrollMode(this.openScrollX, this.openScrollY);

        this.currentNode.open();

        const wrapper = document.querySelector('.popup-wrapper');
        wrapper.classList.add('open'); // 開く

        window.hgn.setDrawMain(true);
    }

    /**
     * 閉じる
     */
    close()
    {
        if (this.currentNode === null) {
            return;
        }
        window.hgn.viewer.setBodyScrollMode(this.openScrollX, this.openScrollY);

        const wrapper = document.querySelector('.popup-wrapper');
        wrapper.classList.remove('open'); // 閉じる
        this.currentNode.close();
    }

    /**
     * スクロール位置の復元
     * 
     * @param {number} ratio
     */
    restoreScrollPosition(ratio)
    {
        const y = Util.lerp(this.openScrollY, window.hgn.viewer.scrollY, ratio, true);
        
        window.hgn.viewer.scrollTo(window.hgn.viewer.scrollX, y);
    }

    /**
     * 更新
     */
    update()
    {

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
}
