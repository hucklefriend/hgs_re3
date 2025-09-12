import { Point } from "../../common/point";

export class NodeContent
{
    protected _htmlElement: HTMLElement;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        this._htmlElement = nodeElement;
    }


    public appear(headerPosition: Point): void
    {
        this._htmlElement.classList.remove('head-fade-out');
        this._htmlElement.classList.add('head-fade-in');
    }

    public disappear(headerPosition: Point): void
    {
        this._htmlElement.classList.remove('head-fade-in');
        this._htmlElement.classList.add('head-fade-out');
    }

    public resize(): void
    {
        
    }

    public update(headerPosition: Point): void
    {
        
    }

    public draw(): void
    {
        
    }

    public dispose(): void
    {
        
    }
} 