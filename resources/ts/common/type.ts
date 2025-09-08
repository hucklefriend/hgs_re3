import { TreeView } from "../tree-view";
import { AccordionTreeNode } from "../node/accordion-tree-node";
import { ChildTreeLinkNode } from "../node/child-tree-link-node";
import { ChildTreeNode } from "../node/child-tree-node";
import { LinkNode } from "../node/link-node";
import { ContentNode } from "../node/content-node";
import { TerminalNode } from "../node/terminal-node";
import { AccordionNode } from "../node/accordion-node";

// 複数のノード型を組み合わせた型エイリアス
export type NodeType = AccordionTreeNode | ChildTreeLinkNode | ChildTreeNode | LinkNode | ContentNode | TerminalNode | AccordionNode;
export type TreeOwnNodeType = AccordionTreeNode | ChildTreeLinkNode | ChildTreeNode;
export type DisappearRouteNodeType = LinkNode | AccordionTreeNode | ChildTreeLinkNode | ChildTreeNode;
