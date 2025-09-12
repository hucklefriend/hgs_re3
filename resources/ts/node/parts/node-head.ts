import { NodePoint } from "./node-point";
import { Point } from "../../common/point";

export class NodeHead
{
    private _nodePoint: NodePoint;
    private _nodeElement: HTMLElement;
    private _titleElement: HTMLElement;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        this._nodeElement = nodeElement;
        this._nodePoint = new NodePoint(nodeElement.querySelector(':scope > .node-pt') as HTMLSpanElement);
        this._titleElement = this._nodeElement.querySelector(':scope > .node-head-text') as HTMLElement;
    }

    public get nodePoint(): NodePoint
    {
        return this._nodePoint;
    }

    /**
     * 接続点を取得する
     * 
     * @returns 接続点
     */
    public getConnectionPoint(): Point
    {
        return this._nodePoint.getCenterPosition();
    }

    public getNodePtWidth(): number
    {
        return this._nodePoint.htmlElement.offsetWidth;
    }

    /**
     * HTML上の絶対座標で接続点を取得する
     * 
     * @returns 絶対座標の接続点
     */
    public getAbsoluteConnectionPoint(): {x: number, y: number}
    {
        let position = this._nodePoint.getAbsoluteCenterPosition();
        position.x -= 1;
        //position.x -= this.element.offsetLeft;

        return position;
    }

    public appear(): void
    {
        this._nodePoint.appear();
        this._titleElement.classList.remove('head-fade-out');
        this._titleElement.classList.add('head-fade-in');
    }

    public disappear(): void
    {
        this._titleElement.classList.remove('head-fade-in');
        if (!this._titleElement.classList.contains('head-fade-out')) {
            this._titleElement.classList.add('head-fade-out');
        }
    }

    public setTitle(title: string): void
    {
        this._titleElement.innerHTML = title;
    }
}
