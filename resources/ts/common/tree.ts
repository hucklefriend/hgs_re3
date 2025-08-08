import { ConnectionLine } from "./connection-line";
import { HeaderNode } from "../node/header-node";
import { LinkNode } from "../node/link-node";
import { ContentNode } from "../node/content-node";
import { TerminalNode } from "../node/terminal-node";
import { SubTreeNode } from "../node/sub-tree-node";
import { AppearStatus } from "../enum/appear-status";

export class Tree
{
    protected _connectionLine: ConnectionLine;
    protected _headerNode: HeaderNode;
    protected _linkNodes: LinkNode[];
    protected _contentNodes: ContentNode[];
    protected _terminalNodes: TerminalNode[];
    protected _subTreeNodes: SubTreeNode[];
    protected _lastNode: LinkNode | ContentNode | TerminalNode | SubTreeNode | null;
    protected _appearStatus: AppearStatus;

    public constructor(headerNodeElement: HTMLElement, connectionLineElement: HTMLDivElement)
    {
        this._connectionLine = new ConnectionLine(connectionLineElement);
        this._headerNode = new HeaderNode(headerNodeElement);

        this._linkNodes = [];
        this._contentNodes = [];
        this._terminalNodes = [];
        this._subTreeNodes = [];
        this._lastNode = null;
        this._appearStatus = AppearStatus.NONE;
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

    public get lastNode(): LinkNode | ContentNode | TerminalNode | SubTreeNode | null
    {
        return this._lastNode;
    }

    /**
     * ノードの読み込み
     */
    public loadNodes(nodeElements: NodeListOf<Element>): void
    {
        this._lastNode = null;
        nodeElements.forEach(nodeElement => {
            // link-nodeクラスがあればLinkNodeを作成
            if (nodeElement.classList.contains('link-node')) {
                this._linkNodes.push(new LinkNode(nodeElement as HTMLElement));
                this._lastNode = this._linkNodes[this._linkNodes.length - 1];
            }

            // content-nodeクラスがあればContentNodeを作成
            if (nodeElement.classList.contains('content-node')) {
                this._contentNodes.push(new ContentNode(nodeElement as HTMLElement));
                this._lastNode = this._contentNodes[this._contentNodes.length - 1];
            }

            // terminal-nodeクラスがあればTerminalNodeを作成
            if (nodeElement.classList.contains('terminal-node')) {
                this._terminalNodes.push(new TerminalNode(nodeElement as HTMLElement));
                this._lastNode = this._terminalNodes[this._terminalNodes.length - 1];
            }

            if (nodeElement.classList.contains('sub-tree-node')) {
                this._subTreeNodes.push(new SubTreeNode(nodeElement as HTMLElement));
                this._lastNode = this._subTreeNodes[this._subTreeNodes.length - 1];
            }
        });
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

        if (this._connectionLine && this._lastNode) {
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
    }

    public appear(): void
    {
        this._headerNode.appear();

        if (this._lastNode) {
            const headerPosition = this._headerNode.getConnectionPoint();
            this._connectionLine.changeHeight(this._lastNode.getNodeElement().offsetTop - headerPosition.y + 2);
            this._connectionLine.appear();
        }

        this._appearStatus = AppearStatus.APPEARING;
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
    }

    public disappear(selectedLinkNode: LinkNode | null): void
    {
        this._headerNode.disappear();
        this._linkNodes.forEach(linkNode => {
            if (selectedLinkNode && linkNode.id !== selectedLinkNode.id) {
                linkNode.disappear();
            } else {
                linkNode.selectedDisappear();
            }
        });
        this._contentNodes.forEach(contentNode => contentNode.disappear());
        this._terminalNodes.forEach(terminalNode => terminalNode.disappear());
        this._subTreeNodes.forEach(subTreeNode => subTreeNode.disappear());

        this._appearStatus = AppearStatus.DISAPPEARING;
    }

    public disappearConnectionLine(): void
    {
        if (this._connectionLine.isAppeared()) {
            if (this._lastNode) {
                const headerPosition = this._headerNode.getConnectionPoint();
                const disappearHeight = this._lastNode.getNodeElement().offsetTop - headerPosition.y + 2;
                this._connectionLine.disappear(disappearHeight);
            } else {
                this._connectionLine.disappear(0);
            }
            this._headerNode.disappear();
        }
    }

    public draw(): void
    {
        this._headerNode.draw();
        this._linkNodes.forEach(linkNode => linkNode.draw());
        this._contentNodes.forEach(contentNode => contentNode.draw());
        this._terminalNodes.forEach(terminalNode => terminalNode.draw());
        this._subTreeNodes.forEach(subTreeNode => subTreeNode.draw());
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
}