import { HorrorGameNetwork } from "../horror-game-network";
import { BasicNode } from "./basic-node";
import { AppearStatus } from "../enum/appear-status";
import { FreePoint } from "./parts/free-point";
import { TreeNodeInterface } from "./interface/tree-node-interface";
import { CurrentNode } from "./current-node";

export class LinkNode extends BasicNode
{
    private _anchor: HTMLAnchorElement;
    private _isHomewardDisappear: boolean;

    public get anchor(): HTMLAnchorElement
    {
        return this._anchor;
    }

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement, parentNode: TreeNodeInterface)
    {
        super(nodeElement, parentNode);

        this._anchor = this._nodeHead.titleElement as HTMLAnchorElement;
        this._anchor.addEventListener('click', this.click.bind(this));
        this._anchor.addEventListener('mouseenter', this.hover.bind(this));
        this._anchor.addEventListener('mouseleave', this.unhover.bind(this));
        this._isHomewardDisappear = false;
    }

    /**
     * ホバー開始時のグラデーションα値を更新
     */
    private updateGradientEndAlphaOnHover(): void
    {
        this._gradientEndAlpha = this.getAnimationValue(0.3, 1.0, 300);
        if (this._gradientEndAlpha >= 1.0) {
            this._gradientEndAlpha = 1.0;
            this._updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    /**
     * ホバー終了時のグラデーションα値を更新
     */
    private updateGradientEndAlphaOnUnhover(): void
    {
        this._gradientEndAlpha = this.getAnimationValue(1.0, 0.3, 300);
        if (this._gradientEndAlpha <= 0.3) {
            this._gradientEndAlpha = 0.3;
            this._updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        super.update();

        if (this._updateGradientEndAlphaFunc !== null) {
            this._updateGradientEndAlphaFunc();
        }
    }

    protected isHover(): boolean
    {
        return this._appearStatus === AppearStatus.APPEARED && this._anchor.classList.contains('hover');
    }

    /**
     * ホバー時の処理
     */
    protected hover(): void
    {
        if (this._appearStatus !== AppearStatus.APPEARED) {
            return;
        }

        this._anchor.classList.add('hover');
        this._nodeContentBehind?.hover();
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
    }

    /**
     * ホバー解除時の処理
     */
    protected unhover(): void
    {
        if (this._appearStatus !== AppearStatus.APPEARED) {
            return;
        }
        this._anchor.classList.remove('hover');
        this._nodeContentBehind?.unhover();

        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
    }

    /**
     * クリック時の処理
     * @param e クリックイベント
     */
    protected click(e: MouseEvent): void
    {
        e.preventDefault();

        if (this._appearStatus !== AppearStatus.APPEARED) {
            return;
        }

        this._isHomewardDisappear = true;

        const hgn = (window as any).hgn as HorrorGameNetwork;
        const currentNode = hgn.currentNode as CurrentNode;
        currentNode.moveNode(this._anchor.href, this, false);

        this.parentNode.prepareDisappear(this);
    }


    public disappear(): void
    {
        if (!this._isHomewardDisappear) {
            super.disappear();
        } else {
            const hgn = (window as any).hgn as HorrorGameNetwork;
            const freePt = FreePoint.getInstance();
            const connectionPoint = this._nodeHead.getConnectionPoint();
            this._updateGradientEndAlphaFunc = null;
    
            const pos = this.getQuadraticBezierPoint(
                0, 0,
                connectionPoint.x - 15, connectionPoint.y,
                1
            );
    
            const parentConnectionPoint = this._parentNode.nodeHead.getAbsoluteConnectionPoint();
            const rect = this._nodeElement.getBoundingClientRect();
            const y = rect.top;// + window.scrollY;
            freePt.setPos(parentConnectionPoint.x - freePt.clientWidth / 2+1, y - freePt.clientHeight / 2);
            freePt.moveOffset(pos.x, pos.y);
            freePt.show();
            this._nodeHead.nodePoint.hidden();
            
            this._nodeContentBehind?.disappear();

            this._animationStartTime = hgn.timestamp;
            this._appearStatus = AppearStatus.DISAPPEARING;
            this._gradientEndAlpha = 0;
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
        const freePt = FreePoint.getInstance();

        this._curveAppearProgress = 1 - this.getAnimationProgress(200);
        if (this._curveAppearProgress <= 0) {
            this._curveAppearProgress = 0;
            this._gradientEndAlpha = 0;
            this._appearAnimationFunc = this.selectedDisappearAnimation2;

            this._animationStartTime = hgn.timestamp;
        } else {
            this.drawCurvedLine(
                15, 0,
                connectionPoint.x, connectionPoint.y
            );

            const pos = this.getQuadraticBezierPoint(
                0, 0,
                connectionPoint.x - 15, connectionPoint.y,
                this._curveAppearProgress
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

        this._parentNode.homewardDisappear();
    }
} 
