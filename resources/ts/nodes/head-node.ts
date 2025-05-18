export class HeadNode
{
    private element: HTMLElement;
    private treePoint: HTMLSpanElement;

    constructor(element: HTMLElement)
    {
        this.element = element;
        this.treePoint = element.querySelector('.tree-pt') as HTMLSpanElement;
    }

    public getTreePoint(): HTMLSpanElement
    {
        return this.treePoint;
    }
} 