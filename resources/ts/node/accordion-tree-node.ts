import { TreeNode } from "./tree-node";
import { TreeNodeInterface } from "./interface/tree-node-interface";
import { AppearStatus } from "../enum/appear-status";
import { BasicNode } from "./basic-node";
import { CurrentNode } from "./current-node";
import { HorrorGameNetwork } from "../horror-game-network";
import { Util } from "../common/util";
import { ClickableNodeInterface } from "./interface/clickable-node-interface";
import { NodeHeadClickable } from "./parts/node-head-clickable";
import { NodeHeadType } from "../common/type";

export class AccordionTreeNode extends TreeNode implements ClickableNodeInterface
{
    private _groupId: string;
    private _isHomewardDisappear: boolean;
    private _isOpen: boolean;
    private _startScrollY: number;
    private _startPosY: number;

    /**
     * クリック可能なノードヘッダを取得
     */
    public get nodeHead(): NodeHeadClickable
    {
        return this._nodeHead as NodeHeadClickable;
    }


    public constructor(nodeElement: HTMLElement, parentNode: TreeNodeInterface)
    {
        super(nodeElement, parentNode);

        this._groupId = nodeElement.getAttribute('data-accordion-group') || '';
        this._isHomewardDisappear = false;
        this._isOpen = false;
        this._startScrollY = 0;
        this._startPosY = 0;

        const currentNode = window.hgn.currentNode as CurrentNode;
        if (currentNode) {
            currentNode.addAccordionGroup(this._groupId, this);
        }
    }

    public appear(): void
    {
        BasicNode.prototype.appear.call(this);
    }

    public appearAnimation(): void
    {
        BasicNode.prototype.appearAnimation.call(this);
    }

    public open(toggleOtherNodes: boolean = false): void
    {
        if (this._isOpen) {
            return;
        }
        this._nodeContentTree.contentElement.classList.add('open');
        this._nodeContentTree.appear();
        this._appearAnimationFunc = this.openAnimation;
        this._isOpen = true;
        this._nodeContentBehind?.invisible();

        if (toggleOtherNodes) {
            this._toggleOtherNodesInGroup('close');
        }
    }

    public openAnimation(): void
    {
        this.parentNode.resizeConnectionLine();
        const nodeRect = this._nodeElement.getBoundingClientRect();
        const posY = nodeRect.top + window.scrollY;
        if (posY !== this._startPosY) {
            //window.scrollTo(0, this._startScrollY - (this._startPosY - posY));
        }
        
        if (AppearStatus.isAppeared(this._nodeContentTree.appearStatus) ||
            AppearStatus.isDisappeared(this._nodeContentTree.appearStatus)) {
            this._appearAnimationFunc = null;
        }
    }

    public close(): void
    {
        if (!this._isOpen) {
            return;
        }
        
        this._nodeContentTree.contentElement.classList.remove('open');
        this._nodeContentTree.disappear();
        const nodeRect = this._nodeElement.getBoundingClientRect();
        this._startPosY = nodeRect.top + window.scrollY;
        this._startScrollY = window.scrollY;

        this._appearAnimationFunc = this.openAnimation;
        this._isOpen = false;
        this._nodeContentBehind?.visible();
    }

    public toggle(): void
    {
        if (this._isOpen) {
            this.close();
        } else {
            this.open(true);
        }
    }

    /**
     * 同じアコーディオングループ内の他のノードを指定された状態に切り替える
     * @param action 実行するアクション（'open' または 'close'）
     */
    private _toggleOtherNodesInGroup(action: 'open' | 'close'): void
    {
        const currentNode = (window as any).hgn.currentNode as CurrentNode;
        if (currentNode) {
            const group = currentNode.getAccordionGroup(this._groupId);
            for (const node of group) {
                if (node.id !== this.id) {
                    if (action === 'open') {
                        node.open();
                    } else {
                        node.close();
                    }
                }
            }
        }
    }

    /**
     * ホバー時の処理
     */
    public hover(): void
    {
        this._nodeContentBehind?.hover();
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
    }

    /**
     * ホバー解除時の処理
     */
    public unhover(): void
    {
        this._nodeContentBehind?.unhover();
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
    }

    /**
     * クリック時の処理
     * @param e クリックイベント
     */
    public click(e: MouseEvent): void
    {
        this.toggle();
    }
}
