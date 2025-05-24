export class Point
{
    private treePoint: HTMLSpanElement;

    /**
     * コンストラクタ
     * @param element ポイントの要素
     */
    constructor(element: HTMLSpanElement)
    {
        this.treePoint = element;
    }

    /**
     * ポイントの中心位置を取得
     * @returns {x: number, y: number}
     */
    public getCenterPosition(): {x: number, y: number}
    {
        return {
            x: this.treePoint.offsetLeft + this.treePoint.offsetWidth / 2,
            y: this.treePoint.offsetTop + this.treePoint.offsetHeight / 2
        };
    }
} 