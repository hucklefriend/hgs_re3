import {DOMNode, TextNode, Bg2OctaNode} from './hgn/node/octa-node.js';
import {Bg2PointNode} from './hgn/node/point-node.js';
import {LinkNode} from './hgn/node/link-node.js';
import {EntranceNode} from './hgn/node/entrance-node.js';
import {ContentNode, ContentLinkNode} from './hgn/node/content-node.js';
import {Head1Node, Head2Node, Head3Node} from './hgn/node/head-node.js';
import {PopupNode, PopupLinkNode} from './hgn/node/popup-node.js';
import {Param} from './hgn/param.js';
import {Util} from './hgn/util.js';
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
    static ANIMATION_MODE_APPEAR = 1;
    static ANIMATION_MODE_DISAPPEAR = 2;

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
        this.contentNode = null;
        this.entranceNode = null;
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

        // 次の更新でメイン再描画するフラグ
        // redrawFlagでも描画される
        this.redrawMainFlag = false;

        // 次の更新でBG2再描画するフラグ
        // redrawFlagでも描画される
        this.redrawBg2Flag = false;

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
        this.animCnt = 0;
        this.edgeScale = 0;

        this.isWaitDisappear = false;
        this.dataCache = null;

        this.loadingShowTimer = null;
        this.changeNetworkAppearTimer = null;
    }

    /**
     * インスタンスの取得
     *
     * @returns {HorrorGameNetwork}
     */
    static getInstance()
    {
        return HorrorGameNetwork.instance;
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
     * 特定のカウントから数えなおしたカウントを取得
     *
     * @param offset
     * @returns {number}
     */
    getOffsetAnimCnt(offset)
    {
        return this.animCnt - offset;
    }

    /**
     * DOMからノードの読み取り
     */
    loadNodes()
    {
        let connections = [];

        // コンテンツノード
        this.contentNodeDOM = document.querySelector('#content-node');
        if (this.contentNodeDOM) {
            this.contentNode = new ContentNode(this.contentNodeDOM);
        }

        // エントランスノード
        let elem = document.querySelector('#entrance-node');
        if (elem) {
            this.entranceNode = new EntranceNode(elem);
            this.nodesIdHash['#entrance-node'] = this.entranceNode;
        }

        // テキストノード
        let elems = document.querySelectorAll('.text-node');
        elems.forEach(elem => {
            this.domNodes.push(new TextNode(elem));
            if (elem.id.length > 0) {
                this.nodesIdHash[elem.id] = this.domNodes[this.domNodes.length - 1];
                this.loadConnection(elem, connections);
            }
        });

        // リンクノード
        elems = document.querySelectorAll('.link-node');
        elems.forEach(elem => {
            let newNode = new LinkNode(elem);
            this.domNodes.push(newNode);
            if (elem.id.length > 0) {
                this.nodesIdHash[elem.id] = newNode;
                this.loadConnection(elem, connections);
            }
        });

        // コンテンツリンクノード
        elems = document.querySelectorAll('.content-link-node');
        elems.forEach(elem =>  {
            let newNode = new ContentLinkNode(elem);
            this.domNodes.push(newNode);
            if (elem.id.length > 0) {
                this.nodesIdHash[elem.id] = newNode;
                this.loadConnection(elem, connections);
            }
        });

        // ポップアップリンクノード
        elems = document.querySelectorAll('.popup-link-node');
        elems.forEach(elem =>  {
            let newNode = new PopupLinkNode(elem);
            this.domNodes.push(newNode);
            if (elem.id.length > 0) {
                this.nodesIdHash[elem.id] = newNode;
                this.loadConnection(elem, connections);
            }
        });

        // ポップアップノード
        elems = document.querySelectorAll('.popup-node');
        elems.forEach(elem =>  {
            this.popupNodes.push(new PopupNode(elem));
            if (elem.id.length > 0) {
                this.nodesIdHash[elem.id] = this.popupNodes[this.popupNodes.length - 1];
            }
        });

        // DOMノード
        elems = document.querySelectorAll('.dom-node');
        elems.forEach(elem =>  {
            let newNode = new DOMNode(elem, 15);
            this.domNodes.push(newNode);
            if (elem.id.length > 0) {
                this.nodesIdHash[elem.id] = this.domNodes[this.domNodes.length - 1];
                this.loadConnection(elem, connections);
            }
        });

        // H1ノード
        elems = document.querySelectorAll('.head1');
        elems.forEach(elem =>  {
            this.domNodes.push(new Head1Node(elem, 10));
        });

        // H2ノード
        elems = document.querySelectorAll('.head2');
        elems.forEach(elem =>  {
            this.domNodes.push(new Head2Node(elem, 10));
        });

        // H3ノード
        elems = document.querySelectorAll('.head3');
        elems.forEach(elem =>  {
            this.domNodes.push(new Head3Node(elem));
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

    /**
     * メインネットワーク間のノード接続
     * 接続先のidの配列がdata-connectにJSON形式で入っている
     *
     * @param nodeElem
     * @param connections
     */
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
        if (this.contentNode) {
            this.contentNode.reload();
        }

        if (this.entranceNode) {
            this.entranceNode.reload();
        }

        this.popupNodes.forEach(node => {
            node.reload();
        });

        this.domNodes.forEach(node => {
            node.reload();
        });

        this.hrList.forEach(hr => {
            hr.reload();
        });

        this.isLoaded = true;
    }

    /**
     * ノードのクリア
     */
    clearNodes()
    {
        this.nodesIdHash = {};

        if (this.contentNode) {
            // コンテンツノードは消さない
        }

        if (this.entranceNode) {
            this.entranceNode.delete();
            this.entranceNode = null;
        }

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
        this.setContainerScrollMode(0, 0);

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
            window.history.pushState({type: 'contentNode', 'linkNodeId': linkNodeId, title:document.title}, '');
        } else {
            window.history.pushState({type: 'network', title:document.title}, '');
        }

        if (window.ratingCheck) {
            this.showRatingCheck();
        } else {
            this.appear();
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
        if (this.edgeScale === 0) {
            return;
        }

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

                        let x1 = node.vertices[vertexNo].x;
                        let y1 = node.vertices[vertexNo].y;
                        let x2 = targetVertex.x;
                        let y2 = targetVertex.y;

                        let centerX = (x1 + x2) / 2;
                        let centerY = (y1 + y2) / 2;

                        // centerXとx1のthis.scaleに合わせた中間点
                        let midX1 = Util.getMidpoint(centerX, x1, this.edgeScale);
                        let midY1 = Util.getMidpoint(centerY, y1, this.edgeScale);
                        this.mainCtx.moveTo(midX1, midY1);

                        // centerXとx2のthis.scaleに合わせた中間点
                        let midX2 = Util.getMidpoint(centerX, x2, this.edgeScale);
                        let midY2 = Util.getMidpoint(centerY, y2, this.edgeScale);
                        this.mainCtx.lineTo(midX2, midY2);


                        // this.mainCtx.moveTo(node.vertices[vertexNo].x, node.vertices[vertexNo].y);
                        // this.mainCtx.lineTo(targetVertex.x, targetVertex.y);
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
        if (this.entranceNode) {
            this.entranceNode.draw(this.mainCtx);
        }

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
     * メインキャンバス描画フラグの設定
     */
    setRedrawMain()
    {
        this.redrawMainFlag = true;
    }

    /**
     * BG2再描画フラグの設定
     */
    setRedrawBg2()
    {
        this.redrawBg2Flag = true;
    }

    /**
     * 更新
     */
    update()
    {
        this.animCnt++;

        if (this.entranceNode) {
            this.entranceNode.update();
        }

        this.changeSize();

        this.scroll();

        this.contentNode.update();

        switch (this.animationMode) {
            case HorrorGameNetwork.ANIMATION_MODE_APPEAR:
                this.appearAnimation();
                break;
            case HorrorGameNetwork.ANIMATION_MODE_DISAPPEAR:
                this.disappearAnimation();
                break;
            case HorrorGameNetwork.ANIMATION_MODE_NONE:
                if (this.isWaitDisappear) {
                    this.isWaitDisappear = false;
                    this.showNewNetwork(this.dataCache);
                } else {
                    this.domNodes.forEach(node => {
                        node.update();
                    });
                }

                break;
        }

        if (this.redrawFlag) {
            this.draw();
            this.bg2.draw();
            this.bg1.draw(this, this.bg2);
        } else if (this.redrawMainFlag) {
            this.draw();
        } else if (this.redrawBg2Flag) {
            this.bg2.draw();
        }

        this.redrawFlag = false;
        this.redrawMainFlag = false;
        this.redrawBg2Flag = false;
        if (Param.SHOW_DEBUG) {
            this.showDebug();
        }
        window.requestAnimationFrame(this.update);
    }

    /**
     * 出現
     */
    appear()
    {
        this.animationMode = HorrorGameNetwork.ANIMATION_MODE_APPEAR;
        this.animCnt = 0;
        this.edgeScale = 0;
        this.bg2.setStrokeStyle();

        this.domNodes.forEach(node => {
            node.appear();
        });
        this.hrList.forEach(hr => {
            hr.appear();
        });

        if (this.entranceNode) {
            this.entranceNode.appear();
        }

        // 0.2秒後に背景の描画を開始
        this.changeNetworkAppearTimer = setTimeout(() => {
            this.setBodyScrollMode(0, 0);
        }, 500);
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        if (this.animCnt > 10 && this.animCnt < 25) {
            this.edgeScale = Util.getMidpoint(0, 1, (this.animCnt - 10) / 15);
        } else if (this.animCnt === 25) {
            this.edgeScale = 1;
        }

        this.domNodes.forEach(node => {
            node.update();
        });
        this.hrList.forEach(hr => {
            hr.update();
        });

        this.setRedraw();

        if (this.animCnt === 30) {
            this.animationMode = HorrorGameNetwork.ANIMATION_MODE_NONE;
        }
    }

    /**
     * 消える
     */
    disappear()
    {
        this.animationMode = HorrorGameNetwork.ANIMATION_MODE_DISAPPEAR;
        this.animCnt = 0;

        this.domNodes.forEach(node => {
            node.disappear();
        });
        this.hrList.forEach(hr => {
            hr.disappear();
        });

        if (this.entranceNode) {
            this.entranceNode.disappear();
        }
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
        if (this.animCnt > 10 && this.animCnt < 25) {
            this.edgeScale = Util.getMidpoint(0, 1, 1 - (this.animCnt - 10) / 15);
        } else if (this.animCnt === 25) {
            this.edgeScale = 0;
        }

        this.domNodes.forEach(node => {
            node.update();
        });
        this.hrList.forEach(hr => {
            hr.update();
        });

        this.setRedraw();

        if (this.animCnt === 30) {
            this.animationMode = HorrorGameNetwork.ANIMATION_MODE_NONE;
        }
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
    scroll(force = false)
    {
        if (!force && this.prevScrollX === window.scrollX &&
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
     * @param isPopState
     */
    openContentNode(url, linkNodeId, isPopState)
    {
        let linkNode = null;
        if (this.nodesIdHash.hasOwnProperty(linkNodeId)) {
            linkNode = this.nodesIdHash[linkNodeId];
        }
        this.contentNode.open(linkNode);

        if (!isPopState) {
            // pushStateにつっこむ
            window.history.pushState({type: 'contentNode', linkNodeId: linkNodeId}, '', url);
        }
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
        // 表示処理中だったら表示処理のキャンセル
        if (this.changeNetworkAppearTimer !== null) {
            clearTimeout(this.changeNetworkAppearTimer);
            this.changeNetworkAppearTimer = null;
        }

        // 遷移中はスクロールさせない
        this.setContainerScrollMode(window.scrollX, window.scrollY);

        this.contentNode.historyUrl = location.href;
        this.contentNode.historyState = window.history.state;
        this.disappear();

        this.fetch(url, (data, hasError) => {
            if (hasError) {
                this.contentNode.open(null);
                this.showContentNode({
                    title: 'エラー',
                    body: 'エラーが発生しました。<br>不具合によるものと思われますので、対処されるまでお待ちください。',
                    documentTitle: 'エラー|ホラーゲームネットワーク',
                    mode: ContentNode.MODE_ERROR
                }, null);

                if (!isBack) {
                    // pushStateにつっこむ
                    window.history.pushState({type:'network', title:'エラー|ホラーゲームネットワーク'}, null, url);
                }

                // 同じネットワークの再表示
                this.appear();
            } else {
                data.url = url;
                if (this.animationMode === HorrorGameNetwork.ANIMATION_MODE_DISAPPEAR) {
                    this.dataCache = data;
                    this.isWaitDisappear = true;
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
        this.scrollModeScrollPosY = 0;
        this.scrollModeStartPosY = 0;
        this.scroll(true);
        this.clearNodes();
        this.mainDOM.innerHTML = '';
        this.bg2.clear();
        this.mainDOM.innerHTML = data.network;
        this.popupDOM.innerHTML = data.popup;

        // 遷移中はスクロールさせない
        this.setContainerScrollMode(window.scrollX, window.scrollY);

        // windowタイトルの変更
        if (data.title) {
            document.title = data.title;
        }

        window.history.pushState({type:'network', title:data.title}, null, data.url);

        this.loadNodes();

        if (data.ratingCheck) {
            this.showRatingCheck();
        } else {
            this.appear();
        }
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

        this.loadingShowTimer = setTimeout(()=>{
            document.querySelector('#loading').style.display = 'block';
        }, 1000);

        fetch(url, {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        }).then((response) => {
            if (this.loadingShowTimer !== null) {
                clearTimeout(this.loadingShowTimer);
            }
            this.loadingShowTimer = null;
            document.querySelector('#loading').style.display = 'none';

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
                    this.openContentNode(location.href, e.state.linkNodeId, true);
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
     * ポップアップノードの非表示
     *
     * @param id
     */
    closePopupNode(id)
    {
        let node = this.nodesIdHash[id];
        if (node) {
            node.close();
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

    /**
     * レーティングチェックの表示
     */
    showRatingCheck()
    {
        if (!document.cookie.includes("over18=true")) {
            this.openPopupNode('rating-check-popup');
        } else {
            this.appear();
        }
    }
}

window.onload = function() {
    const hgn = new HorrorGameNetwork();
    hgn.start();

    window.lazyCss.forEach((url) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    });
}
