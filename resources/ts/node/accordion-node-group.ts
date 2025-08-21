import { AccordionNode } from "./accordion-node";
import { AccordionTreeNode } from "./accordion-tree-node";
import { Tree } from "../common/tree";

export class AccordionNodeGroup
{
    private _parentTree: Tree;
    private _nodes: { [key: string]: AccordionNode | AccordionTreeNode };
    private _openedNode: AccordionNode | AccordionTreeNode | null;

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(parentTree: Tree)
    {
        this._parentTree = parentTree;
        this._nodes = {};
        this._openedNode = null;
    }

    public addNode(node: AccordionNode | AccordionTreeNode): void
    {
        this._nodes[node.id] = node;
        node.group = this;
    }

    public removeNode(node: AccordionNode | AccordionTreeNode): void
    {
        delete this._nodes[node.id];
    }

    public getNode(id: string): AccordionNode | AccordionTreeNode | undefined
    {
        return this._nodes[id];
    }

    public resize(): void
    {
        Object.values(this._nodes).forEach(node => node.resize());
    }

    public update(): void
    {
        Object.values(this._nodes).forEach(node => node.update());
    }

    public draw(): void
    {
        Object.values(this._nodes).forEach(node => node.draw());
    }

    public appear(conLineHeight: number, headerNodeY: number): void
    {
        Object.values(this._nodes).forEach(node => {
            const nodeTop = node.getNodeElement().offsetTop - headerNodeY;
            
            if (nodeTop <= conLineHeight) {
                node.appear();
            }
        });
    }

    public disappear(): void
    {
        Object.values(this._nodes).forEach(node => node.disappear());
    }

    public openNode(node: AccordionNode | AccordionTreeNode): void
    {
        if (this._openedNode) {
            this._openedNode.close();
        }
        this._openedNode = node;
        node.open();
    }
}
