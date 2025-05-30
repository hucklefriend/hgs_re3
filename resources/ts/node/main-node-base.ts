import { NodeBase } from "./node-base";
import { SubLinkNode } from "./sub-link-node";

export abstract class MainNodeBase extends NodeBase
{
    protected canvas: HTMLCanvasElement;
    protected canvasCtx: CanvasRenderingContext2D;
    protected subLinkNodes: SubLinkNode[] = [];
    protected subNodeContainer: HTMLElement;
    protected gradientEndAlpha: number;
    protected animationStartTime: number;
    protected maxChildEndOpacity: number;
    protected minChildEndOpacity: number;
    
    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this.canvas = nodeElement.querySelector('.node-canvas') as HTMLCanvasElement;
        this.canvasCtx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.gradientEndAlpha = 0.3;
        this.animationStartTime = 0;
        this.maxChildEndOpacity = 0.5;
        this.minChildEndOpacity = 0.1;

        this.subNodeContainer = nodeElement.querySelector('.sub-node-container') as HTMLElement;

        const subLinkNodeElements = this.subNodeContainer?.querySelectorAll('.sub-link-node') || [];
        this.subLinkNodes = Array.from(subLinkNodeElements)
            .map(node => new SubLinkNode(node as HTMLElement));
    }

    /**
     * リサイズ時の処理
     */
    public resize(): void
    {
        this.setCanvasSize();
        //this.setCanvasPos();
        this.setDraw();
    }

    /**
     * キャンバスのサイズを設定する
     */
    public setCanvasSize(): void
    {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    /**
     * キャンバスの位置を設定する
     */
    public setCanvasPos(): void
    {
        this.canvas.style.left = -this.nodeElement.offsetLeft + 'px';
        this.canvas.style.top = this.nodeElement.offsetHeight - 40 + 'px';
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
        gradient.addColorStop(0, 'rgb(144, 255, 144)');   // 薄い緑色
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');   // 薄い緑色

        // 発光効果の設定
        this.canvasCtx.shadowColor = 'rgba(144, 238, 144, 0.5)';
        this.canvasCtx.shadowBlur = 10;
        this.canvasCtx.shadowOffsetX = 0;
        this.canvasCtx.shadowOffsetY = 0;
        this.canvasCtx.strokeStyle = gradient;
        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.lineCap = 'butt';

        const connectionPoint = this.getConnectionPoint();

        this.drawCurvedLine(
            15,
            0,
            connectionPoint.x,
            connectionPoint.y
        );

        const canvasRect = this.canvas.getBoundingClientRect();

        this.subLinkNodes.forEach((subLinkNode, index) => {
            if (index >= 4) return; // 4回を超えたら処理をスキップ
            this.drawChildCurvedLine(
                connectionPoint.x,
                connectionPoint.y,
                subLinkNode.getConnectionPoint().x - canvasRect.left,
                subLinkNode.getConnectionPoint().y - canvasRect.top,
                index
            );
        });
        this.isDraw = false;
    }

    /**
     * カーブ線を描画する
     * @param startX 開始点のX座標
     * @param startY 開始点のY座標
     * @param endX 終了点のX座標
     * @param endY 終了点のY座標
     */
    private drawCurvedLine(startX: number, startY: number, endX: number, endY: number): void
    {
        const controlX = startX;
        const controlY = endY;

        // カーブに沿ったグラデーションを作成
        const gradient = this.canvasCtx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, 'rgba(144, 255, 144, 1)');    // 開始点（明るい緑）
        gradient.addColorStop(1, `rgba(144, 255, 144, ${this.gradientEndAlpha})`);   // 終了点

        this.canvasCtx.strokeStyle = gradient;
        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.lineCap = 'round';

        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(startX, startY);
        this.canvasCtx.quadraticCurveTo(controlX, controlY, endX, endY);
        this.canvasCtx.stroke();
    }

    /**
     * 子要素へのカーブ線を描画する
     * @param startX 開始点のX座標
     * @param startY 開始点のY座標
     * @param endX 終了点のX座標
     * @param endY 終了点のY座標
     * @param loopCount ループ回数（0-3）
     */
    private drawChildCurvedLine(startX: number, startY: number, endX: number, endY: number, loopCount: number): void
    {
        // ループ回数に応じて透明度を調整（maxChildEndOpacityからminChildEndOpacityまで徐々に減少）
        const opacity = this.maxChildEndOpacity - (loopCount * 0.1);
        const endOpacity = Math.max(this.minChildEndOpacity, opacity - this.minChildEndOpacity);

        const gradient = this.canvasCtx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, `rgba(100, 200, 100, ${this.gradientEndAlpha})`);   // 開始点の透明度
        gradient.addColorStop(1, `rgba(20, 80, 20, ${endOpacity})`);   // 終了点の透明度

        this.canvasCtx.beginPath();
        this.canvasCtx.strokeStyle = gradient;
        this.canvasCtx.lineWidth = 2;  // 開始点の太さ
        this.canvasCtx.moveTo(startX, startY);
        this.canvasCtx.quadraticCurveTo(startX + (endX - startX) * 0.1, endY, endX, endY);
        this.canvasCtx.stroke();
    }

    public abstract getConnectionPoint(): {x: number, y: number};

    /**
     * アニメーションの進行度を計算（0.0～1.0）
     * @param duration アニメーションの持続時間（ミリ秒）
     * @returns 進行度（0.0～1.0）
     */
    protected getAnimationProgress(duration: number): number
    {
        const currentTime = (window as any).hgn.timestamp;
        const elapsedTime = currentTime - this.animationStartTime;
        
        if (elapsedTime <= duration) {
            return elapsedTime / duration;
        }
        return 1.0;
    }

    /**
     * アニメーションの値を計算
     * @param startValue 開始値
     * @param endValue 終了値
     * @param duration アニメーションの持続時間（ミリ秒）
     * @returns 現在の値
     */
    protected getAnimationValue(startValue: number, endValue: number, duration: number): number
    {
        const progress = this.getAnimationProgress(duration);
        return startValue + (endValue - startValue) * progress;
    }
} 