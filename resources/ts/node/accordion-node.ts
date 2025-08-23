import { MainNodeBase } from "./main-node-base";
import { AppearStatus } from "../enum/appear-status";
import { Tree } from "../common/tree";
import { TreeView } from "../tree-view";
import { AccordionNodeGroup } from "./accordion-node-group";
import { HeaderNode } from "./header-node";

export class AccordionNode extends MainNodeBase
{
    protected _headerNode: HeaderNode;
    protected _expandButton: HTMLButtonElement;

    protected _groupId: string;
    protected _group: AccordionNodeGroup | null;
    protected _container: HTMLElement;
    protected _content: HTMLElement;
    protected _isOpen: boolean;

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement, parentTree: Tree)
    {
        super(nodeElement, parentTree);

        this._headerNode = new HeaderNode(nodeElement.querySelector('.header-node') as HTMLElement);
        this._expandButton = nodeElement.querySelector('.header-node > .node-head > .accordion-expand-button') as HTMLButtonElement;
        this._expandButton.addEventListener('mouseenter', () => this.hover());
        this._expandButton.addEventListener('mouseleave', () => this.unhover());
        this._expandButton.addEventListener('click', (e) => this.click(e));

        this._groupId = nodeElement.getAttribute('data-accordion-group') || '';
        this._group = null;

        let container = nodeElement.querySelector('.accordion-node-container') as HTMLElement | null;
        if (!container) {
            container = nodeElement.querySelector('.accordion-tree-node-container') as HTMLElement;
        }
        this._container = container;
        this._content = this._container.querySelector('.accordion-node-content') as HTMLElement;
        this._isOpen = false;
    }

    public set group(group: AccordionNodeGroup)
    {
        this._group = group;
    }

    public get groupId(): string
    {
        return this._groupId;
    }

    public appear(): void
    {
        super.appear();
        this._headerNode.appear();
        //this._expandButton.setAttribute('aria-expanded', 'false');
    }

    public disappear(): void
    {
        super.disappear();
        this._headerNode.disappear();
    }

    protected hover(): void
    {
        if (this._isOpen) {
            return;
        }

        this._expandButton.classList.add('hover');
    }

    protected unhover(): void
    {
        if (this._isOpen) {
            return;
        }

        this._expandButton.classList.remove('hover');
    }

    /**
     * クリック時の処理
     * @param e クリックイベント
     */
    protected click(e: MouseEvent): void
    {
        e.preventDefault();

        if (this._appearStatus !== AppearStatus.APPEARED) {
            return;
        }

        this.toggle();
    }

    public toggle(): void
    {
        if (this._isOpen) {
            this.close();
        } else {
            this.open();
        }
    }


    public open(): void
    {
        this.invisibleBehind();
        this._container.classList.remove('closed');
        this._container.style.height = this._content.scrollHeight + 'px';
        super.hover();
        this._isOpen = true;

        this._forceResize();
    }

    public close(): void
    {
        this.visibleBehind();
        this._container.classList.add('closed');
        this._container.style.height = '0px';
        this._isOpen = false;
        this._forceResize();
    }

    private _forceResize(): void
    {
        const treeView = window.hgn.treeView as TreeView;
        treeView.isForceResize = true;
        setTimeout(() => {
            treeView.isForceResize = false;
        }, 350);
    }

    protected isHover(): boolean
    {
        return false;
    }

    public getConnectionPoint(): {x: number, y: number}
    {
        return this._headerNode.getConnectionPoint();
    }

    public getAbsoluteConnectionPoint(): {x: number, y: number}
    {
        return this._headerNode.getAbsoluteConnectionPoint();
    }
}
