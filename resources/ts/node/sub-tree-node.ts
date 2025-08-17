import { MainNodeBase } from "./main-node-base";
import { AppearStatus } from "../enum/appear-status";
import { NodePoint } from "./parts/node-point";
import { Tree } from "../common/tree";
import { LinkNode } from "./link-node";
import { FreePoint } from "../common/free-point";
import { HorrorGameNetwork } from "../horror-game-network";
import { TreeView } from "../tree-view";

export class SubTreeNode extends MainNodeBase
{
    private _tree: Tree;

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement, parentTree: Tree)
    {
        super(nodeElement, parentTree);

        this._tree = new Tree(
            this.id,
            nodeElement.querySelector('.header-node') as HTMLElement,
            nodeElement.querySelector('.connection-line') as HTMLDivElement
        );

        this._tree.loadNodes(nodeElement.querySelectorAll('.sub-tree-node-container section.node'));
    }

    public get tree(): Tree
    {
        return this._tree;
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

    public resize(): void
    {
        super.resize();
        this._tree.resize();
    }

    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        super.update();

        this._tree.update();
    }

    

    protected isHover(): boolean
    {
        return this._appearStatus === AppearStatus.APPEARED;
    }

    /**
     * ホバー時の処理
     */
    protected hover(): void
    {
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
        super.terminalNodeHover();
    }

    /**
     * ホバー解除時の処理
     */
    protected unhover(): void
    {
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
        super.terminalNodeUnhover();
    }

    protected terminalNodeHover(): void
    {
        this.hover();
    }
    
    protected terminalNodeUnhover(): void
    {
        this.unhover();
    }

    public appearAnimation(): void
    {
        super.appearAnimation();

        if (this._curveAppearProgress === 1) {
            this._tree.appear();
            this._gradientEndAlpha = 1;
            //this._appearAnimationFunc = this.appearAnimation2;
        }
    }

    

    /**
     * サブノードの出現アニメーション
     */
    protected appearSubNodesAnimation(): void
    {
        
    }

    public disappear(): void
    {
        this._tree.disappear();
        super.disappear(false);

        if (!this.isSelectedDisappear) {
            this._nodeElement.classList.add('invisible');
        } else {
            this._gradientEndAlpha = 1;
        }
    }

    public disappearAnimation(): void
    {
        //super.disappearAnimation();

        if (this._tree.lastNode === null) {
            this._tree.disappearConnectionLine();
            this._appearAnimationFunc = null;
        } else {
            if (this._tree.lastNode.appearStatus === AppearStatus.DISAPPEARED) {
                this._tree.disappearConnectionLine();
                this._appearAnimationFunc = null;
            }
        }
    }

    public disappear2(): void
    {
        //this._tree.connectionLine.setHeight(0);
        this._tree.connectionLine.disappear(0, true);
        this._appearAnimationFunc = this.disappear2Animation;
        this._animationStartTime = (window as any).hgn.timestamp;

        const freePt = (window as any).hgn.treeView.freePt as FreePoint;
        freePt.moveTo(this.getAbsoluteConnectionPoint());
    }

    public disappear2Animation(): void
    {
        const treeView = (window as any).hgn.treeView as TreeView;
        const freePt = treeView.freePt as FreePoint;
        const progress = 1 - this.getAnimationProgress(300);
        if (progress <= 0) {
            this._gradientEndAlpha = 0;
            this._appearAnimationFunc = this.disappear2Animation2;
            this._animationStartTime = (window as any).hgn.timestamp;
            this.invisibleNodeHead();
        } else {
            freePt.moveOffset(0, 0);
        }
    }

    public disappear2Animation2(): void
    {
        const connectionPoint = this.getConnectionPoint();

        const hgn = (window as any).hgn as HorrorGameNetwork;
        const treeView = hgn.treeView as TreeView as TreeView;

        this._curveAppearProgress = 1 - this.getAnimationProgress(200);
        if (this._curveAppearProgress <= 0) {
            this._curveAppearProgress = 0;
            this._gradientEndAlpha = 0;
            this._appearAnimationFunc = null;

            const freePt = treeView.freePt as FreePoint;
            freePt.fixOffset();
            treeView.disappear2();
        } else {
            this.drawCurvedLine(
                15,
                0,
                connectionPoint.x,
                connectionPoint.y
            );
        }

        const freePt = hgn.treeView.freePt as FreePoint;
        const pos = this.getQuadraticBezierPoint(
            0, 0,
            0, connectionPoint.y,
            connectionPoint.x - freePt.clientWidth/2, connectionPoint.y,
            this._curveAppearProgress
        );

        freePt.moveOffset(pos.x- this._tree.headerNode.point.element.offsetWidth, pos.y - connectionPoint.y);
        
        this._isDraw = true;
    }

    public draw(): void
    {
        super.draw();
        this._tree.draw();
    }
    
    /**
     * 接続点を取得する
     * @returns 接続点の座標
     */
    public getConnectionPoint(): {x: number, y: number}
    {
        let connectionPoint = this._tree.headerNode.getConnectionPoint();
        //connectionPoint.x += this._tree.headerNode.element.offsetLeft;
        return connectionPoint;
    }

    /**
     * HTML上の絶対座標で接続点を取得する
     * @returns 絶対座標の接続点
     */
    public getAbsoluteConnectionPoint(): {x: number, y: number}
    {
        return this._tree.headerNode.getAbsoluteConnectionPoint();
    }
}
