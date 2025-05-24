import { MainNodeBase } from "./main-node-base";
import { Point } from "./parts/point";

export class LinkNode extends MainNodeBase
{
    private point: Point;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this.point = new Point(nodeElement.querySelector('.node-head .node-pt') as HTMLSpanElement);
    }

    protected getConnectionPoint(): {x: number, y: number}
    {
        return this.point.getCenterPosition();
    }
} 
