import { TreeView } from "./tree-view";
import { ContentNodeView } from "./content-node-view";

export class HorrorGameNetwork
{
    private static _instance: HorrorGameNetwork;
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
        if (!HorrorGameNetwork._instance) {
            HorrorGameNetwork._instance = new HorrorGameNetwork();
        }
        return HorrorGameNetwork._instance;
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

        // popstateイベントの登録
        window.addEventListener('popstate', () => this.popState());

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
        this.contentNodeView.update();
        
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

    /**
     * popstateイベントの処理
     */
    private popState(): void
    {
        const state = history.state;
        
        // content-node-viewが表示中だったら閉じる
        if (this.contentNodeView.isOpen) {
            this.contentNodeView.close(true);
        }
        
        // content-nodeで行った場合の処理
        if (state && state.type === 'content-node') {
            console.log('content-nodeからの戻り:', state);
            
            // anchorIdから要素を取得してクリックイベントを発火
            if (state.anchorId) {
                const node = this.treeView.getContentNodeByAnchorId(state.anchorId);
                if (node) {
                    node.openContentNodeView(true);
                }
            }
        }
        
        // content-node-closeで行った場合の処理
        if (state && state.type === 'content-node-close') {
            console.log('content-node-closeからの戻り:', state);
            // 必要に応じて追加の処理をここに記述
        }
        
        this.resize();
        this.draw();
    }
} 