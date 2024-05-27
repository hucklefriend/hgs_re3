import {Network} from "./hgn/network.js";

import {DOMNode, TitleNode, TextNode, Bg2OctaNode} from './hgn/node/octa-node.js';
import {Bg2PointNode} from './hgn/node/point-node.js';
import {LinkNode, HgsTitleLinkNode, BackNode} from './hgn/node/link-node.js';
import {ContentNode, ContentLinkNode} from './hgn/node/content-node.js';
import {Head1Node, Head2Node} from './hgn/node/head-node.js';
import {PopupNode, PopupLinkNode} from './hgn/node/popup-node.js';
import {Param} from './hgn/param.js';
import {Background1} from './hgn/background1.js';
import {Background2} from './hgn/background2.js';
import {Background3} from './hgn/background3.js';
import {HR} from './hgn/hr.js';

/**
 * ホラーゲームネットワーク
 * シングルトン
 */
export class HorrorGameNetwork
{
    static SCROLL_MODE_BODY = 1;
    static SCROLL_MODE_SCROLLER = 2;

    /**
     * コンストラクタ
     */
    constructor()
    {
        if (HorrorGameNetwork.instance) {
            return HorrorGameNetwork.instance;
        }
        HorrorGameNetwork.instance = this;

        window.hgn = this;

        // スクロール挙動
        this.scrollMode = HorrorGameNetwork.SCROLL_MODE_BODY;
        this.scroller = document.querySelector('#scroller');
        this.scrollX = window.scrollX;
        this.scrollY = window.scrollY;

        // スクロールの変更検知用
        this.prevScrollX = -99999;
        this.prevScrollY = -99999;

        this.mainDOM = document.querySelector('main');
        this.popupDOM = document.querySelector('#popups');

        // メインのcanvas
        this.mainCanvas = document.querySelector('#main-canvas');
        this.mainCanvas.width = document.documentElement.scrollWidth;
        this.mainCanvas.height = this.mainDOM.offsetHeight;
        this.mainCtx = null;
        if (this.mainCanvas.getContext) {
            this.mainCtx = this.mainCanvas.getContext('2d');
        }
        this.mainDOM = document.querySelector('main');

        // ノード
        this.titleNode = null;
        this.contentNode = null;
        this.linkNodes = [];
        this.contentLinkNodes = [];
        this.popupLinkNodes = [];
        this.popupNodes = [];
        this.domNodes = [];

        this.nodesIdHash = {};

        // hr
        this.hrList = [];


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
        let connections = [];

        let titleElem = document.querySelector('#title-node');
        if (titleElem) {
            this.titleNode = new TitleNode(titleElem);
            if (titleElem.id.length > 0) {
                this.nodesIdHash[titleElem.id] = this.titleNode;

                this.loadConnection(titleElem, connections);
            }
        }

        this.contentNodeDOM = document.querySelector('#content-node');
        if (this.contentNodeDOM) {
            this.contentNode = new ContentNode(this.contentNodeDOM);
        }

        let textNodeElems = document.querySelectorAll('.text-node');
        textNodeElems.forEach(nodeElem => {
            this.domNodes.push(new TextNode(nodeElem));
            if (nodeElem.id.length > 0) {
                this.nodesIdHash[nodeElem.id] = this.domNodes[this.domNodes.length - 1];
                this.loadConnection(nodeElem, connections);
            }
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
            if (nodeElem.id.length > 0) {
                this.nodesIdHash[nodeElem.id] = newNode;
                this.loadConnection(nodeElem, connections);
            }
        });

        let contentLinkNodeElems = document.querySelectorAll('.content-link-node');
        contentLinkNodeElems.forEach(nodeElem =>  {
            this.contentLinkNodes.push(new ContentLinkNode(nodeElem));
            if (nodeElem.id.length > 0) {
                this.nodesIdHash[nodeElem.id] = this.contentLinkNodes[this.contentLinkNodes.length - 1];
                this.loadConnection(nodeElem, connections);
            }
        });

        let popupLinkNodeElems = document.querySelectorAll('.popup-link-node');
        popupLinkNodeElems.forEach(nodeElem =>  {
            this.popupLinkNodes.push(new PopupLinkNode(nodeElem));
            if (nodeElem.id.length > 0) {
                this.nodesIdHash[nodeElem.id] = this.popupLinkNodes[this.popupLinkNodes.length - 1];
                this.loadConnection(nodeElem, connections);
            }
        });

        let popupNodeElems = document.querySelectorAll('.popup-node');
        popupNodeElems.forEach(nodeElem =>  {
            this.popupNodes.push(new PopupNode(nodeElem));
            if (nodeElem.id.length > 0) {
                this.nodesIdHash[nodeElem.id] = this.popupNodes[this.popupNodes.length - 1];
            }
        });

        let domNodeElems = document.querySelectorAll('.dom-node');
        domNodeElems.forEach(nodeElem =>  {
            this.domNodes.push(new DOMNode(nodeElem, 15));
            if (nodeElem.id.length > 0) {
                this.nodesIdHash[nodeElem.id] = this.domNodes[this.domNodes.length - 1];
                this.loadConnection(nodeElem, connections);
            }
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

        // 接続の設定
        connections.forEach((c) => {
            let node1 = this.nodesIdHash[c[0]];
            let node2 = this.nodesIdHash[c[1]];
            if (node1 && node2) {
                node1.connect(null, node2);
            }
        });


        let hrElems = document.querySelectorAll('hr');
        hrElems.forEach(hrElem =>  {
            this.hrList.push(new HR(hrElem));
        });
    }

    loadConnection(nodeElem, connections)
    {
        if (nodeElem.dataset.connect) {
            // カンマ区切り文字列を配列に分解
            let connect = JSON.parse(nodeElem.dataset.connect);
            connect.forEach((c)=> {
                connections.push([nodeElem.id, c]);
            });
        }
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

        this.linkNodes.forEach(node => {
            node.reload();
        });

        this.contentLinkNodes.forEach(node => {
            node.reload();
        });

        this.popupLinkNodes.forEach(node => {
            node.reload();
        });

        this.popupNodes.forEach(node => {
            node.reload();
        });

        this.domNodes.forEach(node => {
            node.reload();
        });
    }

    /**
     * ノードのクリア
     */
    clearNodes()
    {
        this.nodesIdHash = {};

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

        this.contentLinkNodes.forEach(contentNode =>  {
            contentNode.delete();
        });
        this.contentLinkNodes = [];

        this.popupLinkNodes.forEach(node =>  {
            node.delete();
        });
        this.popupLinkNodes = [];

        this.popupNodes.forEach(node =>  {
            node.delete();
        });
        this.popupNodes = [];

        this.domNodes.forEach(domNode => {
            domNode.delete();
        });
        this.domNodes = [];

        this.hrList.forEach(hr => {
            hr.delete();
        });
        this.hrList = [];
    }

    /**
     * 開始
     */
    start()
    {
        window.history.pushState({type: 'network'}, '');

        this.draw();

        if (window.contentNode !== null) {
            this.showContentNode(window.contentNode);
            window.contentNode = null;
        }

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

        this.hrList.forEach(hr => {
            hr.draw(this.mainCtx);
        });
    }

    /**
     * エッジの描画
     */
    drawEdge()
    {
        let keys = Object.keys(this.nodesIdHash);
        if (keys.length > 0) {
            this.mainCtx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
            this.mainCtx.lineWidth = 1; // 線の太さ
            this.mainCtx.shadowColor = "lime"; // 影の色
            this.mainCtx.shadowBlur = 5; // 影のぼかし効果

            keys.forEach((key) => {
                let node = this.nodesIdHash[key];
                node.connects.forEach((connect, vertexNo) => {
                    if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING &&
                        !(connect.node instanceof Bg2OctaNode) && !(connect.node instanceof Bg2PointNode)){
                        let targetVertex = connect.getVertex();

                        this.mainCtx.beginPath();
                        this.mainCtx.moveTo(node.vertices[vertexNo].x, node.vertices[vertexNo].y);
                        this.mainCtx.lineTo(targetVertex.x, targetVertex.y);
                        this.mainCtx.stroke();
                    }
                });
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

        this.contentLinkNodes.forEach(contentLinkNode => {
            contentLinkNode.draw(this.mainCtx);
        });

        this.popupLinkNodes.forEach(node => {
            node.draw(this.mainCtx);
        });

        this.popupNodes.forEach(node => {
            node.draw(this.mainCtx);
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
        this.contentNode.changeSize();
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
            this.mainCanvas.height === this.mainDOM.offsetHeight) {
            return;
        }

        this.mainCanvas.width = document.documentElement.scrollWidth;
        this.mainCanvas.height = this.mainDOM.offsetHeight;
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

        if (this.scrollMode === HorrorGameNetwork.SCROLL_MODE_SCROLLER) {

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
        window.history.pushState({type: 'contentNode'}, '', url);
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
            window.history.pushState({type:'network'}, null, url);
        }
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
        this.popupDOM.innerHTML = data.popup;
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

    popState(e)
    {
        if (this.contentNode.isOpened()) {
            this.contentNode.close(true);
        } else {
            if (e.state) {
                if (e.state.type === 'network') {
                    this.changeNetwork(location.href, true);
                } else if (e.state.type === 'contentNode') {
                    this.openContentNode(location.href, true);
                }
            }
        }
    }

    /**
     * ポップアップノードの表示
     *
     * @param id
     */
    openPopupNode(id)
    {
        let node = this.nodesIdHash[id];
        if (node) {
            node.open();
        }
    }

    setBodyScrollMode(x, y)
    {
        this.scrollMode = HorrorGameNetwork.SCROLL_MODE_BODY;
        this.scroller.classList.remove('self-scroll');
        window.scrollTo(x, y);
    }

    setContainerScrollMode(x, y)
    {
        this.scrollMode = HorrorGameNetwork.SCROLL_MODE_SCROLLER;
        this.scroller.classList.add('self-scroll');

        // スクロール位置をリセット
        window.scrollTo(x, y);
        this.scroller.scrollTo(x, y);
    }
}

window.onload = function() {
    const hgn = HorrorGameNetwork.getInstance();
    hgn.start();
}
