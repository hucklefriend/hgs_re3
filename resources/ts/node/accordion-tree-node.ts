import { TreeNode } from "./tree-node";
import { TreeNodeInterface } from "./interface/tree-node-interface";
import { AppearStatus } from "../enum/appear-status";
import { BasicNode } from "./basic-node";
import { CurrentNode } from "./current-node";
import { HorrorGameNetwork } from "../horror-game-network";
import { Util } from "../common/util";

export class AccordionTreeNode extends TreeNode
{
    private _groupId: string;
    private _btn: HTMLButtonElement;
    private _isHomewardDisappear: boolean;
    private _isOpen: boolean;
    private _startScrollY: number;
    private _startPosY: number;

    public get btn(): HTMLButtonElement
    {
        return this._btn;
    }


    public constructor(nodeElement: HTMLElement, parentNode: TreeNodeInterface)
    {
        super(nodeElement, parentNode);

        this._groupId = nodeElement.getAttribute('data-accordion-group') || '';
        this._btn = this._nodeHead.titleElement as HTMLButtonElement;
        this._btn.addEventListener('click', this.click.bind(this));
        this._btn.addEventListener('mouseenter', this.hover.bind(this));
        this._btn.addEventListener('mouseleave', this.unhover.bind(this));
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
            console.log('opened/closed');
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
     * ホバー開始時のグラデーションα値を更新
     */
    protected updateGradientEndAlphaOnHover(): void
    {
        this._curveCanvas.gradientEndAlpha = Util.getAnimationValue(0.3, 1.0, this._animationStartTime, 300);
        if (this._curveCanvas.gradientEndAlpha === 1) {
            this._updateGradientEndAlphaFunc = null;
        }

        this.setDraw();
    }

    /**
     * ホバー終了時のグラデーションα値を更新
     */
    protected updateGradientEndAlphaOnUnhover(): void
    {
        this._curveCanvas.gradientEndAlpha = Util.getAnimationValue(1.0, 0.3, this._animationStartTime, 300);
        if (this._curveCanvas.gradientEndAlpha <= 0.3) {
            this._curveCanvas.gradientEndAlpha = 0.3;
            this._updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    protected isHover(): boolean
    {
        return this._appearStatus === AppearStatus.APPEARED && this._btn.classList.contains('hover');
    }

    /**
     * ホバー時の処理
     */
    protected hover(): void
    {
        if (this._appearStatus !== AppearStatus.APPEARED) {
            return;
        }

        this._btn.classList.add('hover');
        this._nodeContentBehind?.hover();
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
    }

    /**
     * ホバー解除時の処理
     */
    protected unhover(): void
    {
        if (this._appearStatus !== AppearStatus.APPEARED) {
            return;
        }
        this._btn.classList.remove('hover');
        this._nodeContentBehind?.unhover();

        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
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
}
