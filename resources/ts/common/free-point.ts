import { AppearStatus } from "../enum/appear-status";
import { MainNodeBase } from "../node/main-node-base";
import { Util } from "./util";

export class FreePoint
{
    private _element: HTMLDivElement;
    public pos: {x: number, y: number};
    private routeNodes: MainNodeBase[];

    private _animationFunc: (() => void) | null;
    private _animationGoalPos: {x: number, y: number};    
    private _animationStartTime: number;

    /**
     * コンストラクタ
     * @param element 接続線の要素
     */
    public constructor(element: HTMLDivElement)
    {
        this._element = element;
        this.pos = {x: 0, y: 0};
        this.routeNodes = [];
        this._animationGoalPos = {x: 0, y: 0};
        this._animationFunc = null;
        this._animationStartTime = 0;
    }

    public addRouteNode(node: MainNodeBase): void
    {
        this.routeNodes.push(node);
    }

    public get clientWidth(): number
    {
        return this._element.clientWidth;
    }

    public get clientHeight(): number
    {
        return this._element.clientHeight;
    }

    public setPos(x: number, y: number): void
    {
        this.pos.x = x;
        this.pos.y = y;
    }

    public fixOffset(): void
    {
        this.pos.x = parseInt(this._element.style.left);
        this.pos.y = parseInt(this._element.style.top);
    }

    public moveOffset(x: number, y: number): void
    {
        this._element.style.left = this.pos.x + x + 'px';
        this._element.style.top = this.pos.y + y + 'px';
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