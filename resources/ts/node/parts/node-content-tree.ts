import { Point } from "../../common/point";
import { ConnectionLine } from "./connection-line";
import { LinkNode } from "../link-node";
import { AppearStatus } from "../../enum/appear-status";
import { NodeType } from "../../common/type";
import { NodeContent } from "./node-content";
import { TreeNode } from "../tree-node";
import { TreeNodeInterface } from "../interface/tree-node-interface";
import { BasicNode } from "../basic-node";
import { AccordionTreeNode } from "../accordion-tree-node";

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
    }

    /**
     * ノードの読み込み
     */
    public loadNodes(parentNode: TreeNodeInterface): void
    {
        this._nodeCount = 0;
        this.homewardNode = null;
        this._contentElement.querySelectorAll(':scope > section.node').forEach(nodeElement => {
            // link-nodeクラスがあればLinkNodeを作成
            if (nodeElement.classList.contains('link-node')) {
                this._nodes.push(new LinkNode(nodeElement as HTMLElement, parentNode));
                this._nodeCount++;
            } else if (nodeElement.classList.contains('tree-node')) {
                if (nodeElement.classList.contains('accordion')) {
                    this._nodes.push(new AccordionTreeNode(nodeElement as HTMLElement, parentNode));
                } else {
                    this._nodes.push(new TreeNode(nodeElement as HTMLElement, parentNode));
                }
                this._nodeCount++;
            } else {
                // どれにも当てはまらないものはベーシックノード
                this._nodes.push(new BasicNode(nodeElement as HTMLElement, parentNode));
                this._nodeCount++;
            }
        });
    }

    public get lastNode(): NodeType
    {
        return this._nodes[this._nodes.length - 1];
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
            if (AppearStatus.isDisappeared(node.appearStatus)) {
                const top = node.nodeElement.offsetTop - headerPosition.y;
                if (top <= conLineHeight) {
                    node.appear();
                }
            }
        });

        if (AppearStatus.isAppeared(this._connectionLine.appearStatus)) {
            this.appearAnimationFunc = this.appearAnimation2;
        }
    }

    public appearAnimation2(): void
    {
        if (this.lastNode.appearStatus === AppearStatus.APPEARED) {
            this.appeared();
        }
    }

    public appeared(): void
    {
        this._appearStatus = AppearStatus.APPEARED;
        this.appearAnimationFunc = null;
    }

    public disappear(): void
    {
        if (this.homewardNode) {
            const headerPosition = this._parentNode.nodeHead.getConnectionPoint();
            const height = this.homewardNode.nodeElement.offsetTop - headerPosition.y + 2;
            const orgHeight = this._connectionLine.height;
            this._connectionLine.changeHeight(height);
            this._connectionLineFadeOut.setPosition(headerPosition.x - 1, headerPosition.y + height);
            this._connectionLineFadeOut.changeHeight(orgHeight - height);
            this._connectionLineFadeOut.visible();
            this._connectionLineFadeOut.disappearFadeOut();
            this.disappeareUnderLine(height, headerPosition);
            this.homewardNode.disappear();

            this._appearStatus = AppearStatus.DISAPPEARING;
            this.appearAnimationFunc = this.disappearAnimation;
        } else {
            this._connectionLine.disappearFadeOut();
            this._appearStatus = AppearStatus.DISAPPEARING;
            this.appearAnimationFunc = this.disappearAnimation2;
            this._nodes.forEach(node => node.disappear());
        }
    }

    private disappeareUnderLine(conLineHeight: number, headerPosition: Point): void
    {
        this._nodes.forEach(node => {
            if (AppearStatus.isAppeared(node.appearStatus)) {
                const top = node.nodeElement.offsetTop - headerPosition.y;
                if (top >= conLineHeight) {
                    node.disappear();
                }
            }
        });
    }

    /**
     * 消失アニメーション
     */
    public disappearAnimation(): void
    {
        if (AppearStatus.isDisappearing(this._connectionLine.appearStatus)) {
            const headerPosition = this._parentNode.nodeHead.getConnectionPoint();
            const conLineHeight = this._connectionLine.getAnimationHeight();
            this.disappeareUnderLine(conLineHeight - 100, headerPosition);
        }
        
        if (AppearStatus.isDisappeared(this._connectionLine.appearStatus)) {
            this.disappeared();
        }
    }

    public disappearAnimation2(): void
    {
        if (AppearStatus.isDisappeared(this._connectionLine.appearStatus)) {
            this.disappeared();
        }
    }

    public disappeared(): void
    {
        this._appearStatus = AppearStatus.DISAPPEARED;
        this.appearAnimationFunc = null;
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