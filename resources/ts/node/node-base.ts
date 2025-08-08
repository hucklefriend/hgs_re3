export abstract class NodeBase
{
    private _id: string;
    protected _nodeElement: HTMLElement;
    protected _isDraw: boolean;
    
    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement)
    {
        this._id = nodeElement.id;
        this._nodeElement = nodeElement;
        this._isDraw = false;
    }

    /**
     * ノードのIDを取得する
     */
    public get id(): string
    {
        return this._id;
    }

    public get element(): HTMLElement
    {
        return this._nodeElement;
    }

    /**
     * ノードの要素を取得する
     */
    public getNodeElement(): HTMLElement
    {
        return this._nodeElement;
    }

    /**
     * 次のアニメーションフレームで描画を行う
     */
    public setDraw(): void
    {
        this._isDraw = true;
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

    /**
     * 接続点を取得する
     */
    protected abstract getConnectionPoint(): {x: number, y: number};
} 