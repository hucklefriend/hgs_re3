import {DOMNode, TitleNode, TextNode, Bg2OctaNode} from './hgn/node/octa-node.js';
import {Bg2PointNode} from './hgn/node/point-node.js';
import {LinkNode, HgsTitleLinkNode} from './hgn/node/link-node.js';
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

    static ANIMATION_MODE_NONE = 0;
    static ANIMATION_MODE_NETWORK_IN = 1;
    static ANIMATION_MODE_NETWORK_OUT = 2;

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
        this.scrollModeScrollPosY = 0;
        this.scrollModeStartPosY = 0;

        this.mainDOM = document.querySelector('main');
        this.popupDOM = document.querySelector('#popups');

        // メインのcanvas
        this.mainCanvas = document.querySelector('#main-canvas');
        this.mainCanvas.width = document.documentElement.scrollWidth;
        this.mainCanvas.height = this.mainDOM.offsetHeight + 50;
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

        this.isLoaded = false;

        this.animationMode = HorrorGameNetwork.ANIMATION_MODE_NONE;
        this.animationCnt = 0;

        this.waitNetworkOut = false;
        this.dataCache = null;
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
     * 高さの取得
     *
     * @returns {number}
     */
    getHeight()
    {
        return this.mainDOM.offsetHeight;
    }

    /**
     * スクロールXの取得
     *
     * @returns {number}
     */
    getScrollX()
    {
        return this.scrollX;
    }

    /**
     * スクロールYの取得
     *
     * @returns {number}
     */
    getScrollY()
    {
        if (this.scrollMode === HorrorGameNetwork.SCROLL_MODE_SCROLLER) {
            return this.scrollModeScrollPosY;
        } else {
            return this.scrollY;
        }
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
            let newNode;
            if (nodeElem.id === 'n-HGS') {
                newNode = new HgsTitleLinkNode(nodeElem);
                this.bg2.createHGSNetwork(newNode);
            } else {
                newNode = new LinkNode(nodeElem);
                this.bg2.createRandomNetwork(newNode)
            }

            this.linkNodes.push(newNode);
            if (nodeElem.id.length > 0) {
                this.nodesIdHash[nodeElem.id] = newNode;
                this.loadConnection(nodeElem, connections);
            }
        });

        let contentLinkNodeElems = document.querySelectorAll('.content-link-node');
        contentLinkNodeElems.forEach(nodeElem =>  {
            let newNode = new ContentLinkNode(nodeElem);
            this.contentLinkNodes.push(newNode);
            this.bg2.createRandomNetwork(newNode)
            if (nodeElem.id.length > 0) {
                this.nodesIdHash[nodeElem.id] = this.contentLinkNodes[this.contentLinkNodes.length - 1];
                this.loadConnection(nodeElem, connections);
            }
        });

        let popupLinkNodeElems = document.querySelectorAll('.popup-link-node');
        popupLinkNodeElems.forEach(nodeElem =>  {
            let newNode = new PopupLinkNode(nodeElem);
            this.popupLinkNodes.push(newNode);
            this.bg2.createRandomNetwork(newNode);
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
            let newNode = new DOMNode(nodeElem, 15);
            this.domNodes.push(newNode);
            this.bg2.createRandomNetwork(newNode);
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

        this.isLoaded = true;
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

        this.isLoaded = true;
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
        // ノードの読み取り
        this.loadNodes();

        if (window.contentNode !== null) {
            let linkNodeId = window.contentNode.linkNodeId;
            let linkNode = null;
            if (this.nodesIdHash.hasOwnProperty(linkNodeId)) {
                linkNode = this.nodesIdHash[linkNodeId];
            }
            this.contentNode.open(linkNode);
            this.contentNode.setContent(window.contentNode);
            window.contentNode = null;
            window.history.pushState({type: 'contentNode', 'linkNodeId': linkNodeId}, '');
        } else {
            window.history.pushState({type: 'network'}, '');

            this.startNetworkIn();
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
        this.bg2.draw();
        this.bg1.draw(this, this.bg2);

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

        this.contentNode.update();

        switch (this.animationMode) {
            case HorrorGameNetwork.ANIMATION_MODE_NETWORK_IN:
                this.networkIn();
                break;
            case HorrorGameNetwork.ANIMATION_MODE_NETWORK_OUT:
                this.networkOut();
                break;
            case HorrorGameNetwork.ANIMATION_MODE_NONE:
                if (this.waitNetworkOut) {
                    this.waitNetworkOut = false;
                    this.showNewNetwork(this.dataCache);
                }

                break;
        }


        if (this.redrawFlag) {
            this.draw();
            this.redrawFlag = false;
        }

        if (Param.SHOW_DEBUG) {
            this.showDebug();
        }
        window.requestAnimationFrame(this.update);
    }

    startNetworkIn()
    {
        this.animationMode = HorrorGameNetwork.ANIMATION_MODE_NETWORK_IN;
        this.animationCnt = 0;
        this.bg2.fadeCnt = 0;
        this.bg2.setStrokeStyle();

        this.domNodes.forEach(node => {
            node.appear();
        });
    }

    networkIn()
    {
        this.animationCnt++;
        const OPEN_MAIN_CNT = 10;

        // 最初の10フレームでタイトルとメインノードが出現
        if (this.animationCnt < OPEN_MAIN_CNT) {
            this.mainCtx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
            this.mainCtx.shadowColor = "rgb(0,150, 0)"; // 影の色
            this.mainCtx.shadowBlur = 8; // 影のぼかし効果
            this.mainCtx.fillStyle = "rgba(0, 0, 0, 0.95)";
            this.mainCtx.lineWidth = 2; // 線の太さ
            this.mainCtx.lineJoin = "round"; // 線の結合部分のスタイル
            this.mainCtx.lineCap = "round"; // 線の末端のスタイル

            this.linkNodes.forEach(linkNode => {
                linkNode.scale = this.animationCnt / OPEN_MAIN_CNT;
            });
            this.contentLinkNodes.forEach(linkNode => {
                linkNode.scale = this.animationCnt / OPEN_MAIN_CNT;
            });
        } else if (this.animationCnt === OPEN_MAIN_CNT) {
            this.linkNodes.forEach(linkNode => {
                linkNode.scale = 1;
            });
            this.contentLinkNodes.forEach(linkNode => {
                linkNode.scale = 1;
            });
            this.mainDOM.classList.remove('hide');
        } else if (this.animationCnt < 20) {
            this.bg2.addFadeCnt(1);
        }



        this.domNodes.forEach(node => {
            node.update();
        });

        this.setRedraw();

        if (this.animationCnt === 30) {
            this.animationMode = HorrorGameNetwork.ANIMATION_MODE_NONE;
        }
    }

    startNetworkOut()
    {
        this.animationMode = HorrorGameNetwork.ANIMATION_MODE_NETWORK_OUT;
        this.animationCnt = 0;
        this.mainDOM.classList.add('hide');

        this.domNodes.forEach(node => {
            node.disappear();
        });
    }

    networkOut()
    {
        this.animationCnt++;
        const SUB_NODE_REMOVE_CNT = 10;
        const CLOSE_MAIN_CNT = 10;

        // 最初の10フレームでタイトルとメインノードが出現
        if (this.animationCnt <= SUB_NODE_REMOVE_CNT) {
            this.bg2.addFadeCnt(-1);
        } else if (this.animationCnt <= (SUB_NODE_REMOVE_CNT + CLOSE_MAIN_CNT)) {
            this.mainCtx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
            this.mainCtx.shadowColor = "rgb(0,150, 0)"; // 影の色
            this.mainCtx.shadowBlur = 8; // 影のぼかし効果
            this.mainCtx.fillStyle = "rgba(0, 0, 0, 0.95)";
            this.mainCtx.lineWidth = 2; // 線の太さ
            this.mainCtx.lineJoin = "round"; // 線の結合部分のスタイル
            this.mainCtx.lineCap = "round"; // 線の末端のスタイル

            this.linkNodes.forEach(linkNode => {
                linkNode.scale = (SUB_NODE_REMOVE_CNT - (this.animationCnt - SUB_NODE_REMOVE_CNT)) / CLOSE_MAIN_CNT;
            });
            this.contentLinkNodes.forEach(linkNode => {
                linkNode.scale = (SUB_NODE_REMOVE_CNT - (this.animationCnt - SUB_NODE_REMOVE_CNT)) / CLOSE_MAIN_CNT;
            });
        } else {
            this.animationMode = HorrorGameNetwork.ANIMATION_MODE_NONE;
        }



        this.domNodes.forEach(node => {
            node.update();
        });


        this.setRedraw();
    }

    /**
     * ウィンドウサイズの変更
     */
    changeSize()
    {
        if (this.mainCanvas.width === document.documentElement.scrollWidth &&
            this.mainCanvas.height === (this.mainDOM.offsetHeight + 50)) {
            return;
        }

        this.mainCanvas.width = document.documentElement.scrollWidth;
        this.mainCanvas.height = this.mainDOM.offsetHeight + 50;
        this.reloadNodes();

        this.bg2.resize();
        this.bg1.resize();

        if (this.contentNode.changeSize()) {
            this.contentNode.draw();
        }

        this.setRedraw();
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

        this.scrollX = window.scrollX;
        this.scrollY = window.scrollY;

        if (this.scrollMode === HorrorGameNetwork.SCROLL_MODE_SCROLLER) {
            this.scrollModeScrollPosY = this.scrollModeStartPosY + (this.scrollY / 3);

            this.scroller.scrollTo(0, this.scrollModeScrollPosY);
        }

        this.bg3.scroll();
        this.bg2.scroll();
        this.bg1.scroll();
        if (this.contentNode.isOpened()) {
            this.contentNode.scroll();
        }

        this.prevScrollX = window.scrollX;
        this.prevScrollY = window.scrollY;

        this.setRedraw();
    }

    /**
     * デバッグ描画
     */
    showDebug()
    {
        let text;
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
     * @param linkNodeId
     */
    openContentNode(url, linkNodeId)
    {
        let linkNode = null;
        if (this.nodesIdHash.hasOwnProperty(linkNodeId)) {
            linkNode = this.nodesIdHash[linkNodeId];
        }
        this.contentNode.open(linkNode);

        // pushStateにつっこむ
        window.history.pushState({type: 'contentNode', linkNodeId: linkNodeId}, '', url);
        this.fetch(url, (data, hasError) => {
            if (hasError) {
                this.showContentNode({
                    title: 'Error',
                    body: 'エラーが発生しました。<br>不具合によるものと思われますので、対処されるまでお待ちください。',
                    mode: ContentNode.MODE_ERROR
                });
            } else {
                this.showContentNode(data);
            }
        });
    }

    /**
     * コンテンツノードを表示
     *
     * @param data
     */
    showContentNode(data)
    {
        this.contentNode.setContent(data);
    }

    /**
     * 表示ネットワークの切り替え
     * つまりページ遷移
     */
    changeNetwork(url, isBack = false)
    {
        this.contentNode.historyUrl = location.href;
        this.contentNode.historyState = window.history.state;
        this.startNetworkOut();

        if (!isBack) {
            // pushStateにつっこむ
            window.history.pushState({type:'network'}, null, url);
        }
        this.fetch(url, (data, hasError) => {
            if (hasError) {
                this.contentNode.open(null);
                this.showContentNode({
                    title: 'Error',
                    body: 'エラーが発生しました。<br>不具合によるものと思われますので、対処されるまでお待ちください。',
                    mode: ContentNode.MODE_ERROR
                }, null);

                // 同じネットワークの再表示
                this.startNetworkIn();
            } else {
                if (this.animationMode === HorrorGameNetwork.ANIMATION_MODE_NETWORK_OUT) {
                    this.dataCache = data;
                    this.waitNetworkOut = true;
                } else {
                    this.showNewNetwork(data);
                }
            }
        });
    }

    /**
     * 新しいネットワークの表示
     *
     * @param data
     */
    showNewNetwork(data)
    {
        window.scrollTo(0, 0);
        this.clearNodes();
        this.mainDOM.innerHTML = '';
        this.bg2.clear();
        this.mainDOM.innerHTML = data.network;
        this.popupDOM.innerHTML = data.popup;
        this.loadNodes();
        this.startNetworkIn();
    }

    /**
     * データの取得
     *
     * @param url
     * @param callback
     */
    fetch(url, callback)
    {
        let urlObj = new URL(url);
        urlObj.searchParams.append('a', '1');
        url = urlObj.toString();

        fetch(url, {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        }).then((response) => {
            if (!response.ok) {
                return response.json().then(error => {
                    callback(error, true);
                    throw new Error('Fetch error');
                });
            }
            return response.json(); // JSON形式のレスポンスを取得
        }).then((data) => {
            // データの取得が成功した場合の処理
            callback(data, false);
        }).catch((error) => {
            // エラーが発生した場合の処理
            console.error('There was a problem with the fetch operation:');
            console.error(error);
        });
    }

    /**
     * ポップステート
     *
     * @param e
     */
    popState(e)
    {
        if (this.contentNode.isOpened()) {
            this.contentNode.close(true);
        } else {
            if (e.state) {
                if (e.state.type === 'network') {
                    this.changeNetwork(location.href, true);
                } else if (e.state.type === 'contentNode') {
                    this.openContentNode(location.href, e.state.linkNodeId);
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

    /**
     * Bodyでスクロールさせるモード
     *
     * @param x
     * @param y
     */
    setBodyScrollMode(x, y)
    {
        this.scrollMode = HorrorGameNetwork.SCROLL_MODE_BODY;
        this.scroller.classList.remove('self-scroll');
        window.scrollTo(x, y);
    }

    /**
     * 独自スクローラーでスクロールさせるモード
     *
     * @param x
     * @param y
     */
    setContainerScrollMode(x, y)
    {
        this.scrollMode = HorrorGameNetwork.SCROLL_MODE_SCROLLER;
        this.scroller.classList.add('self-scroll');

        // スクロール位置をリセット
        window.scrollTo(x, 0);
        this.scroller.scrollTo(x, y);
        this.scrollModeStartPosY = y;
        this.scrollModeScrollPosY = y;
    }
}

window.onload = function() {
    const hgn = HorrorGameNetwork.getInstance();
    hgn.start();
}
