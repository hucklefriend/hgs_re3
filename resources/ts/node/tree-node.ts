import { BasicNode } from "./basic-node";
import { AppearStatus } from "../enum/appear-status";
import { Util } from "../common/util";
import { NodeType } from "../common/type";
import { NodeContentTree } from "./parts/node-content-tree";
import { TreeNodeInterface } from "./interface/tree-node-interface";


export class TreeNode extends BasicNode
{
    public isSelectedDisappear: boolean;

    protected _canvas: HTMLCanvasElement;
    protected _canvasCtx: CanvasRenderingContext2D;
    //protected _behindLinkNodes: BehindLinkNode[] = [];
    //protected _behindNodeContainer: HTMLElement;
    protected _gradientEndAlpha: number;
    protected _animationStartTime: number;
    // protected _behindGradientStartAlpha: number;
    // protected _maxBehindEndOpacity: number;
    // protected _minBehindEndOpacity: number;
    protected _curveAppearProgress: number;
    //protected _behindCurveAppearProgress: number[];
    protected _updateGradientEndAlphaFunc: (() => void) | null;
    //protected _isDrawBehind: boolean;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement, parentNode: TreeNodeInterface)
    {
        super(nodeElement, parentNode);

        this.isSelectedDisappear = false;

        this._canvas = nodeElement.querySelector(':scope > .node-canvas') as HTMLCanvasElement;
        this._canvasCtx = this._canvas.getContext('2d') as CanvasRenderingContext2D;

        this._gradientEndAlpha = 0;
        this._animationStartTime = 0;
        // this._behindGradientStartAlpha = 0;
        // this._maxBehindEndOpacity = 0.3;
        // this._minBehindEndOpacity = 0.1;
        this._appearAnimationFunc = null;
        //this._behindNodeContainer = nodeElement.querySelector('.node > .behind-node-container') as HTMLElement;
        this._curveAppearProgress = 0;
        //this._behindCurveAppearProgress = [0, 0, 0, 0];
        this._updateGradientEndAlphaFunc = null;
        //this._isDrawBehind = true;

        // const behindLinkNodeElements = this._behindNodeContainer?.querySelectorAll('.node > .behind-node-container > .behind-link-node') || [];
        // this._behindLinkNodes = Array.from(behindLinkNodeElements)
        //     .map(node => new BehindLinkNode(node as HTMLElement));
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
            this._appearAnimationFunc = null;//this.appearSubNodesAnimation;
            this._nodeHead.appear();
            this._animationStartTime = (window as any).hgn.timestamp;

            // if (this.getNodeElement().matches(':hover')) {
            //     this.hover();
            // }
        }
        
        this._isDraw = true;
    }

    /**
     * サブノードの出現アニメーション
     */
    // protected appearSubNodesAnimation(): void
    // {
    //     const progress = this.getAnimationProgress(1000);
    //     if (progress >= 1) {
    //         this._behindCurveAppearProgress = [1, 1, 1, 1];
    //         this._appearStatus = AppearStatus.APPEARED;

    //         this._appearAnimationFunc = null;
    //     }

    //     this._behindCurveAppearProgress[0] = progress * 2;
    //     if (this._behindCurveAppearProgress[0] > 1) {
    //         this._behindCurveAppearProgress[0] = 1;

    //         if (this._behindLinkNodes.length > 0) {
    //             this._behindLinkNodes[0].element.classList.remove('invisible');
    //         }
    //     }
    //     this._behindCurveAppearProgress[1] = progress * 1.5;
    //     if (this._behindCurveAppearProgress[1] > 1) {
    //         this._behindCurveAppearProgress[1] = 1;
    //         if (this._behindLinkNodes.length > 1) {
    //             this._behindLinkNodes[1].element.classList.remove('invisible');
    //         }
    //     }
    //     this._behindCurveAppearProgress[2] = progress * 1.2;
    //     if (this._behindCurveAppearProgress[2] > 1) {
    //         this._behindCurveAppearProgress[2] = 1;
    //         if (this._behindLinkNodes.length > 2) {
    //             this._behindLinkNodes[2].element.classList.remove('invisible');
    //         }
    //     }

    //     this._behindCurveAppearProgress[3] = progress;
    //     if (this._behindCurveAppearProgress[3] >= 1) {
    //         this._behindCurveAppearProgress[3] = 1;
    //         if (this._behindLinkNodes.length > 3) {
    //             this._behindLinkNodes[3].element.classList.remove('invisible');
    //         }
    //     }
        
    //     this._isDraw = true;
    // }

    /**
     * 消滅アニメーション開始
     */
    public disappear(): void
    {
        this._animationStartTime = (window as any).hgn.timestamp;
        this._gradientEndAlpha = 0;
        this._appearStatus = AppearStatus.DISAPPEARING;
        this._updateGradientEndAlphaFunc = null;

        //this.disappearBehind();

        this._isDraw = true;

        this._appearAnimationFunc = this.disappearAnimation;
    }

    // protected disappearBehind(): void
    // {
    //     this._behindLinkNodes.forEach(behindLinkNode => behindLinkNode.element.classList.add('invisible'));
    //     this._behindCurveAppearProgress = [0,0,0,0];
    // }

    protected invisibleNodeHead(): void
    {
        this._nodeHead.disappear();
    }

    /**
     * 消滾アニメーション
     */
    protected disappearAnimation(): void
    {
        if (this.curveDisappearAnimation()) {
            this._appearAnimationFunc = null;
            this._nodeHead.disappear();
            this._appearStatus = AppearStatus.DISAPPEARED;
            //this._parentTree.increaseDisappearedNodeCount();
        }
        
        this._isDraw = true;
    }

    protected curveDisappearAnimation(): boolean
    {
        this._curveAppearProgress = 1 - this.getAnimationProgress(200);
        if (this._curveAppearProgress <= 0) {
            this._curveAppearProgress = 0;
            this._gradientEndAlpha = 0;
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
                15,
                0,
                connectionPoint.x,
                connectionPoint.y
            );
        }

        // if (this._isDrawBehind && this._behindCurveAppearProgress[0] > 0) {
        //     const canvasRect = this._canvas.getBoundingClientRect();
        //     this._behindLinkNodes.forEach((behindLinkNode, index) => {
        //         if (index >= 4) return; // 4回を超えたら処理をスキップ
        //         this.drawChildCurvedLine(
        //             connectionPoint.x,
        //             connectionPoint.y,
        //             behindLinkNode.getConnectionPoint().x - canvasRect.left,
        //             behindLinkNode.getConnectionPoint().y - canvasRect.top,
        //             index
        //         );
        //     });
        // }
        
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
        gradient.addColorStop(0, 'rgba(144, 255, 144, 1)');    // 開始点（明るい緑）
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
     * 子要素へのカーブ線を描画する
     * @param startX 開始点のX座標
     * @param startY 開始点のY座標
     * @param endX 終了点のX座標
     * @param endY 終了点のY座標
     * @param loopCount ループ回数（0-3）
     */
    // private drawChildCurvedLine(startX: number, startY: number, endX: number, endY: number, loopCount: number): void
    // {
    //     // ループ回数に応じて透明度を調整（maxSubEndOpacityからminSubEndOpacityまで徐々に減少）
    //     const opacity = this._maxBehindEndOpacity - (loopCount * 0.1);
    //     let endOpacity = Math.max(this._minBehindEndOpacity, opacity - this._minBehindEndOpacity);

    //     let currentEndX = endX;
    //     let currentEndY = endY;

    //     // 進行度に応じてグラデーションの終了点を調整
    //     if (this._behindCurveAppearProgress[loopCount] < 1) {
    //         currentEndX = startX + (endX - startX) * this._behindCurveAppearProgress[loopCount];
    //         currentEndY = startY + (endY - startY) * this._behindCurveAppearProgress[loopCount];

    //         endOpacity = endOpacity * this._behindCurveAppearProgress[loopCount];
    //     }

    //     const gradient = this._canvasCtx.createLinearGradient(startX, startY, currentEndX, currentEndY);
    //     gradient.addColorStop(0, `rgba(100, 200, 100, ${endOpacity})`);   // 開始点の透明度
    //     gradient.addColorStop(1, `rgba(20, 80, 20, ${endOpacity})`);   // 終了点の透明度

    //     this._canvasCtx.beginPath();
    //     this._canvasCtx.strokeStyle = gradient;
    //     this._canvasCtx.lineWidth = 2;  // 開始点の太さ
    //     this._canvasCtx.moveTo(startX, startY);
    //     this._canvasCtx.quadraticCurveTo(startX + (endX - startX) * 0.1, endY, endX, endY);
    //     this._canvasCtx.stroke();
    // }

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

    // public invisibleBehind(): void
    // {
    //     this._behindLinkNodes.forEach(behindLinkNode => behindLinkNode.invisible());
    //     this._isDrawBehind = false;
    //     this._isDraw = true;
    // }

    // public visibleBehind(): void
    // {
    //     this._behindLinkNodes.forEach(behindLinkNode => behindLinkNode.visible());
    //     this._isDrawBehind = true;
    //     this._isDraw = true;
    // }
} 