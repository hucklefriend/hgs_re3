import { NodeContentTree } from "../parts/node-content-tree";
import { NodeHeadType } from "../../common/type";
import { LinkNode } from "../link-node";

/**
 * ツリー構造を持つノードのインターフェース
 */
export interface TreeNodeInterface
{
    /**
     * ノードコンテンツツリー
     */
    readonly nodeContentTree: NodeContentTree;

    /**
     * ノードヘッド
     */
    readonly nodeHead: NodeHeadType;

    /**
     * 出現したノード数を増加
     */
    increaseAppearedNodeCount(): void;

    /**
     * 消滅したノード数を増加
     */
    increaseDisappearedNodeCount(): void;

    /**
     * 消滅アニメーション準備
     * @param selectedLinkNode 選択されたリンクノード
     */
    prepareDisappear(selectedLinkNode: LinkNode | null): void;
}