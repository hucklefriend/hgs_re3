import { AppearStatus } from "../enum/appear-status";
import { Tree } from "./tree";

export class ConnectionLine
{
    private _element: HTMLDivElement;
    private _height: number;
    private _animationHeight: number;
    private _animationStartTime: number;
    private _appearAnimationFunc: (() => void) | null;
    private _appearStatus: AppearStatus;
    private _disappearHeight: number;
    private _parentTree: Tree;

    /**
     * コンストラクタ
     * @param element 接続線の要素
     */
    public constructor(element: HTMLDivElement, parentTree: Tree)
    {
        this._element = element;
        this._height = 0;
        this._animationHeight = 0;
        this._animationStartTime = 0;
        this._appearAnimationFunc = null;
        this._appearStatus = AppearStatus.NONE;
        this._disappearHeight = 0;
        this._parentTree = parentTree;
    }

    public setPosition(x: number, y: number): void
    {
        this._element.style.left = `${x}px`;
        this._element.style.top = `${y}px`;
    }

    /**
     * 高さを設定
     * @param height 高さ
     */
    public setHeight(height: number): void
    {
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
        this._animationHeight = 0;
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
        this._element.classList.add('visible');
    }

    /**
     * 消滅アニメーション開始
     */
    public disappear(disappearHeight: number, isFadeOut: boolean = false): void
    {
        this._disappearHeight = disappearHeight - this._element.offsetTop;
        if (this._disappearHeight < 0) {
            this._disappearHeight = 0;
        }

        if (this._appearAnimationFunc === null) {
            this._appearStatus = AppearStatus.DISAPPEARING;
            this._animationStartTime = (window as any).hgn.timestamp;
            this._appearAnimationFunc = this.disappearAnimation;
            if (isFadeOut) {
                //this._element.classList.add('fade-out');
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
            this.setHeight(this._disappearHeight);
            this._element.classList.remove('fade-out');

            if (this._height === 0) {
                this._appearStatus = AppearStatus.DISAPPEARED;
                this._element.classList.remove('visible');
            }
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

    public changeHeight(height: number): void
    {
        this._height = height;
        this._element.style.height = `${this._height}px`;
    }
} 