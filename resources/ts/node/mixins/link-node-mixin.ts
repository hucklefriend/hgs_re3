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
    //public _isHomewardDisappear: boolean = false;
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
        this._parentInstance.clickLink(this.anchor, e);
    }
}
