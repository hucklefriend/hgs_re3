import { Util } from "../../common/util";

export class FreePoint
{
    private _element: HTMLDivElement;
    public pos: {x: number, y: number};

    private _animationFunc: (() => void) | null;
    private _animationGoalPos: {x: number, y: number};    
    private _animationStartTime: number;
    private _halfWidth: number;
    private _halfHeight: number;

    public get element(): HTMLDivElement
    {
        return this._element;
    }

    /**
     * コンストラクタ
     */
    public constructor(parentNodeElement: HTMLElement)
    {
        this._element = document.createElement('div');
        this._element.textContent = '●';
        this._element.classList.add('free-pt');
        parentNodeElement.appendChild(this._element);
        this.pos = {x: 0, y: 0};
        this._animationGoalPos = {x: 0, y: 0};
        this._animationFunc = null;
        this._animationStartTime = 0;
        this._halfWidth = this._element.clientWidth / 2;
        this._halfHeight = this._element.clientHeight / 2;
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
        this._element.style.left = this.pos.x - this._halfWidth + 'px';
        this._element.style.top = this.pos.y - this._halfHeight + 'px';

        return this;
    }

    public fixOffset(): FreePoint
    {
        this.pos.x = parseInt(this._element.style.left) + this._halfWidth;
        this.pos.y = parseInt(this._element.style.top) + this._halfHeight;
        return this;
    }

    public moveOffset(x: number, y: number): FreePoint
    {
        this._element.style.left = this.pos.x + x - this._halfWidth + 'px';
        this._element.style.top = this.pos.y + y - this._halfHeight + 'px';

        return this;
    }

    public show(): void
    {
        this._element.classList.add('visible');
    }

    public hide(): void
    {
        this._element.classList.remove('visible');
    }

    public update(): void
    {
        if (this._animationFunc !== null) {
            this._animationFunc();
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