import { Point } from "../../common/point";

export class NodePoint
{
    protected _htmlElement: HTMLSpanElement;

    public get htmlElement(): HTMLSpanElement
    {
        return this._htmlElement;
    }

    /**
     * コンストラクタ
     * @param element ポイントの要素
     */
    constructor(htmlElement: HTMLSpanElement)
    {
        this._htmlElement = htmlElement;
    }

    public appear(): void
    {
        this._htmlElement.classList.add('visible');
    }

    public disappear(): void
    {
        this._htmlElement.classList.remove('visible');
    }

    /**
     * 中心位置を取得
     * 
     * @returns 中心位置
     */
    public getCenterPosition(): Point
    {
        return new Point(
            Math.floor(this._htmlElement.offsetLeft + this._htmlElement.offsetWidth / 2),
            Math.floor(this._htmlElement.offsetTop + this._htmlElement.offsetHeight / 2)
        );
    }

    public getAbsoluteCenterPosition(): Point
    {
        const rect = this._htmlElement.getBoundingClientRect();

        return new Point(
            Math.floor((rect.left + rect.width / 2) + window.scrollX - (window as any).hgn.main.offsetLeft),
            Math.floor((rect.top + rect.height / 2) + window.scrollY - (window as any).hgn.main.offsetTop)
        );
    }
} 