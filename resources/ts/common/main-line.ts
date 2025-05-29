export class MainLine
{
    private element: HTMLDivElement;

    /**
     * コンストラクタ
     */
    public constructor(element: HTMLDivElement)
    {
        this.element = element;
    }

    public setStartPoint(x: number, y: number): void
    {
        //this.element.style.left = `${x}px`;
        //this.element.style.top = `${y}px`;
    }

    public setHeight(height: number): void
    {
        this.element.style.height = `${height}px`;
    }
} 