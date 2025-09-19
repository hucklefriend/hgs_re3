import { CurrentNode } from "../node/current-node";
import { LinkNode } from "../node/link-node";
import { BasicNode } from "../node/basic-node";
import { NodeContent } from "../node/parts/node-content";
import { NodeContentTree } from "../node/parts/node-content-tree";
import { ChildTreeNode } from "../node/child-tree-node";

// 複数のノード型を組み合わせた型エイリアス
export type NodeType = CurrentNode | BasicNode | LinkNode | ChildTreeNode;
export type TreeNodeType = CurrentNode | ChildTreeNode;
export type DisappearRouteNodeType = CurrentNode | LinkNode/* | AccordionTreeNode | ChildTreeLinkNode | ChildTreeNode*/;
export type NodeContentType = NodeContent | NodeContentTree | null;