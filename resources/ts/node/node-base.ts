export abstract class NodeBase
{
    private _id: string;
    protected nodeElement: HTMLElement;
    protected isDraw: boolean;
    
    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        this._id = nodeElement.id;
        this.nodeElement = nodeElement;
        this.isDraw = false;
    }

    public get id(): string
    {
        return this._id;
    }

    public getNodeElement(): HTMLElement
    {
        return this.nodeElement;
    }

    /**
     * 次のアニメーションフレームで描画を行う
     */
    public setDraw(): void
    {
        this.isDraw = true;
    }

    /**
     * 開始処理
     */
    public start(): void
    {
    }

    /**
     * リサイズ処理
     */
    public resize(): void
    {
    }

    /**
     * 更新処理
     */
    public update(): void
    {
    }

    /**
     * 出現アニメーション開始
     */
    public appear(): void
    {
    }

    /**
     * 消滅アニメーション開始
     */
    public disappear(): void
    {
    }

    /**
     * 描画処理
     */
    public draw(): void
    {
    }

    protected abstract getConnectionPoint(): {x: number, y: number};
} 