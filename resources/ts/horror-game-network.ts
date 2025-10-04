import { CurrentNode } from "./node/current-node";
import { Util } from "./common/util";
import { AppearStatus } from "./enum/appear-status";

/**
 * ホラーゲームネットワーク
 * インターネット全体で見たら、ここも一つのノードと言えるでしょう。
 */
export class HorrorGameNetwork
{
    private static _instance: HorrorGameNetwork;
    private _timestamp: number;
    private _mainElement: HTMLElement;

    private _currentNode: CurrentNode;
    //private _contentNodeView: ContentNodeView;

    public isForceResize: boolean;

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
    public get mainElement(): HTMLElement
    {
        return this._mainElement;
    }

    /**
     * カレントノードを取得
     */
    public get currentNode(): CurrentNode
    {
        return this._currentNode;
    }

    /**
     * コンストラクタ
     */
    private constructor()
    {
        this._mainElement = document.querySelector('main') as HTMLElement;
        this._currentNode = new CurrentNode(this._mainElement.querySelector('#current-node') as HTMLElement);

        this._timestamp = 0;

        this.isForceResize = false;
    }

    /**
     * 開始処理
     */
    public start(): void
    {
        // リサイズイベントの登録
        const target = document.body; // 監視対象
        let lastWidth = target.offsetWidth;
        let lastHeight = target.offsetHeight;
        
        const ro = new ResizeObserver(entries => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
        
            // if (width !== lastWidth && height !== lastHeight) {
            //   console.log("幅・高さの両方が変化");
            // } else if (width !== lastWidth) {
            //   console.log("横幅のみ変化");
            // }
            
            // 高さが変化したらリサイズ
            if (height !== lastHeight) {
                this.isForceResize = true;
            }
        
            lastWidth = width;
            lastHeight = height;
          }
        });
        
        ro.observe(target);
        

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
        window.addEventListener('popstate', (event) => {this.popState(event)});
        
        this._currentNode.start();
        this.resize();
        this._currentNode.appear();

        // 初期状態の履歴を設定
        const initialState = {
            type: 'link-node',
            url: window.location.href,
            anchorId: ''
        };
        history.replaceState(initialState, '', window.location.href);

        requestAnimationFrame((timestamp) => this.update(timestamp));
    }

    /**
     * リサイズ時の処理
     */
    private resize(): void
    {
        this._currentNode.resize();
    }

    /**
     * アニメーションの更新処理
     */
    private update(timestamp: number): void
    {
        this._timestamp = timestamp;

        if (this.isForceResize) {
            this.resize();
            this.isForceResize = false;
        }

        this._currentNode.update();
        //this.contentNodeView.update();
        
        this.draw();

        requestAnimationFrame((timestamp) => this.update(timestamp));
    }

    /**
     * 描画処理
     */
    public draw(): void
    {
        this._currentNode.draw();
    }

    /**
     * popstateイベントの処理
     */
    private popState(event?: PopStateEvent): void
    {
        // popstateイベントの引数から移動前のstateを取得
        const previousState = event?.state;
        
        if (previousState) {
            this._currentNode.moveNode(previousState.url, null, true, previousState.isChildOnly ?? false);
        }

        if (AppearStatus.isAppeared(this._currentNode.appearStatus)) {
            this._currentNode.disappear();
        } else {
            // アニメーション中だったら強制遷移
            location.href = previousState.url;
        }
    }
} 
