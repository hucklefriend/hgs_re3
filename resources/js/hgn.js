import {Network} from "./hgn/network.js";

import {DOMNode, TitleNode, TextNode} from './hgn/node/octa-node.js';
import {LinkNode, HgsTitleLinkNode, BackNode} from './hgn/node/link-node.js';
import {ContentNode, ContentLinkNode} from './hgn/node/content-node.js';
import {Head1Node, Head2Node} from './hgn/node/head-node.js';
import {Param} from './hgn/param.js';
import {Background1} from './hgn/background1.js';
import {Background2} from './hgn/background2.js';
import {Background3} from './hgn/background3.js';

/**
 * ホラーゲームネットワーク
 * シングルトン
 */
export class HorrorGameNetwork
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        if (HorrorGameNetwork.instance) {
            return HorrorGameNetwork.instance;
        }
        HorrorGameNetwork.instance = this;

        // メインのcanvas
        this.mainCanvas = document.querySelector('#main-canvas');
        this.mainCanvas.width = document.documentElement.scrollWidth;
        this.mainCanvas.height = document.documentElement.scrollHeight;
        this.mainCtx = null;
        if (this.mainCanvas.getContext) {
            this.mainCtx = this.mainCanvas.getContext('2d');
        }
        this.mainDOM = document.querySelector('main');

        // ノード
        this.titleNode = null;
        this.backNode = null;
        this.contentNode = null;
        this.linkNodes = [];
        this.textNodes = [];
        this.contentLinkNodes = [];
        this.domNodes = [];

        // 背景の生成
        this.bg1 = new Background1();
        this.bg2 = new Background2();
        this.bg3 = new Background3();

        // ノードの読み取り
        this.loadNodes();

        // 背景を描画
        this.bg2.draw();
        //this.bg1.draw(this.bg2);
        this.bg3.draw();

        // スクロールの変更検知用
        this.prevScrollX = -99999;
        this.prevScrollY = -99999;

        // 次の更新で再描画するフラグ
        this.redrawFlag = false;

        this.update = this.update.bind(this);

        window.addEventListener('popstate', (e) => {
            this.popState(e);
        });

        if (Param.SHOW_DEBUG) {
            this.debug = document.querySelector('#debug');
            this.lastTime= 0;
            this.frameCount = 0;
            this.fps = 0;
        }

        this.contentNodeOpenCnt = 0;
        this.isFirstNetwork = true;
    }

    /**
     * インスタンスの取得
     *
     * @returns {HorrorGameNetwork}
     */
    static getInstance()
    {
        if (HorrorGameNetwork.instance) {
            return HorrorGameNetwork.instance;
        }
        return new HorrorGameNetwork();
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

        let backElem = document.querySelector('.back-node');
        if (backElem) {
            this.backNode = new BackNode(backElem);

            if (this.titleNode) {
                this.backNode.connect2OctaNode(3, this.titleNode, 0);
            }
        }

        this.contentNodeDOM = document.querySelector('#content-node');
        if (this.contentNodeDOM) {
            this.contentNode = new ContentNode(this.contentNodeDOM);
        }

        let textNodeElems = document.querySelectorAll('.text-node');
        textNodeElems.forEach(nodeElem => {
            this.textNodes.push(new TextNode(nodeElem));
        });

        let linkNodeElems = document.querySelectorAll('.link-node');
        linkNodeElems.forEach(nodeElem => {
            let newNode = null;
            if (nodeElem.id === 'n-HGS') {
                newNode = new HgsTitleLinkNode(nodeElem);
                this.bg2.createHGSNetwork(newNode);
            } else {
                newNode = new LinkNode(nodeElem);
                this.bg2.createRandomNetwork(newNode, 2)
            }

            this.linkNodes.push(newNode);
        });

        let contentLinkNodeElems = document.querySelectorAll('.content-link-node');
        contentLinkNodeElems.forEach(nodeElem =>  {
            this.contentLinkNodes.push(new ContentLinkNode(nodeElem));
        });

        let domNodeElems = document.querySelectorAll('.dom-node');
        domNodeElems.forEach(nodeElem =>  {
            this.domNodes.push(new DOMNode(nodeElem, 15));
        });

        let h1Elems = document.querySelectorAll('.head1');
        h1Elems.forEach(nodeElem =>  {
            this.domNodes.push(new Head1Node(nodeElem, 10));
        });

        let h2Elems = document.querySelectorAll('.head2');
        h2Elems.forEach(nodeElem =>  {
            this.domNodes.push(new Head2Node(nodeElem, 10));
        });

        this.bg2.reload();
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

        if (this.contentNode) {
            this.contentNode.reload();
        }

        this.linkNodes.forEach(linkNode => {
            linkNode.reload();
        });

        this.textNodes.forEach(textNode => {
            textNode.reload();
        });

        this.contentLinkNodes.forEach(contentNode => {
            contentNode.reload();
        });

        this.domNodes.forEach(domNode => {
            domNode.reload();
        });
    }

    /**
     * ノードのクリア
     */
    clearNodes()
    {
        if (this.titleNode) {
            this.titleNode.delete();
            this.titleNode = null;
        }

        if (this.backNode) {
            this.backNode.delete();
            this.backNode = null;
        }

        if (this.contentNode) {
            // コンテンツノードは消さない
        }

        this.linkNodes.forEach(linkNode => {
            linkNode.delete();
        });
        this.linkNodes = [];

        this.textNodes.forEach(textNode => {
            textNode.delete();
        });
        this.textNodes = [];

        this.contentLinkNodes.forEach(contentNode =>  {
            contentNode.delete();
        });
        this.contentLinkNodes = [];

        this.domNodes.forEach(domNode => {
            domNode.delete();
        });
        this.domNodes = [];
    }

    /**
     * 開始
     */
    start()
    {
        window.history.pushState({type: 'network', contentNodeOpenCnt: 0}, '');

        this.draw();

        if (Param.SHOW_DEBUG) {
            this.showDebug();
        }
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

    /**
     * ノードの描画
     */
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

        this.contentLinkNodes.forEach(contentLinkNode => {
            contentLinkNode.draw(this.mainCtx);
        });

        this.domNodes.forEach(domNode => {
            domNode.draw(this.mainCtx);
        });

        if (this.contentNode.isOpened()) {
            this.contentNode.draw();
        }
    }

    /**
     * 再描画フラグの設定
     */
    setRedraw()
    {
        this.redrawFlag = true;
    }

    /**
     * 更新
     */
    update()
    {
        this.changeSize();
        this.scroll();

        if (this.redrawFlag) {
            this.draw();
            this.redrawFlag = false;
        }

        if (Param.SHOW_DEBUG) {
            this.showDebug();
        }
        window.requestAnimationFrame(this.update);
    }

    /**
     * ウィンドウサイズの変更
     */
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

        this.bg2.resize();
        this.bg2.draw();
        this.bg1.resize();
        this.bg1.draw(this, this.bg2);
        this.bg3.resize();
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
        this.bg3.scroll();

        this.bg2.scroll();
        this.bg2.draw();
        this.bg1.scroll();
        this.bg1.draw(this, this.bg2);
        if (this.contentNode.isOpened()) {
            this.contentNode.scroll();
        }

        this.prevScrollX = window.scrollX;
        this.prevScrollY = window.scrollY;
    }

    /**
     * デバッグ描画
     */
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
        text += 'touch: ' + Param.IS_TOUCH_DEVICE.toString() + '<br>';

        this.debug.innerHTML = text;
        this.lastTime = timestamp;
    }

    /**
     * コンテンツノードの表示
     *
     * @param url
     */
    openContentNode(url)
    {
        // pushStateにつっこむ
        window.history.pushState({type: 'contentNode', contentNodeOpenCnt: 0}, '', url);
        this.fetch(url, (data) => {
            this.showContentNode(data);
        });
    }

    /**
     * コンテンツノードを表示
     *
     * @param data
     */
    showContentNode(data)
    {
        this.contentNode.open(data);
        this.contentNodeOpenCnt++;
    }

    /**
     * 表示ネットワークの切り替え
     * つまりページ遷移
     */
    changeNetwork(url, isBack = false)
    {
        this.contentNode.historyUrl = location.href;
        this.contentNode.historyState = window.history.state;

        if (!isBack) {
            // pushStateにつっこむ
            window.history.pushState({type: 'network', contentNodeOpenCnt: this.contentNodeOpenCnt}, null, url);
            this.isFirstNetwork = false;
        }
        this.contentNodeOpenCnt = 0;
        this.clearNodes();
        this.bg2.clear();
        this.fetch(url, (data) => {
            this.showNewNetwork(data);
        });
    }

    showNewNetwork(data)
    {
        // this.clearNodes();
        // this.bg2.clear();

        window.scrollTo(0, 0);
        this.mainDOM.innerHTML = data.network;
        this.loadNodes();
        this.draw();
        this.bg2.draw();
        //this.setRedraw();
    }

    /**
     * データの取得
     *
     * @param url
     * @param callback
     */
    fetch(url, callback)
    {
        let urlObj = new URL(url); // URLオブジェクトを作成
        urlObj.searchParams.append('a', '1'); // クエリパラメータ'a'を追加
        url = urlObj.toString(); // URLオブジェクトを文字列に戻す

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
            callback(data);
        }).catch((error) => {
            // エラーが発生した場合の処理
            console.error('There was a problem with the fetch operation:');
            console.error(error);
        });
    }

    back()
    {
        console.log('back: ' + (-1 - this.contentNodeOpenCnt).toString());
        window.history.go(-1 - this.contentNodeOpenCnt);
    }

    popState(e)
    {
        if (this.contentNode.isOpened()) {
            this.contentNode.close(true);
        } else {
            console.log('popState: ');
            console.log(e);
            if (e.state) {
                if (e.state.type === 'network') {
                    this.changeNetwork(location.href, true);

                    this.contentNodeOpenCnt = e.state.contentNodeOpenCnt;
                } else if (e.state.type === 'contentNode') {
                    this.openContentNode(location.href, true);
                }
            }
        }
    }
}

window.onload = function() {
    const hgn = HorrorGameNetwork.getInstance();
    hgn.start();
}
