import { MainNodeBase } from "./main-node-base";
import { AppearStatus } from "../enum/appear-status";
import { NodePoint } from "./parts/node-point";
import { Tree } from "../common/tree";
import { LinkNode } from "./link-node";
import { FreePoint } from "../common/free-point";
import { HorrorGameNetwork } from "../horror-game-network";
import { TreeView } from "../tree-view";
import { AccordionNode } from "./accordion-node";
import { SubTreeNode } from "./sub-tree-node";
import { AccordionNodeGroup } from "./accordion-node-group";

export class AccordionTreeNode extends AccordionNode
{
    private _tree: Tree;

    public constructor(nodeElement: HTMLElement, parentTree: Tree)
    {
        super(nodeElement, parentTree);

        this._tree = new Tree(
            this.id,
            nodeElement.querySelector('.header-node') as HTMLElement,
            nodeElement.querySelector('.connection-line') as HTMLDivElement
        );

        this._tree.loadNodes(this._content.querySelectorAll('section.node'));
        this._tree.resize();
    }

    public get tree(): Tree
    {
        return this._tree;
    }

    public open(): void
    {
        super.open();
        
        this._tree.appear(false);
    }

    public close(): void
    {
        super.close();
        this._tree.disappear(false);
        this._tree.disappearConnectionLine(true, true);
    }

    public update(): void
    {
        super.update();
        this._tree.update();
    }

    public resize(): void
    {
        super.resize();
        this._tree.resize();
    }

    public draw(): void
    {
        super.draw();
        this._tree.draw();
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
}
