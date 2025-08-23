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
}
