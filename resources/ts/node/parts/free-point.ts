import { Util } from "../../common/util";
import { DisappearRouteNodeType } from "../../common/type";

export class FreePoint
{
    private static _instance: FreePoint | null = null;
    
    private _element: HTMLDivElement;
    public pos: {x: number, y: number};

    private _animationFunc: (() => void) | null;
    private _animationGoalPos: {x: number, y: number};    
    private _animationStartTime: number;

    /**
     * プライベートコンストラクタ（シングルトンパターン）
     */
    private constructor()
    {
        this._element = document.querySelector('div#free-pt') as HTMLDivElement;
        this.pos = {x: 0, y: 0};
        this._animationGoalPos = {x: 0, y: 0};
        this._animationFunc = null;
        this._animationStartTime = 0;
    }

    /**
     * シングルトンインスタンスを取得
     * @returns FreePointのインスタンス
     */
    public static getInstance(): FreePoint
    {
        if (FreePoint._instance === null) {
            FreePoint._instance = new FreePoint();
        }
        return FreePoint._instance;
    }

    public get clientWidth(): number
    {
        return this._element.clientWidth;
    }

    public get clientHeight(): number
    {
        return this._element.clientHeight;
    }

    public setPos(x: number, y: number): FreePoint
    {
        this.pos.x = x;
        this.pos.y = y;
        return this;
    }

    public setElementPos(): FreePoint
    {
        this._element.style.left = this.pos.x + 'px';
        this._element.style.top = this.pos.y + 'px';

        this.scroll();
        return this;
    }

    public fixOffset(): FreePoint
    {
        this.pos.x = parseInt(this._element.style.left);
        this.pos.y = parseInt(this._element.style.top);
        return this;
    }

    public moveOffset(x: number, y: number): FreePoint
    {
        this._element.style.left = this.pos.x + x + 'px';
        this._element.style.top = this.pos.y + y + 'px';

        this.scroll();
        return this;
    }

    private scroll(): void
    {
        const elementTop = parseInt(this._element.style.top);
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const screenCenter = scrollY + windowHeight / 2;
        
        // 要素が画面中央より上にある場合、スクロール位置を調整
        if (elementTop < screenCenter) {
            window.scrollTo(0, elementTop - windowHeight / 2);
        }
    }

    public show(): void
    {
        this._element.classList.add('visible');
    }

    public hide(): void
    {
        this._element.classList.remove('visible');
    }

    public static update(): void
    {
        const freePoint = FreePoint.getInstance();
        if (freePoint._animationFunc !== null) {
            freePoint._animationFunc();
        }
    }

    public moveTo(goalPos: {x: number, y: number}): void
    {
        this._animationStartTime = (window as any).hgn.timestamp;
        
        this._animationGoalPos = goalPos;
        this._animationGoalPos.x -= this._element.clientWidth / 2;
        this._animationGoalPos.y -= this._element.clientHeight / 2;
        this._animationFunc = this.moveAnimation;
    }

    private moveAnimation(): void
    {
        const progress = Util.getAnimationProgress(this._animationStartTime, 300);
        if (progress >= 1) {
            this._animationFunc = null;
            this.setPos(this._animationGoalPos.x, this._animationGoalPos.y);
            this.moveOffset(0, 0);
        } else {
            this.moveOffset (
                (this._animationGoalPos.x - this.pos.x) * progress,
                (this._animationGoalPos.y - this.pos.y) * progress
            );
        }
    }
} 