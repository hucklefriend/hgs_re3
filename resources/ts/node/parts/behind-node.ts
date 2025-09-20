import { NodePoint } from "./node-point";

export class BehindNode
{
    private _point: NodePoint;
    private _nodeElement: HTMLElement;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        this._point = new NodePoint(nodeElement.querySelector('.node-pt') as HTMLSpanElement);
        this._nodeElement = nodeElement;
    }

    public get nodeElement(): HTMLElement
    {
        return this._nodeElement;
    }

    public getConnectionPoint(): {x: number, y: number}
    {
        const rect = this._point.htmlElement.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    /**
     * HTML上の絶対座標で接続点を取得する
     * @returns 絶対座標の接続点
     */
    public getAbsoluteConnectionPoint(): {x: number, y: number}
    {
        return this._point.getAbsoluteCenterPosition();
    }

    public invisible(): void
    {
        this._nodeElement.classList.remove('visible');
    }

    public visible(): void
    {
        this._nodeElement.classList.add('visible');
    }
} 
