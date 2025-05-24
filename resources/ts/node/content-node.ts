import { NodeBase } from "./node-base";
import { Point } from "./parts/point";

export class ContentNode extends NodeBase
{
    private point: Point;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this.point = new Point(nodeElement.querySelector('.node-pt') as HTMLSpanElement);
    }

    protected getConnectionPoint(): {x: number, y: number}
    {
        return this.point.getCenterPosition();
    }
} 