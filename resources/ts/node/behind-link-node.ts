import { NodePoint } from "./parts/node-point";

export class BehindLinkNode
{
    private _point: NodePoint;
    private _element: HTMLElement;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        this._point = new NodePoint(nodeElement.querySelector('.node-pt') as HTMLSpanElement);
        this._element = nodeElement;
    }

    public get element(): HTMLElement
    {
        return this._element;
    }

    public getConnectionPoint(): {x: number, y: number}
    {
        const rect = this._point.element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }
} 
