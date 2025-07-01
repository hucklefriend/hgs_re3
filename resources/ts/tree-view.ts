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
    private _linkNodes: LinkNode[];
    private _contentNodes: ContentNode[];
    private _lastNode: LinkNode | ContentNode | null;

    private _isSelfScroll: boolean;
    private _scrollStartX: number;
    private _scrollStartY: number;
    private _appearAnimationFunc: (() => void) | null;

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
        this._linkNodes = [];
        this._contentNodes = [];
        this._lastNode = null;

        this._isSelfScroll = false;
        this._scrollStartX = 0;
        this._scrollStartY = 0;

        this._appearAnimationFunc = null;
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
        if (this._appearAnimationFunc !== null) {
            this._appearAnimationFunc();
        }

        this._headerNode.update();
        this._mainLine.update();
        this._linkNodes.forEach(linkNode => linkNode.update());
        this._contentNodes.forEach(contentNode => contentNode.update());
    }

    /**
     * 出現アニメーション開始
     */
    public appear(): void
    {
        this._headerNode.appear();
        this._mainLine.appear();

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
    public disappear(): void
    {
        this._mainLine.disappear();
        this._headerNode.disappear();
        this._linkNodes.forEach(linkNode => linkNode.disappear());
        this._contentNodes.forEach(contentNode => contentNode.disappear());
    }

    /**
     * 消滅アニメーション
     */
    private disappearAnimation(): void
    {
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
}
