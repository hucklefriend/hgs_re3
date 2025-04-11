
import { Param } from '../common/param.js';
import { Util } from '../common/util.js';
import { Rect } from '../common/rect.js';
//import { SubNetworkWorker } from './sub-network-worker.js';


/**
 * サブネットワークビューア
 */
export class SubNetworkViewer
{
    /**
     * タイプ
     */
    get TYPE()
    {
        return 'sub-network';
    }
    
    /**
     * コンストラクタ
     */
    constructor()
    {
        this.subCanvas = document.querySelector('#sub-canvas');
        this.subCtx = this.subCanvas.getContext('2d');
        this.subOffscreenCanvas = new OffscreenCanvas(1, 1);
        this.subOffscreenCtx = this.subOffscreenCanvas.getContext('2d');

        // 描画状態のキャッシュ
        this._strokeStyle = "rgba(0, 100, 0, 0.8)";
        this._lineWidth = 1;
        this._shadowColor = "lime";
        this._shadowBlur = 3;
        this._fillStyle = "rgba(0, 150, 0, 0.8)";

        this._setDrawingState(this.subOffscreenCtx);

        this.viewRect = new Rect(0, 0, 0, 0);
    }

    /**
     * キャンバスサイズを設定
     */
    setCanvasSize()
    {
        if (this.subCanvas.height == window.hgn.viewer.height) {
            return;
        }

        this.subCanvas.width = window.hgn.body.offsetWidth;
        this.subCanvas.height = window.hgn.viewer.height;

        //this.subOffscreenCanvas.width = window.innerWidth;
        //this.subOffscreenCanvas.height = window.innerHeight;
        this.subOffscreenCanvas.width = window.innerWidth;
        this.subOffscreenCanvas.height = this.subCanvas.height;

        this._setDrawingState(this.subOffscreenCtx);

        // this.postMessage({
        //     type: 'resize',
        //     width: this.subCanvas.width, 
        //     height: this.subCanvas.height,
        //     windowWidth: window.innerWidth,
        //     windowHeight: window.innerHeight
        // });
    }

    /**
     * 描画状態を設定
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    _setDrawingState(ctx)
    {
        ctx.strokeStyle = this._strokeStyle;
        ctx.lineWidth = this._lineWidth;
        ctx.shadowColor = this._shadowColor;
        ctx.shadowBlur = this._shadowBlur;
        ctx.fillStyle = this._fillStyle;
    }

    /**
     * ビューレクトを更新
     * 
     * @param {Rect} viewRect
     */
    update(viewRect)
    {
        this.viewRect.copyFrom(viewRect);
        //this.viewRect.move(0, this.viewRect.top - (this.viewRect.top * Param.SUB_NETWORK_SCROLL_RATE));
    }

    /**
     * キャンバスを描画
     */
    drawCanvas(viewRect)
    {
        // オフスクリーンキャンバスの内容をメインキャンバスへ
        this.subCtx.clearRect(
            // viewRect.left, viewRect.top,
            // viewRect.width, viewRect.height
            0, 0, 
            this.subCanvas.width, this.subCanvas.height
        );
        this.subCtx.drawImage(
            this.subOffscreenCanvas,
            0, 0//, // ソースの開始位置
            //this.subOffscreenCanvas.width, this.subOffscreenCanvas.height, // ソースのサイズ
            // viewRect.left, viewRect.top, // 描画先の開始位置
            // viewRect.width, viewRect.height // 描画先のサイズ
        );

        this.subOffscreenCtx.clearRect(0, 0,
            this.subOffscreenCanvas.width, this.subOffscreenCanvas.height);
    }
















/*
    /**
     * ワーカーを初期化
     *
    initWorker()
    {
        // サブネットワークのワーカー
        const workerUrl = import.meta.env.DEV
            ? '/vite/resources/js/viewer/sub-network-worker.js'             // 開発用
            : new URL('./viewer/sub-network-worker.js', import.meta.url);   // 本番用
        const worker = new Worker(workerUrl, { type: 'module' });
        this.subNetworkWorker = worker;

        this.subNetworkWorker.postMessage({ type: 'init', canvas: this.subCanvasOffscreen }, [this.subCanvasOffscreen]);

        // ワーカーメッセージのハンドラを設定
        this.subNetworkWorker.onmessage = (e) => {
            if (e.data.type === 'draw-complete') {
                // ワーカーでの描画が完了したら、subCanvasに描画
                this.subCtx.clearRect(0, 0, this.subCanvas.width, this.subCanvas.height);
                this.subCtx.drawImage(e.data.bitmap, 0, 0);
                // ImageBitmapを使用後に解放
                e.data.bitmap.close();
            }
        };
    }

    /**
     * メッセージを送信
     * 
     * @param {*} message 
     *
    postMessage(message)
    {
        this.subNetworkWorker.postMessage(message);
    }
*/
}
