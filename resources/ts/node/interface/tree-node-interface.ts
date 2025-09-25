import { NodeContentTree } from "../parts/node-content-tree";
import { NodeType } from "../../common/type";
import { NodeHead } from "../parts/node-head";

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
    readonly nodeHead: NodeHead;

    /**
     * 帰路ノード
     */
    readonly homewardNode: NodeType | null;

    /**
     * 消滅アニメーション準備
     * @param homewardNode 帰路ノード
     */
    prepareDisappear(homewardNode: NodeType): void;

    /**
     * 帰路消滅アニメーション開始
     */
    homewardDisappear(): void;

    resizeConnectionLine(): void;
}