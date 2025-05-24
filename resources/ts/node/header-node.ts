import { NodeBase } from "./node-base";
import { Point } from "./parts/point";

export class HeaderNode extends NodeBase
{
    private point: Point;
    private title: HTMLElement;
    //private content: HTMLElement;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this.point = new Point(nodeElement.querySelector('.node-pt') as HTMLSpanElement);
        this.title = nodeElement.querySelector('.node-head h1') as HTMLElement;
        //this.content = nodeElement.querySelector('.node-body') as HTMLElement;
    }

    /**
     * 接続点を取得する
     */
    protected getConnectionPoint(): {x: number, y: number}
    {
        return this.point.getCenterPosition();
    }
} 