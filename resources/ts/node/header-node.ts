import { NodeBase } from "./node-base";
import { NodePoint } from "./parts/node-point";
import { Point } from "../common/point";

export class HeaderNode extends NodeBase
{
    private point: NodePoint;
    private title: HTMLElement;
    //private content: HTMLElement;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this.point = new NodePoint(nodeElement.querySelector('.node-pt') as HTMLSpanElement);
        this.title = nodeElement.querySelector('.node-head h1') as HTMLElement;
        //this.content = nodeElement.querySelector('.node-body') as HTMLElement;
    }

    /**
     * 接続点を取得する
     * 
     * @returns 接続点
     */
    public getConnectionPoint(): Point
    {
        return this.point.getCenterPosition();
    }
} 