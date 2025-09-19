import { Point } from "../../common/point";
import { ConnectionLine } from "./connection-line";
import { LinkNode } from "../link-node";
import { AppearStatus } from "../../enum/appear-status";
import { NodeType } from "../../common/type";
import { NodeContent } from "./node-content";
import { ChildTreeNode } from "../child-tree-node";
import { TreeNodeInterface } from "../interface/tree-node-interface";

export class NodeContentTree extends NodeContent
{
    protected _parentNode: NodeType;
    protected _nodes: NodeType[];
    protected _connectionLine: ConnectionLine;
    protected _connectionLineFadeOut: ConnectionLine;

    protected _appearStatus: AppearStatus;
    public homewardNode: NodeType | null;
    public appearAnimationFunc: (() => void) | null;
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

        const connectionLineFadeOutElement = ConnectionLine.createElement();
        nodeElement.parentNode?.append(connectionLineFadeOutElement);
        this._connectionLineFadeOut = new ConnectionLine(connectionLineFadeOutElement);

        this._nodes = [];

        this._appearStatus = AppearStatus.DISAPPEARED;
        this.homewardNode = null;
        this.appearAnimationFunc = null;
        this._nodeCount = 0;
        this._appearedNodeCount = 0;
    }

    /**
     * ノードの読み込み
     */
    public loadNodes(parentNode: TreeNodeInterface): void
    {
        this._nodeCount = 0;
        this._appearedNodeCount = 0;
        this.homewardNode = null;
        this._contentElement.querySelectorAll(':scope > section.node').forEach(nodeElement => {
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
        this._nodes.forEach(node => node.dispose());
        this._nodes = [];
    }

    public resizeConnectionLine(headerPosition: Point): void
    {
        if (this._connectionLine && !AppearStatus.isDisappeared(this._connectionLine.appearStatus)) {
            this._connectionLine.setPosition(headerPosition.x - 1, headerPosition.y);
            this._connectionLine.changeHeight(this.lastNode.nodeElement.offsetTop - headerPosition.y + 2);
        }
    }


    public update(): void
    {
        this._connectionLine.update();
        this._nodes.forEach(node => node.update());

        if (this.appearAnimationFunc !== null) {
            this.appearAnimationFunc();
        }
    }

    public appear(): void
    {
        const headerPosition = this._parentNode.nodeHead.getConnectionPoint();
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
    public appearAnimation(): void
    {
        const headerPosition = this._parentNode.nodeHead.getConnectionPoint();
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

    public appearAnimation2(): void
    {
        if (this.lastNode.appearStatus === AppearStatus.APPEARED) {
            this._appearStatus = AppearStatus.APPEARED;
            this.appearAnimationFunc = null;
        }
    }

    public disappear(): void
    {
        this._nodes.forEach(node => node.disappear());

        if (this.homewardNode) {
            const headerPosition = this._parentNode.nodeHead.getConnectionPoint();
            const height = this.homewardNode.nodeElement.offsetTop - headerPosition.y + 2;
            const orgHeight = this._connectionLine.height;
            this._connectionLine.changeHeight(height);
            this._connectionLineFadeOut.setPosition(headerPosition.x - 1, headerPosition.y + height);
            this._connectionLineFadeOut.changeHeight(orgHeight - height);
            this._connectionLineFadeOut.visible();
            this._connectionLineFadeOut.disappearFadeOut();
        } else {
            this._connectionLine.disappearFadeOut();
        }

        this._appearStatus = AppearStatus.DISAPPEARING;
    }

    public disappearAnimation(): void
    {

    }

    public disappearConnectionLine(withFreePt: boolean = false): void
    {
        if (!AppearStatus.isDisappeared(this._connectionLine.appearStatus)) {
            this.connectionLine.disappear(0, withFreePt);
        }
    }

    public draw(): void
    {
        this._nodes.forEach(node => node.draw());
    }
}