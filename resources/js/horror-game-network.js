
import { MapViewer } from './viewer/map-viewer.js';
import { DocumentViewer } from './viewer/document-viewer.js';
import { ContentViewer } from './viewer/content-viewer.js';
import { PopupNode } from './node/popup-node.js';
import { Param } from './common/param.js';
import { Util } from './common/util.js';
import { Background } from './viewer/background.js';
import SubNetworkWorker from './viewer/sub-network-worker.js';

/**
 * ホラーゲームネットワーク
 * シングルトン
 */
export class HorrorGameNetwork
{
    static #instance = null;

    static ANIMATION_MODE_NONE = 0;
    static ANIMATION_MODE_APPEAR = 1;
    static ANIMATION_MODE_DISAPPEAR = 2;

    /**
     * コンストラクタ
     */
    constructor()
    {
        if (HorrorGameNetwork.#instance) {
            throw new Error('HorrorGameNetworkのインスタンスは既に存在します。getInstance()を使用してください。');
        }

        // 各種ビューアの用意
        this.documentViewer = new DocumentViewer();
        this.mapViewer = new MapViewer();
        this.viewer = null;         // 現在のメインビューア
        this.waitViewer = null;     // 交代前の待ちビューア

        // コンテンツビューアとポップアップビューアはthis.viewerに入ることはないサブのビューア
        this.contentViewer = new ContentViewer();
        //this.popupViewer = new PopupViewer();

        this.background = new Background(); // 背景

        this.body = document.querySelector('body');

        // メインのcanvas
        this.mainCanvas = document.querySelector('#main-canvas');
        this.mainCtx = null;
        this.mainCtx = this.mainCanvas.getContext('2d');

        // オフスクリーンキャンバスの生成
        // 未対応の場合は既存のcanvasで代用anvasで代用
        this.offscreenCanvas = null;
        if (typeof OffscreenCanvas !== 'undefined') {
            this.offscreenCanvas = new OffscreenCanvas(1, 1);
        } else {
            this.offscreenCanvas = document.createElement('canvas');
            this.offscreenCanvas.width = 1;
            this.offscreenCanvas.height = 1;
        }
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');

        this.isDrawMain = false;    // 次の更新でメインを再描画するフラグ
        this.isDrawOutsideView = false; // メインの描画で表示領域外も描画するか
        
        // サブネットワークのワーカー
        const workerUrl = import.meta.env.DEV
            ? '/vite/resources/js/viewer/sub-network-worker.js'             // 開発用
            : new URL('./viewer/sub-network-worker.js', import.meta.url);   // 本番用
        const worker = new Worker(workerUrl, { type: 'module' });
        this.subNetworkWorker = worker;
        const subCanvas = document.querySelector('#sub-canvas');
        const subCanvasOffscreen = subCanvas.transferControlToOffscreen();
        this.subNetworkWorker.postMessage({ type: 'init', canvas: subCanvasOffscreen }, [subCanvasOffscreen]);

        window.addEventListener('popstate', (e) => {
            this.popState(e);
        });

        this.isLoaded = false;

        this.animationMode = HorrorGameNetwork.ANIMATION_MODE_NONE;
        this.animCnt = 0;
        this.edgeScale = 0;

        this._animStartTime = 0;
        this._animElapsedTime = 0;
        this._time = 0;

        this.isWaitDisappear = false;
        this.dataCache = null;

        this.loadingShowTimer = null;
        this.changeNetworkAppearTimer = null;

        this.scrollTimer = null;

        this.lastFrameTime = 0;
        this.fps = 30;
        this.frameInterval = 1000 / this.fps;
        
        if (Param.SHOW_DEBUG) {
            this.debug = document.querySelector('#debug');
            this.lastTime = 0;
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
        if (!HorrorGameNetwork.#instance) {
            HorrorGameNetwork.#instance = new HorrorGameNetwork();
        }

        return HorrorGameNetwork.#instance;
    }

    /**
     * 更新時間の取得
     * 
     * @returns {number}
     */
    get time()
    {
        return this._time;
    }

    /**
     * アニメーション開始時間の取得
     */
    get animStartTime()
    {
        return this._animStartTime;
    }

    /**
     * アニメーション経過時間の取得
     */
    get animElapsedTime()
    {
        return this._animElapsedTime;
    }

    /**
     * 開始
     */
    start(type, params = {})
    {
        if (type === 'document') {
            // ドキュメントビューワ
            this.viewer = this.documentViewer;
        } else if (type === 'map') {
            // マップビューワ
            this.viewer = this.mapViewer;

            // マップビューワの初期化
            this.viewer.prepare(params);
        }

        this.viewer.start(false);
        this.setCanvasSize();   // 

        if (window.contentNode !== null) {
            let linkNodeId = window.contentNode.linkNodeId;
            let linkNode = this.viewer.getNodeById(linkNodeId);

            this.contentViewer.open(linkNode);
            this.contentViewer.setContent(window.contentNode);

            window.contentNode = null;
            window.history.pushState({type: 'content', 'linkNodeId': linkNodeId, title:document.title}, '');

            if (linkNode !== null) {
                this.viewer.scrollToNode(linkNode);
            }
        } else {
            window.history.pushState({type: type, title:document.title}, '');
        }

        if (Param.SHOW_DEBUG) {
            this.showDebug();
        }

        window.addEventListener('resize', (e) => {this.resize(e);});
        window.addEventListener('scroll', () => {this.scroll();});
    
        if (window.ratingCheck) {
            window.requestAnimationFrame(time => {
                this.showRatingCheck();
                this.update(time);
            });
            
        } else {
            window.requestAnimationFrame(time => {
                this._time = time;  // appearの中で使うが、updateより先に実行したいのでここでセットしておく
                this.appear();
                this.update(time);
            });
        }
    }

    /**
     * サブネットワークワーカーにメッセージを送信
     * 
     * @param {Object} obj
     */
    postMessageToSubNetworkWorker(obj)
    {
        this.subNetworkWorker.postMessage(obj);
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
     * 更新
     */
    update(time)
    {
        this._time = time;
        this._animElapsedTime = time - this.animStartTime;
        this.animCnt++;

        this.contentViewer.update();

        this.viewer.update();

        if (this.isDrawMain) {
            this.drawMain();
            this.isDrawMain = false;
            this.isDrawOutsideView = false;
        }

        // 交代？
        if (this.waitViewer !== null) {
            console.log(this.viewer.appearedNodeCnt);
            // 現在のビューワでノードが全部消えて、次のビューワの準備が整っている
            if (this.viewer.isAllNodeDisappeared() && this.waitViewer.isWait) {
                // ビューワの交代
                this.viewer.end();
                this.viewer = this.waitViewer;
                this.viewer.start(true);
                this.waitViewer = null;

                this.viewer.appear();
            }
        }

        if (Param.SHOW_DEBUG) {
            this.showDebug();
        }

        window.requestAnimationFrame(currentTime => this.update(currentTime));
    }

    /**
     * 出現
     */
    appear()
    {
        this._animStartTime = this._time;
        this._animElapsedTime = 0;

        this.viewer.appear();
    }

    /**
     * 消失
     */
    disappear()
    {
        this._animStartTime = this._time;
        this._animElapsedTime = 0;

        this.viewer.disappear();
    }

    /**
     * ウィンドウサイズの変更
     */
    resize()
    {
        this.viewer.resize();
        this.contentViewer.resize();

        this.setCanvasSize();
        this.setDraw(true);
    }

    /**
     * Canvasサイズを設定
     */
    setCanvasSize()
    {
        this.mainCanvas.width = this.body.offsetWidth;
        this.mainCanvas.height = this.body.offsetHeight;

        if (this.offscreenCanvas) {
            this.offscreenCanvas.width = this.viewer.viewRect.width;
            this.offscreenCanvas.height = this.viewer.viewRect.height;
        }

        this.postMessageToSubNetworkWorker({
            type: 'resize',
            width: this.body.offsetWidth, 
            height: this.body.offsetHeight,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
    }

    /**
     * スクロール
     */
    scroll()
    {
        this.viewer.scroll();

        if (this.scrollTimer !== null) {
            clearTimeout(this.scrollTimer);
        }

        this.setDrawSub();
    }

    /**
     * メインの描画
     */
    drawMain()
    {
        if (this.isDrawOutsideView) {
            this.offscreenCanvas.width = this.mainCanvas.width;
            this.offscreenCanvas.height = this.mainCanvas.height;
        } else {
            this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        }

        this.viewer.draw(this.offscreenCtx, this.isDrawOutsideView);

        if (this.isDrawOutsideView) {
            // オフスクリーンキャンバスの内容をメインキャンバスへ
            this.mainCtx.clearRect(0, 0,this.mainCanvas.width, this.mainCanvas.height);
            this.mainCtx.drawImage(this.offscreenCanvas, 0, 0);

            this.offscreenCanvas.width = this.viewer.viewRect.width;
            this.offscreenCanvas.height = this.viewer.viewRect.height;
        } else {
            // オフスクリーンキャンバスの内容をメインキャンバスへ
            this.mainCtx.clearRect(
                this.viewer.viewRect.left, this.viewer.viewRect.top,
                this.viewer.viewRect.width, this.viewer.viewRect.height
            );
            this.mainCtx.drawImage(
                this.offscreenCanvas,
                0, 0, // ソースの開始位置
                this.offscreenCanvas.width, this.offscreenCanvas.height, // ソースのサイズ
                //this.viewer.viewRect.width, this.viewer.viewRect.height, // ソースのサイズ
                this.viewer.viewRect.left, this.viewer.viewRect.top, // 描画先の開始位置
                this.viewer.viewRect.width, this.viewer.viewRect.height // 描画先のサイズ
            );
        }
    }

    /**
     * メイン・サブ両方の描画の設定
     */
    setDraw(isDrawOutsideView = false)
    {
        this.setDrawMain(isDrawOutsideView);
        this.setDrawSub();
    }

    /**
     * メイン描画フラグの設定
     * 
     * @param {boolean} isDrawOutsideView
     */
    setDrawMain(isDrawOutsideView = false)
    {
        this.isDrawMain = true;
        this.isDrawOutsideView = isDrawOutsideView;
    }

    /**
     * サブ描画をサブネットワークワーカーへ転送
     */
    setDrawSub()
    {
        this.postMessageToSubNetworkWorker({ type: 'draw', viewRect: this.viewer.viewRect });
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

    navigateToMap(url, isBack = false)
    {
        this.navigateToNextViewer(this.mapViewer, url);
    }

    navigateToDocument(url, isBack = false)
    {
        this.navigateToNextViewer(this.documentViewer, url, isBack);
    }

    navigateToNextViewer(waitViewer, url, isBack = false)
    {
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
                this.waitViewer = waitViewer;
                this.waitViewer.prepare(data);
            }
        });
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
            callback(error, true);
            throw new Error('Fetch error');
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

window.hgn = HorrorGameNetwork.getInstance();

