import { MainNodeBase } from "./main-node-base";

export class ContentNode extends MainNodeBase
{
    private _anchor: HTMLAnchorElement;
    private updateGradientEndAlphaFunc: (() => void) | null;
    private openAnimationFunc: (() => void) | null;
    private _isOpen: boolean;

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this._anchor = nodeElement.querySelector('.content-link') as HTMLAnchorElement;
        this.updateGradientEndAlphaFunc = null;
        this.openAnimationFunc = null;
        this._isOpen = false;

        // ホバーイベントの設定
        this._anchor.addEventListener('mouseenter', () => this.hover());
        this._anchor.addEventListener('mouseleave', () => this.unhover());
        
        // クリックイベントの設定
        this._anchor.addEventListener('click', (event: MouseEvent) => this.onClick(event));
    }

    /**
     * 開いているかどうかを取得する
     * @returns 開いているかどうか
     */
    public get isOpen(): boolean
    {
        return this._isOpen;
    }

    /**
     * クリック時の処理
     * @param event マウスイベント
     */
    private onClick(event: MouseEvent): void
    {
        event.preventDefault();

        if (this.isOpen) {
            return ;
        }

        this.open();

        const url = this._anchor.href;
        fetch(url, {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('取得したデータ:', data);
            })
            .catch(error => {
                console.error('データの取得に失敗しました:', error);
            });
    }

    /**
     * ホバー開始時のグラデーションα値を更新
     */
    private updateGradientEndAlphaOnHover(): void
    {
        this.gradientEndAlpha = this.getAnimationValue(0.3, 1.0, 300);
        if (this.gradientEndAlpha >= 1.0) {
            this.gradientEndAlpha = 1.0;
            this.updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    /**
     * ホバー終了時のグラデーションα値を更新
     */
    private updateGradientEndAlphaOnUnhover(): void
    {
        this.gradientEndAlpha = this.getAnimationValue(1.0, 0.3, 300);
        if (this.gradientEndAlpha <= 0.3) {
            this.gradientEndAlpha = 0.3;
            this.updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        if (this.openAnimationFunc !== null) {
            // 開くアニメーション中は親のupdateを呼ばない
            this.openAnimationFunc();
        } else {
            super.update();

            if (this.updateGradientEndAlphaFunc !== null) {
                this.updateGradientEndAlphaFunc();
            }
        }
    }

    /**
     * ホバー時の処理
     */
    private hover(): void
    {
        this.animationStartTime = (window as any).hgn.timestamp;
        this.updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
    }

    /**
     * ホバー解除時の処理
     */
    private unhover(): void
    {
        this.animationStartTime = (window as any).hgn.timestamp;
        this.updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
    }

    /**
     * 開くアニメーション開始
     */
    private open(): void
    {
        this._isOpen = true;
        this.animationStartTime = (window as any).hgn.timestamp;
        this.openAnimationFunc = this.openAnimation;
    }

    /**
     * 開くアニメーション
     */
    private openAnimation(): void
    {
        this.openAnimationFunc = null;
    }

    /**
     * 閉じるアニメーション開始
     */
    private close(): void
    {
        this.animationStartTime = (window as any).hgn.timestamp;
        this.openAnimationFunc = this.closeAnimation;
    }

    /**
     * 閉じるアニメーション
     */
    private closeAnimation(): void
    {
        this.openAnimationFunc = null;
        this._isOpen = false;
    }
    
    /**
     * 接続点を取得する
     * @returns 接続点の座標
     */
    public getConnectionPoint(): {x: number, y: number}
    {
        return {
            x: this._anchor.offsetLeft,
            y: this._anchor.offsetTop + this._anchor.offsetHeight / 2
        };
    }
}
