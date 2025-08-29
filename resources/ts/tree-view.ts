import { LinkNode } from "./node/link-node";
import { ContentNode } from "./node/content-node";
import { MainNodeBase } from "./node/main-node-base";
import { Util } from "./common/util";
import { Tree } from "./common/tree";
import { FreePoint } from "./common/free-point";
import { SubTreeNode } from "./node/sub-tree-node";
import { AppearStatus } from "./enum/appear-status";
import { AccordionTreeNode } from "./node/accordion-tree-node";

export class TreeView
{
    private static SCROLL_SPEED_RATE: number = 0.7;

    private _element: HTMLElement;
    
    private _treeNodes: HTMLElement;
    private _tree: Tree;

    private _isSelfScroll: boolean;
    private _scrollStartX: number;
    private _scrollStartY: number;
    private _appearAnimationFunc: (() => void) | null;

    private _disappearRouteNodes: (SubTreeNode | TreeView | AccordionTreeNode)[];
    private _freePt: FreePoint;
    private _appearStatus: AppearStatus;
    public isForceResize: boolean;

    private _isChanging: boolean;
    private _nextTreeCache: {
        title: string;
        treeHeaderTitle: string;
        treeNodes: string;
        popup: string;
        ratingCheck: boolean;
    } | null;

    /**
     * コンストラクタ
     * 
     * @param element ツリービューの要素
     */
    public constructor(element: HTMLElement)
    {
        this._element = element;
        this._tree = new Tree(
            'tree-view',
            element.querySelector('.tree-view > #tree-nodes > .header-node') as HTMLElement,
            element.querySelector('.tree-view > .connection-line') as HTMLDivElement
        );

        this._treeNodes = document.querySelector('div#tree-nodes > .node-container') as HTMLElement;

        this._isSelfScroll = false;
        this._scrollStartX = 0;
        this._scrollStartY = 0;

        this._appearAnimationFunc = null;

        this._freePt = new FreePoint(document.querySelector('div#free-pt') as HTMLDivElement);

        this._nextTreeCache = null;

        this._isChanging = false;

        this._disappearRouteNodes = [];

        this._appearStatus = AppearStatus.NONE;

        this.isForceResize = false;
    }

    public get id(): string
    {
        return this._tree.id;
    }

    /**
     * 自己スクロールの設定
     * @param isSelfScroll 自己スクロールの有無
     */
    public setSelfScroll(isSelfScroll: boolean): void
    {
        this._isSelfScroll = isSelfScroll;
        this._element.classList.toggle('self-scroll', isSelfScroll);

        if (!isSelfScroll) {
            this._element.style.left = `0px`;
            this._element.style.top = `0px`;
        }
    }

    /**
     * ノードの読み込み
     */
    public loadNodes(): void
    {
        const mainNodes = document.querySelectorAll('div.node-container > section.node');
        this._tree.loadNodes(mainNodes, null);
    }

    /**
     * ノードの開放
     */
    public disposeNodes(): void
    {
        this._disappearRouteNodes = [];
        this._tree.disposeNodes();
    }

    public getContentNodeByAnchorId(anchorId: string): ContentNode | null
    {
        for (const contentNode of this._tree.contentNodes) {
            if (contentNode.getAnchorId() === anchorId) {
                return contentNode;
            }
        }
        return null;
    }

    /**
     * リサイズ時の処理
     */
    public resize(): void
    {
        this._tree.resize();

        this._scrollStartX = window.scrollX;
        this._scrollStartY = window.scrollY;

        if (this._isSelfScroll) {
            this.scroll();
        }
    }

    /**
     * スクロールの処理
     */
    public scroll(): void
    {
        if (this._isSelfScroll) {
            const scrollX = this._scrollStartX - (window.scrollX * TreeView.SCROLL_SPEED_RATE);
            const scrollY = this._scrollStartY - (window.scrollY * TreeView.SCROLL_SPEED_RATE);
            this._element.style.left = `${scrollX}px`;
            this._element.style.top = `${scrollY}px`;
        }
    }

    /**
     * 更新
     */
    public update(): void
    {
        if (this.isForceResize) {
            this.resize();
        }

        if (this._isChanging) {
            this.changeTree();
        } else {
            if (this._appearAnimationFunc !== null) {
                this._appearAnimationFunc();
            }
    
            this._tree.update();
            this._freePt.update();
        }
    }

    /**
     * 出現アニメーション開始
     */
    public appear(): void
    {
        this._tree.appear();

        this._appearAnimationFunc = this.appearAnimation;
    }

    /**
     * 出現アニメーション
     */
    private appearAnimation(): void
    {
        this._tree.appearAnimation();

        if (this._tree.connectionLine.isAppeared()) {
            this._appearAnimationFunc = null;
        }
    }

    /**
     * 消滅アニメーション開始
     */
    public disappear(selectedLinkNode: LinkNode | null): void
    {
        if (selectedLinkNode) {
            let node = selectedLinkNode.parentNode;
            while (node) {
                node.isSelectedDisappear = true;
                this._disappearRouteNodes.push(node as SubTreeNode | AccordionTreeNode);
                node = node.parentNode;
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
        this._tree.headerNode.point.element.classList.remove('fade-out');

        this._isChanging = true;
        this._appearStatus = AppearStatus.DISAPPEARED;
    }

    private changeTree(): void
    {
        if (this._nextTreeCache && this._appearStatus === AppearStatus.DISAPPEARED) {
            this.disposeNodes();

            this._tree.headerNode.title = this._nextTreeCache.treeHeaderTitle;
            this._treeNodes.innerHTML = this._nextTreeCache.treeNodes;

            this.loadNodes();
            this.resize();
            this._nextTreeCache = null;
            this._isChanging = false;
            
            this.appear();
        }
    }

    /**
     * 描画処理
     */
    public draw(): void
    {
        this._tree.draw();
    }

    public get freePt(): FreePoint
    {
        return this._freePt;
    }

    public set nextTreeCache(cache: { title: string; treeHeaderTitle: string; treeNodes: string; popup: string; ratingCheck: boolean; })
    {
        this._nextTreeCache = cache;
    }

    public moveTree(url: string, linkNode: LinkNode | null, isFromPopState: boolean): void
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
                this.nextTreeCache = data;
            })
            .catch(error => {
                console.error('データの取得に失敗しました:', error);
            });
    }

    public disappear2(): void
    {
        const node = this._disappearRouteNodes.shift();
        if (node instanceof SubTreeNode || node instanceof AccordionTreeNode) {
            node.disappear2();
        } else if (node instanceof TreeView) {
            this._tree.disappearConnectionLine(true);
            const connectionPoint = this._tree.headerNode.getAbsoluteConnectionPoint();
            this._freePt.moveTo(connectionPoint);
            setTimeout(() => {
                this.disappeared();
            }, 300);
        }
    }
}

