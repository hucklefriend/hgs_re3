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
        if (!this.isOpen) {
            this.animationStartTime = (window as any).hgn.timestamp;
            this.updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
        }
    }

    /**
     * ホバー解除時の処理
     */
    private unhover(): void
    {
        if (!this.isOpen) {
            this.animationStartTime = (window as any).hgn.timestamp;
            this.updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
        }
    }

    /**
     * 開くアニメーション開始
     */
    private open(): void
    {
        this._isOpen = true;
        this.animationStartTime = (window as any).hgn.timestamp;
        this.openAnimationFunc = this.openAnimation;

        const hgn = (window as any).hgn;
        const contentNodeView = hgn.contentNodeView;
        contentNodeView.element.style.display = 'block';
        contentNodeView.element.classList.add('blur');
        contentNodeView.element.classList.add('blur-active');

        // ContentNodeViewの位置とサイズを設定
        const anchorRect = this._anchor.getBoundingClientRect();
        const element = contentNodeView.element;
        
        const main = hgn.main;

        element.style.left = `${this._anchor.offsetLeft}px`;
        element.style.top = `${this.nodeElement.offsetTop}px`;
        element.style.width = `${this._anchor.clientWidth}px`;
        element.style.height = `${this._anchor.clientHeight}px`;

        //contentNodeView.title.textContent = this._anchor.textContent;
        contentNodeView.content.innerHTML = '';
    }

    /**
     * 開くアニメーション
     */
    private openAnimation(): void
    {
        const hgn = (window as any).hgn;
        const contentNodeView = hgn.contentNodeView;
        const element = contentNodeView.element;
        const main = hgn.main;

        const startLeft = this._anchor.offsetLeft;
        const startTop = this.nodeElement.offsetTop;
        const startWidth = this._anchor.clientWidth;
        const startHeight = this._anchor.clientHeight;
        const endWidth = main.clientWidth;
        const endHeight = main.clientHeight;

        const currentTime = (window as any).hgn.timestamp;
        const elapsedTime = currentTime - this.animationStartTime;
        const duration = 100;

        if (elapsedTime >= duration) {
            element.style.left = '0px';
            element.style.top = '0px';
            element.style.width = `${endWidth}px`;
            element.style.height = `${endHeight}px`;
            this.openAnimationFunc = null;
            return;
        }

        const progress = elapsedTime / duration;
        const currentLeft = startLeft * (1 - progress);
        const currentTop = startTop * (1 - progress);
        const currentWidth = startWidth + (endWidth - startWidth) * progress;
        const currentHeight = startHeight + (endHeight - startHeight) * progress;

        element.style.left = `${currentLeft}px`;
        element.style.top = `${currentTop}px`;
        element.style.width = `${currentWidth}px`;
        element.style.height = `${currentHeight}px`;
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
