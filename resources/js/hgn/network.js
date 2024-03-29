import {BackNode, TitleNode, LinkNode, ContentNode, TextNode} from './node/octa-node.js';
import {Param} from './param.js';
import {Background1} from './background1.js';
import {Background2} from './background2.js';
import {Background3} from './background3.js';

/**
 * ネットワーク
 * シングルトン
 */
export class Network
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        if (Network.instance) {
            return Network.instance;
        }
        Network.instance = this;

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

        // 次の更新で再描画するフラグ
        this.redrawFlag = false;

        this.update = this.update.bind(this);

        this.debug = document.querySelector('#debug');
        this.lastTime= 0;
        this.frameCount = 0;
        this.fps = 0;
    }

    static getInstance()
    {
        if (Network.instance) {
            return Network.instance;
        }
        return new Network();
    }

    /**
     * DOMからノードの読み取り
     */
    loadNodes()
    {
        let titleElem = document.querySelector('#title-node');
        if (titleElem) {
            this.titleNode = new TitleNode(titleElem);
        }

        let backElem = document.querySelector('#back-node');
        if (backElem) {
            this.backNode = new BackNode(backElem);

            if (this.titleNode) {
                this.backNode.connect2OctaNode(3, this.titleNode, 0);
            }
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
        this.showDebug();
        window.requestAnimationFrame(this.update);
    }

    /**
     * 描画
     */
    draw()
    {
        this.mainCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        this.drawEdge();
        this.drawNodes();
    }

    /**
     * エッジの描画
     */
    drawEdge()
    {
        if (this.backNode) {
            this.mainCtx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
            this.mainCtx.lineWidth = 1; // 線の太さ
            this.mainCtx.shadowColor = "lime"; // 影の色
            this.mainCtx.shadowBlur = 5; // 影のぼかし効果

            this.backNode.connects.forEach((connect, vertexNo) => {
                if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING) {
                    let targetVertex = connect.getVertex();

                    this.mainCtx.beginPath();
                    this.mainCtx.moveTo(this.backNode.vertices[vertexNo].x, this.backNode.vertices[vertexNo].y);
                    this.mainCtx.lineTo(targetVertex.x, targetVertex.y);
                    this.mainCtx.stroke();
                }
            });
        }
    }

    drawNodes()
    {
        if (this.titleNode) {
            this.titleNode.draw(this.mainCtx);
        }

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

    setRedraw()
    {
        this.redrawFlag = true;
    }

    update()
    {
        this.changeSize();
        this.scroll();

        if (this.redrawFlag) {
            this.draw();
            this.redrawFlag = false;
        }

        this.showDebug();
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
        this.bg3.resize();
        this.bg3.draw();
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

    showDebug()
    {
        let text = '';
        const timestamp = Date.now();
        if (this.lastTime !== 0) {
            // 前回のフレームからの経過時間（ミリ秒）を計算
            const delta = timestamp - this.lastTime;
            this.frameCount++;

            // 簡単なデモのため、1秒ごとにフレームレートをコンソールに表示
            if (this.frameCount % 60 === 0) {
                // 1秒間に何フレームあるか計算し、フレームレートとして保存
                this.fps = 1000 / delta;
            }
        }

        text = `FPS: ${this.fps.toFixed(2)}<br>`;
        text += 'touch: ' + Param.IS_TOUCH_DEVICE.toString();

        this.debug.innerHTML = text;
        this.lastTime = timestamp;
    }
}
