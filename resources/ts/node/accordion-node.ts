import { MainNodeBase } from "./main-node-base";
import { AppearStatus } from "../enum/appear-status";
import { NodePoint } from "./parts/node-point";
import { Tree } from "../common/tree";
import { LinkNode } from "./link-node";
import { FreePoint } from "../common/free-point";
import { HorrorGameNetwork } from "../horror-game-network";
import { TreeView } from "../tree-view";
import { AccordionNodeGroup } from "./accordion-node-group";
import { Util } from "../common/util";

export class AccordionNode extends LinkNode
{
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
        this._groupId = nodeElement.getAttribute('data-accordion-group') || '';
        this._group = null;
        this._container = nodeElement.querySelector('.accordion-node-container') as HTMLElement;
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

    protected hover(): void
    {
        if (this._isOpen) {
            return;
        }
        super.hover();
    }

    protected unhover(): void
    {
        if (this._isOpen) {
            return;
        }
        super.unhover();
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
        super.hover(false);
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
}
