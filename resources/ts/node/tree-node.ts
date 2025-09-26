import { BasicNode } from "./basic-node";
import { AppearStatus } from "../enum/appear-status";
import { NodeContentTree } from "./parts/node-content-tree";
import { FreePoint } from "./parts/free-point";
import { TreeNodeInterface } from "./interface/tree-node-interface";
import { NodeType } from "../common/type";
import { Util } from "../common/util";
import { Point } from "../common/point";

export class TreeNode extends BasicNode implements TreeNodeInterface
{
    protected _nodeContentTree: NodeContentTree;
    protected _homewardNode: NodeType | null;

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
        
        if (this._curveCanvas.appearProgress === 1) {
            this._nodeContentTree.appear();
            this._curveCanvas.gradientEndAlpha = 1;
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
        this._parentNode.prepareDisappear(this);
    }

    public disappear(): void
    {
        if (this._homewardNode === null) {
            super.disappear();
        }

        this._appearStatus = AppearStatus.DISAPPEARING;
        this._nodeContentTree.homewardNode = this._homewardNode;
        this._nodeContentTree.disappear();

        this._nodeContentBehind?.disappear();
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
            this._curveCanvas.appearProgress = 1;
            this._appearAnimationFunc = this.homewardDisappearAnimation2;

            const freePt = FreePoint.getInstance();
    
            const parentConnectionPoint = this._parentNode.nodeHead.getAbsoluteConnectionPoint();
            const rect = this._nodeElement.getBoundingClientRect();
            const y = rect.top + window.scrollY;
            freePt.setPos(parentConnectionPoint.x - freePt.clientWidth / 2+1, y - freePt.clientHeight / 2);

            const connectionPoint = this._nodeHead.getConnectionPoint();
            const pos = Util.getQuadraticBezierPoint(
                0, 0,
                connectionPoint.x - 15, connectionPoint.y,
                this._curveCanvas.appearProgress
            );
    
            freePt.moveOffset(pos.x, pos.y);
            this._nodeHead.nodePoint.hidden();
        }
    }

    public homewardDisappearAnimation2(): void
    {
        const connectionPoint = this._nodeHead.getConnectionPoint();
        const freePt = FreePoint.getInstance();

        this._curveCanvas.appearProgress = 1 - Util.getAnimationProgress(this._animationStartTime, 200);
        this._curveCanvas.gradientStartAlpha = this._curveCanvas.appearProgress;
        this._curveCanvas.gradientEndAlpha = this._curveCanvas.appearProgress / 3;
        if (this._curveCanvas.appearProgress === 0) {
            this._curveCanvas.gradientEndAlpha = 0;
            this._homewardNode = null;
            this._appearAnimationFunc = null;
            this._appearStatus = AppearStatus.DISAPPEARED;

            freePt.fixOffset();
            this.parentNode.homewardDisappear();
        } else { 
            this._curveCanvas.drawCurvedLine(new Point(15, 0), connectionPoint);

            const pos = Util.getQuadraticBezierPoint(
                0, 0,
                connectionPoint.x - 15, connectionPoint.y,
                this._curveCanvas.appearProgress
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

    public resizeConnectionLine(): void
    {
        this._nodeContentTree.resizeConnectionLine(this._nodeHead.getConnectionPoint());
        // 親にも伝播させる
        this._parentNode.resizeConnectionLine();
    }
}
