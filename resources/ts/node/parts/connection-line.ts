import { AppearStatus } from "../../enum/appear-status";
import { FreePoint } from "./free-point";
import { Util } from "../../common/util";

export class ConnectionLine
{
    private _element: HTMLDivElement;
    private _height: number;
    private _animationHeight: number;
    private _animationStartTime: number;
    private _appearAnimationFunc: (() => void) | null;
    private _appearStatus: AppearStatus;
    private _disappearHeight: number;
    private _withFreePt: boolean;
    private _appearType: number;

    public get appearStatus(): AppearStatus
    {
        return this._appearStatus;
    }

    public get height(): number
    {
        return this._height;
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
        this._withFreePt = false;
        this._appearType = 0;
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

    public visible(): void
    {
        this._element.classList.add('visible');
        this._element.classList.remove('fade-out');
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
        this._element.style.height = `${this._animationHeight}px`;
        this.visible();
        this._appearType = this._height > 1000 ? 1 : 0;
    }

    /**
     * 出現アニメーション
     */
    private appearAnimation(): void
    {
        if (this._appearType === 0) {
            this._animationHeight += 15;
        } else {
            const progress = Util.getAnimationProgress(this._animationStartTime, 1000);
            this._animationHeight = this._height * progress;
        }
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
    public disappear(disappearHeight: number, withFreePt: boolean = false): void
    {
        this._disappearHeight = disappearHeight - this._element.offsetTop;
        if (this._disappearHeight < 0) {
            this._disappearHeight = 0;
        }

        if (this._appearAnimationFunc === null) {
            this._appearStatus = AppearStatus.DISAPPEARING;
            this._animationStartTime = (window as any).hgn.timestamp;
            this._appearAnimationFunc = this.disappearAnimation;
            this._withFreePt = withFreePt;
            this._animationHeight = this._height;
        }
    }

    /**
     * 消滾アニメーション
     */
    private disappearAnimation(): void
    {
        if (this._appearType === 0) {
            this._animationHeight -= 15;
        } else {
            const progress = 1 - Util.getAnimationProgress(this._animationStartTime, 1000);
            this._animationHeight = this._height * progress;
        }

        if (this._animationHeight <= this._disappearHeight) {
            this._animationHeight = this._disappearHeight;
        }

        this._element.style.height = `${this._animationHeight}px`;

        if (this._withFreePt) {
            const freePt = FreePoint.getInstance();
            const rect = this._element.getBoundingClientRect();
            
            // this._elementのドキュメント座標を取得
            const elementDocX = rect.left + window.scrollX;
            const elementDocY = rect.top + window.scrollY;
            
            // freePtをthis._elementと同じ位置に配置
            const x = elementDocX - Math.floor(freePt.clientWidth / 2) + 1;
            const y = elementDocY + this._animationHeight - Math.floor(freePt.clientHeight / 2);

            freePt.setPos(x, y).setElementPos();
        }

        if (this._animationHeight === this._disappearHeight) {
            this._appearAnimationFunc = null;
            this.setHeight(this._disappearHeight);
            this._element.classList.remove('fade-out');

            if (this._height === 0) {
                this._appearStatus = AppearStatus.DISAPPEARED;
                this._element.classList.remove('visible');
            }
        }
    }

    public disappearFadeOut(): void
    {
        this._element.classList.add('fade-out');
        
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

    private onFadeOutComplete(): void
    {
        // アニメーション完了後の処理
        this._appearStatus = AppearStatus.DISAPPEARED;
        this.changeHeight(0);
        this._element.classList.remove('visible');
    }

    public changeHeight(height: number): void
    {
        this._height = height;
        this._element.style.height = `${this._height}px`;
    }

    public static createElement(): HTMLDivElement
    {
        const element = document.createElement('div');
        element.classList.add('connection-line');
        return element;
    }
} 