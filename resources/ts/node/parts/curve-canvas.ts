import { Config } from "../../common/config";
import { NodeBase } from "../node-base";
import { Point } from "../../common/point";

export class CurveCanvas
{
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    private _gradientStartAlpha: number;
    private _gradientEndAlpha: number;
    private _appearProgress: number;

    public get canvas(): HTMLCanvasElement
    {
        return this._canvas;
    }

    public get ctx(): CanvasRenderingContext2D
    {
        return this._ctx;
    }

    public set gradientStartAlpha(value: number)
    {
        this._gradientStartAlpha = value;
    }

    public set gradientEndAlpha(value: number)
    {
        this._gradientEndAlpha = value;
    }
    
    public set appearProgress(value: number)
    {
        // valueは0.0～1.0の間の値
        if (value < 0) {
            value = 0;
        } else if (value > 1) {
            value = 1;
        }

        this._appearProgress = value;
    }

    public get appearProgress(): number
    {
        return this._appearProgress;
    }

    public constructor(parentNode: NodeBase)
    {
        // <canvas>を作成
        this._canvas = document.createElement('canvas');
        this._canvas.classList.add('node-canvas');
        parentNode.nodeElement.appendChild(this._canvas);
        
        // CSSで設定されたサイズをcanvasのwidth/height属性に設定
        this.setCanvasSizeFromCSS();
        
        this._ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D;


        this._gradientStartAlpha = 1;
        this._gradientEndAlpha = 0;
        this._appearProgress = 0;
        
        // 発光効果の設定
        this._ctx.shadowColor = 'rgba(144, 238, 144, 0.5)';
        this._ctx.shadowBlur = 10;
        this._ctx.shadowOffsetX = 0;
        this._ctx.shadowOffsetY = 0;
        this._ctx.lineWidth = 2;
        this._ctx.lineCap = 'round';
    }

    /**
     * CSSで設定されたサイズをcanvasのwidth/height属性に設定する
     */
    private setCanvasSizeFromCSS(): void
    {
        // 要素をDOMに追加してから計算スタイルを取得
        const computedStyle = window.getComputedStyle(this._canvas);
        const width = parseInt(computedStyle.width, 10);
        const height = parseInt(computedStyle.height, 10);
        
        // canvasのwidth/height属性に設定
        this._canvas.width = width;
        this._canvas.height = height;
    }

    /**
     * キャンバスをクリアする
     */
    public clearCanvas(): void
    {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    /**
     * カーブ線を描画する
     * 
     * @param startPoint 開始点
     * @param endPoint 終了点
     */
    public drawCurvedLine(startPoint: Point, endPoint: Point): void
    {
        if (this._appearProgress <= 0) {
            return;
        }

        const controlX = startPoint.x;
        const controlY = endPoint.y;
        let currentEndX = endPoint.x;
        let currentEndY = endPoint.y;

        // 進行度に応じてグラデーションの終了点を調整
        if (this._appearProgress < 1) {
            currentEndX = startPoint.x + (endPoint.x - startPoint.x) * this._appearProgress;
            currentEndY = startPoint.y + (endPoint.y - startPoint.y) * this._appearProgress;
        }

        // カーブに沿ったグラデーションを作成
        const gradient = this._ctx.createLinearGradient(startPoint.x, startPoint.y, currentEndX, currentEndY);
        gradient.addColorStop(0, `rgba(144, 255, 144, ${this._gradientStartAlpha})`);    // 開始点（明るい緑）
        gradient.addColorStop(1, `rgba(144, 255, 144, ${this._gradientEndAlpha})`);   // 終了点

        this._ctx.strokeStyle = gradient;

        this._ctx.beginPath();
        this._ctx.moveTo(startPoint.x, startPoint.y);
        this._ctx.quadraticCurveTo(controlX, controlY, endPoint.x, endPoint.y);
        this._ctx.stroke();
    }


    /**
     * BehindNodeへのカーブ線を描画する
     * 
     * @param startX 開始点のX座標
     * @param startY 開始点のY座標
     * @param endX 終了点のX座標
     * @param endY 終了点のY座標
     * @param lineIndex ループ回数（0-3）
     * @param progress 進行度（0-1）
     */
    public drawBehindCurvedLine(startX: number, startY: number, endX: number, endY: number, lineIndex: number, progress: number): void
    {
        // ループ回数に応じて透明度を調整（maxEndOpacityからminEndOpacityまで徐々に減少）
        const opacity = Config.getInstance().BEHIND_CURVE_LINE_MAX_OPACITY - (lineIndex * 0.1);
        let endOpacity = Math.max(Config.getInstance().BEHIND_CURVE_LINE_MIN_OPACITY, opacity - Config.getInstance().BEHIND_CURVE_LINE_MIN_OPACITY);

        let currentEndX = endX;
        let currentEndY = endY;

        // 進行度に応じてグラデーションの終了点を調整
        if (progress < 1) {
            currentEndX = startX + (endX - startX) * progress;
            currentEndY = startY + (endY - startY) * progress;

            endOpacity = endOpacity * progress;
        }

        const gradient = this._ctx.createLinearGradient(startX, startY, currentEndX, currentEndY);
        gradient.addColorStop(0, `rgba(100, 200, 100, ${endOpacity})`);   // 開始点の透明度
        gradient.addColorStop(1, `rgba(20, 80, 20, ${endOpacity})`);   // 終了点の透明度

        this._ctx.beginPath();
        this._ctx.strokeStyle = gradient;
        this._ctx.lineWidth = 2;  // 開始点の太さ
        this._ctx.moveTo(startX, startY);
        this._ctx.quadraticCurveTo(startX + (endX - startX) * 0.1, endY, endX, endY);
        this._ctx.stroke();
    }
}
