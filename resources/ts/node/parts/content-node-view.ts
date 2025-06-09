export class ContentNodeView
{
    public element: HTMLDivElement;
    public header: HTMLElement;
    public title: HTMLHeadingElement;
    public content: HTMLDivElement;
    public footer: HTMLElement;

    /**
     * コンストラクタ
     * @param element ノードの要素
     */
    constructor(element: HTMLDivElement)
    {
        this.element = element;
        this.header = element.querySelector('header') as HTMLElement;
        this.title = this.header.querySelector('h1') as HTMLHeadingElement;
        this.content = element.querySelector('#content-node-view-content') as HTMLDivElement;
        this.footer = element.querySelector('footer') as HTMLElement;
    }
} 