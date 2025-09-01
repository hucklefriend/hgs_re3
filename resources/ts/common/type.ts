import { TreeView } from "../tree-view";
import { SubTreeNode } from "../node/sub-tree-node";
import { AccordionTreeNode } from "../node/accordion-tree-node";
import { LinkNode } from "../node/link-node";

// 複数のノード型を組み合わせた型エイリアス
export type TreeOwnNodeType = SubTreeNode | AccordionTreeNode;
export type DisappearRouteNodeType = LinkNode | SubTreeNode | AccordionTreeNode;
