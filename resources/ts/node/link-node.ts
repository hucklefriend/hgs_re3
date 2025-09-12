import { HorrorGameNetwork } from "../horror-game-network";
import { BasicNode } from "./basic-node";
import { AppearStatus } from "../enum/appear-status";
import { FreePoint } from "./parts/free-point";
import { NodeType } from "../common/type";
import { CurrentNode } from "./current-node";

export class LinkNode extends BasicNode
{
    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement, parentNode: NodeType)
    {
        super(nodeElement, parentNode);
    }

    /**
     * ホバー開始時のグラデーションα値を更新
     */
    private updateGradientEndAlphaOnHover(): void
    {
        this._gradientEndAlpha = this.getAnimationValue(0.3, 1.0, 300);
        // this._maxBehindEndOpacity = this.getAnimationValue(0.3, 0.5, 200);
        // this._minBehindEndOpacity = this.getAnimationValue(0.1, 0.2, 200);
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
        // this._maxBehindEndOpacity = this.getAnimationValue(0.5, 0.3, 200);
        // this._minBehindEndOpacity = this.getAnimationValue(0.2, 0.1, 200);
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
        return false;
        //return this._appearStatus === AppearStatus.APPEARED && this._anchor.classList.contains('hover');
    }

    /**
     * ホバー時の処理
     */
    protected hover(isCurveAnimation: boolean = true): void
    {
        if (this._appearStatus !== AppearStatus.APPEARED) {
            return;
        }
        // this._anchor.classList.add('hover');
        // this._behindNodeContainer.classList.add('hover');
        if (isCurveAnimation) {
            this._animationStartTime = (window as any).hgn.timestamp;
            this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
        }
        //super.terminalNodeHover();
    }

    /**
     * ホバー解除時の処理
     */
    protected unhover(isCurveAnimation: boolean = true): void
    {
        if (this._appearStatus !== AppearStatus.APPEARED) {
            return;
        }
        // this._anchor.classList.remove('hover');
        // this._behindNodeContainer.classList.remove('hover');
        if (isCurveAnimation) {
            this._animationStartTime = (window as any).hgn.timestamp;
            this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
        }
        //super.terminalNodeUnhover();
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

        // const treeView = (window as any).hgn.treeView as TreeView;
        // treeView.moveTree(this._anchor.href, this, false);
    }


    public disappear(): void
    {
        if (!this.isSelectedDisappear) {
            super.disappear();
        } else {
            const hgn = (window as any).hgn as HorrorGameNetwork;
            const freePt = FreePoint.getInstance();
            const connectionPoint = this.getConnectionPoint();
            this._updateGradientEndAlphaFunc = null;
    
            const pos = this.getQuadraticBezierPoint(
                0, 0,
                0, connectionPoint.y,
                connectionPoint.x - freePt.clientWidth / 2, connectionPoint.y,
                1
            );
    
            const rect = this._nodeElement.getBoundingClientRect();
            const x = rect.left + window.scrollX - hgn.mainElement.offsetLeft;
            const y = rect.top + window.scrollY;

            freePt.setPos(x, y - freePt.clientHeight / 2);
            freePt.moveOffset(pos.x, pos.y);
            freePt.show();
            
            //this.disappearBehind();

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
        const connectionPoint = this.getConnectionPoint();

        const hgn = (window as any).hgn as HorrorGameNetwork;
        const freePt = FreePoint.getInstance();

        this._curveAppearProgress = 1 - this.getAnimationProgress(200);
        if (this._curveAppearProgress <= 0) {
            this._curveAppearProgress = 0;
            this._gradientEndAlpha = 0;
            this._appearAnimationFunc = this.disappearAnimation2;

            this._animationStartTime = hgn.timestamp;
        } else {
            this.drawCurvedLine(
                15,
                0,
                connectionPoint.x,
                connectionPoint.y
            );
        }

        const pos = this.getQuadraticBezierPoint(
            0, 0,
            0, connectionPoint.y,
            connectionPoint.x - freePt.clientWidth / 2, connectionPoint.y,
            this._curveAppearProgress
        );

        freePt.moveOffset(pos.x, pos.y);
        
        this._isDraw = true;
    }

    public disappearAnimation2(): void
    {
        const hgn = (window as any).hgn as HorrorGameNetwork;
        const currentNode = hgn.currentNode as CurrentNode;
        const freePt = FreePoint.getInstance();
        freePt.fixOffset();
        currentNode.disappear2();
        this._appearAnimationFunc = null;
        //this._parentTree.increaseDisappearedNodeCount();
    }

    protected terminalNodeHover(): void
    {
        this.hover();
    }
    
    protected terminalNodeUnhover(): void
    {
        this.unhover();
    }
} 
