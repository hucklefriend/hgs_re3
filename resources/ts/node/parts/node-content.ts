import { Point } from "../../common/point";

export class NodeContent
{
    protected _contentElement: HTMLElement;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        this._contentElement = nodeElement;
    }


    public appear(): void
    {
        this._contentElement.classList.remove('head-fade-out');
        this._contentElement.classList.add('head-fade-in');
    }

    public disappear(): void
    {
        this._contentElement.classList.remove('head-fade-in');
        this._contentElement.classList.add('head-fade-out');
    }

    public resize(): void
    {
        
    }

    public update(): void
    {
        
    }

    public dispose(): void
    {
        
    }
} 