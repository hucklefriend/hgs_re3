import { NodeBase } from "./node-base";
import { AppearStatus } from "../enum/appear-status";
import { Util } from "../common/util";
import { TreeNodeInterface } from "./interface/tree-node-interface";
import { NodeContentBehind } from "./parts/node-content-behind";

export class BasicNode extends NodeBase
{
    protected _canvas: HTMLCanvasElement;
    protected _canvasCtx: CanvasRenderingContext2D;
    protected _gradientStartAlpha: number;
    protected _gradientEndAlpha: number;
    protected _animationStartTime: number;
    protected _curveAppearProgress: number;
    protected _updateGradientEndAlphaFunc: (() => void) | null;
    protected _parentNode: TreeNodeInterface;
    protected _nodeContentBehind: NodeContentBehind | null;

    public get parentNode(): TreeNodeInterface
    {
        return this._parentNode;
    }

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement, parentNode: TreeNodeInterface)
    {
        super(nodeElement);

        this._parentNode = parentNode;
        
        this._canvas = this.createCanvas();
        nodeElement.appendChild(this._canvas);
        this._canvasCtx = this._canvas.getContext('2d') as CanvasRenderingContext2D;
        this.setCanvasSize();

        this._gradientStartAlpha = 1;
        this._gradientEndAlpha = 0;
        this._animationStartTime = 0;
        this._appearAnimationFunc = null;
        this._curveAppearProgress = 0;
        this._updateGradientEndAlphaFunc = null;


        this._nodeContentBehind = null;
        if (this._behindContentElement) {
            this._nodeContentBehind = new NodeContentBehind(this._behindContentElement as HTMLElement);
            this._nodeContentBehind.loadNodes();
        }
    }

    private createCanvas(): HTMLCanvasElement
    {
        const canvas = document.createElement('canvas');
        canvas.classList.add('node-canvas');
        return canvas;
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
        this._canvas.width = this._canvas.clientWidth * dpr;
        this._canvas.height = this._canvas.clientHeight * dpr;
        this._canvasCtx.scale(dpr, dpr);
    }

    /**
     * キャンバスの位置を設定する
     */
    public setCanvasPos(): void
    {
        this._canvas.style.left = -this._nodeElement.offsetLeft + 'px';
        this._canvas.style.top = this._nodeElement.offsetHeight - 40 + 'px';
    }

    protected hover(): void {}

    protected unhover(): void {}

    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        super.update();

        this._nodeContentBehind?.update();

        if (this._appearAnimationFunc) {
            this._appearAnimationFunc();
        }

        if (this._updateGradientEndAlphaFunc) {
            this._updateGradientEndAlphaFunc();
        }
    }

    /**
     * 出現アニメーション開始
     */
    public appear(): void
    {
        if (AppearStatus.isDisappeared(this._appearStatus)) {
            this._appearStatus = AppearStatus.APPEARING;
            this._appearAnimationFunc = this.appearAnimation;
            this._curveAppearProgress = 0;
            this._animationStartTime = (window as any).hgn.timestamp;
            this._gradientEndAlpha = 0;
        }
    }

    /**
     * 出現アニメーション
     */
    protected appearAnimation(): void
    {
        this._curveAppearProgress = this.getAnimationProgress(200);
        if (this._curveAppearProgress >= 1) {
            this._curveAppearProgress = 1;
            this._gradientEndAlpha = 0.3;//this.isHover() ? 1 : 0.3;
            this._nodeHead.appear();

            if (this._nodeContentBehind) {
                this._nodeContentBehind.appear();
                this._appearAnimationFunc = this.appearBehindAnimation;
            } else {
                this._appearAnimationFunc = null;
            }
            this._appearStatus = AppearStatus.APPEARED;

            // if (this.getNodeElement().matches(':hover')) {
            //     this.hover();
            // }
        }
        
        this._isDraw = true;
    }

    protected appearBehindAnimation(): void
    {
        if (this._nodeContentBehind && AppearStatus.isAppeared(this._nodeContentBehind.appearStatus)) {
            this._appearAnimationFunc = null;
            this._appearStatus = AppearStatus.APPEARED;
        }

        this._isDraw = true;
    }

    /**
     * 消滅アニメーション開始
     */
    public disappear(): void
    {
        super.disappear();
        this._animationStartTime = (window as any).hgn.timestamp;
        this._gradientEndAlpha = 0;
        this._appearStatus = AppearStatus.DISAPPEARING;
        this._updateGradientEndAlphaFunc = null;

        this._nodeContentBehind?.disappear();

        this._isDraw = true;

        this._appearAnimationFunc = this.disappearAnimation;
    }

    /**
     * 消滾アニメーション
     */
    protected disappearAnimation(): void
    {
        if (this.curveDisappearAnimation()) {
            this._appearAnimationFunc = null;
            this._appearStatus = AppearStatus.DISAPPEARED;
        }
        
        this._isDraw = true;
    }

    protected curveDisappearAnimation(): boolean
    {
        this._gradientStartAlpha = this.getAnimationProgress(200);
        this._curveAppearProgress = 1 - this.getAnimationProgress(200);
        this._gradientStartAlpha = this._curveAppearProgress;
        if (this._curveAppearProgress <= 0) {
            this._curveAppearProgress = 0;
            this._gradientEndAlpha = 0;
            this._gradientStartAlpha = 0;
            return true;
        }

        return false;
    }

    /**
     * 描画処理
     */
    public draw(): void
    {
        if (!this._isDraw) {
            return;
        }

        // キャンバスをクリア
        this._canvasCtx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        // 発光効果の設定
        this._canvasCtx.shadowColor = 'rgba(144, 238, 144, 0.5)';
        this._canvasCtx.shadowBlur = 10;
        this._canvasCtx.shadowOffsetX = 0;
        this._canvasCtx.shadowOffsetY = 0;
        this._canvasCtx.lineWidth = 2;
        this._canvasCtx.lineCap = 'butt';

        const connectionPoint = this._nodeHead.getConnectionPoint();

        if (this._curveAppearProgress > 0) {
            this.drawCurvedLine(
                Math.floor(this._parentNode.nodeHead.getNodePtWidth() / 2),
                0,
                connectionPoint.x,
                connectionPoint.y
            );
        }

        this._nodeContentBehind?.draw(this._canvas, this._canvasCtx, connectionPoint);
    
        this._isDraw = false;
    }

    /**
     * カーブ線を描画する
     * @param startX 開始点のX座標
     * @param startY 開始点のY座標
     * @param endX 終了点のX座標
     * @param endY 終了点のY座標
     */
    protected drawCurvedLine(startX: number, startY: number, endX: number, endY: number): void
    {
        const controlX = startX;
        const controlY = endY;
        let currentEndX = endX;
        let currentEndY = endY;

        // 進行度に応じてグラデーションの終了点を調整
        if (this._curveAppearProgress < 1) {
            currentEndX = startX + (endX - startX) * this._curveAppearProgress;
            currentEndY = startY + (endY - startY) * this._curveAppearProgress;
        }

        // カーブに沿ったグラデーションを作成
        const gradient = this._canvasCtx.createLinearGradient(startX, startY, currentEndX, currentEndY);
        gradient.addColorStop(0, `rgba(144, 255, 144, ${this._gradientStartAlpha})`);    // 開始点（明るい緑）
        gradient.addColorStop(1, `rgba(144, 255, 144, ${this._gradientEndAlpha})`);   // 終了点

        this._canvasCtx.strokeStyle = gradient;
        this._canvasCtx.lineWidth = 2;
        this._canvasCtx.lineCap = 'round';

        this._canvasCtx.beginPath();
        this._canvasCtx.moveTo(startX, startY);
        this._canvasCtx.quadraticCurveTo(controlX, controlY, endX, endY);
        this._canvasCtx.stroke();
    }

    /**
     * 二次ベジェ曲線上の座標を計算する
     * @param startX 開始点のX座標
     * @param startY 開始点のY座標
     * @param controlX 制御点のX座標
     * @param controlY 制御点のY座標
     * @param endX 終了点のX座標
     * @param endY 終了点のY座標
     * @param t 進行度（0.0～1.0）
     * @returns 指定された進行度での座標
     */
    protected getQuadraticBezierPoint(
        startX: number, 
        startY: number, 
        controlX: number, 
        controlY: number, 
        endX: number, 
        endY: number, 
        t: number
    ): {x: number, y: number}
    {
        // 二次ベジェ曲線の数式: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
        const x = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * endX;
        const y = Math.pow(1 - t, 2) * startY + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * endY;
        
        return {x, y};
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

    /**
     * アニメーションの進行度を計算（0.0～1.0）
     * @param duration アニメーションの持続時間（ミリ秒）
     * @returns 進行度（0.0～1.0）
     */
    protected getAnimationProgress(duration: number): number
    {
        return Util.getAnimationProgress(this._animationStartTime, duration);
    }

    

    

    public invisibleBehind(): void
    {
        if (this._nodeContentBehind) {
            this._nodeContentBehind.invisible();
            this._isDraw = true;
        }
    }

    public visibleBehind(): void
    {
        if (this._nodeContentBehind) {
            this._nodeContentBehind.visible();
            this._isDraw = true;
        }
    }
} 