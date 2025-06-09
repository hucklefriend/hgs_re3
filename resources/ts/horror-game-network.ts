import { HeaderNode } from "./node/header-node";
import { LinkNode } from "./node/link-node";
import { ContentNode } from "./node/content-node";
import { MainLine } from "./common/main-line";
import { ContentNodeView } from "./node/parts/content-node-view";

export class HorrorGameNetwork
{
    private static instance: HorrorGameNetwork;
    private headerNode: HeaderNode;
    private linkNodes: LinkNode[];
    private contentNodes: ContentNode[];
    private lastNode: LinkNode | ContentNode | null;
    private _mainLine: MainLine;
    private _timestamp: number;
    private _appearAnimationFunc: (() => void) | null;
    private _contentNodeView: ContentNodeView;

    /**
     * コンストラクタ
     */
    private constructor()
    {
        this.headerNode = new HeaderNode(document.querySelector('header') as HTMLElement);
        this._mainLine = new MainLine(document.querySelector('div#main-line') as HTMLDivElement);
        this.linkNodes = [];
        this.contentNodes = [];
        this.lastNode = null;
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

        // タブの可視性変更イベントの登録
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.resize();
                this.draw();
            }
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
        this.lastNode = null;
        const mainNodes = document.querySelectorAll('div.node-container > section.node');
        mainNodes.forEach(mainNode => {
            const mainNodeId = mainNode.id;

            // link-nodeクラスがあればLinkNodeを作成
            if (mainNode.classList.contains('link-node')) {
                this.linkNodes.push(new LinkNode(mainNode as HTMLElement));
                this.lastNode = this.linkNodes[this.linkNodes.length - 1];
            }

            // content-nodeクラスがあればContentNodeを作成
            if (mainNode.classList.contains('content-node')) {
                this.contentNodes.push(new ContentNode(mainNode as HTMLElement));
                this.lastNode = this.contentNodes[this.contentNodes.length - 1];
            }
        });
    }

    /**
     * リサイズ時の処理
     */
    private resize(): void
    {
        this.headerNode.resize();
        this.linkNodes.forEach(linkNode => linkNode.resize());
        this.contentNodes.forEach(contentNode => contentNode.resize());

        if (this._mainLine && this.lastNode) {
            const headerPosition = this.headerNode.getConnectionPoint();
            this._mainLine.setHeight(this.lastNode.getNodeElement().offsetTop - headerPosition.y + 2);
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
        this.headerNode.update();
        this.linkNodes.forEach(linkNode => linkNode.update());
        this.contentNodes.forEach(contentNode => contentNode.update());

        this.draw();

        requestAnimationFrame((timestamp) => this.update(timestamp));
    }

    /**
     * 出現アニメーション開始
     */
    public appear(): void
    {
        this._mainLine.appear();
        this.headerNode.appear();
        // this.linkNodes.forEach(linkNode => linkNode.appear());
        // this.contentNodes.forEach(contentNode => contentNode.appear());

        this._appearAnimationFunc = this.appearAnimation;
    }

    /**
     * 出現アニメーション
     */
    private appearAnimation(): void
    {
        const mainLineHeight = this._mainLine.getAnimationHeight();

        this.linkNodes.forEach(linkNode => {
            const linkNodeTop = linkNode.getNodeElement().offsetTop - this.headerNode.getConnectionPoint().y;
            
            if (linkNodeTop <= mainLineHeight) {
                linkNode.appear();
            }
        });

        this.contentNodes.forEach(contentNode => {
            const contentNodeTop = contentNode.getNodeElement().offsetTop - this.headerNode.getConnectionPoint().y;
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
        this.headerNode.disappear();
        this.linkNodes.forEach(linkNode => linkNode.disappear());
        this.contentNodes.forEach(contentNode => contentNode.disappear());
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
        this.headerNode.draw();
        this.linkNodes.forEach(linkNode => linkNode.draw());
        this.contentNodes.forEach(contentNode => contentNode.draw());
    }
} 