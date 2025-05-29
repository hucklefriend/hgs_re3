import { MainNodeBase } from "./main-node-base";

export class ContentNode extends MainNodeBase
{
    private linkElement: HTMLElement;

    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this.linkElement = nodeElement.querySelector('.content-link') as HTMLElement;
    }

    public getConnectionPoint(): {x: number, y: number}
    {
        return {
            x: this.linkElement.offsetLeft,
            y: this.linkElement.offsetTop + this.linkElement.offsetHeight / 2
        };
    }
} 