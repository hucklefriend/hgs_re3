import { Point } from "../../common/point";

export class NodePoint
{
    public element: HTMLSpanElement;

    /**
     * コンストラクタ
     * @param element ポイントの要素
     */
    constructor(element: HTMLSpanElement)
    {
        this.element = element;
    }

    /**
     * 中心位置を取得
     * 
     * @returns 中心位置
     */
    public getCenterPosition(): Point
    {
        return new Point(
            this.element.offsetLeft + this.element.offsetWidth / 2,
            this.element.offsetTop + this.element.offsetHeight / 2
        );
    }

    public getAbsoluteCenterPosition(): Point
    {

        const rect = this.element.getBoundingClientRect();


        console.log(this.getCenterPosition());
        console.log((rect.left + rect.width / 2), (rect.top + rect.height / 2));

        return new Point(
            (rect.left + rect.width / 2) + window.scrollX - (window as any).hgn.main.offsetLeft,
            (rect.top + rect.height / 2) + window.scrollY - (window as any).hgn.main.offsetTop
        );
    }
} 