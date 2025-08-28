import { NodeBase } from "./node-base";
import { NodePoint } from "./parts/node-point";
import { Point } from "../common/point";

export class HeaderNode extends NodeBase
{
    private _point: NodePoint;
    private _nodeHead: HTMLElement;
    private _title: HTMLElement;
    private _content: HTMLElement | null;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this._point = new NodePoint(nodeElement.querySelector('.node-pt') as HTMLSpanElement);
        this._nodeHead = nodeElement.querySelector('.node-head') as HTMLElement;
        this._title = this._nodeHead.querySelector('h1, h2, h3, h4, h5, h6, a, button') as HTMLElement;
        this._content = nodeElement.querySelector('.header-node-content') as HTMLElement;
    }

    /**
     * 接続点を取得する
     * 
     * @returns 接続点
     */
    public getConnectionPoint(): Point
    {
        let position = this._point.getCenterPosition();
        position.x -= 1;
        position.x += this.element.offsetLeft;

        return position;
    }

    /**
     * HTML上の絶対座標で接続点を取得する
     * 
     * @returns 絶対座標の接続点
     */
    public getAbsoluteConnectionPoint(): {x: number, y: number}
    {
        let position = this._point.getAbsoluteCenterPosition();
        position.x -= 1;
        //position.x -= this.element.offsetLeft;

        return position;
    }

    public appear(): void
    {
        this._point.element.classList.remove('fade-out');
        this._title.classList.remove('header-fade-out-right');
        this._title.classList.add('header-fade-in-left');

        if (this._content) {
            this._content.classList.remove('header-fade-out-right');
            this._content.classList.add('header-fade-in-left');
        }
    }

    public disappear(): void
    {
        this._title.classList.remove('header-fade-in-left');
        if (!this._title.classList.contains('header-fade-out-right')) {
            this._title.classList.add('header-fade-out-right');
        }

        if (this._content) {
            this._content.classList.remove('header-fade-in-left');
            this._content.classList.add('header-fade-out-right');
        }
    }

    public disappearPoint(): void
    {
        this._point.element.classList.add('fade-out');
    }

    public get point(): NodePoint
    {
        return this._point;
    }

    public set title(title: string)
    {
        this._title.innerHTML = title;
    }
} 