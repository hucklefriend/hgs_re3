import { HeaderNode } from "./node/header-node";
import { LinkNode } from "./node/link-node";
import { ContentNode } from "./node/content-node";
import { MainLine } from "./common/main-line";
import { ContentNodeView } from "./node/parts/content-node-view";

export class HorrorGameNetwork
{
    private static instance: HorrorGameNetwork;
    private _headerNode: HeaderNode;
    private _linkNodes: LinkNode[];
    private _contentNodes: ContentNode[];
    private _lastNode: LinkNode | ContentNode | null;
    private _mainLine: MainLine;
    private _timestamp: number;
    private _appearAnimationFunc: (() => void) | null;
    private _contentNodeView: ContentNodeView;

    /**
     * コンストラクタ
     */
    private constructor()
    {
        this._headerNode = new HeaderNode(document.querySelector('header') as HTMLElement);
        this._mainLine = new MainLine(document.querySelector('div#main-line') as HTMLDivElement);
        this._linkNodes = [];
        this._contentNodes = [];
        this._lastNode = null;
        this._timestamp = 0;
        this._appearAnimationFunc = null;
        this._contentNodeView = new ContentNodeView(document.querySelector('div#content-node-view') as HTMLDivElement);
    }

    /**
     * インスタンスを返す
     */
    public static getInstance(): HorrorGameNetwork
    {
        if (!HorrorGameNetwork.instance) {
            HorrorGameNetwork.instance = new HorrorGameNetwork();
        }
        return HorrorGameNetwork.instance;
    }

    /**
     * 現在のタイムスタンプを取得
     */
    public get timestamp(): number
    {
        return this._timestamp;
    }

    /**
     * メインラインを取得
     */
    public get mainLine(): MainLine
    {
        return this._mainLine;
    }

    /**
     * コンテンツノードビューを取得
     */
    public get contentNodeView(): ContentNodeView
    {
        return this._contentNodeView;
    }

    /**
     * 開始処理
     */
    public start(): void
    {
        // リサイズイベントの登録
        window.addEventListener('resize', () => this.resize());

        // ページ遷移前のイベント登録
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('isPageTransition', 'true');
        });

        // ページ表示イベントの登録（キャッシュからの復元時）
        window.addEventListener('pageshow', (event) => {
            const isPageTransition = sessionStorage.getItem('isPageTransition') === 'true';
            if (event.persisted && !isPageTransition) {
                this.resize();
                this.draw();
            }
            sessionStorage.removeItem('isPageTransition');
        });

        this.loadNodes();

        this.resize();

        this.appear();

        requestAnimationFrame((timestamp) => this.update(timestamp));
    }

    /**
     * ノードの読み込み
     */
    private loadNodes(): void
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

    /**
     * リサイズ時の処理
     */
    private resize(): void
    {
        this._headerNode.resize();
        this._linkNodes.forEach(linkNode => linkNode.resize());
        this._contentNodes.forEach(contentNode => contentNode.resize());

        if (this._mainLine && this._lastNode) {
            const headerPosition = this._headerNode.getConnectionPoint();
            this._mainLine.setHeight(this._lastNode.getNodeElement().offsetTop - headerPosition.y + 2);
        }
    }

    /**
     * アニメーションの更新処理
     */
    private update(timestamp: number): void
    {
        this._timestamp = timestamp;

        if (this._appearAnimationFunc) {
            this._appearAnimationFunc();
        }

        this._mainLine.update();
        this._headerNode.update();
        this._linkNodes.forEach(linkNode => linkNode.update());
        this._contentNodes.forEach(contentNode => contentNode.update());

        this.draw();

        requestAnimationFrame((timestamp) => this.update(timestamp));
    }

    /**
     * 出現アニメーション開始
     */
    public appear(): void
    {
        this._mainLine.appear();
        this._headerNode.appear();
        // this._linkNodes.forEach(linkNode => linkNode.appear());
        // this._contentNodes.forEach(contentNode => contentNode.appear());

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