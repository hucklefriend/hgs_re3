import { BasicNode } from "./basic-node";
import { AppearStatus } from "../enum/appear-status";
import { NodeContentTree } from "./parts/node-content-tree";
import { FreePoint } from "./parts/free-point";
import { HorrorGameNetwork } from "../horror-game-network";
import { TreeView } from "../tree-view";
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
        super.disappear();

        this._nodeContentTree.homewardNode = this._homewardNode;
        this._nodeContentTree.disappear();
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
                if (this.isSelectedDisappear) {
                    this._appearAnimationFunc = null;
                } else {
                    this._appearAnimationFunc = this.disappearAnimation2;
                }
            }
        }
    }

    public disappearAnimation2(): void
    {
        if (this._tree.connectionLine.isDisappeared()) {
            this._parentTree.increaseDisappearedNodeCount();
            this._appearAnimationFunc = null;
            this._appearStatus = AppearStatus.DISAPPEARED;
        }
    }

    public homewardDisappear(): void
    {
        this._nodeContentTree.disappearConnectionLine(true);
        this._appearAnimationFunc = this.homewardDisappearAnimation;
        this._animationStartTime = (window as any).hgn.timestamp;
    }

    public homewardDisappearAnimation(): void
    {
        if (this._nodeContentTree.appearStatus === AppearStatus.DISAPPEARED) {
            this._appearAnimationFunc = this.homewardDisappearAnimation2;
        }
    }

    public homewardDisappearAnimation2(): void
    {
        const connectionPoint = this._nodeHead.getConnectionPoint();

        this._curveAppearProgress = 1 - this.getAnimationProgress(200);
        if (this._curveAppearProgress <= 0) {
            this._curveAppearProgress = 0;
            this._gradientEndAlpha = 0;
            this._appearAnimationFunc = null;
            this._parentNode.increaseDisappearedNodeCount();
            this._appearStatus = AppearStatus.DISAPPEARED;

            FreePoint.getInstance().fixOffset();
            this.parentNode.homewardDisappear();
        } else {
            this.drawCurvedLine(
                15,
                0,
                connectionPoint.x,
                connectionPoint.y
            );
        }

        const freePt = FreePoint.getInstance();
        const pos = this.getQuadraticBezierPoint(
            0, 0,
            0, connectionPoint.y,
            connectionPoint.x - freePt.clientWidth/2, connectionPoint.y,
            this._curveAppearProgress
        );

        freePt.moveOffset(pos.x- this._nodeHead.nodePoint.htmlElement.offsetWidth, pos.y - connectionPoint.y);
        
        this._isDraw = true;
    }

    public draw(): void
    {
        super.draw();
        this._nodeContentTree.draw();
    }
}
