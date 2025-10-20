import { Util } from "../common/util";
import { AppearStatus } from "../enum/appear-status";
import { NextNodeCache } from "./parts/next-node-cache";
import { NodeContentTree } from "./parts/node-content-tree";
import { NodeBase } from "./node-base";
import { TreeNodeInterface } from "./interface/tree-node-interface";
import { NodeType } from "../common/type";
import { AccordionTreeNode } from "./accordion-tree-node";
import { HorrorGameNetwork } from "../horror-game-network";

export class CurrentNode extends NodeBase implements TreeNodeInterface
{
    private _nodeContentTree: NodeContentTree;

    private _isChanging: boolean = false;
    private _isChildOnly: boolean = false;
    private _nextNodeCache: NextNodeCache | null = null;
    private _homewardNode: NodeType | null = null;
    private _currentNodeContentElement: HTMLElement | null = null;
    private _accordionGroups: { [key: string]: AccordionTreeNode[] } = {};
    private _tmpStateData: { url: string, isChildOnly: boolean } | null = null;

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

        this._currentNodeContentElement = document.getElementById('current-node-content');
        this._nodeContentTree = new NodeContentTree(this._treeContentElement as HTMLElement, this);
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
        document.body.classList.remove('has-error');

        if (!this._isChildOnly) {
            this._currentNodeContentElement!.innerHTML = '';
        }
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
        const hgn = (window as any).hgn as HorrorGameNetwork;
        hgn.calculateDisappearSpeedRate(1);

        this._appearStatus = AppearStatus.APPEARING;
        if (!this._isChildOnly) {
            this._nodeHead.appear();
        }

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
            this.disappearHeader();
            
            this._appearAnimationFunc = this.disappearAnimationWaitComplete;
        }
    }

    /**
     * 消滾アニメーション
     */
    private disappearAnimation(): void
    {
        if (AppearStatus.isDisappeared(this._nodeContentTree.lastNode.appearStatus)) {
            this._appearAnimationFunc = this.disappearAnimationWaitComplete;
        }
    }

    public disappearHeader(): void
    {
        if (!this._isChildOnly) {
            this._nodeHead.disappear();
            this.disappearContents();
        }
    }

    private disappearAnimationWaitComplete(): void
    {
        if ((this._isChildOnly || AppearStatus.isDisappeared(this._nodeHead.appearStatus)) &&
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

            if (this._nextNodeCache.hasError) {
                document.body.classList.add('has-error');
            }

            if (this._tmpStateData) {
                if (this._nextNodeCache.url.length > 0) {
                    this._tmpStateData.url = this._nextNodeCache.url;
                }

                window.history.pushState(this._tmpStateData, '', this._tmpStateData.url);
                this._tmpStateData = null;
            }

            if (!this._isChildOnly) {
                document.title = this._nextNodeCache.title;
                this._nodeHead.title = this._nextNodeCache.currentNodeTitle;
                if (this._currentNodeContentElement) {
                    this._currentNodeContentElement.innerHTML = this._nextNodeCache.currentNodeContent;
                }
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
     * @param isFromPopState 
     * @param isChildOnly 子ノードのみの場合はtrue
     */
    public moveNode(url: string, isFromPopState: boolean, isChildOnly: boolean = false): void
    {
        if (!isFromPopState) {
            // pushStateで履歴に追加
            this._tmpStateData = { url: url, isChildOnly: isChildOnly };
        }

        this._isChildOnly = isChildOnly;

        const urlWithParam = Util.addParameterA(url);
        fetch(urlWithParam, {
                headers: {"X-Requested-With": "XMLHttpRequest"}
            })
            .then(response => response.json())
            .then(data => {
                this.nextNodeCache = data;
            })
            .catch(error => {
                console.error('データの取得に失敗しました:', error);
            });
    }

    public postData(url: string, data: any, isChildOnly: boolean = false, isNoPushState: boolean = false): void
    {
        if (!isNoPushState) {
            this._tmpStateData = { url: url, isChildOnly: isChildOnly };
        } else {
            this._tmpStateData = null;
        }
        this._isChildOnly = isChildOnly;

        const urlWithParam = Util.addParameterA(url);
        fetch(urlWithParam, {
            headers: {"X-Requested-With": "XMLHttpRequest"},
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(data => {
            this.nextNodeCache = data;
        })
        .catch(error => {
            console.error('データの送信に失敗しました:', error);
        });
    }

    public changeChildNodes(url: string, nodeId: string | null, isChildOnly: boolean = false): void
    {
        if (nodeId) {
            const node = this.getNodeById(nodeId);
            if (node && !(node instanceof CurrentNode)) {
                node.parentNode.prepareDisappear(node);
            }
        }

        this.moveNode(url, false, isChildOnly);
        this.disappear();
    }

    public changeChildNodesWithData(url: string, data: any, isChildOnly: boolean = false, isNoPushState: boolean = false): void
    {
        this._isChildOnly = false;
        this.postData(url, data, isChildOnly, isNoPushState);
        this.disappear();
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

    public getNodeById(id: string): NodeType | null
    {
        return this._nodeContentTree.getNodeById(id);
    }
}

