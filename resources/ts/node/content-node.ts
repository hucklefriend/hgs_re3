import { MainNodeBase } from "./main-node-base";

export class ContentNode extends MainNodeBase
{
    private _anchor: HTMLAnchorElement;
    private updateGradientEndAlphaFunc: (() => void) | null;

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this._anchor = nodeElement.querySelector('.content-link') as HTMLAnchorElement;
        this.updateGradientEndAlphaFunc = null;

        // ホバーイベントの設定
        this._anchor.addEventListener('mouseenter', () => this.hover());
        this._anchor.addEventListener('mouseleave', () => this.unhover());
        
        // クリックイベントの設定
        this._anchor.addEventListener('click', (event: MouseEvent) => this.onClick(event));
    }

    public getAnchorId(): string
    {
        return this._anchor.id;
    }

    private isOpenContentView(): boolean
    {
        const hgn = (window as any).hgn;
        const contentNodeView = hgn.contentNodeView;
        return contentNodeView.isOpen;
    }

    /**
     * クリック時の処理
     * @param event マウスイベント
     */
    private onClick(event: MouseEvent): void
    {
        event.preventDefault();

        if (this.isOpenContentView()) {
            return ;
        }

        this.openContentNodeView(false);
    }

    public openContentNodeView(isFromPopState: boolean): void
    {
        const hgn = (window as any).hgn;
        hgn.contentNodeView.open(this._anchor, this._nodeElement.offsetTop);

        const url = this._anchor.href;
        
        if (!isFromPopState) {
            // pushStateで履歴に追加（content-nodeで行ったことを記録）
            const stateData = {
                type: 'content-node',
                url: url,
                anchorId: this._anchor.id,
                timestamp: Date.now()
            };
            history.pushState(stateData, '', url);
            console.log('stateData:', stateData);
        }

        fetch(url, {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then(data => {
                //console.log('取得したデータ:', data);
                hgn.contentNodeView.setContent(data);
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
        this._gradientEndAlpha = this.getAnimationValue(0.3, 1.0, 300);
        if (this._gradientEndAlpha >= 1.0) {
            this._gradientEndAlpha = 1.0;
            this.updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    /**
     * ホバー終了時のグラデーションα値を更新
     */
    private updateGradientEndAlphaOnUnhover(): void
    {
        this._gradientEndAlpha = this.getAnimationValue(1.0, 0.3, 300);
        if (this._gradientEndAlpha <= 0.3) {
            this._gradientEndAlpha = 0.3;
            this.updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        super.update();

        if (this.updateGradientEndAlphaFunc !== null) {
            this.updateGradientEndAlphaFunc();
        }
    }

    protected isHover(): boolean
    {
        return this._anchor.classList.contains('hover');
    }

    /**
     * ホバー時の処理
     */
    private hover(): void
    {
        this._anchor.classList.add('hover');
        if (!this.isOpenContentView()) {
            this._animationStartTime = (window as any).hgn.timestamp;
            this.updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
        }
    }

    /**
     * ホバー解除時の処理
     */
    private unhover(): void
    {
        this._anchor.classList.remove('hover');
        if (!this.isOpenContentView()) {
            this._animationStartTime = (window as any).hgn.timestamp;
            this.updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
        }
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
