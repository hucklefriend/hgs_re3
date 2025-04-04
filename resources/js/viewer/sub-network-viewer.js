
import { Param } from '../common/param.js';
import { Util } from '../common/util.js';
import { SubNetworkWorker } from './sub-network-worker.js';


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
        // サブネットワークのワーカー
        const workerUrl = import.meta.env.DEV
            ? '/vite/resources/js/viewer/sub-network-worker.js'             // 開発用
            : new URL('./viewer/sub-network-worker.js', import.meta.url);   // 本番用
        const worker = new Worker(workerUrl, { type: 'module' });
        this.subNetworkWorker = worker;
        this.subCanvas = document.querySelector('#sub-canvas');
        this.subCanvasOffscreen = new OffscreenCanvas(this.subCanvas.width, this.subCanvas.height);
        this.subNetworkWorker.postMessage({ type: 'init', canvas: this.subCanvasOffscreen }, [this.subCanvasOffscreen]);
        this.subCtx = this.subCanvas.getContext('2d');

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

    postMessage(message)
    {
        this.subNetworkWorker.postMessage(message);
    }

    setCanvasSize()
    {
        this.subCanvas.width = window.hgn.body.offsetWidth;
        this.subCanvas.height = window.hgn.viewer.height;

        this.postMessage({
            type: 'resize',
            width: this.subCanvas.width, 
            height: this.subCanvas.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
    }
}
