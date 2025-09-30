import { Util } from "../common/util";
import { AppearStatus } from "../enum/appear-status";
import { NextNodeCache } from "./parts/next-node-cache";
import { NodeContentTree } from "./parts/node-content-tree";
import { NodeBase } from "./node-base";
import { LinkNode } from "./link-node";
import { TreeNodeInterface } from "./interface/tree-node-interface";
import { NodeType } from "../common/type";
import { AccordionTreeNode } from "./accordion-tree-node";
import { LinkTreeNode } from "./link-tree-node";

export class CurrentNode extends NodeBase implements TreeNodeInterface
{
    private _nodeContentTree: NodeContentTree;

    private _isChanging: boolean;
    private _nextNodeCache: NextNodeCache | null;
    private _homewardNode: NodeType | null;
    private _currentNodeContentElement: HTMLElement | null;
    private _accordionGroups: { [key: string]: AccordionTreeNode[] };

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
        this._homewardNode = null;
        this._currentNodeContentElement = document.getElementById('current-node-content');

        this._nodeContentTree = new NodeContentTree(this._treeContentElement as HTMLElement, this);

        this._accordionGroups = {};
    }

    public start(): void
    {
        this._nodeContentTree.loadNodes(this);
    }

    /**
     * ノードの開放
     */
    public dispose(): void
    {
        this._nodeContentTree.disposeNodes();
        this._accordionGroups = {};
        this._homewardNode = null;
        this._currentNodeContentElement!.innerHTML = '';
    }

    /**
     * ノードコンテンツツリーを取得
     */
    public get nodeContentTree(): NodeContentTree
    {
        return this._nodeContentTree;
    }

    public resize(): void
    {
        super.resize();
        this._nodeContentTree.resize();
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
            this._appearAnimationFunc?.();

            super.update();
            this._nodeContentTree.update();
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
        this._appearStatus = AppearStatus.APPEARING;
        this._nodeHead.appear();
        this.appearContents();
        this._nodeContentTree.appear();

        const connectionPoint = this._nodeHead.getConnectionPoint();
        this.freePt.setPos(connectionPoint.x, connectionPoint.y).setElementPos();
        this.freePt.show();

        this._appearAnimationFunc = this.appearAnimation;

    }

    /**
     * 出現アニメーション
     */
    private appearAnimation(): void
    {
        if (AppearStatus.isAppeared(this._nodeContentTree.appearStatus)) {
            this._appearAnimationFunc = null;
            this._appearStatus = AppearStatus.APPEARED;
        }
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
        this._appearStatus = AppearStatus.DISAPPEARING;
        this._nodeContentTree.disappear();
        if (this._homewardNode !== null) {
            this._appearAnimationFunc = this.disappearAnimation;
        } else {
            this._nodeHead.disappear();
            this.disappearContents();
            
            this._appearAnimationFunc = this.disappearAnimationWaitFinished;
        }
    }

    /**
     * 消滾アニメーション
     */
    private disappearAnimation(): void
    {
        if (AppearStatus.isDisappeared(this._nodeContentTree.lastNode.appearStatus)) {
            this._appearAnimationFunc = this.disappearAnimationWaitFinished;
        }
    }

    private disappearAnimationWaitFinished(): void
    {
        if (AppearStatus.isDisappeared(this._nodeHead.appearStatus) &&
            AppearStatus.isDisappeared(this._nodeContentTree.appearStatus)) {
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

        this._appearStatus = AppearStatus.DISAPPEARED;

        this._isChanging = true;
    }

    /**
     * ノードの切り替え
     */
    private changeNode(): void
    {
        if (this._nextNodeCache && this._appearStatus === AppearStatus.DISAPPEARED) {
            this.dispose();

            document.title = this._nextNodeCache.title;
            this._nodeHead.title = this._nextNodeCache.currentNodeTitle;
            if (this._currentNodeContentElement) {
                this._currentNodeContentElement.innerHTML = this._nextNodeCache.currentNodeContent;
            }
            if (this._treeContentElement) {
                this._treeContentElement.innerHTML = this._nextNodeCache.nodes;
            }

            this._nodeContentTree.loadNodes(this);
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
    public moveNode(url: string, linkNode: LinkNode | LinkTreeNode | null, isFromPopState: boolean): void
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
        this._nodeContentTree.disappearConnectionLine();
    }

    public resizeConnectionLine(): void
    {
        this._nodeContentTree.resizeConnectionLine(this._nodeHead.getConnectionPoint());
    }

    public addAccordionGroup(groupId: string, node: AccordionTreeNode): void
    {
        if (!this._accordionGroups[groupId]) {
            this._accordionGroups[groupId] = [];
        }
        this._accordionGroups[groupId].push(node);
    }

    public getAccordionGroup(groupId: string): AccordionTreeNode[]
    {
        return this._accordionGroups[groupId];
    }
}

