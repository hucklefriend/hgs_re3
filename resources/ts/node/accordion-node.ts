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
        //this._expandButton.addEventListener('touchstart', (e) => this.touchStart(e));

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

    public disappear(isInvisibleNodeHead: boolean = true): void
    {
        super.disappear(isInvisibleNodeHead);
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

    /**
     * タッチ開始時の処理
     * @param e タッチイベント
     */
    protected touchStart(e: TouchEvent): void
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
        
        // モバイル対応：一時的に要素を表示してからscrollHeightを取得
        const originalHeight = this._container.style.height;
        const originalOverflow = this._container.style.overflow;
        const originalVisibility = this._container.style.visibility;
        const originalDisplay = this._container.style.display;
        
        // 一時的に表示状態にする
        this._container.style.height = 'auto';
        this._container.style.overflow = 'visible';
        this._container.style.visibility = 'hidden';
        this._container.style.position = 'absolute';
        this._container.style.display = 'block';
        
        // 強制的にリフローを発生させる
        this._container.offsetHeight;
        
        // scrollHeightを取得（モバイル対応）
        let scrollHeight = this._content.scrollHeight;
        
        // scrollHeightが0の場合は、getBoundingClientRect()を使用
        if (scrollHeight === 0) {
            const rect = this._content.getBoundingClientRect();
            scrollHeight = rect.height;
        }
        
        // 元の状態に戻す
        this._container.style.height = originalHeight;
        this._container.style.overflow = originalOverflow;
        this._container.style.visibility = originalVisibility;
        this._container.style.position = '';
        this._container.style.display = originalDisplay;
        
        // 取得したscrollHeightでアニメーション開始
        this._container.style.height = scrollHeight + 'px';
        alert('open ' + scrollHeight + 'px');
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
