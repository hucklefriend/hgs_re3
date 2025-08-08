import { HeaderNode } from "./node/header-node";
import { LinkNode } from "./node/link-node";
import { ContentNode } from "./node/content-node";
import { Util } from "./common/util";
import { Tree } from "./common/tree";

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

    private _selectedLinkNode: LinkNode | null;
    private _freePt: HTMLElement;

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
            element.querySelector('.tree-view > #tree-nodes > .header-node') as HTMLElement,
            element.querySelector('.tree-view > .connection-line') as HTMLDivElement
        );

        this._treeNodes = document.querySelector('div#tree-nodes > .node-container') as HTMLElement;

        this._isSelfScroll = false;
        this._scrollStartX = 0;
        this._scrollStartY = 0;

        this._appearAnimationFunc = null;

        this._selectedLinkNode = null;

        this._freePt = document.querySelector('div#free-pt') as HTMLElement;

        this._nextTreeCache = null;

        this._isChanging = false;
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
        this._tree.loadNodes(mainNodes);
    }

    /**
     * ノードの開放
     */
    public disposeNodes(): void
    {
        this._tree.disposeNodes();
        this._selectedLinkNode = null;
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
        if (this._isChanging) {
            this.changeTree();
        } else {
            if (this._appearAnimationFunc !== null) {
                this._appearAnimationFunc();
            }
    
            this._tree.update();
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
        this._selectedLinkNode = selectedLinkNode;
        this._tree.disappear(selectedLinkNode);
    }

    /**
     * 消滅完了
     */
    public disappeared(): void
    {
        // if (this._nextTreeCache) {
        //     const nextTreeCache = this._nextTreeCache;
        //     this._nextTreeCache = null;
        //     const anchorId = nextTreeCache.anchorId;
        //     const contentNode = this.getContentNodeByAnchorId(anchorId);
        // }

        this._freePt.classList.remove('visible');
        this._tree.headerNode.point.element.classList.remove('fade-out');

        this._isChanging = true;
    }

    private changeTree(): void
    {
        if (this._nextTreeCache) {
            this._isChanging = false;
            this.disposeNodes();

            this._tree.headerNode.title = this._nextTreeCache.treeHeaderTitle;
            this._treeNodes.innerHTML = this._nextTreeCache.treeNodes;

            this.loadNodes();
            this.resize();
            this._nextTreeCache = null;
            
            this.appear();
        } else {
            this._isChanging = true;
        }
    }

    /**
     * 描画処理
     */
    public draw(): void
    {
        this._tree.draw();
    }

    public get freePt(): HTMLElement
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
}
