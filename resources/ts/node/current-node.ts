import { Util } from "../common/util";
import { FreePoint } from "./parts/free-point";
import { AppearStatus } from "../enum/appear-status";
import { NextNodeCache } from "./parts/next-node-cache";
import { NodeContentTree } from "./parts/node-content-tree";
import { NodeBase } from "./node-base";
import { LinkNode } from "./link-node";
import { TreeNodeInterface } from "./interface/tree-node-interface";
import { NodeType } from "../common/type";

export class CurrentNode extends NodeBase implements TreeNodeInterface
{   
    private _nodeContentTree: NodeContentTree;
    private _disappearRouteNodes: TreeNodeInterface[];

    private _isChanging: boolean;
    private _nextNodeCache: NextNodeCache | null;
    private _homewardNode: NodeType | null;

    public get homewardNode(): NodeType | null
    {
        return this._homewardNode;
    }

    /**
     * コンストラクタ
     * 
     * @param htmlElement HTML要素
     */
    public constructor(htmlElement: HTMLElement)
    {
        super(htmlElement);

        this._nextNodeCache = null;
        this._isChanging = false;
        this._disappearRouteNodes = [];
        this._homewardNode = null;

        this._nodeContentTree = new NodeContentTree(this._treeContentElement as HTMLElement, this);
        this._nodeContentTree.loadNodes(this);
    }

    /**
     * ノードの開放
     */
    public dispose(): void
    {
        this._disappearRouteNodes = [];
        this._nodeContentTree.disposeNodes();
    }

    /**
     * ノードコンテンツツリーを取得
     */
    public get nodeContentTree(): NodeContentTree
    {
        return this._nodeContentTree;
    }

    /**
     * 出現したノード数を増加
     */
    public increaseAppearedNodeCount(): void
    {
        this._nodeContentTree.increaseAppearedNodeCount();
    }

    /**
     * 消滅したノード数を増加
     */
    public increaseDisappearedNodeCount(): void
    {
        this._nodeContentTree.increaseDisappearedNodeCount();
    }

    /**
     * 更新
     */
    public update(): void
    {
        if (this._isChanging) {
            // ノード切り替え待ち
            this.changeNode();
        } else {
            if (this._appearAnimationFunc !== null) {
                this._appearAnimationFunc();
            }

            super.update();
            this._nodeContentTree.update();
            FreePoint.update();
        }
    }

    /**
     * 描画
     */
    public draw(): void
    {
        super.draw();
        this._nodeContentTree.draw();
    }

    /**
     * 出現アニメーション開始
     */
    public appear(): void
    {
        super.appear();
        this._nodeContentTree.appear();

        this._appearAnimationFunc = this.appearAnimation;
    }

    /**
     * 出現アニメーション
     */
    private appearAnimation(): void
    {
        if (AppearStatus.isAppeared(this._nodeContentTree.appearStatus)) {
            this._appearAnimationFunc = null;
        }
    }

    public addDisappearRouteNode(node: TreeNodeInterface): void
    {
        this._disappearRouteNodes.push(node);
    }

    /**
     * 消滅アニメーション準備
     * 
     * @param selectedLinkNode クリックしたリンクノード
     */
    public prepareDisappear(homewardNode: NodeType): void
    {
        // クリックしたリンクノードから親をたどってCurrentNodeにたどり着く
        // ここに来たらdisappearを呼ぶ
        this._homewardNode = homewardNode;
        this._nodeContentTree.homewardNode = homewardNode;
        this.disappear();
    }

    /**
     * 消滅アニメーション開始
     */
    public disappear(): void
    {
        this._nodeContentTree.disappear();
        this._appearAnimationFunc = this.disappearAnimation;
    }

    /**
     * 消滾アニメーション
     */
    private disappearAnimation(): void
    {
        if (this._nodeContentTree.lastNode === null) {
            this._nodeHead.disappear();
            this._appearAnimationFunc = this.disappearAnimationWaitFinished;
        } else {
            if (AppearStatus.isDisappeared(this._nodeContentTree.lastNode.appearStatus)) {
                //this._nodeContentTree.disappearConnectionLine();
                this._appearAnimationFunc = this.disappearAnimationWaitFinished;
            }
        }
    }

    private disappearAnimationWaitFinished(): void
    {
        if (AppearStatus.isDisappeared(this._nodeHead.appearStatus)) {
            this._appearAnimationFunc = null;
            this.disappeared();
        }
    }

    /**
     * 消滅完了
     */
    public disappeared(): void
    {
        window.scrollTo(0, 0);
        FreePoint.getInstance().hide();

        this._isChanging = true;
        this._appearStatus = AppearStatus.DISAPPEARED;
    }

    /**
     * ノードの切り替え
     */
    private changeNode(): void
    {
        if (this._nextNodeCache && this._appearStatus === AppearStatus.DISAPPEARED) {
            this.disposeNodes();

            this._tree.headerNode.title = this._nextNodeCache.title;
            this._treeNodes.innerHTML = this._nextNodeCache.nodes;

            this.loadNodes();
            this.resize();
            this._nextNodeCache = null;
            this._isChanging = false;
            
            this.appear();
        }
    }


    public set nextNodeCache(cache: NextNodeCache)
    {
        this._nextNodeCache = cache;
    }

    /**
     * 別のノードへ移動する
     * 
     * @param url 
     * @param linkNode 
     * @param isFromPopState 
     */
    public moveNode(url: string, linkNode: LinkNode | null, isFromPopState: boolean): void
    {
        if (!isFromPopState) {
            // pushStateで履歴に追加
            const stateData = {
                type: 'link-node',
                url: url,
                anchorId: linkNode?.anchor.id || ''
            };
            history.pushState(stateData, '', url);
        }

        const urlWithParam = Util.addParameterA(url);
        fetch(urlWithParam, {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then(data => {
                this.nextNodeCache = data;
            })
            .catch(error => {
                console.error('データの取得に失敗しました:', error);
            });
    }

    public homewardDisappear(): void
    {
        this._nodeHead.disappear();
        this._nodeContentTree.disappearConnectionLine(true);
    }
}

