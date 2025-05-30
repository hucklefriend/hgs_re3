import { HeaderNode } from "./node/header-node";
import { LinkNode } from "./node/link-node";
import { ContentNode } from "./node/content-node";
import { MainLine } from "./common/main-line";

export class HorrorGameNetwork
{
    private static instance: HorrorGameNetwork;
    private headerNode: HeaderNode;
    private linkNodes: LinkNode[];
    private contentNodes: ContentNode[];
    private lastNode: LinkNode | ContentNode | null;
    private mainLine: MainLine | null;
    private _timestamp: number;

    /**
     * コンストラクタ
     */
    private constructor()
    {
        this.headerNode = new HeaderNode(document.querySelector('header') as HTMLElement);
        this.linkNodes = [];
        this.contentNodes = [];
        this.lastNode = null;
        this.mainLine = null;
        this._timestamp = 0;
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
     * 開始処理
     */
    public start(): void
    {
        this.mainLine = new MainLine(document.querySelector('div#main-line') as HTMLDivElement);

        // リサイズイベントの登録
        window.addEventListener('resize', () => this.resize());

        this.loadNodes();

        this.resize();

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

        if (this.mainLine && this.lastNode) {
            const headerPosition = this.headerNode.getConnectionPoint();
            this.mainLine.setStartPoint(headerPosition.x-1, headerPosition.y);

            const lastNodePosition = this.lastNode.getConnectionPoint();
            this.mainLine.setHeight(this.lastNode.getNodeElement().offsetTop - headerPosition.y + 2);
        }
    }

    /**
     * アニメーションの更新処理
     */
    private update(timestamp: number): void
    {
        this._timestamp = timestamp;
        this.headerNode.update();
        this.linkNodes.forEach(linkNode => linkNode.update());
        this.contentNodes.forEach(contentNode => contentNode.update());

        this.draw();

        requestAnimationFrame((timestamp) => this.update(timestamp));
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