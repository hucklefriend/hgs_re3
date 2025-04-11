import { MapViewer } from './viewer/map-viewer.js';
import { DocumentViewer } from './viewer/document-viewer.js';
import { ContentViewer } from './viewer/content-viewer.js';
import { PopupViewer } from './viewer/popup-viewer.js';
import { Param } from './common/param.js';
import { Util } from './common/util.js';
import { Background } from './viewer/background.js';
import { SubNetworkViewer } from './viewer/sub-network-viewer.js';
import { loadComponents } from './components/index.js';
import { NormalLink } from './common/normal-link.js';

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

        this.components = loadComponents();;
        this.createdComponents = {};

        // 各種ビューアの用意
        this.documentViewer = new DocumentViewer();
        this.mapViewer = new MapViewer();
        this.viewer = null;         // 現在のメインビューア
        this.waitViewer = null;     // 交代前の待ちビューア

        // 以下はthis.viewerに入ることはないサブのビューア
        this.contentViewer = new ContentViewer();
        this.popupViewer = new PopupViewer();
        this.subNetworkViewer = new SubNetworkViewer();

        this.background = new Background(); // 背景

        this.body = document.querySelector('body');
        this.canvasContainer = document.querySelector('#canvas-container');

        // メインのcanvas
        this.mainCanvas = document.querySelector('#main-canvas');
        this.mainCtx = this.mainCanvas.getContext('2d');

        // オフスクリーンキャンバスの生成
        // 未対応の場合は既存のcanvasで代用
        // this.offscreenCanvas = null;
        // if (typeof OffscreenCanvas !== 'undefined') {
        //     this.offscreenCanvas = new OffscreenCanvas(1, 1);
        // } else {
        //     this.offscreenCanvas = document.createElement('canvas');
        //     this.offscreenCanvas.width = 1;
        //     this.offscreenCanvas.height = 1;
        // }
        // this.offscreenCtx = this.offscreenCanvas.getContext('2d');

        this._isDrawMain = false;    // 次の更新でメインを再描画するフラグ
        this._isDrawOutsideView = false; // メインの描画で表示領域外も描画するか
        this._isDrawSub = false; // サブ描画フラグ

        window.addEventListener('popstate', (e) => {
            this.popState(e);
        });

        this.isLoaded = false;

        this.animationMode = HorrorGameNetwork.ANIMATION_MODE_NONE;
        this.edgeScale = 0;

        this._animStartTime = 0;
        this._animElapsedTime = 0;
        this._time = 0;

        this.loadingShowTimer = null;

        this.lastFrameTime = 0;
        this.fps = 30;
        this.frameInterval = 1000 / this.fps;

        this._normalLinks = [];
        
        if (Param.SHOW_DEBUG) {
            this.debug = document.querySelector('#debug');
            this.lastTime = 0;
            this.frameCount = 0;
            this.fps = 0;
        }

        this._scrollTimeout = null;
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
     * 
     * @returns {number}
     */
    get animStartTime()
    {
        return this._animStartTime;
    }

    /**
     * アニメーション経過時間の取得
     * 
     * @returns {number}
     */
    get animElapsedTime()
    {
        return this._animElapsedTime;
    }

    /**
     * 開始
     * 
     * @param {string} type
     */
    start(type)
    {
        this.popupViewer.loadNodes();

        if (type === this.documentViewer.TYPE) {
            // ドキュメントビューワ
            this.viewer = this.documentViewer;
        } else if (type === this.mapViewer.TYPE) {
            // マップビューワ
            this.viewer = this.mapViewer;
        }

        this.viewer.start(false);
        this.setCanvasSize();
        
        if (window.content !== null) {
            // コンテンツノードの表示
            let linkNodeId = window.content.linkNodeId;
            let linkNode = this.viewer.getNodeById(linkNodeId);

            this.contentViewer.open(linkNode);
            this.contentViewer.setContent(window.content);

            window.content = null;
            window.history.pushState({type: this.contentViewer.TYPE, 'linkNodeId': linkNodeId, title: document.title}, '');
        } else {
            window.history.pushState({type: type, title: document.title}, '');
        }

        if (Param.SHOW_DEBUG) {
            this.showDebug();
        }

        window.addEventListener('resize', (e) => {this.resize(e);});
        window.addEventListener('scroll', () => {this.scroll();});

        this.setupNormalLink();
    
        if (window.ratingCheck) {
            window.requestAnimationFrame(time => {
                this.showRatingCheck();
                this.update(time);
            });
            
        } else {
            window.requestAnimationFrame(time => {
                this._time = time;  // appearの中で使うが、updateより先に実行したいのでここでセットしておく
                this.update(time);
                this.appear();
            });
        }
    }

    /**
     * 更新 
     * 
     * @param {number} time
     */
    update(time)
    {
        this._time = time;
        this._animElapsedTime = time - this.animStartTime;

        this.contentViewer.update();
        this.popupViewer.update();
        this.viewer.update();

        if (this._isDrawMain) {
            // メインキャンバスの描画
            this.drawMain();
            this._isDrawMain = false;
            this._isDrawOutsideView = false;
        }

        if (this._isDrawSub) {
            this.subNetworkViewer.update(this.viewer.viewRect);
            this.viewer.updateSub();
    
            // サブ描画
            this.drawSub();
            this._isDrawSub = false;
        }

        // 次のビューワが交代を待っている？
        if (this.waitViewer !== null) {
            // 現在のビューワでノードが全部消えて、次のビューワの準備が整っているなら交代する
            if (this.viewer.isAllNodeDisappeared()) {
                //this.subNetworkViewer.postMessage({ type: 'clear-networks', viewRect: this.viewer.viewRect });

                if (this.waitViewer.isWait) {
                    this.clearComponents(); // 作成済みコンポーネントの削除
                    this.showNewViewer();   // ビューワの交代
                }
            } else {
                this.viewer.showAppearedNodes();
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
        this.mainCanvas.height = this.viewer.height;

        //this.offscreenCanvas.width = window.innerWidth;
        //this.offscreenCanvas.height = window.innerHeight;

        this.subNetworkViewer.setCanvasSize();

        document.querySelector('#canvas-container-pad').style.top = this.mainCanvas.height + 'px';
    }

    /**
     * スクロール
     * 
     * @param {boolean} isNewViewer
     */
    scroll(isNewViewer = false)
    {
        this.viewer.scroll(isNewViewer);
        this.setDrawSub();
    }

    /**
     * メインの描画
     */
    drawMain()
    {
        if (this._isDrawOutsideView) {
            //this.offscreenCanvas.width = this.mainCanvas.width;
            //this.offscreenCanvas.height = this.mainCanvas.height;
            this.mainCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        } else {
            //this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);

            this.mainCtx.clearRect(this.viewer.viewRect.left, this.viewer.viewRect.top, this.viewer.viewRect.width, this.viewer.viewRect.height);
        }

        this.viewer.draw(this.mainCtx, this._isDrawOutsideView);

        // if (this._isDrawOutsideView) {
        //     // オフスクリーンキャンバスの内容をメインキャンバスへ
        //     this.mainCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        //     this.mainCtx.drawImage(this.offscreenCanvas, 0, 0);

        //     this.offscreenCanvas.width = this.viewer.viewRect.width;
        //     this.offscreenCanvas.height = this.viewer.viewRect.height;
        // } else {
        //     // オフスクリーンキャンバスの内容をメインキャンバスへ
        //     this.mainCtx.clearRect(
        //         this.viewer.viewRect.left, this.viewer.viewRect.top,
        //         this.viewer.viewRect.width, this.viewer.viewRect.height
        //     );
        //     this.mainCtx.drawImage(
        //         this.offscreenCanvas,
        //         0, 0, // ソースの開始位置
        //         this.offscreenCanvas.width, this.offscreenCanvas.height, // ソースのサイズ
        //         this.viewer.viewRect.left, this.viewer.viewRect.top, // 描画先の開始位置
        //         this.viewer.viewRect.width, this.viewer.viewRect.height // 描画先のサイズ
        //     );
        // }
    }   

    /**
     * サブ描画
     */
    drawSub()
    {
        this.viewer.drawSub(this.subNetworkViewer.subOffscreenCtx);
        this.subNetworkViewer.drawCanvas(this.viewer.viewRect);
    }

    /**
     * メイン・サブ両方の描画の設定
     * 
     * @param {boolean} isDrawOutsideView
     */
    setDraw(isDrawOutsideView = false)
    {
        this.setDrawMain(isDrawOutsideView);
        this.setDrawSub();
    }

    /**
     * メイン描画フラグを立てる
     * 
     * @param {boolean} isDrawOutsideView
     */
    setDrawMain(isDrawOutsideView = false)
    {
        this._isDrawMain = true;
        this._isDrawOutsideView |= isDrawOutsideView;
    }

    /**
     * サブ描画フラグを立てる
     */
    setDrawSub()
    {
        this._isDrawSub = true;
        //this.subNetworkViewer.postMessage({ type: 'draw', viewRect: this.viewer.viewRect });
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
     * コンテンツの表示
     *
     * @param {string} url
     * @param {string} linkNodeId
     * @param {boolean} isPopState
     */
    openContentView(url, linkNodeId, isPopState)
    {
        const linkNode = this.viewer.getNodeById(linkNodeId);
        this.contentViewer.open(linkNode, ContentViewer.MODE_NORMAL);

        if (!isPopState) {
            // pushStateにつっこむ
            window.history.pushState({type: this.contentViewer.TYPE, linkNodeId: linkNodeId}, '', url);
        }
        this.fetch(url, (data, hasError) => {
            if (hasError) {
                this.contentViewer.setContent({
                    title: 'Error',
                    body: 'エラーが発生しました。<br>不具合によるものと思われますので、対処されるまでお待ちください。',
                    mode: ContentViewer.MODE_ERROR
                });
            } else {
                this.contentViewer.setContent(data);
            }
        });
    }

    /**
     * コンテンツビューワを閉じる
     */
    closeContentView()
    {
        this.contentViewer.close();
    }

    /**
     * マップビューワへ遷移
     * 
     * @param {string} url
     * @param {boolean} isBack
     */
    navigateToMap(url, isBack = false)
    {
        this.navigateToNextViewer(this.mapViewer, url, isBack);
    }

    /**
     * ドキュメントビューワへ遷移
     *
     * @param {string} url
     * @param {boolean} isBack
     */
    navigateToDocument(url, isBack = false)
    {
        this.navigateToNextViewer(this.documentViewer, url, isBack);
    }

    /**
     * 次のビューワへ遷移
     *
     * @param {DocumentViewer|MapViewer} waitViewer
     * @param {string} url
     * @param {boolean} isBack
     */
    navigateToNextViewer(waitViewer, url, isBack = false)
    {
        this.disappear();

        this.fetch(url, (data, hasError) => {
            if (hasError) {
                console.error(data);
                this.contentViewer.open(null);
                this.contentViewer.setContent({
                    title: 'エラー',
                    body: 'エラーが発生しました。<br>不具合によるものと思われますので、対処されるまでお待ちください。',
                    documentTitle: 'エラー|ホラーゲームネットワーク',
                    mode: ContentViewer.MODE_ERROR
                });
        
                if (!isBack) {
                    // pushStateにつっこむ
                    window.history.pushState({type:this.contentViewer.TYPE, title:'エラー|ホラーゲームネットワーク'}, null, url);
                }

                // 同じネットワークの再表示
                this.appear();
            } else {
                data.url = url;
                data.isBack = isBack;
                this.waitViewer = waitViewer;
                this.waitViewer.prepare(data);
            }
        });
    }

    /**
     * 新しいビューワの表示
     * 
     * @param {boolean} isBack
     */
    showNewViewer(isBack)
    {
        this.clearNomalLink();

        window.scrollTo(0, 0);
        this.scroll(true);

        const title = this.waitViewer.dataCache.title;
        const ratingCheck = this.waitViewer.dataCache.ratingCheck;
        this.popupViewer.clearNodes();
        this.popupViewer.render(this.waitViewer.dataCache.popup);
        this.popupViewer.loadNodes();

        // windowタイトルの変更
        if (title) {
            document.title = title;
        }

        this.viewer.end();
        this.viewer = this.waitViewer;
        this.viewer.start(true, isBack);
        this.waitViewer = null;
        this.setCanvasSize();

        this.setupNormalLink();

        if (ratingCheck) {
            this.showRatingCheck();
        } else {
            this.update(this._time);
            this.appear();
        }
    }

    /**
     * データの取得
     *
     * @param {string} url
     * @param {Function} callback
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
        if (this.contentViewer.isOpened()) {
            this.contentViewer.close(true);
        } else {
            if (e.state) {
                if (e.state.type === this.documentViewer.TYPE) {
                    this.navigateToDocument(location.href, true);
                } else if (e.state.type === this.contentViewer.TYPE) {
                    this.openContentView(location.href, e.state.linkNodeId, true);
                } else if (e.state.type === this.mapViewer.TYPE) {
                    this.navigateToMap(location.href, true);
                }
            }
        }
    }

    /**
     * ポップアップビューアの表示
     *
     * @param {string} id
     */
    openPopupViewer(id)
    {
        this.popupViewer.open(id);
    }

    /**
     * ポップアップビューアの非表示
     *
     * @param {string} id
     */
    closePopupViewer()
    {
        this.popupViewer.close();
    }

    /**
     * レーティングチェックの表示
     */
    showRatingCheck()
    {
        if (!document.cookie.includes("over18=true")) {
            this.openPopupViewer('rating-check-popup');
        } else {
            this.appear();
        }
    }

    /**
     * 画像の読み込み完了を待機
     * 
     * @param {Element} DOM
     * @returns {Promise} すべての画像が読み込まれたらresolve
     */
    waitForImages(DOM)
    {
        const images = DOM.getElementsByTagName('img');
        const promises = Array.from(images).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = () => resolve();
                    img.onerror = () => resolve(); // エラー時も続行
                }
            });
        });
        return Promise.all(promises);
    }

    /**
     * コンポーネントの作成
     * 
     * @param {string} id
     * @param {string} componentName
     * @returns {Object}
     */
    createComponent(id, componentName)
    {
        let component = new this.components[componentName]();
        this.createdComponents[id] = component;
        
        return component;
    }

    /**
     * コンポーネントの削除
     * 
     * @param {string} id
     */
    deleteComponent(id)
    {
        this.createdComponents[id].destroy();
        delete this.createdComponents[id];
    }

    /**
     * 作成済みコンポーネントの削除
     */
    clearComponents()
    {
        Object.keys(this.createdComponents).forEach(id => {
            this.deleteComponent(id);
        });
        this.createdComponents = {};
    }

    /**
     * 通常リンクの設定
     */
    setupNormalLink()
    {
        const normalLinks = document.querySelectorAll('.normal-link');
        normalLinks.forEach(link => {
            this._normalLinks.push(new NormalLink(link));
        });
    }

    /**
     * 通常リンクの削除
     */
    clearNomalLink()
    {
        Object.keys(this._normalLinks).forEach(i => {
            this._normalLinks[i].delete();
            delete this._normalLinks[i];
        });
        this._normalLinks = [];
    }
}

window.hgn = HorrorGameNetwork.getInstance();

