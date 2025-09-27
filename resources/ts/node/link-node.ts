import { BasicNode } from "./basic-node";
import { TreeNodeInterface } from "./interface/tree-node-interface";
import { ClickableNodeInterface } from "./interface/clickable-node-interface";
import { LinkNodeMixin } from "./mixins/link-node-mixin";

export class LinkNode extends BasicNode implements ClickableNodeInterface
{
    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement, parentNode: TreeNodeInterface)
    {
        super(nodeElement, parentNode);
    }

    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        super.update();
    }

    // LinkNodeMixinのメソッドを委譲
    public get anchor(): HTMLAnchorElement
    {
        return this.linkMixin.anchor;
    }

    public get nodeHead(): any
    {
        return this.linkMixin.nodeHead;
    }

    public hover(): void
    {
        this.linkMixin.hover();
    }

    public unhover(): void
    {
        this.linkMixin.unhover();
    }

    public click(e: MouseEvent): void
    {
        this.linkMixin.click(e);
    }

    public disappear(): void
    {
        if (!this.linkMixin._isHomewardDisappear) {
            super.disappear();
        } else {
            this.linkMixin.executeHomewardDisappear();
        }
    }

    public selectedDisappearAnimation(): void
    {
        this.linkMixin.selectedDisappearAnimation();
    }

    public selectedDisappearAnimation2(): void
    {
        this.linkMixin.selectedDisappearAnimation2();
    }

    private get linkMixin(): LinkNodeMixin
    {
        if (!(this as any)._linkMixin) {
            (this as any)._linkMixin = new LinkNodeMixin(this);
        }
        return (this as any)._linkMixin;
    }
}
