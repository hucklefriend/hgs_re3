import { NodePoint } from "./parts/node-point";

export class SubLinkNode
{
    private _point: NodePoint;
    public element: HTMLElement;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        this._point = new NodePoint(nodeElement.querySelector('.node-pt') as HTMLSpanElement);
        this.element = nodeElement;
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
