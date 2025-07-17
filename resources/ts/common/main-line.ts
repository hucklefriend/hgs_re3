import { AppearStatus } from "../enum/appear-status";

export class MainLine
{

    private _element: HTMLDivElement;
    private _height: number;
    private _animationHeight: number;
    private _animationStartTime: number;
    private _appearAnimationFunc: (() => void) | null;
    private _appearStatus: AppearStatus;
    private _disappearHeight: number;

    /**
     * コンストラクタ
     * @param element メインラインの要素
     */
    public constructor(element: HTMLDivElement)
    {
        this._element = element;
        this._height = 0;
        this._animationHeight = 0;
        this._animationStartTime = 0;
        this._appearAnimationFunc = null;
        this._appearStatus = AppearStatus.NONE;
        this._disappearHeight = 0;
    }

    /**
     * 高さを設定
     * @param height 高さ
     */
    public setHeight(height: number): void
    {
        //this._element.style.height = `${height}px`;
        this._height = height;
    }

    /**
     * アニメーションの高さを取得する
     */
    public getAnimationHeight(): number
    {
        return this._animationHeight;
    }

    /**
     * アニメーションの更新
     */
    public update(): void
    {
        if (this._appearAnimationFunc) {
            this._appearAnimationFunc();
        }
    }

    /**
     * 出現アニメーション開始
     */
    public appear(): void
    {
        this._animationStartTime = (window as any).hgn.timestamp;
        this._appearAnimationFunc = this.appearAnimation;
        this._appearStatus = AppearStatus.APPEARING;
    }

    /**
     * 出現アニメーション
     */
    private appearAnimation(): void
    {
        const progress = (window as any).hgn.timestamp - this._animationStartTime;
        this._animationHeight = this._height * progress / 1000;

        if (this._animationHeight >= this._height) {
            this._animationHeight = this._height;
            this._appearAnimationFunc = null;
            this._appearStatus = AppearStatus.APPEARED;
        }

        this._element.style.height = `${this._animationHeight}px`;
    }

    /**
     * 消滅アニメーション開始
     */
    public disappear(disappearHeight: number, isFadeOut: boolean = false): void
    {
        this._disappearHeight = disappearHeight;
        if (this._appearAnimationFunc === null) {
            this._appearStatus = AppearStatus.DISAPPEARING;
            this._animationStartTime = (window as any).hgn.timestamp;
            this._appearAnimationFunc = this.disappearAnimation;
            if (isFadeOut) {
                this._element.classList.add('fade-out');
            }
        }
    }

    /**
     * 消滾アニメーション
     */
    private disappearAnimation(): void
    {
        const progress = (window as any).hgn.timestamp - this._animationStartTime;
        this._animationHeight = this._height * (1 - progress / 300);

        if (this._animationHeight <= this._disappearHeight) {
            this._animationHeight = this._disappearHeight;
            this._appearAnimationFunc = null;
            //this._element.style.visibility = 'hidden';
            this._appearStatus = AppearStatus.DISAPPEARED;
            this.setHeight(this._disappearHeight);
            this._element.classList.remove('fade-out');
        }

        this._element.style.height = `${this._animationHeight}px`;
    }

    /**
     * 出現しきったかどうかを取得する
     * @returns 出現しきったかどうか
     */
    public isAppeared(): boolean
    {
        return this._appearStatus === AppearStatus.APPEARED;
    }

    /**
     * 出現中かどうかを取得する
     * @returns 出現中かどうか
     */
    public isAppearing(): boolean
    {
        return this._appearStatus === AppearStatus.APPEARING;
    }

    /**
     * 消滅中かどうかを取得する
     * @returns 消滾中かどうか
     */
    public isDisappearing(): boolean
    {
        return this._appearStatus === AppearStatus.DISAPPEARING;
    }

    /**
     * 消滅しきったかどうかを取得する
     * @returns 消滅しきったかどうか
     */
    public isDisappeared(): boolean
    {
        return this._appearStatus === AppearStatus.DISAPPEARED;
    }
} 