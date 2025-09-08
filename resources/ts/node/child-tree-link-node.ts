import { HorrorGameNetwork } from "../horror-game-network";
import { MainNodeBase } from "./main-node-base";
import { NodePoint } from "./parts/node-point";
import { AppearStatus } from "../enum/appear-status";
import { TreeView } from "../tree-view";
import { FreePoint } from "../common/free-point";
import { Util } from "../common/util";
import { Tree } from "../common/tree";
import { TreeOwnNodeType } from "../common/type";
import { ChildTreeNode } from "./child-tree-node";

export class ChildTreeLinkNode extends ChildTreeNode
{
    
    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement, parentNode: TreeOwnNodeType | null, parentTree: Tree)
    {
        super(nodeElement, parentNode, parentTree);
    }
} 
