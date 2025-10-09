import { HorrorGameNetwork } from "../../horror-game-network";
import { AppearStatus } from "../../enum/appear-status";
import { CurrentNode } from "../current-node";
import { Util } from "../../common/util";
import { Point } from "../../common/point";
import { NodeHeadClickable } from "../parts/node-head-clickable";

/**
 * LinkNodeとLinkTreeNodeの共通機能を提供するmixin
 */
export class LinkNodeMixin
{
    public _isHomewardDisappear: boolean = false;
    private _parentInstance: any;

    constructor(parentInstance: any)
    {
        this._parentInstance = parentInstance;
    }

    public get anchor(): HTMLAnchorElement
    {
        return this._parentInstance._nodeHead.titleElement as HTMLAnchorElement;
    }

    public get nodeHead(): NodeHeadClickable
    {
        return this._parentInstance._nodeHead as NodeHeadClickable;
    }

    /**
     * ホバー時の処理
     */
    public hover(): void
    {
        this._parentInstance._nodeContentBehind?.hover();
        this._parentInstance._animationStartTime = (window as any).hgn.timestamp;
        this._parentInstance._updateGradientEndAlphaFunc = this._parentInstance.updateGradientEndAlphaOnHover;
    }

    /**
     * ホバー解除時の処理
     */
    public unhover(): void
    {
        this._parentInstance._nodeContentBehind?.unhover();
        this._parentInstance._animationStartTime = (window as any).hgn.timestamp;
        this._parentInstance._updateGradientEndAlphaFunc = this._parentInstance.updateGradientEndAlphaOnUnhover;
    }

    /**
     * クリック時の処理
     * @param e クリックイベント
     */
    public click(e: MouseEvent): void
    {
        // 外部リンクの場合は処理しない
        if (this.anchor.getAttribute('rel') === 'external') {
            location.href = this.anchor.href;
            return;
        }

        const nodeContentTree = this._parentInstance.parentNode.nodeContentTree;
        if (!AppearStatus.isAppeared(nodeContentTree.appearStatus)) {
            return;
        }

        const headPos = this._parentInstance.nodeHead.getConnectionPoint();
        const hgn = (window as any).hgn as HorrorGameNetwork;
        hgn.calculateDisappearSpeedRate(headPos.y + window.scrollY);

        this._isHomewardDisappear = true;

        const currentNode = hgn.currentNode as CurrentNode;
        currentNode.moveNode(this.anchor.href, this._parentInstance, false);

        this._parentInstance.disappearContents();

        this._parentInstance.parentNode.prepareDisappear(this._parentInstance);
    }

    /**
     * 消滾アニメーション
     */
    public selectedDisappearAnimation(): void
    {
        const connectionPoint = this.nodeHead.getConnectionPoint();

        const hgn = (window as any).hgn as HorrorGameNetwork;
        const freePt = this._parentInstance.freePt;

        this._parentInstance._curveCanvas.appearProgress = 1 - Util.getAnimationProgress(this._parentInstance._animationStartTime, 100);
        if (this._parentInstance._curveCanvas.appearProgress === 0) {
            this._parentInstance._curveCanvas.gradientEndAlpha = 0;
            this._parentInstance._appearAnimationFunc = this._parentInstance.selectedDisappearAnimation2;

            this._parentInstance._animationStartTime = hgn.timestamp;
        } else {
            // TODO: 12を計算で出す nodeHeadPointの幅の半分
            this._parentInstance._curveCanvas.drawCurvedLine(new Point(12, 0), connectionPoint);

            const pos = Util.getQuadraticBezierPoint(
                0, 0,
                connectionPoint.x, connectionPoint.y,
                this._parentInstance._curveCanvas.appearProgress
            );
    
            freePt.moveOffset(pos.x, pos.y);
        }
        
        this._parentInstance._isDraw = true;
    }

    /**
     * 消滾アニメーション2
     */
    public selectedDisappearAnimation2(): void
    {
        this._isHomewardDisappear = false;
        this._parentInstance._appearAnimationFunc = null;
        this._parentInstance._appearStatus = AppearStatus.DISAPPEARED;

        this._parentInstance.freePt.hide();
        this._parentInstance._parentNode.homewardDisappear();
    }

    /**
     * ホームワード消滾処理
     */
    protected handleHomewardDisappear(): void
    {
        const hgn = (window as any).hgn as HorrorGameNetwork;
        const freePt = this._parentInstance.freePt;
        const connectionPoint = this.nodeHead.getConnectionPoint();
        this._parentInstance._updateGradientEndAlphaFunc = null;

        // TODO: 12を計算で出す nodeHeadPointの幅の半分
        freePt.setPos(12, 0).setElementPos();
        freePt.show();
        this.nodeHead.nodePoint.hidden();
        
        this._parentInstance._nodeContentBehind?.disappear();
        // TreeNodeの場合は_nodeContentTreeも消滾させる
        this._parentInstance._nodeContentTree?.disappear();

        this._parentInstance._animationStartTime = hgn.timestamp;
        this._parentInstance._appearStatus = AppearStatus.DISAPPEARING;
        this._parentInstance._curveCanvas.gradientEndAlpha = 0;
        this.nodeHead.disappear();
        this._parentInstance._isDraw = true;

        this._parentInstance._appearAnimationFunc = this._parentInstance.selectedDisappearAnimation;
    }

    /**
     * ホームワード消滾処理を実行する
     */
    public executeHomewardDisappear(): void
    {
        this.handleHomewardDisappear();
    }
}
