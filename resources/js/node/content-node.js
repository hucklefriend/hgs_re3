import { Vertex } from '../common/vertex.js';
import { DOMNode } from './dom-node.js';
import { LinkNode } from './link-node.js';
import { HorrorGameNetwork } from '../horror-game-network.js';
import { Util } from '../common/util.js';
/**
 * @type {HorrorGameNetwork}
 */
window.hgn;

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
            window.hgn.openContentView(this.url, this.id, false);
        }
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
     * 描画
     *
     * @param ctx
     * @param viewRect
     */
    draw(ctx, viewRect)
    {
        if (!this.isHide) {
            super.draw(ctx, viewRect);
        }
    }
}

/**
 * コンテンツノード
 */
export class ContentNode extends DOMNode
{
    /**
     * コンストラクタ
     * 
     * @param {*} id 
     * @param {*} x 
     * @param {*} y 
     * @param {*} DOM 
     * @param {*} notchSize 
     */
    constructor(id, x, y, DOM, notchSize = 13)
    {
        super(id, x, y, DOM, notchSize);

        this.animStartTime = 0;
        this.animVertices = null;
        this.minVertices = null;
        this._isAppeared = false;
        this._lineWidth = 1;

        this.blurDOM = document.querySelector('#content-node-blur');
    }

    /**
     * 出現済みか
     */
    get isAppeared()
    {
        return this._isAppeared;
    }
    
    /**
     * 八角形の設定
     * canvasをはみ出てしまうので、OctaNodeよりちょっと小さくする
     */
    setOctagon()
    {
        const padding = 5;

        this.vertices[0].x = this.rect.left + this.notchSize + padding;
        this.vertices[0].y = this.rect.top + padding;
        this.vertices[1].x = this.rect.right - this.notchSize - padding;
        this.vertices[1].y = this.rect.top + padding;
        this.vertices[2].x = this.rect.right - padding;
        this.vertices[2].y = this.rect.top + this.notchSize + padding;
        this.vertices[3].x = this.rect.right - padding;
        this.vertices[3].y = this.rect.bottom - this.notchSize - padding;
        this.vertices[4].x = this.rect.right - this.notchSize - padding;
        this.vertices[4].y = this.rect.bottom - padding;
        this.vertices[5].x = this.rect.left + this.notchSize + padding;
        this.vertices[5].y = this.rect.bottom - padding;
        this.vertices[6].x = this.rect.left + padding;
        this.vertices[6].y = this.rect.bottom - this.notchSize - padding;
        this.vertices[7].x = this.rect.left + padding;
        this.vertices[7].y = this.rect.top + this.notchSize + padding;
    }

    /**
     * 出現
     */
    appear(linkNode)
    {
        this._isAppeared = false;
        super.appear();

        this.blurDOM.style.opacity = 0;
        this.blurDOM.style.display = 'block';

        this.animStartTime = window.hgn.time;

        if (linkNode) {
            // リンクノードがあるので、そこから拡大
            this.minVertices = linkNode.vertices.map(vertex => 
                new Vertex(vertex.x, vertex.y)
            );
            for (let i = 0; i < 8; i++) {
                this.minVertices[i].x = this.minVertices[i].x - window.hgn.viewer.scrollX;
                this.minVertices[i].y = this.minVertices[i].y - window.hgn.viewer.scrollY;
            }
        } else {
            // リンクノードが見当たらない場合はビューポート上の中央から出現させる
            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2;
            this.minVertices = [
                new Vertex(x, y),
                new Vertex(x, y),
                new Vertex(x, y),
                new Vertex(x, y),
                new Vertex(x, y),
                new Vertex(x, y),
                new Vertex(x, y),
                new Vertex(x, y)
            ];
        }

        this.animVertices = this.minVertices.map(vertex => 
            new Vertex(vertex.x, vertex.y)
        );
        this.reload();
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        const animTime = window.hgn.time - this.animStartTime;
        if (animTime < 200) {
            const ratio = (animTime) / 200;
            for (let i = 0; i < 8; i++) {
                this.animVertices[i].x = Util.getMidpoint(this.minVertices[i].x, this.vertices[i].x, ratio, true);
                this.animVertices[i].y = Util.getMidpoint(this.minVertices[i].y, this.vertices[i].y, ratio, true);
            }

            this.lineWidth = Util.getMidpoint(1, 3, ratio, true);
            this.blurDOM.style.opacity = Util.getMidpoint(0, 1, ratio, false);
        } else {
            this.appeared();
        }

        window.hgn.contentViewer.setDraw();
    }

    /**
     * 出現済み
     */
    appeared()
    {
        super.appeared();

        this.animVertices = [...this.vertices];
        this.blurDOM.style.opacity = 1;
        this._isAppeared = true;

        window.hgn.contentViewer.opened();
    }

    /**
     * 消失
     */
    disappear()
    {
        this._isAppeared = false;
        super.disappear();

        this.animStartTime = window.hgn.time;
    }

    /**
     * 消失アニメーション
     */
    disappearAnimation()
    {
        const animTime = window.hgn.time - this.animStartTime;
        if (animTime < 300) {
        
            if (window.hgn.contentViewer.linkNode) {
                // 一緒にスクロールさせる都合上、リンクノードの位置が毎回変わるので毎回取り直し
                for (let i = 0; i < 8; i++) {
                    this.minVertices[i].x = window.hgn.contentViewer.linkNode.vertices[i].x - window.hgn.viewer.scrollX;
                    this.minVertices[i].y = window.hgn.contentViewer.linkNode.vertices[i].y - window.hgn.viewer.scrollY;
                }
            }
            const ratio = 1 - (animTime / 300);
            for (let i = 0; i < 8; i++) {
                this.animVertices[i].x = Util.getMidpoint(this.minVertices[i].x, this.vertices[i].x, ratio, true);
                this.animVertices[i].y = Util.getMidpoint(this.minVertices[i].y + window.scrollY, this.vertices[i].y, ratio, true);
            }

            this.blurDOM.style.opacity = Util.getMidpoint(0, 1, ratio, false);
            this.lineWidth = Util.getMidpoint(1, 3, ratio, true);

            window.hgn.contentViewer.restoreScrollPosition(ratio);
            window.hgn.contentViewer.setDraw();
        } else {
            this.disappeared();
        }
    }

    /**
     * 消失済み
     */
    disappeared()
    {
        super.disappeared();
        this.blurDOM.style.display = 'none';
        this.minVertices = null;
        this.animVertices = null;

        window.hgn.contentViewer.closed();
    }

    /**
     * ウィンドウサイズの変更
     */
    reload()
    {
        super.reload();
        window.hgn.contentViewer.setDraw();
    }

    /**
     * 描画
     */
    draw(ctx, left, top)
    {
        ctx.lineWidth = this.lineWidth; // 線の太さはアニメーションで変わるので調整

        super.setShapePathByVertices(ctx, this.animVertices, left, top);
        ctx.stroke();
    }
}
