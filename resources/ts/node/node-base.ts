import { NodeHead } from "./parts/node-head";
import { NodeContentType } from "../common/type";
import { NodeContent } from "./parts/node-content";
import { AppearStatus } from "../enum/appear-status";
import { NodeHeadType } from "../common/type";

export abstract class NodeBase
{
    private _id: string;

    protected _nodeElement: HTMLElement;
    protected _nodeHead: NodeHeadType;
    protected _nodeContents: { [key: string]: NodeContentType };
    protected _appearStatus: AppearStatus;
    protected _appearAnimationFunc: (() => void) | null;
    protected _treeContentElement: HTMLElement | null;
    protected _behindContentElement: HTMLElement | null;
    protected _isDraw: boolean;

    /**
     * ノードのIDを取得する
     */
    public get id(): string
    {
        return this._id;
    }

    /**
     * ノードのHTML要素を取得する
     */
    public get nodeElement(): HTMLElement
    {
        return this._nodeElement;
    }

    /**
     * ノードのヘッダを取得する
     */
    public get nodeHead(): NodeHead
    {
        return this._nodeHead;
    }

    /**
     * ノードの出現状態を取得する
     */
    public get appearStatus(): AppearStatus
    {
        return this._appearStatus;
    }
    
    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        this._id = nodeElement.id;

        this._nodeElement = nodeElement;
        this._treeContentElement = null;
        this._behindContentElement = null;
        this._nodeHead = this.loadHead();
        this._nodeContents = this.loadContents();

        this._appearStatus = AppearStatus.DISAPPEARED;
        this._appearAnimationFunc = null;
        this._isDraw = false;
    }

    /**
     * ノードのヘッダを読み込む
     * 
     * @returns 
     */
    protected loadHead(): NodeHeadType
    {
        const nodeHead = this._nodeElement.querySelector(':scope > .node-head') as HTMLElement;
        return new NodeHead(nodeHead);
    }

    /**
     * ノードのコンテンツを読み込む
     * 
     * @returns 
     */
    private loadContents(): { [key: string]: NodeContentType }
    {
        const nodeContents: { [key: string]: NodeContentType } = {};
        const contentElements = this._nodeElement.querySelectorAll(':scope > .node-content');
        contentElements.forEach(contentElement => {
            if (contentElement.classList.contains('tree')) {
                // 循環参照を起こしてしまうので、TreeコンテンツはHTMLのみ保持する
                // Treeは1つしか持たない、2つ目以降は無視する
                if (this._treeContentElement === null) {
                    this._treeContentElement = contentElement as HTMLElement;
                } else {
                    // 2つ目以降は削除する
                    contentElement.remove();
                }
            } else if (contentElement.classList.contains('behind')) {
                // 循環参照を起こしてしまうので、BehindコンテンツはHTMLのみ保持する
                // Behindも1つしか持たない、2つ目以降は無視する
                if (this._behindContentElement === null) {
                    this._behindContentElement = contentElement as HTMLElement;
                } else {
                    // 2つ目以降は削除する
                    contentElement.remove();
                }
            } else {
                nodeContents[contentElement.id] = new NodeContent(contentElement as HTMLElement);
            }
        });
        return nodeContents;
    }

    public dispose(): void
    {
        
    }

    /**
     * ノードのコンテンツをIDから取得する
     * 
     * @param id コンテンツのID
     * @returns コンテンツ
     */
    public getContentById(id: string): NodeContentType | undefined
    {
        return this._nodeContents[id];
    }

    /**
     * 次のアニメーションフレームで描画を行う
     */
    public setDraw(): void
    {
        this._isDraw = true;
    }

    /**
     * リサイズ処理
     */
    public resize(): void
    {
        Object.values(this._nodeContents).forEach(content => content?.resize());
    }

    /**
     * 更新処理
     */
    public update(): void
    {
        Object.values(this._nodeContents).forEach(content => content?.update());
    }

    /**
     * 出現アニメーション開始
     */
    public appearContents(): void
    {
        Object.values(this._nodeContents).forEach(content => content?.appear());
    }

    /**
     * 消滅アニメーション開始
     */
    public disappearContents(): void
    {
        Object.values(this._nodeContents).forEach(content => content?.disappear());
    }

    /**
     * 描画処理
     */
    public draw(): void
    {
        
    }
} 
