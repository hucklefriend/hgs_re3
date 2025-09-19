import { BasicNode } from "./basic-node";
import { AppearStatus } from "../enum/appear-status";
import { NodeContentTree } from "./parts/node-content-tree";
import { FreePoint } from "./parts/free-point";
import { TreeNodeInterface } from "./interface/tree-node-interface";
import { CurrentNode } from "./current-node";
import { NodeType } from "../common/type";

export class ChildTreeNode extends BasicNode implements TreeNodeInterface
{
    private _nodeContentTree: NodeContentTree;
    private _homewardNode: NodeType | null;

    /**
     * ノードコンテンツツリーを取得
     */
    public get nodeContentTree(): NodeContentTree
    {
        return this._nodeContentTree;
    }

    /**
     * 帰路ノードを取得
     */
    public get homewardNode(): NodeType | null
    {
        return this._homewardNode;
    }

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement, parentNode: TreeNodeInterface)
    {
        super(nodeElement, parentNode);

        this._nodeContentTree = new NodeContentTree(this._treeContentElement as HTMLElement, this);
        this._nodeContentTree.loadNodes(this);
        this._homewardNode = null;
    }

    /**
     * 出現したノード数を増加
     */
    public increaseAppearedNodeCount(): void
    {
        this._nodeContentTree.increaseAppearedNodeCount();
    }

    /**
     * 消滅したノード数を増加
     */
    public increaseDisappearedNodeCount(): void
    {
        this._nodeContentTree.increaseDisappearedNodeCount();
    }

    /**
     * ホバー開始時のグラデーションα値を更新
     */
    protected updateGradientEndAlphaOnHover(): void
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
    protected updateGradientEndAlphaOnUnhover(): void
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
        this._nodeContentTree.resize();
    }

    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        super.update();

        this._nodeContentTree.update();
    }

    public appear(): void
    {
        if (AppearStatus.isDisappeared(this._appearStatus)) {
            super.appear();
            this._appearAnimationFunc = this.appearAnimation;
        }
    }

    public appearAnimation(): void
    {
        super.appearAnimation();
        
        if (this._curveAppearProgress === 1) {
            this._nodeContentTree.appear();
            this._gradientEndAlpha = 1;
            this._animationStartTime = (window as any).hgn.timestamp;
            this._appearAnimationFunc = this.appearAnimation2;
        }
    }

    public appearAnimation2(): void
    {
        if (AppearStatus.isAppeared(this._nodeContentTree.appearStatus)) {
            this._appearAnimationFunc = null;
        }
    }

    
    /**
     * サブノードの出現アニメーション
     */
    protected appearSubNodesAnimation(): void
    {
        
    }

    public prepareDisappear(homewardNode: NodeType): void
    {
        this._homewardNode = homewardNode;
        const currentNode = (window as any).hgn.currentNode as CurrentNode;
        currentNode.addDisappearRouteNode(this);
        this._parentNode.prepareDisappear(this);
    }

    public disappear(): void
    {
        if (this._homewardNode === null) {
            super.disappear();
        }

        this._nodeContentTree.homewardNode = this._homewardNode;
        this._nodeContentTree.disappear();
    }

    public homewardDisappear(): void
    {
        this._nodeContentTree.disappearConnectionLine(true);
        this._appearAnimationFunc = this.homewardDisappearAnimation;
        this._animationStartTime = (window as any).hgn.timestamp;
        this._nodeHead.disappear();
    }

    public homewardDisappearAnimation(): void
    {
        if (this._nodeContentTree.appearStatus === AppearStatus.DISAPPEARED) {
            this._animationStartTime = (window as any).hgn.timestamp;
            this._curveAppearProgress = 1;
            this._appearAnimationFunc = this.homewardDisappearAnimation2;

            const freePt = FreePoint.getInstance();
    
            const parentConnectionPoint = this._parentNode.nodeHead.getAbsoluteConnectionPoint();
            const rect = this._nodeElement.getBoundingClientRect();
            const y = rect.top - window.scrollY;
            freePt.setPos(parentConnectionPoint.x - freePt.clientWidth / 2+1, y - freePt.clientHeight / 2);

            const connectionPoint = this._nodeHead.getConnectionPoint();
            const pos = this.getQuadraticBezierPoint(
                0, 0,
                connectionPoint.x - 15, connectionPoint.y,
                this._curveAppearProgress
            );
    
            freePt.moveOffset(pos.x, pos.y);
            this._nodeHead.nodePoint.hidden();
        }
    }

    public homewardDisappearAnimation2(): void
    {
        const connectionPoint = this._nodeHead.getConnectionPoint();
        const freePt = FreePoint.getInstance();

        this._curveAppearProgress = 1 - this.getAnimationProgress(200);
        this._gradientStartAlpha = this._curveAppearProgress;
        this._gradientEndAlpha = this._curveAppearProgress / 3;
        if (this._curveAppearProgress <= 0) {
            this._curveAppearProgress = 0;
            this._gradientEndAlpha = 0;
            this._homewardNode = null;
            this._appearAnimationFunc = null;
            this._parentNode.increaseDisappearedNodeCount();
            this._appearStatus = AppearStatus.DISAPPEARED;

            freePt.fixOffset();
            this.parentNode.homewardDisappear();
        } else {
            this.drawCurvedLine(
                15,
                0,
                connectionPoint.x,
                connectionPoint.y
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

    public draw(): void
    {
        super.draw();
        this._nodeContentTree.draw();
    }
}
