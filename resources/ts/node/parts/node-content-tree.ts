import { Point } from "../../common/point";
import { ConnectionLine } from "./connection-line";
import { LinkNode } from "../link-node";
import { AppearStatus } from "../../enum/appear-status";
import { DisappearRouteNodeType, NodeType } from "../../common/type";
import { NodeContent } from "./node-content";
import { ChildTreeNode } from "../child-tree-node";

export class NodeContentTree extends NodeContent
{
    protected _parentNode: NodeType;
    protected _nodes: NodeType[];
    protected _connectionLine: ConnectionLine;

    protected _appearStatus: AppearStatus;
    public disappearRouteNode: DisappearRouteNodeType | null;
    public appearAnimationFunc: ((headerPosition: Point) => void) | null;
    protected _nodeCount: number;
    protected _appearedNodeCount: number;

    public get appearStatus(): AppearStatus
    {
        return this._appearStatus;
    }

    /**
     * 接続線を取得
     * 
     * @returns 接続線
     */
    public get connectionLine(): ConnectionLine
    {
        return this._connectionLine;
    }

    /**
     * コンストラクタ
     * 
     * @param nodeElement 
     */
    public constructor(nodeElement: HTMLElement, parentNode: NodeType)
    {
        super(nodeElement);

        this._parentNode = parentNode;

        const connectionLineElement = ConnectionLine.createElement();
        nodeElement.parentNode?.append(connectionLineElement);
        this._connectionLine = new ConnectionLine(connectionLineElement);

        this._nodes = [];

        this._appearStatus = AppearStatus.DISAPPEARED;
        this.disappearRouteNode = null;
        this.appearAnimationFunc = null;
        this._nodeCount = 0;
        this._appearedNodeCount = 0;
    }

    /**
     * ノードの読み込み
     */
    public loadNodes(parentNode: NodeType): void
    {
        this._nodeCount = 0;
        this._appearedNodeCount = 0;
        this.disappearRouteNode = null;
        this._htmlElement.querySelectorAll(':scope > section.node').forEach(nodeElement => {
            // link-nodeクラスがあればLinkNodeを作成
            if (nodeElement.classList.contains('link-node')) {
                this._nodes.push(new LinkNode(nodeElement as HTMLElement, parentNode));
                this._nodeCount++;
            } else if (nodeElement.classList.contains('tree-node')) {
                this._nodes.push(new ChildTreeNode(nodeElement as HTMLElement, parentNode));
                this._nodeCount++;
            } else {
                // どれにも当てはまらないものはベーシックノード
                this._nodes.push(new LinkNode(nodeElement as HTMLElement, parentNode));
                this._nodeCount++;
            }

            /*
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

            if (nodeElement.classList.contains('child-tree-node')) {
                this._childTreeNodes.push(new ChildTreeNode(nodeElement as HTMLElement, parentNode, this));
                this._lastNode = this._childTreeNodes[this._childTreeNodes.length - 1];
                this._nodeCount++;
            }

            if (nodeElement.classList.contains('child-tree-link-node')) {
                this._childTreeNodes.push(new ChildTreeLinkNode(nodeElement as HTMLElement, parentNode, this));
                this._lastNode = this._childTreeNodes[this._childTreeNodes.length - 1];
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
            }*/
        });
    }

    public get lastNode(): NodeType
    {
        return this._nodes[this._nodes.length - 1];
    }

    public increaseAppearedNodeCount(): void
    {
        this._appearedNodeCount++;

        if (this._appearedNodeCount === this._nodeCount) {
            this._appearStatus = AppearStatus.APPEARED;
        }
    }

    public increaseDisappearedNodeCount(): void
    {
        this._appearedNodeCount--;

        if (this._appearedNodeCount === 0) {
            this._appearStatus = AppearStatus.DISAPPEARED;
        }
    }

    /**
     * ノードの開放
     */
    public disposeNodes(): void
    {
        // LinkNodeの開放
        this._nodes.forEach(node => {
            if (node) {
                node.dispose();
            }
        });
        this._nodes = [];
    }

    public resizeConnectionLine(headerPosition: Point): void
    {
        if (this._connectionLine && !AppearStatus.isDisappeared(this._connectionLine.appearStatus)) {
            this._connectionLine.setPosition(headerPosition.x - 1, headerPosition.y);
            this._connectionLine.changeHeight(this.lastNode.nodeElement.offsetTop - headerPosition.y + 2);
        }
    }


    public update(headerPosition: Point): void
    {
        this._connectionLine.update();
        this._nodes.forEach(node => node.update());

        if (this.appearAnimationFunc !== null) {
            this.appearAnimationFunc(headerPosition);
        }
    }

    public appear(headerPosition: Point): void
    {
        this._connectionLine.setPosition(headerPosition.x - 1, headerPosition.y);
        const conLineHeight = this.lastNode.nodeElement.offsetTop - headerPosition.y + 2;
        this._connectionLine.changeHeight(conLineHeight);
        this._connectionLine.appear();

        this._appearStatus = AppearStatus.APPEARING;
        this.appearAnimationFunc = this.appearAnimation;
    }

    /**
     * 出現アニメーション
     */
    public appearAnimation(headerPosition: Point): void
    {
        const conLineHeight = this._connectionLine.getAnimationHeight();
        
        this._nodes.forEach(node => {
            const top = node.nodeElement.offsetTop - headerPosition.y;
            if (top <= conLineHeight) {
                node.appear();
            }
        });

        if (AppearStatus.isAppeared(this._connectionLine.appearStatus)) {
            this.appearAnimationFunc = this.appearAnimation2;
        }
    }

    public appearAnimation2(headerPosition: Point): void
    {
        if (this.lastNode.appearStatus === AppearStatus.APPEARED) {
            this._appearStatus = AppearStatus.APPEARED;
            this.appearAnimationFunc = null;
        }
    }

    public disappear(): void
    {
        this._nodes.forEach(node => node.disappear());

        this._appearStatus = AppearStatus.DISAPPEARING;
    }

    public disappearAnimation(): void
    {

    }

    public disappearConnectionLine(force0: boolean = false, isFadeOut: boolean = false): void
    {
        if (!AppearStatus.isDisappeared(this._connectionLine.appearStatus)) {
            if (!force0 && this.disappearRouteNode) {
                const top = this.disappearRouteNode.nodeElement.offsetTop;
                this.connectionLine.disappear(top, isFadeOut);   
            } else {
                this.connectionLine.disappear(0, isFadeOut);
            }
        }
    }

    public draw(): void
    {
        this._nodes.forEach(node => node.draw());
    }
}