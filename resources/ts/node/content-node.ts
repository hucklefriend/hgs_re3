import { NodeBase } from "./node-base";
import { NodePoint } from "./parts/node-point";

export class ContentNode extends NodeBase
{
    private point: NodePoint;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this.point = new NodePoint(nodeElement.querySelector('.node-pt') as HTMLSpanElement);
    }

    public getConnectionPoint(): {x: number, y: number}
    {
        return this.point.getCenterPosition();
    }
} 