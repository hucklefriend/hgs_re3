import { NodeBase } from "./node-base";
import { SubLinkNode } from "./sub-link-node";

export abstract class MainNodeBase extends NodeBase
{
    public static readonly APPEAR_STATUS_NONE = 0;
    public static readonly APPEAR_STATUS_APPEARING = 1;
    public static readonly APPEAR_STATUS_APPEARED = 2;
    public static readonly APPEAR_STATUS_DISAPPEARING = 3;
    public static readonly APPEAR_STATUS_DISAPPEARED = 4;

    protected canvas: HTMLCanvasElement;
    protected canvasCtx: CanvasRenderingContext2D;
    protected subLinkNodes: SubLinkNode[] = [];
    protected nodeHead: HTMLElement;
    protected subNodeContainer: HTMLElement;
    protected gradientEndAlpha: number;
    protected animationStartTime: number;
    protected subGradientStartAlpha: number;
    protected maxSubEndOpacity: number;
    protected minSubEndOpacity: number;
    protected appearAnimationFunc: (() => void) | null;
    protected appearStatus: number;
    protected curveAppearProgress: number;
    protected subCurveAppearProgress: number[];

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this.canvas = nodeElement.querySelector('.node-canvas') as HTMLCanvasElement;
        this.canvasCtx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.nodeHead = nodeElement.querySelector('.node-head') as HTMLElement;
        
        this.gradientEndAlpha = 0;
        this.animationStartTime = 0;
        this.subGradientStartAlpha = 0;
        this.maxSubEndOpacity = 0.3;
        this.minSubEndOpacity = 0.1;
        this.appearAnimationFunc = null;
        this.subNodeContainer = nodeElement.querySelector('.sub-node-container') as HTMLElement;
        this.appearStatus = MainNodeBase.APPEAR_STATUS_NONE;
        this.curveAppearProgress = 0;
        this.subCurveAppearProgress = [0, 0, 0, 0];

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
        this.setDraw();
    }

    /**
     * キャンバスのサイズを設定する
     */
    public setCanvasSize(): void
    {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.clientWidth * dpr;
        this.canvas.height = this.canvas.clientHeight * dpr;
        this.canvasCtx.scale(dpr, dpr);
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
     * アニメーションの更新処理
     */
    public update(): void
    {
        super.update();

        if (this.appearAnimationFunc) {
            this.appearAnimationFunc();
        }
    }

    /**
     * 出現アニメーション開始
     */
    public appear(): void
    {
        if (this.appearStatus === MainNodeBase.APPEAR_STATUS_NONE) {
            this.appearStatus = MainNodeBase.APPEAR_STATUS_APPEARING;
            this.appearAnimationFunc = this.appearAnimation;
            this.nodeElement.style.visibility = 'visible';
            this.curveAppearProgress = 0;
            this.animationStartTime = (window as any).hgn.timestamp;
            this.gradientEndAlpha = 0;
        }
    }

    /**
     * 出現アニメーション
     */
    protected appearAnimation(): void
    {
        this.curveAppearProgress = this.getAnimationProgress(500);
        if (this.curveAppearProgress >= 1) {
            this.curveAppearProgress = 1;
            this.gradientEndAlpha = 0.3;
            this.appearAnimationFunc = this.appearSubNodesAnimation;
            this.nodeHead.classList.remove('disappear');
            this.animationStartTime = (window as any).hgn.timestamp;
        }
        
        this.isDraw = true;
    }

    /**
     * サブノードの出現アニメーション
     */
    protected appearSubNodesAnimation(): void
    {
        const progress = this.getAnimationProgress(1000);
        if (progress >= 1) {
            this.subCurveAppearProgress = [1, 1, 1, 1];
            this.appearStatus = MainNodeBase.APPEAR_STATUS_APPEARED;

            this.appearAnimationFunc = null;
        }

        this.subCurveAppearProgress[0] = progress * 2;
        if (this.subCurveAppearProgress[0] > 1) {
            this.subCurveAppearProgress[0] = 1;

            if (this.subLinkNodes.length > 0) {
                this.subLinkNodes[0].element.classList.remove('disappear');
            }
        }
        this.subCurveAppearProgress[1] = progress * 1.5;
        if (this.subCurveAppearProgress[1] > 1) {
            this.subCurveAppearProgress[1] = 1;
            if (this.subLinkNodes.length > 1) {
                this.subLinkNodes[1].element.classList.remove('disappear');
            }
        }
        this.subCurveAppearProgress[2] = progress * 1.2;
        if (this.subCurveAppearProgress[2] > 1) {
            this.subCurveAppearProgress[2] = 1;
            if (this.subLinkNodes.length > 2) {
                this.subLinkNodes[2].element.classList.remove('disappear');
            }
        }

        this.subCurveAppearProgress[3] = progress;
        if (this.subCurveAppearProgress[3] >= 1) {
            this.subCurveAppearProgress[3] = 1;
            if (this.subLinkNodes.length > 3) {
                this.subLinkNodes[3].element.classList.remove('disappear');
            }
        }
        
        this.isDraw = true;
    }

    /**
     * 消滅アニメーション開始
     */
    public disappear(): void
    {
        this.appearAnimationFunc = this.disappearAnimation;
    }

    /**
     * 消滾アニメーション
     */
    protected disappearAnimation(): void
    {
        this.animationStartTime = (window as any).hgn.timestamp;
        this.appearAnimationFunc = this.disappearAnimation;
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

        // 発光効果の設定
        this.canvasCtx.shadowColor = 'rgba(144, 238, 144, 0.5)';
        this.canvasCtx.shadowBlur = 10;
        this.canvasCtx.shadowOffsetX = 0;
        this.canvasCtx.shadowOffsetY = 0;
        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.lineCap = 'butt';

        const connectionPoint = this.getConnectionPoint();

        if (this.curveAppearProgress > 0) {
            this.drawCurvedLine(
                15,
                0,
                connectionPoint.x,
                connectionPoint.y
            );
        }

        if (this.subCurveAppearProgress[0] > 0) {
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
        }
        
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
        let currentEndX = endX;
        let currentEndY = endY;

        // 進行度に応じてグラデーションの終了点を調整
        if (this.curveAppearProgress < 1) {
            currentEndX = startX + (endX - startX) * this.curveAppearProgress;
            currentEndY = startY + (endY - startY) * this.curveAppearProgress;
        }

        // カーブに沿ったグラデーションを作成
        const gradient = this.canvasCtx.createLinearGradient(startX, startY, currentEndX, currentEndY);
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
        // ループ回数に応じて透明度を調整（maxSubEndOpacityからminSubEndOpacityまで徐々に減少）
        const opacity = this.maxSubEndOpacity - (loopCount * 0.1);
        let endOpacity = Math.max(this.minSubEndOpacity, opacity - this.minSubEndOpacity);

        let currentEndX = endX;
        let currentEndY = endY;

        // 進行度に応じてグラデーションの終了点を調整
        if (this.subCurveAppearProgress[loopCount] < 1) {
            currentEndX = startX + (endX - startX) * this.subCurveAppearProgress[loopCount];
            currentEndY = startY + (endY - startY) * this.subCurveAppearProgress[loopCount];

            endOpacity = endOpacity * this.subCurveAppearProgress[loopCount];
        }

        const gradient = this.canvasCtx.createLinearGradient(startX, startY, currentEndX, currentEndY);
        gradient.addColorStop(0, `rgba(100, 200, 100, ${endOpacity})`);   // 開始点の透明度
        gradient.addColorStop(1, `rgba(20, 80, 20, ${endOpacity})`);   // 終了点の透明度

        this.canvasCtx.beginPath();
        this.canvasCtx.strokeStyle = gradient;
        this.canvasCtx.lineWidth = 2;  // 開始点の太さ
        this.canvasCtx.moveTo(startX, startY);
        this.canvasCtx.quadraticCurveTo(startX + (endX - startX) * 0.1, endY, endX, endY);
        this.canvasCtx.stroke();
    }

    /**
     * 接続点を取得する
     */
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