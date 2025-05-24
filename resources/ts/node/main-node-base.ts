import { NodeBase } from "./node-base";

export abstract class MainNodeBase extends NodeBase
{
    protected canvas: HTMLCanvasElement;
    protected canvasCtx: CanvasRenderingContext2D;
    
    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this.canvas = nodeElement.querySelector('.node-canvas') as HTMLCanvasElement;
        this.canvasCtx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    /**
     * カーブの制御点を計算する
     * 
     * @param startX 開始点のX座標
     * @param startY 開始点のY座標
     * @param endX 終了点のX座標
     * @param endY 終了点のY座標
     * @returns 制御点の座標 {x: number, y: number}
     */
    private calculateControlPoint(startX: number, startY: number, endX: number, endY: number): {x: number, y: number}
    {
        // 制御点は開始点のX座標と終了点のY座標を使用
        return {
            x: startX,
            y: endY
        };
    }

    /**
     * カーブ線を描画する
     * @param startX 開始点のX座標
     * @param startY 開始点のY座標
     * @param endX 終了点のX座標
     * @param endY 終了点のY座標
     * @param gradient グラデーション
     */
    private drawCurvedLine(startX: number, startY: number, endX: number, endY: number, gradient: CanvasGradient): void
    {
        const controlPoint = this.calculateControlPoint(startX, startY, endX, endY);
        
        this.canvasCtx.beginPath();
        this.canvasCtx.strokeStyle = gradient;
        this.canvasCtx.lineWidth = 2;
        //this.canvasCtx.moveTo(startX, startY);
        //this.canvasCtx.lineTo(startX, startY + (endY - startY) * 0.7); // 下方向に伸びる（80%の位置まで）
        this.canvasCtx.moveTo(startX, endY - 30);
        this.canvasCtx.quadraticCurveTo(controlPoint.x, controlPoint.y, endX, endY);
        this.canvasCtx.stroke();
    }

    /**
     * 子要素へのカーブ線を描画する
     * @param startX 開始点のX座標
     * @param startY 開始点のY座標
     * @param endX 終了点のX座標
     * @param endY 終了点のY座標
     * @param gradient グラデーション
     */
    private drawChildCurvedLine(startX: number, startY: number, endX: number, endY: number, gradient: CanvasGradient): void
    {
        // 線の透明度と色を徐々に変化させるためのグラデーション
        const lineGradient = this.canvasCtx.createLinearGradient(startX, startY, endX, endY);
        lineGradient.addColorStop(0, 'rgba(70, 150, 70, 0.8)');     // 開始点（明るい緑、不透明）
        lineGradient.addColorStop(0.5, 'rgba(50, 125, 50, 0.6)');   // 中間点（やや暗い緑、中間の透明度）
        lineGradient.addColorStop(1, 'rgba(30, 100, 30, 0.1)');       // 終了点（暗い緑、半透明）

        this.canvasCtx.beginPath();
        this.canvasCtx.strokeStyle = lineGradient;
        this.canvasCtx.lineWidth = 2;  // 開始点の太さ
        this.canvasCtx.moveTo(startX, startY);
        this.canvasCtx.quadraticCurveTo(startX + (endX - startX) * 0.1, endY, endX, endY);
        this.canvasCtx.stroke();
    }

    /**
     * リサイズ時の処理
     */
    public resize(): void
    {
        this.setCanvasSize();
        this.setDraw();
    }

    /**
     * キャンバスのサイズを設定する
     */
    public setCanvasSize(): void
    {
        this.canvas.width = this.nodeElement.offsetWidth;
        this.canvas.height = this.nodeElement.offsetHeight + 150;

        this.setDraw();
    }

    /**
     * 描画処理
     */
    public draw(): void
    {
        if (!this.isDraw) {
            return;
        }

        // キャンバスをクリア
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 発光効果のためのグラデーション
        const gradient = this.canvasCtx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(144, 255, 144, 0.8)');   // 薄い緑色
        gradient.addColorStop(0.5, 'rgba(144, 255, 144, 0.4)'); // 中間
        gradient.addColorStop(1, 'rgba(70, 150, 70, 0.8)');   // 薄い緑色

        // 発光効果の設定
        this.canvasCtx.shadowColor = 'rgba(144, 238, 144, 0.5)';
        this.canvasCtx.shadowBlur = 10;
        this.canvasCtx.shadowOffsetX = 0;
        this.canvasCtx.shadowOffsetY = 0;

        const connectionPoint = this.getConnectionPoint();

        this.drawCurvedLine(
            0,
            0,
            connectionPoint.x - this.canvas.offsetLeft,
            connectionPoint.y - this.canvas.offsetTop,
            gradient
        );

        // nodePoints から childNodePoints への線を描画
        // Object.keys(this.nodePoints).forEach(key => {
        //     const parentPoint = this.nodePoints[key];
        //     const parentRect = parentPoint.getBoundingClientRect();
        //     const parentCenterX = parentRect.left + parentRect.width / 2 - canvasOffsetLeft;
        //     const parentCenterY = parentRect.top + parentRect.height / 2 - canvasOffsetTop;

        //     if (this.childNodePoints[key]) {
        //         this.childNodePoints[key].forEach(childPoint => {
        //             const childRect = childPoint.getBoundingClientRect();
        //             const childCenterX = childRect.left + childRect.width / 2 - canvasOffsetLeft;
        //             const childCenterY = childRect.top + childRect.height / 2 - canvasOffsetTop;

        //             this.drawChildCurvedLine(
        //                 parentCenterX,
        //                 parentCenterY,
        //                 childCenterX,
        //                 childCenterY,
        //                 gradient
        //             );
        //         });
        //     }
        // });


        this.isDraw = false;
    }

    protected abstract getConnectionPoint(): {x: number, y: number};
} 