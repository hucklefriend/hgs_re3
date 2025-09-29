import { AppearStatus } from "../../enum/appear-status";
import { Util } from "../../common/util";
import { Config } from "../../common/config";

export class ConnectionLine
{
    private _element: HTMLDivElement;
    private _height: number;
    private _animationHeight: number;
    private _animationStartTime: number;
    private _appearAnimationFunc: (() => void) | null;
    private _appearStatus: AppearStatus;
    private _disappearHeight: number;
    private _appearType: number;
    private _isFast: boolean;

    /**
     * 出現状態を取得
     * @returns 出現状態
     */
    public get appearStatus(): AppearStatus
    {
        return this._appearStatus;
    }

    /**
     * 高さを取得
     * @returns 高さ
     */
    public get height(): number
    {
        return this._height;
    }

    /**
     * 要素を取得
     * @returns HTMLDivElement
     */
    public get element(): HTMLDivElement
    {
        return this._element;
    }

    /**
     * コンストラクタ
     * @param element 接続線の要素
     */
    public constructor(element: HTMLDivElement)
    {
        this._element = element;
        this._height = 0;
        this._animationHeight = 0;
        this._animationStartTime = 0;
        this._appearAnimationFunc = null;
        this._appearStatus = AppearStatus.DISAPPEARED;
        this._disappearHeight = 0;
        this._appearType = 0;
        this._isFast = false;
        this.setHeight(0);
    }

    /**
     * 位置を設定
     * @param x X座標
     * @param y Y座標
     */
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
     * 要素を表示状態にする
     */
    public visible(): void
    {
        this._element.classList.add('visible');
        this._element.classList.remove('fade-out', 'fade-out-fast');
    }

    private setAppearType(): void
    {
        this._appearType = this._height > Config.getInstance().CONNECTION_LINE_TYPE_THRESHOLD ? 1 : 0;
    }

    /**
     * 出現アニメーション開始
     */
    public appear(isFast: boolean = false): void
    {
        this._animationStartTime = (window as any).hgn.timestamp;
        this._appearAnimationFunc = this.appearAnimation;
        this._appearStatus = AppearStatus.APPEARING;
        this._animationHeight = 0;
        this._element.style.height = `${this._animationHeight}px`;
        this.visible();
        this.setAppearType();
        this._isFast = isFast;
    }

    private getShortAppearSpeed(): number
    {
        return this._isFast ? Config.getInstance().CONNECTION_LINE_FAST_SHORT_APPEAR_SPEED : Config.getInstance().CONNECTION_LINE_SHORT_APPEAR_SPEED;
    }

    private getLongAppearTime(): number
    {
        return this._isFast ? Config.getInstance().CONNECTION_LINE_FAST_LONG_APPEAR_TIME : Config.getInstance().CONNECTION_LINE_LONG_APPEAR_TIME;
    }

    /**
     * 出現アニメーション
     */
    private appearAnimation(): void
    {
        if (this._appearType === 0) {
            this._animationHeight += this.getShortAppearSpeed();
        } else {
            const progress = Util.getAnimationProgress(this._animationStartTime, this.getLongAppearTime());
            this._animationHeight = this._height * progress;
        }
        if (this._animationHeight >= this._height) {
            this._animationHeight = this._height;
            this._appearAnimationFunc = null;
            this._appearStatus = AppearStatus.APPEARED;
        }

        this._element.style.height = `${this._animationHeight}px`;
    }

    private getShortDisappearSpeed(): number
    {
        return this._isFast ? Config.getInstance().CONNECTION_LINE_FAST_SHORT_DISAPPEAR_SPEED : Config.getInstance().CONNECTION_LINE_SHORT_DISAPPEAR_SPEED;
    }

    private getLongDisappearTime(): number
    {
        return this._isFast ? Config.getInstance().CONNECTION_LINE_FAST_LONG_DISAPPEAR_TIME : Config.getInstance().CONNECTION_LINE_LONG_DISAPPEAR_TIME;
    }

    /**
     * 消滅アニメーション開始
     */
    public disappear(disappearHeight: number, isFast: boolean = false): void
    {
        this._disappearHeight = disappearHeight - this._element.offsetTop;
        if (this._disappearHeight < 0) {
            this._disappearHeight = 0;
        }

        if (this._appearAnimationFunc === null) {
            this._appearStatus = AppearStatus.DISAPPEARING;
            this._animationStartTime = (window as any).hgn.timestamp;
            this._appearAnimationFunc = this.disappearAnimation;
            this._animationHeight = this._height;
            this._isFast = isFast;
            this.setAppearType();
        }
    }

    /**
     * 消滾アニメーション
     */
    private disappearAnimation(): void
    {
        if (this._appearType === 0) {
            this._animationHeight -= this.getShortDisappearSpeed();
        } else {
            const progress = 1 - Util.getAnimationProgress(this._animationStartTime, this.getLongDisappearTime());
            this._animationHeight = this._height * progress;
        }

        if (this._animationHeight <= this._disappearHeight) {
            this._animationHeight = this._disappearHeight;
        }

        this._element.style.height = `${this._animationHeight}px`;

        if (this._animationHeight === this._disappearHeight) {
            this._appearAnimationFunc = null;
            this.setHeight(this._disappearHeight);
            this._element.classList.remove('fade-out', 'fade-out-fast');

            if (this._height === 0) {
                this._appearStatus = AppearStatus.DISAPPEARED;
                this._element.classList.remove('visible');
            }
        }
    }

    /**
     * フェードアウトアニメーション開始
     */
    public disappearFadeOut(isFast: boolean = false): void
    {
        this._element.classList.add(isFast ? 'fade-out-fast' : 'fade-out');
        this._animationHeight = 0;
        this._isFast = isFast;
        
        // transitionendイベントをリッスン
        const handleTransitionEnd = (event: TransitionEvent) => {
            // backgroundとbox-shadowのアニメーションが完了したかチェック
            if (event.propertyName === 'background' || event.propertyName === 'box-shadow') {                
                // イベントリスナーを削除（一度だけ実行したい場合）
                this._element.removeEventListener('transitionend', handleTransitionEnd);
                
                // 完了後の処理
                this.onFadeOutComplete();
            }
        };
        
        this._element.addEventListener('transitionend', handleTransitionEnd);
    }

    /**
     * フェードアウト完了時の処理
     */
    private onFadeOutComplete(): void
    {
        // アニメーション完了後の処理
        this._appearStatus = AppearStatus.DISAPPEARED;
        this.changeHeight(0);
        this._element.classList.remove('visible');
    }

    /**
     * 高さを変更
     * @param height 新しい高さ
     */
    public changeHeight(height: number): void
    {
        this._height = height;

        if (AppearStatus.isAppeared(this._appearStatus)) {
            this._element.style.height = `${this._height}px`;
        } else if (AppearStatus.isTransitioning(this._appearStatus)) {
            this._element.style.height = `${this._animationHeight}px`;
        }
    }

    /**
     * 接続線の要素を作成
     * @returns 作成されたHTMLDivElement
     */
    public static createElement(): HTMLDivElement
    {
        const element = document.createElement('div');
        element.classList.add('connection-line');
        return element;
    }
} 