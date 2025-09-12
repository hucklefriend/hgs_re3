import { NodeContentTree } from "../parts/node-content-tree";
import { NodeHeadType } from "../../common/type";

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
}