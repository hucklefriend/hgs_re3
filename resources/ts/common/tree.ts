import { ConnectionLine } from "./connection-line";
import { HeaderNode } from "../node/header-node";
import { LinkNode } from "../node/link-node";
import { ContentNode } from "../node/content-node";
import { TerminalNode } from "../node/terminal-node";
import { SubTreeNode } from "../node/sub-tree-node";
import { AppearStatus } from "../enum/appear-status";
import { AccordionNodeGroup } from "../node/accordion-node-group";
import { AccordionNode } from "../node/accordion-node";
import { AccordionTreeNode } from "../node/accordion-tree-node";
import { MainNodeBase } from "../node/main-node-base";
import { TreeOwnNodeType, DisappearRouteNodeType } from "./type";

export class Tree
{
    protected _id: string;
    protected _connectionLine: ConnectionLine;
    protected _headerNode: HeaderNode;
    protected _linkNodes: LinkNode[];
    protected _contentNodes: ContentNode[];
    protected _terminalNodes: TerminalNode[];
    protected _subTreeNodes: SubTreeNode[];
    protected _accordionGroups: { [key: string]: AccordionNodeGroup };
    protected _lastNode: LinkNode | ContentNode | TerminalNode | SubTreeNode | AccordionNode | AccordionTreeNode | null;
    protected _appearStatus: AppearStatus;
    public disappearRouteNode: DisappearRouteNodeType | null;
    public appearAnimationFunc: (() => void) | null;
    protected _nodeCount: number;
    protected _disappearedNodeCount: number;

    public constructor(id: string, headerNodeOrElement: HTMLElement | HeaderNode, connectionLineElement: HTMLDivElement)
    {
        this._id = id;

        this._headerNode = headerNodeOrElement instanceof HeaderNode ?
            headerNodeOrElement : new HeaderNode(headerNodeOrElement);
        this._connectionLine = new ConnectionLine(connectionLineElement, this);

        this._linkNodes = [];
        this._contentNodes = [];
        this._terminalNodes = [];
        this._subTreeNodes = [];
        this._accordionGroups = {};
        this._lastNode = null;
        this._appearStatus = AppearStatus.NONE;
        this.disappearRouteNode = null;
        this.appearAnimationFunc = null;
        this._nodeCount = 0;
        this._disappearedNodeCount = 0;
    }

    public get id(): string
    {
        return this._id;
    }

    public get headerNode(): HeaderNode
    {
        return this._headerNode;
    }

    public get connectionLine(): ConnectionLine
    {
        return this._connectionLine;
    }

    public get linkNodes(): LinkNode[]
    {
        return this._linkNodes;
    }

    public get contentNodes(): ContentNode[]
    {
        return this._contentNodes;
    }

    public get terminalNodes(): TerminalNode[]
    {
        return this._terminalNodes;
    }

    public get subTreeNodes(): SubTreeNode[]
    {
        return this._subTreeNodes;
    }

    public get accordionGroups(): { [key: string]: AccordionNodeGroup }
    {
        return this._accordionGroups;
    }

    public get lastNode(): LinkNode | ContentNode | TerminalNode | SubTreeNode | AccordionNode | AccordionTreeNode | null
    {
        return this._lastNode;
    }

    /**
     * ノードの読み込み
     */
    public loadNodes(nodeElements: NodeListOf<Element>, parentNode: MainNodeBase | null): void
    {
        this._lastNode = null;
        this._nodeCount = 0;
        this._disappearedNodeCount = 0;
        this.disappearRouteNode = null;
        nodeElements.forEach(nodeElement => {
            // link-nodeクラスがあればLinkNodeを作成
            if (nodeElement.classList.contains('link-node')) {
                this._linkNodes.push(new LinkNode(nodeElement as HTMLElement, parentNode, this));
                this._lastNode = this._linkNodes[this._linkNodes.length - 1];
                this._nodeCount++;
            }

            // content-nodeクラスがあればContentNodeを作成
            if (nodeElement.classList.contains('content-node')) {
                this._contentNodes.push(new ContentNode(nodeElement as HTMLElement, parentNode, this));
                this._lastNode = this._contentNodes[this._contentNodes.length - 1];
                this._nodeCount++;
            }

            // terminal-nodeクラスがあればTerminalNodeを作成
            if (nodeElement.classList.contains('terminal-node')) {
                this._terminalNodes.push(new TerminalNode(nodeElement as HTMLElement, parentNode, this));
                this._lastNode = this._terminalNodes[this._terminalNodes.length - 1];
                this._nodeCount++;
            }

            if (nodeElement.classList.contains('sub-tree-node')) {
                this._subTreeNodes.push(new SubTreeNode(nodeElement as HTMLElement, parentNode, this));
                this._lastNode = this._subTreeNodes[this._subTreeNodes.length - 1];
                this._nodeCount++;
            }

            if (nodeElement.classList.contains('accordion-node')) {
                const accordionNode = new AccordionNode(nodeElement as HTMLElement, parentNode, this);
                this.addAccordionNode(accordionNode);
                this._lastNode = accordionNode;
                this._nodeCount++;
            }

            if (nodeElement.classList.contains('accordion-tree-node')) {
                const accordionTreeNode = new AccordionTreeNode(nodeElement as HTMLElement, parentNode, this);
                this.addAccordionNode(accordionTreeNode);
                this._lastNode = accordionTreeNode;
                this._nodeCount++;
            }
        });
    }

    private addAccordionNode(accordionNode: AccordionNode | AccordionTreeNode): void
    {
        if (this._accordionGroups[accordionNode.groupId]) {
            this._accordionGroups[accordionNode.groupId].addNode(accordionNode);
        } else {
            const accordionGroup = new AccordionNodeGroup(this);
            accordionGroup.addNode(accordionNode);
            this._accordionGroups[accordionNode.groupId] = accordionGroup;
        }
    }

    public increaseDisappearedNodeCount(): void
    {
        this._disappearedNodeCount++;

        if (this._nodeCount === this._disappearedNodeCount) {
            this._appearStatus = AppearStatus.DISAPPEARED;
        }
    }

    /**
     * ノードの開放
     */
    public disposeNodes(): void
    {
        // LinkNodeの開放
        this._linkNodes.forEach(linkNode => {
            if (linkNode) {
                // イベントリスナーの削除（必要に応じて実装）
                // 現在の実装ではイベントリスナーはDOM要素に直接追加されているため、
                // ノードインスタンスを削除することで参照がクリアされる
            }
        });
        this._linkNodes = [];

        // ContentNodeの開放
        this._contentNodes.forEach(contentNode => {
            if (contentNode) {
                // イベントリスナーの削除（必要に応じて実装）
                // 現在の実装ではイベントリスナーはDOM要素に直接追加されているため、
                // ノードインスタンスを削除することで参照がクリアされる
            }
        });
        this._contentNodes = [];

        // TerminalNodeの開放
        this._terminalNodes.forEach(terminalNode => {
            if (terminalNode) {
                // イベントリスナーの削除（必要に応じて実装）
                // 現在の実装ではイベントリスナーはDOM要素に直接追加されているため、
                // ノードインスタンスを削除することで参照がクリアされる
            }
        });
        this._terminalNodes = [];

        // SubTreeNodeの開放
        this._subTreeNodes.forEach(subTreeNode => {
            if (subTreeNode) {
                // イベントリスナーの削除（必要に応じて実装）
                // 現在の実装ではイベントリスナーはDOM要素に直接追加されているため、
                // ノードインスタンスを削除することで参照がクリアされる
            }
        });
        this._subTreeNodes = [];

        // AccordionNodeの開放

        // AccordionNodeの開放
        // 各グループのノードをクリア
        Object.values(this._accordionGroups).forEach(accordionGroup => {
            // 必要に応じて個別のノードのクリーンアップ処理を追加
        });
        this._accordionGroups = {};

        // 最後のノード参照をクリア
        this._lastNode = null;
    }

    public resize(): void
    {
        this._headerNode.resize();
        this._linkNodes.forEach(linkNode => linkNode.resize());
        this._contentNodes.forEach(contentNode => contentNode.resize());
        this._terminalNodes.forEach(terminalNode => terminalNode.resize());
        this._subTreeNodes.forEach(subTreeNode => subTreeNode.resize());
        Object.values(this._accordionGroups).forEach(accordionGroup => accordionGroup.resize());

        if (this._connectionLine && this._lastNode && !this._connectionLine.isDisappeared()) {
            const headerPosition = this._headerNode.getConnectionPoint();
            this._connectionLine.setPosition(headerPosition.x, headerPosition.y);
            this._connectionLine.changeHeight(this._lastNode.getNodeElement().offsetTop - headerPosition.y + 2);
        }
    }

    public update(): void
    {
        this._headerNode.update();
        this._connectionLine.update();
        this._linkNodes.forEach(linkNode => linkNode.update());
        this._contentNodes.forEach(contentNode => contentNode.update());
        this._terminalNodes.forEach(terminalNode => terminalNode.update());
        this._subTreeNodes.forEach(subTreeNode => subTreeNode.update());
        Object.values(this._accordionGroups).forEach(accordionGroup => accordionGroup.update());

        if (this.appearAnimationFunc !== null) {
            this.appearAnimationFunc();
        }
    }

    public appear(isHeaderAppear: boolean = true): void
    {
        if (isHeaderAppear) {
            this._headerNode.appear();
        }

        if (this._lastNode) {
            const headerPosition = this._headerNode.getConnectionPoint();
            const conLineHeight = this._lastNode.getNodeElement().offsetTop - headerPosition.y + 2;
            this._connectionLine.changeHeight(conLineHeight);
            this._connectionLine.appear();
        }

        this._appearStatus = AppearStatus.APPEARING;
        this.appearAnimationFunc = this.appearAnimation;
    }

    /**
     * 出現アニメーション
     */
    public appearAnimation(): void
    {
        const conLineHeight = this._connectionLine.getAnimationHeight();
        
        this._linkNodes.forEach(linkNode => {
            const linkNodeTop = linkNode.getNodeElement().offsetTop - this._headerNode.getConnectionPoint().y;
            
            if (linkNodeTop <= conLineHeight) {
                linkNode.appear();
            }
        });

        this._contentNodes.forEach(contentNode => {
            const contentNodeTop = contentNode.getNodeElement().offsetTop - this._headerNode.getConnectionPoint().y;
        
            if (contentNodeTop <= conLineHeight) {
                contentNode.appear();
            }
        });

        this._terminalNodes.forEach(terminalNode => {
            const terminalNodeTop = terminalNode.getNodeElement().offsetTop - this._headerNode.getConnectionPoint().y;
            
            if (terminalNodeTop <= conLineHeight) {
                terminalNode.appear();
            }
        });

        this._subTreeNodes.forEach(subTreeNode => {
            const subTreeNodeTop = subTreeNode.getNodeElement().offsetTop - this._headerNode.getConnectionPoint().y;
            
            if (subTreeNodeTop <= conLineHeight) {
                subTreeNode.appear();
            }
        });

        Object.values(this._accordionGroups).forEach(accordionGroup => accordionGroup.appear(conLineHeight, this._headerNode.getConnectionPoint().y));

        if (this.connectionLine.isAppeared()) {
            this.appearAnimationFunc = null;
        }
    }

    public disappear(isHeaderDisappear: boolean = true): void
    {
        if (isHeaderDisappear) {
            this._headerNode.disappear();
        }

        this._linkNodes.forEach(linkNode => linkNode.disappear());
        this._contentNodes.forEach(contentNode => contentNode.disappear());
        this._terminalNodes.forEach(terminalNode => terminalNode.disappear());
        this._subTreeNodes.forEach(subTreeNode => subTreeNode.disappear());
        Object.values(this._accordionGroups).forEach(accordionGroup => accordionGroup.disappear());

        this._appearStatus = AppearStatus.DISAPPEARING;
    }

    public disappearAnimation(): void
    {

    }

    public disappearConnectionLine(force0: boolean = false, isFadeOut: boolean = false): void
    {
        if (!this._connectionLine.isDisappeared()) {
            if (!force0 && this.disappearRouteNode) {
                const top = this.disappearRouteNode.getNodeElement().offsetTop;
                this.connectionLine.disappear(top, isFadeOut);   
            } else {
                this.connectionLine.disappear(0, isFadeOut);
            }
        }
    }

    public draw(): void
    {
        this._headerNode.draw();
        this._linkNodes.forEach(linkNode => linkNode.draw());
        this._contentNodes.forEach(contentNode => contentNode.draw());
        this._terminalNodes.forEach(terminalNode => terminalNode.draw());
        this._subTreeNodes.forEach(subTreeNode => subTreeNode.draw());
        Object.values(this._accordionGroups).forEach(accordionGroup => accordionGroup.draw());
    }

    public getContentNodeByAnchorId(anchorId: string): ContentNode | null
    {
        for (const contentNode of this.contentNodes) {
            if (contentNode.getAnchorId() === anchorId) {
                return contentNode;
            }
        }
        return null;
    }

    public isDisappeared(): boolean
    {
        return this._appearStatus === AppearStatus.DISAPPEARED;
    }
}