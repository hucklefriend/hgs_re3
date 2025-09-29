import { NodeBase } from "./node-base";
import { AppearStatus } from "../enum/appear-status";
import { Util } from "../common/util";
import { TreeNodeInterface } from "./interface/tree-node-interface";
import { NodeContentBehind } from "./parts/node-content-behind";
import { NodeHead } from "./parts/node-head";
import { NodeHeadType } from "../common/type";
import { NodeHeadClickable } from "./parts/node-head-clickable";
import { CurveCanvas } from "./parts/curve-canvas";
import { Point } from "../common/point";
import { ClickableNodeInterface } from "./interface/clickable-node-interface";

export class BasicNode extends NodeBase
{
    protected _animationStartTime: number;
    protected _updateGradientEndAlphaFunc: (() => void) | null;
    protected _parentNode: TreeNodeInterface;
    protected _nodeContentBehind: NodeContentBehind | null;
    protected _curveCanvas: CurveCanvas;
    protected _isFast: boolean;
    protected _doNotAppearBehind: boolean;

    public get parentNode(): TreeNodeInterface
    {
        return this._parentNode;
    }

    public get curveCanvas(): CurveCanvas
    {
        return this._curveCanvas;
    }

    public get behindContent(): NodeContentBehind | null
    {
        return this._nodeContentBehind;
    }

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement, parentNode: TreeNodeInterface)
    {
        super(nodeElement);

        this._parentNode = parentNode;

        this._curveCanvas = new CurveCanvas(this);
        this._isFast = false;
        this._animationStartTime = 0;
        this._appearAnimationFunc = null;
        this._updateGradientEndAlphaFunc = null;
        this._doNotAppearBehind = false;

        this._nodeContentBehind = null;
        if (this._behindContentElement) {
            this._nodeContentBehind = new NodeContentBehind(this._behindContentElement as HTMLElement);
            this._nodeContentBehind.loadNodes();
        }
    }

    /**
     * ノードのヘッダを読み込む
     * 
     * @returns 
     */
    protected loadHead(): NodeHeadType
    {
        // 自身の継承先がClickableNodeInterfaceを実装しているかをチェック
        const nodeHead = this._nodeElement.querySelector(':scope > .node-head') as HTMLElement;
        if (Util.isClickableNode(this)) {
            return new NodeHeadClickable(nodeHead, this as ClickableNodeInterface);
        }
        return new NodeHead(nodeHead);
    }

    /**
     * リサイズ時の処理
     */
    public resize(): void
    {
        this._nodeContentBehind?.resize();
        super.resize();
        this.setDraw();
    }

    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        super.update();

        this._nodeContentBehind?.update();

        this._appearAnimationFunc?.();
        this._updateGradientEndAlphaFunc?.();
    }

    /**
     * 出現アニメーション開始
     */
    public appear(isFast: boolean = false, doNotAppearBehind: boolean = false): void
    {
        if (AppearStatus.isDisappeared(this._appearStatus)) {
            this.startAppear(isFast, doNotAppearBehind);
        }
    }

    protected startAppear(isFast: boolean = false, doNotAppearBehind: boolean = false): void
    {
        this._appearStatus = AppearStatus.APPEARING;
        this._appearAnimationFunc = this.appearAnimation;
        this._animationStartTime = (window as any).hgn.timestamp;
        this._curveCanvas.appearProgress = 0;
        this._curveCanvas.gradientStartAlpha = 1;
        this._curveCanvas.gradientEndAlpha = 0;

        this.freePt.setPos(Math.floor(this._parentNode.nodeHead.getNodePtWidth() / 2), 0).setElementPos();
        this.freePt.show();
        this._isFast = isFast;
        this._doNotAppearBehind = doNotAppearBehind;
    }

    /**
     * 出現アニメーション
     */
    public appearAnimation(): void
    {
        this._curveCanvas.appearProgress = Util.getAnimationProgress(this._animationStartTime, this._isFast ? 70 : 200);
        
        const connectionPoint = this._nodeHead.getConnectionPoint();
        const pos = Util.getQuadraticBezierPoint(
            Math.floor(this._parentNode.nodeHead.getNodePtWidth() / 2), 0,
            connectionPoint.x, connectionPoint.y,
            this._curveCanvas.appearProgress
        );

        this.freePt.moveOffset(pos.x-10, pos.y);
        if (this._curveCanvas.appearProgress === 1) {
            this._curveCanvas.gradientEndAlpha = 0.3;//this.isHover() ? 1 : 0.3;
            this._nodeHead.appear();
            this.freePt.hide();
            this.freePt.setPos(connectionPoint.x, connectionPoint.y).setElementPos();
            this.appearContents();

            if (this._nodeContentBehind && !this._doNotAppearBehind) {
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
    public disappear(isFast: boolean = false, doNotAppearBehind: boolean = false): void
    {
        this._isFast = isFast;
        this.disappearContents();
        this._animationStartTime = (window as any).hgn.timestamp;
        this._curveCanvas.gradientEndAlpha = 0;
        this._appearStatus = AppearStatus.DISAPPEARING;
        this._updateGradientEndAlphaFunc = null;

        if (!doNotAppearBehind) {
            this._nodeContentBehind?.disappear();
        }

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
            this._nodeHead.disappearFadeOut();
        }
        
        this._isDraw = true;
    }

    protected curveDisappearAnimation(): boolean
    {
        this._curveCanvas.appearProgress = 1 - Util.getAnimationProgress(this._animationStartTime, 100);
        this._curveCanvas.gradientEndAlpha = this._curveCanvas.appearProgress * 0.7;
        if (this._curveCanvas.appearProgress === 0) {
            this._curveCanvas.gradientEndAlpha = 0;
            this._curveCanvas.gradientStartAlpha = 0;
            return true;
        }

        return false;
    }

    /**
     * ホバー開始時のグラデーションα値を更新
     */
    protected updateGradientEndAlphaOnHover(): void
    {
        this._curveCanvas.gradientEndAlpha = Util.getAnimationValue(0.3, 1.0, this._animationStartTime, 300);
        if (this._curveCanvas.gradientEndAlpha === 1) {
            this._updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    /**
     * ホバー終了時のグラデーションα値を更新
     */
    protected updateGradientEndAlphaOnUnhover(): void
    {
        this._curveCanvas.gradientEndAlpha = Util.getAnimationValue(1.0, 0.3, this._animationStartTime, 300);
        if (this._curveCanvas.gradientEndAlpha <= 0.3) {
            this._curveCanvas.gradientEndAlpha = 0.3;
            this._updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    /**
     * 描画処理
     */
    public draw(): void
    {
        if (!this._isDraw) {
            return;
        }

        this._curveCanvas.clearCanvas();

        const connectionPoint = this._nodeHead.getConnectionPoint();

        const startPoint = new Point(
            Math.floor(this._parentNode.nodeHead.getNodePtWidth() / 2),
            0
        );

        this._curveCanvas.drawCurvedLine(startPoint, connectionPoint);

        // 背景ノードの描画
        this._nodeContentBehind?.draw(this._curveCanvas, connectionPoint);
    
        this._isDraw = false;
    }
} 