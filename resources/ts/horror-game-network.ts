import { TreeView } from "./tree-view";
import { ContentNodeView } from "./content-node-view";

export class HorrorGameNetwork
{
    private static instance: HorrorGameNetwork;
    private _timestamp: number;
    private _main: HTMLElement;
    private _treeView: TreeView;
    private _contentNodeView: ContentNodeView;

    /**
     * コンストラクタ
     */
    private constructor()
    {
        this._main = document.querySelector('main') as HTMLElement;
        this._treeView = new TreeView(document.querySelector('div.tree-view') as HTMLElement);
        this._contentNodeView = new ContentNodeView(document.querySelector('div#content-node-view') as HTMLDivElement);

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
     * main要素を取得
     */
    public get main(): HTMLElement
    {
        return this._main;
    }

    /**
     * ツリービューを取得
     */
    public get treeView(): TreeView
    {
        return this._treeView;
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

        this.treeView.loadNodes();
        
        this.resize();

        this.treeView.appear();

        requestAnimationFrame((timestamp) => this.update(timestamp));
    }

    /**
     * リサイズ時の処理
     */
    private resize(): void
    {
        this._treeView.resize();
    }

    /**
     * アニメーションの更新処理
     */
    private update(timestamp: number): void
    {
        this._timestamp = timestamp;

        this.treeView.update();
        //this.contentNodeView.update();
        
        this.draw();

        requestAnimationFrame((timestamp) => this.update(timestamp));
    }

    /**
     * 描画処理
     */
    public draw(): void
    {
        this.treeView.draw();
        //this.contentNodeView.draw();
    }
} 