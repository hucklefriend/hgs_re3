import { NodeContentTree } from "../parts/node-content-tree";
import { NodeHeadType } from "../../common/type";
import { NodeType } from "../../common/type";

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
     * 帰路ノード
     */
    readonly homewardNode: NodeType | null;

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
     * @param homewardNode 帰路ノード
     */
    prepareDisappear(homewardNode: NodeType): void;

    /**
     * 帰路消滅アニメーション開始
     */
    homewardDisappear(): void;
}