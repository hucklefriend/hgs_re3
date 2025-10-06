import { TreeNodeInterface } from "./interface/tree-node-interface";
import { ClickableNodeInterface } from "./interface/clickable-node-interface";
import { LinkNodeMixin } from "./mixins/link-node-mixin";
import { TreeNode } from "./tree-node";
import { Util } from "../common/util";

export class LinkTreeNode extends TreeNode implements ClickableNodeInterface
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

    

    /**
     * ホバー開始時のグラデーションα値を更新
     */
    protected updateGradientEndAlphaOnHover(): void
    {
        // 何もしない
        this._updateGradientEndAlphaFunc = null;
    }

    /**
     * ホバー終了時のグラデーションα値を更新
     */
    protected updateGradientEndAlphaOnUnhover(): void
    {
        // 何もしない
        this._updateGradientEndAlphaFunc = null;
    }
}
