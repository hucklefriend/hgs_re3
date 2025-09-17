import { Util } from "../common/util";
import { FreePoint } from "./parts/free-point";
import { AppearStatus } from "../enum/appear-status";
import { DisappearRouteNodeType } from "../common/type";
import { NextNodeCache } from "./parts/next-node-cache";
import { NodeContentTree } from "./parts/node-content-tree";
import { NodeBase } from "./node-base";
import { LinkNode } from "./link-node";
import { TreeNodeInterface } from "./interface/tree-node-interface";

export class CurrentNode extends NodeBase implements TreeNodeInterface
{   
    public isSelectedDisappear: boolean;

    private _nodeContentTree: NodeContentTree;
    private _disappearRouteNodes: TreeNodeInterface[];

    private _isChanging: boolean;
    private _nextNodeCache: NextNodeCache | null;

    /**
     * コンストラクタ
     * 
     * @param htmlElement HTML要素
     */
    public constructor(htmlElement: HTMLElement)
    {
        super(htmlElement);

        this.isSelectedDisappear = true;    // CurrentNodeは常にtrue

        this._nextNodeCache = null;
        this._isChanging = false;
        this._disappearRouteNodes = [];

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

    public prepareDisappear(selectedLinkNode: LinkNode | null): void
    {
        this.disappear(selectedLinkNode);
    }

    /**
     * 消滅アニメーション開始
     */
    public disappear(selectedLinkNode: LinkNode | null = null): void
    {
        if (selectedLinkNode) {
            let node = selectedLinkNode.parentNode;
            if (node === null) {
                this._tree.disappearRouteNode = selectedLinkNode;
            } else {
                let child = selectedLinkNode as DisappearRouteNodeType;
                while (node) {
                    node.isSelectedDisappear = true;
    
                    this._disappearRouteNodes.push(node as TreeOwnNodeType);

                    if (node.tree) {
                        node.tree.disappearRouteNode = child;
                    }

                    child = node;
                    node = node.parentNode;
                    if (node === null) {
                        this._tree.disappearRouteNode = child;
                    }
                }
            }

            this._disappearRouteNodes.push(this);
            selectedLinkNode.isSelectedDisappear = true;
        }

        this._tree.disappear();

        this._appearAnimationFunc = this.disappearAnimation;
    }

    private disappearAnimation(): void
    {
        if (this._tree.lastNode === null) {
            this._tree.disappearConnectionLine();
            if (this._disappearRouteNodes.length === 0) {
                this._appearAnimationFunc = this.disappearAnimation2;
            } else {
                this._appearAnimationFunc = null;
            }
        } else {
            if (this._tree.lastNode.appearStatus === AppearStatus.DISAPPEARED) {
                this._tree.disappearConnectionLine();
                if (this._disappearRouteNodes.length === 0) {
                    this._appearAnimationFunc = this.disappearAnimation2;
                } else {
                    this._appearAnimationFunc = null;
                }
            }
        }
    }

    private disappearAnimation2(): void
    {
        if (this._tree.isDisappeared()) {
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
        this._freePt.hide();
        this._tree.headerNode.point.disappear();

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
        this.disappear(linkNode);

        if (!isFromPopState) {
            // pushStateで履歴に追加
            const stateData = {
                type: 'link-node',
                url: url,
                anchorId: linkNode?.getAnchorId() || ''
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

    public disappear2(): void
    {
        const node = this._disappearRouteNodes.shift();
        if (node instanceof ChildTreeNode || node instanceof AccordionTreeNode) {
            node.disappear2();
        } else if (node instanceof TreeView) {
            this._tree.disappearConnectionLine(true);
            const connectionPoint = this._tree.headerNode.getAbsoluteConnectionPoint();
            this._freePt.moveTo(connectionPoint);
            this._appearAnimationFunc = this.disappearAnimation2;
        }
    }
}

