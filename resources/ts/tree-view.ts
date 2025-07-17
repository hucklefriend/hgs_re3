import { HeaderNode } from "./node/header-node";
import { LinkNode } from "./node/link-node";
import { ContentNode } from "./node/content-node";
import { MainLine } from "./common/main-line";

export class TreeView
{
    private static SCROLL_SPEED_RATE: number = 0.7;
    
    private _element: HTMLElement;

    private _headerNode: HeaderNode;
    private _mainLine: MainLine;
    private _treeNodes: HTMLElement;
    private _linkNodes: LinkNode[];
    private _contentNodes: ContentNode[];
    private _lastNode: LinkNode | ContentNode | null;

    private _isSelfScroll: boolean;
    private _scrollStartX: number;
    private _scrollStartY: number;
    private _appearAnimationFunc: (() => void) | null;

    private _selectedLinkNode: LinkNode | null;

    private _freePt: HTMLElement;

    private _isChanging: boolean;
    private _nextTreeCache: {
        title: string;
        tree: string;
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

        this._headerNode = new HeaderNode(document.querySelector('header') as HTMLElement);
        this._mainLine = new MainLine(document.querySelector('div#main-line') as HTMLDivElement);
        this._treeNodes = document.querySelector('div#tree-nodes') as HTMLElement;
        this._linkNodes = [];
        this._contentNodes = [];
        this._lastNode = null;

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
        this._lastNode = null;
        const mainNodes = document.querySelectorAll('div.node-container > section.node');
        mainNodes.forEach(mainNode => {
            const mainNodeId = mainNode.id;

            // link-nodeクラスがあればLinkNodeを作成
            if (mainNode.classList.contains('link-node')) {
                this._linkNodes.push(new LinkNode(mainNode as HTMLElement));
                this._lastNode = this._linkNodes[this._linkNodes.length - 1];
            }

            // content-nodeクラスがあればContentNodeを作成
            if (mainNode.classList.contains('content-node')) {
                this._contentNodes.push(new ContentNode(mainNode as HTMLElement));
                this._lastNode = this._contentNodes[this._contentNodes.length - 1];
            }
        });
        console.log(this._lastNode);
    }

    /**
     * ノードの開放
     */
    public disposeNodes(): void
    {
        // LinkNodeの開放
        this._linkNodes.forEach(linkNode => {
            if (linkNode) {
                // イベントリスナーの削除（必要に応じて実装）
                // 現在の実装ではイベントリスナーはDOM要素に直接追加されているため、
                // ノードインスタンスを削除することで参照がクリアされる
            }
        });
        this._linkNodes = [];

        // ContentNodeの開放
        this._contentNodes.forEach(contentNode => {
            if (contentNode) {
                // イベントリスナーの削除（必要に応じて実装）
                // 現在の実装ではイベントリスナーはDOM要素に直接追加されているため、
                // ノードインスタンスを削除することで参照がクリアされる
            }
        });
        this._contentNodes = [];

        // 最後のノード参照をクリア
        this._lastNode = null;
        this._selectedLinkNode = null;
    }

    public getContentNodeByAnchorId(anchorId: string): ContentNode | null
    {
        for (const contentNode of this._contentNodes) {
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
        this._headerNode.resize();
        this._linkNodes.forEach(linkNode => linkNode.resize());
        this._contentNodes.forEach(contentNode => contentNode.resize());

        if (this._mainLine && this._lastNode) {
            const headerPosition = this._headerNode.getConnectionPoint();
            this._mainLine.setHeight(this._lastNode.getNodeElement().offsetTop - headerPosition.y + 2);
        }
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
    
            this._headerNode.update();
            this._mainLine.update();
            this._linkNodes.forEach(linkNode => linkNode.update());
            this._contentNodes.forEach(contentNode => contentNode.update());
        }
    }

    /**
     * 出現アニメーション開始
     */
    public appear(): void
    {
        this._headerNode.appear();

        if (this._lastNode) {
            const headerPosition = this._headerNode.getConnectionPoint();
            this._mainLine.setHeight(this._lastNode.getNodeElement().offsetTop - headerPosition.y + 2);
            this._mainLine.appear();
        }

        this._appearAnimationFunc = this.appearAnimation;
    }

    /**
     * 出現アニメーション
     */
    private appearAnimation(): void
    {
        const mainLineHeight = this._mainLine.getAnimationHeight();

        this._linkNodes.forEach(linkNode => {
            const linkNodeTop = linkNode.getNodeElement().offsetTop - this._headerNode.getConnectionPoint().y;
            
            if (linkNodeTop <= mainLineHeight) {
                linkNode.appear();
            }
        });

        this._contentNodes.forEach(contentNode => {
            const contentNodeTop = contentNode.getNodeElement().offsetTop - this._headerNode.getConnectionPoint().y;
        
            if (contentNodeTop <= mainLineHeight) {
                contentNode.appear();
            }
        });

        if (this._mainLine.isAppeared()) {
            this._appearAnimationFunc = null;
        }
    }

    /**
     * 消滅アニメーション開始
     */
    public disappear(selectedLinkNode: LinkNode): void
    {
        this._selectedLinkNode = selectedLinkNode;
        this._headerNode.disappear();
        this._linkNodes.forEach(linkNode => {
            if (linkNode.id !== selectedLinkNode.id) {
                linkNode.disappear();
            } else {
                linkNode.selectedDisappear();
            }
        });
        this._contentNodes.forEach(contentNode => contentNode.disappear());
    }

    public disappearMainLine(): void
    {
        if (this._mainLine.isAppeared()) {
            if (this._selectedLinkNode) {
                const headerPosition = this._headerNode.getConnectionPoint();
                const disappearHeight = this._selectedLinkNode.getNodeElement().offsetTop - headerPosition.y + 2;
                this._mainLine.disappear(disappearHeight);
            } else {
                this._mainLine.disappear(0);
            }
            this._headerNode.disappear();
        }
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
        this._headerNode.point.element.classList.remove('fade-out');

        this.changeTree();
    }

    private changeTree(): void
    {
        if (this._nextTreeCache) {
            this._isChanging = false;
            this.disposeNodes();

            this._headerNode.title = this._nextTreeCache.title;
            this._treeNodes.innerHTML = this._nextTreeCache.tree;

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
        this._headerNode.draw();
        this._linkNodes.forEach(linkNode => linkNode.draw());
        this._contentNodes.forEach(contentNode => contentNode.draw());
    }

    public get freePt(): HTMLElement
    {
        return this._freePt;
    }

    public get mainLine(): MainLine
    {
        return this._mainLine;
    }

    public get headerNode(): HeaderNode
    {
        return this._headerNode;
    }

    public set nextTreeCache(cache: { title: string; tree: string; popup: string; ratingCheck: boolean; })
    {
        this._nextTreeCache = cache;
    }
}
