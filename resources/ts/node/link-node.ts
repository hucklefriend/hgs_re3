import { HorrorGameNetwork } from "../horror-game-network";
import { BasicNode } from "./basic-node";
import { AppearStatus } from "../enum/appear-status";
import { FreePoint } from "./parts/free-point";
import { TreeNodeInterface } from "./interface/tree-node-interface";
import { CurrentNode } from "./current-node";
import { Util } from "../common/util";
import { Point } from "../common/point";
import { CurveCanvas } from "./parts/curve-canvas";
import { ClickableNodeInterface } from "./interface/clickable-node-interface";
import { NodeHeadClickable } from "./parts/node-head-clickable";

export class LinkNode extends BasicNode implements ClickableNodeInterface
{
    private _isHomewardDisappear: boolean;

    public get anchor(): HTMLAnchorElement
    {
        return this.nodeHead.titleElement as HTMLAnchorElement;
    }

    public get nodeHead(): NodeHeadClickable
    {
        return this._nodeHead as NodeHeadClickable;
    }

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement, parentNode: TreeNodeInterface)
    {
        super(nodeElement, parentNode);

        this._isHomewardDisappear = false;
    }


    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        super.update();
    }

    /**
     * ホバー時の処理
     */
    public hover(): void
    {
        this._nodeContentBehind?.hover();
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
    }

    /**
     * ホバー解除時の処理
     */
    public unhover(): void
    {
        this._nodeContentBehind?.unhover();

        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
    }

    /**
     * クリック時の処理
     * @param e クリックイベント
     */
    public click(e: MouseEvent): void
    {
        this._isHomewardDisappear = true;

        const hgn = (window as any).hgn as HorrorGameNetwork;
        const currentNode = hgn.currentNode as CurrentNode;
        currentNode.moveNode(this.anchor.href, this, false);

        this.parentNode.prepareDisappear(this);
    }


    public disappear(): void
    {
        if (!this._isHomewardDisappear) {
            super.disappear();
        } else {
            const hgn = (window as any).hgn as HorrorGameNetwork;
            const freePt = this.freePt;
            const connectionPoint = this._nodeHead.getConnectionPoint();
            this._updateGradientEndAlphaFunc = null;
    
            freePt.setPos(12, 0).setElementPos();
            freePt.show();
            this._nodeHead.nodePoint.hidden();
            
            this._nodeContentBehind?.disappear();

            this._animationStartTime = hgn.timestamp;
            this._appearStatus = AppearStatus.DISAPPEARING;
            this._curveCanvas.gradientEndAlpha = 0;
            this._nodeHead.disappear();
            this._isDraw = true;

            this._appearAnimationFunc = this.selectedDisappearAnimation;
        }
    }

    /**
     * 消滾アニメーション
     */
    protected selectedDisappearAnimation(): void
    {
        const connectionPoint = this._nodeHead.getConnectionPoint();

        const hgn = (window as any).hgn as HorrorGameNetwork;
        const freePt = this.freePt;

        this._curveCanvas.appearProgress = 1 - Util.getAnimationProgress(this._animationStartTime, 200);
        if (this._curveCanvas.appearProgress === 0) {
            this._curveCanvas.gradientEndAlpha = 0;
            this._appearAnimationFunc = this.selectedDisappearAnimation2;

            this._animationStartTime = hgn.timestamp;
        } else {
            // TODO: 12を計算で出す
            this._curveCanvas.drawCurvedLine(new Point(12, 0), connectionPoint);

            const pos = Util.getQuadraticBezierPoint(
                0, 0,
                connectionPoint.x, connectionPoint.y,
                this._curveCanvas.appearProgress
            );
    
            freePt.moveOffset(pos.x, pos.y);
        }
        
        this._isDraw = true;
    }

    public selectedDisappearAnimation2(): void
    {
        this._isHomewardDisappear = false;
        this._appearAnimationFunc = null;
        this._appearStatus = AppearStatus.DISAPPEARED;

        this.freePt.hide();
        this._parentNode.homewardDisappear();
    }
} 
