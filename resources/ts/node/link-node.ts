import { MainNodeBase } from "./main-node-base";
import { NodePoint } from "./parts/node-point";

export class LinkNode extends MainNodeBase
{
    private point: NodePoint;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this.point = new NodePoint(nodeElement.querySelector('.node-head .node-pt') as HTMLSpanElement);
    }

    public getConnectionPoint(): {x: number, y: number}
    {
        return this.point.getCenterPosition();
    }
} 
