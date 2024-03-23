
import {OctaNode, DOMNode, BackNode, TitleNode, LinkNode, ContentNode, TextNode} from '../hgn/node.js';
import {Vertex} from '../hgn/vertex.js';
import {Param} from '../hgn/param.js';
import {Background1} from '../hgn/background1.js';
import {Background2} from '../hgn/background2.js';
import {Background3} from '../hgn/background3.js';

export class Network
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        // メインのcanvas
        this.mainCanvas = document.querySelector('#main-canvas');
        this.mainCanvas.width = document.documentElement.scrollWidth;
        this.mainCanvas.height = document.documentElement.scrollHeight;
        this.mainCtx = null;
        if (this.mainCanvas.getContext) {
            this.mainCtx = this.mainCanvas.getContext('2d');
        }

        // ノード
        this.titleNode = null;
        this.backNode = null;
        this.linkNodes = [];
        this.textNodes = [];
        this.contentNodes = [];

        // ノードの読み取り
        this.loadNodes();

        // 背景2の生成（背景1に背景2の情報が必要なので先にこっちを生成）
        this.bg2 = new Background2(this);
        this.bg2.draw(this);

        // 背景1の生成
        this.bg1 = new Background1();
        this.bg1.draw(this, this.bg2);

        // 背景3の生成
        this.bg3 = new Background3()
        this.bg3.draw();

        // スクロールの変更検知用
        this.prevScrollX = -99999;
        this.prevScrollY = -99999;

        this.update = this.update.bind(this);
    }

    /**
     * DOMからノードの読み取り
     */
    loadNodes()
    {
        let titleElem = document.querySelector('#title-node');
        this.titleNode = new TitleNode(titleElem);

        let backElem = document.querySelector('#back-node');
        if (backElem) {
            this.backNode = new BackNode(backElem);
        }

        let textNodeElems = document.querySelectorAll('.text-node');
        textNodeElems.forEach(nodeElem => {
            this.textNodes.push(new TextNode(nodeElem));
        });

        let linkNodeElems = document.querySelectorAll('.link-node');
        linkNodeElems.forEach(nodeElem => {
            this.linkNodes.push(new LinkNode(nodeElem));
        });

        let contentNodeElems = document.querySelectorAll('.content-node');
        contentNodeElems.forEach(nodeElem =>  {
            this.contentNodes.push(new ContentNode(nodeElem));
        });
    }

    /**
     * Windowサイズ変更などによるNodeの再読取り
     */
    reloadNodes()
    {
        if (this.titleNode) {
            this.titleNode.reload();
        }

        if (this.backNode) {
            this.backNode.reload();
        }

        this.linkNodes.forEach(linkNode => {
            linkNode.reload();
        });

        this.textNodes.forEach(textNode => {
            textNode.reload();
        });

        this.contentNodes.forEach(contentNode =>  {
            contentNode.reload();
        });
    }

    /**
     * 開始
     */
    start()
    {
        this.draw();
        window.requestAnimationFrame(this.update);
    }

    /**
     * 描画
     */
    draw()
    {
        this.mainCtx.clearRect(0, 0, this.prevScrollX, this.prevScrollY);
        this.drawEdge();
        this.drawNodes();
    }

    /**
     * エッジの描画
     */
    drawEdge()
    {
        if (this.backNode) {
            // titleNodeとbackNodeを線でつなげる
            this.mainCtx.beginPath();
            this.mainCtx.moveTo(this.titleNode.vertices[0].x, this.titleNode.vertices[0].y);
            this.mainCtx.lineTo(this.backNode.vertices[4].x, this.backNode.vertices[4].y);
            this.mainCtx.strokeStyle = "rgba(255, 255, 0, 0.8)";
            this.mainCtx.lineWidth = 1;
            this.mainCtx.stroke();
        }
    }

    drawNodes()
    {
        this.titleNode.draw(this.mainCtx);

        if (this.backNode) {
            this.backNode.draw(this.mainCtx);
        }

        this.linkNodes.forEach(linkNode => {
            linkNode.draw(this.mainCtx);
        });

        this.textNodes.forEach(textNode => {
            textNode.draw(this.mainCtx);
        });

        this.contentNodes.forEach(contentNode => {
            contentNode.draw(this.mainCtx);
        });
    }

    drawBackground3()
    {

    }

    update()
    {
        this.changeSize();
        this.scroll();

        window.requestAnimationFrame(this.update);
    }

    changeSize()
    {
        if (this.mainCanvas.width === document.documentElement.scrollWidth &&
            this.mainCanvas.height === document.documentElement.scrollHeight) {
            return;
        }

        this.mainCanvas.width = document.documentElement.scrollWidth;
        this.mainCanvas.height = document.documentElement.scrollHeight;
        this.reloadNodes();

        this.draw();

        this.bg2.scroll();
        this.bg2.draw(this);
        this.bg1.scroll();
        this.bg1.draw(this, this.bg2);
    }

    /**
     * スクロール
     */
    scroll()
    {
        if (this.prevScrollX === window.scrollX &&
            this.prevScrollY === window.scrollY) {
            return;
        }

        this.bg2.scroll();
        this.bg2.draw(this);
        this.bg1.scroll();
        this.bg1.draw(this, this.bg2);
        this.bg3.scroll();

        this.prevScrollX = window.scrollX;
        this.prevScrollY = window.scrollY;
    }
}
