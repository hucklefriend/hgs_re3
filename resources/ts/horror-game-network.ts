import { HeaderNode } from "./node/header-node";
import { LinkNode } from "./node/link-node";
import { ContentNode } from "./node/content-node";

export class HorrorGameNetwork
{
    private static instance: HorrorGameNetwork;
    private headerNode: HeaderNode;
    private linkNodes: LinkNode[];
    private contentNodes: ContentNode[];

    /**
     * コンストラクタ
     */
    private constructor()
    {
        this.headerNode = new HeaderNode(document.querySelector('header') as HTMLElement);
        this.linkNodes = [];
        this.contentNodes = [];
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
     * 開始処理
     */
    public start(): void
    {
        // リサイズイベントの登録
        window.addEventListener('resize', () => this.resize());

        this.loadNodes();

        this.resize();

        this.update();
    }

    /**
     * ノードの読み込み
     */
    private loadNodes(): void
    {
        const mainNodes = document.querySelectorAll('div.node-container > section.node');
        mainNodes.forEach(mainNode => {
            const mainNodeId = mainNode.id;

            // link-nodeクラスがあればLinkNodeを作成
            if (mainNode.classList.contains('link-node')) {
                this.linkNodes.push(new LinkNode(mainNode as HTMLElement));
            }

            // content-nodeクラスがあればContentNodeを作成
            if (mainNode.classList.contains('content-node')) {
                this.contentNodes.push(new ContentNode(mainNode as HTMLElement));
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
    }

    /**
     * アニメーションの更新処理
     */
    private update(): void
    {
        this.headerNode.update();
        this.linkNodes.forEach(linkNode => linkNode.update());
        this.contentNodes.forEach(contentNode => contentNode.update());

        this.draw();

        requestAnimationFrame(() => this.update());
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