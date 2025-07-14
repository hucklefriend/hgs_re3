import { NodeBase } from "./node-base";
import { NodePoint } from "./parts/node-point";
import { Point } from "../common/point";

export class HeaderNode extends NodeBase
{
    private _point: NodePoint;
    private _nodeHead: HTMLElement;
    private _title: HTMLElement;
    //private content: HTMLElement;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this._point = new NodePoint(nodeElement.querySelector('.node-pt') as HTMLSpanElement);
        this._nodeHead = nodeElement.querySelector('.node-head') as HTMLElement;
        this._title = this._nodeHead.querySelector('h1') as HTMLElement;
        //this.content = nodeElement.querySelector('.node-body') as HTMLElement;
    }

    /**
     * 接続点を取得する
     * 
     * @returns 接続点
     */
    public getConnectionPoint(): Point
    {
        return this._point.getCenterPosition();
    }

    public disappear(): void
    {
        if (!this._nodeHead.classList.contains('fade-out-right')) {
            this._nodeHead.classList.add('fade-out-right');
        }
    }

    public get point(): NodePoint
    {
        return this._point;
    }
} 