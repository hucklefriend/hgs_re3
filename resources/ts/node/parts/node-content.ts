import { Point } from "../../common/point";

export class NodeContent
{
    protected _contentElement: HTMLElement;

    public get contentElement(): HTMLElement
    {
        return this._contentElement;
    }

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        this._contentElement = nodeElement;
    }


    public appear(): void
    {
        this._contentElement.classList.remove('content-fade-out');
        this._contentElement.classList.add('content-fade-in');
    }

    public disappear(): void
    {
        this._contentElement.classList.remove('content-fade-in');
        this._contentElement.classList.add('content-fade-out');
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