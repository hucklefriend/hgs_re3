import { Point } from "../../common/point";

export class NodePoint
{
    private element: HTMLSpanElement;

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
} 