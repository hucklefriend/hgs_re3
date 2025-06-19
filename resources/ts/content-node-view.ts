import { Rect } from "./common/rect";

export class ContentNodeView
{
    public element: HTMLDivElement;
    public header: HTMLElement;
    public title: HTMLHeadingElement;
    public content: HTMLDivElement;
    public footer: HTMLElement;

    private _animationStartTime: number;
    private openAnimationFunc: (() => void) | null;
    private _isOpen: boolean;
    private _anchor: HTMLAnchorElement | null;
    private _startRect: Rect;
    private _pendingContent: any | null;

    /**
     * コンストラクタ
     * @param element ノードの要素
     */
    constructor(element: HTMLDivElement)
    {
        this.element = element;
        this.header = element.querySelector('header') as HTMLElement;
        this.title = this.header.querySelector('h1') as HTMLHeadingElement;
        this.content = element.querySelector('#content-node-view-content') as HTMLDivElement;
        this.footer = element.querySelector('footer') as HTMLElement;
        this._startRect = new Rect(0, 0, 0, 0);

        this._animationStartTime = 0;
        this.openAnimationFunc = null;
        this._isOpen = false;
        this._anchor = null;
        this._pendingContent = null;

        // 閉じるボタンのクリックイベントリスナーを追加
        const closeButton = element.querySelector('#content-node-view-close') as HTMLElement;
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.close();
            });
        }
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
     * コンテンツを設定する
     * @param data コンテンツデータ
     */
    public setContent(data: any): void
    {
        if (data && data.body) {
            // アニメーションが終わっている場合は即座に設定
            if (this.openAnimationFunc === null) {
                this.content.innerHTML = data.body;
                
                // コンテンツの高さに合わせて要素の高さを調整
                const contentHeight = this.content.scrollHeight;
                const headerHeight = this.header.offsetHeight;
                const footerHeight = this.footer.offsetHeight;
                const totalHeight = contentHeight + headerHeight + footerHeight;
                
                this.element.style.height = `${totalHeight}px`;
            } else {
                // アニメーション中はデータを保持
                this._pendingContent = data;
            }
        }
    }

    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        if (!this._isOpen) {
            return;
        }

        if (this.openAnimationFunc !== null) {
            this.openAnimationFunc();
        }
    }

    /**
     * 開くアニメーション開始
     */
    public open(anchor: HTMLAnchorElement, startTop: number): void
    {
        this._anchor = anchor;
        this._isOpen = true;
        this._animationStartTime = (window as any).hgn.timestamp;
        this.openAnimationFunc = this.openAnimation;

        this.element.style.display = 'block';
        this.element.classList.add('blur');
        this.element.classList.add('blur-active');

        // ContentNodeViewの位置とサイズを設定
        const element = this.element;

        if (anchor === null) {
            this._startRect.x = window.innerWidth / 2;
            this._startRect.y = window.innerHeight / 2;
            this._startRect.width = 0;
            this._startRect.height = 0;
        } else {
            this._startRect.x = this._anchor.offsetLeft;
            this._startRect.y = startTop;
            this._startRect.width = this._anchor.clientWidth;
            this._startRect.height = this._anchor.clientHeight;
        }
        
        element.style.left = `${this._startRect.x}px`;
        element.style.top = `${this._startRect.y}px`;
        element.style.width = `${this._startRect.width}px`;
        element.style.height = `${this._startRect.height}px`;

        this.title.textContent = this._anchor.textContent;
        this.content.innerHTML = '';
    }

    /**
     * 開くアニメーション
     */
    private openAnimation(): void
    {
        const hgn = (window as any).hgn;
        const main = hgn.main;

        const startLeft = this._startRect.x;
        const startTop = this._startRect.y;
        const startWidth = this._startRect.width;
        const startHeight = this._startRect.height;
        const endWidth = main.clientWidth;
        const endHeight = window.innerHeight - 20;

        const currentTime = (window as any).hgn.timestamp;
        const elapsedTime = currentTime - this._animationStartTime;
        const duration = 100;

        if (elapsedTime >= duration) {
            this.element.style.left = '0px';
            this.element.style.top = '0px';
            this.element.style.width = `${endWidth}px`;
            this.element.style.height = `${endHeight}px`;
            this.openAnimationFunc = null;
            
            // アニメーション完了時に保持されたコンテンツがあれば設定
            if (this._pendingContent !== null) {
                this.setContent(this._pendingContent);
                this._pendingContent = null;
            }
            return;
        }

        const progress = elapsedTime / duration;
        const currentLeft = startLeft * (1 - progress);
        const currentTop = startTop * (1 - progress);
        const currentWidth = startWidth + (endWidth - startWidth) * progress;
        const currentHeight = startHeight + (endHeight - startHeight) * progress;

        this.element.style.left = `${currentLeft}px`;
        this.element.style.top = `${currentTop}px`;
        this.element.style.width = `${currentWidth}px`;
        this.element.style.height = `${currentHeight}px`;
    }

    /**
     * 閉じるアニメーション開始
     */
    public close(): void
    {
        this._animationStartTime = (window as any).hgn.timestamp;
        this.openAnimationFunc = this.closeAnimation;
    }

    /**
     * 閉じるアニメーション
     */
    private closeAnimation(): void
    {
        const hgn = (window as any).hgn;
        const contentNodeView = hgn.contentNodeView;
        const element = contentNodeView.element;
        const main = hgn.main;

        const startLeft = 0;
        const startTop = 0;
        const startWidth = main.clientWidth;
        const startHeight = window.innerHeight - 20;
        const endLeft = this._startRect.x;
        const endTop = this._startRect.y;
        const endWidth = this._startRect.width;
        const endHeight = this._startRect.height;

        const currentTime = (window as any).hgn.timestamp;
        const elapsedTime = currentTime - this._animationStartTime;
        const duration = 100;

        if (elapsedTime >= duration) {
            element.style.left = `${endLeft}px`;
            element.style.top = `${endTop}px`;
            element.style.width = `${endWidth}px`;
            element.style.height = `${endHeight}px`;
            this.openAnimationFunc = null;
            this._isOpen = false;
            this.element.style.display = 'none';
            this.element.classList.remove('blur');
            this.element.classList.remove('blur-active');
            return;
        }

        const progress = elapsedTime / duration;
        const currentLeft = startLeft + (endLeft - startLeft) * progress;
        const currentTop = startTop + (endTop - startTop) * progress;
        const currentWidth = startWidth + (endWidth - startWidth) * progress;
        const currentHeight = startHeight + (endHeight - startHeight) * progress;

        element.style.left = `${currentLeft}px`;
        element.style.top = `${currentTop}px`;
        element.style.width = `${currentWidth}px`;
        element.style.height = `${currentHeight}px`;
    }
} 