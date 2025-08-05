import { MainNodeBase } from "./main-node-base";
import { AppearStatus } from "../enum/appear-status";
import { NodePoint } from "./parts/node-point";
import { Tree } from "../common/tree";

export class SubTreeNode extends MainNodeBase
{
    private _point: NodePoint;
    private _title: HTMLSpanElement;
    private _tree: Tree;

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this._tree = new Tree(nodeElement);

        this._point = new NodePoint(nodeElement.querySelector('.node-head .node-pt') as HTMLSpanElement);
        this._title = nodeElement.querySelector('.terminal-title') as HTMLSpanElement;
    }

    public get title(): string
    {
        return this._title.innerHTML;
    }

    /**
     * ホバー開始時のグラデーションα値を更新
     */
    private updateGradientEndAlphaOnHover(): void
    {
        this._gradientEndAlpha = this.getAnimationValue(0.3, 1.0, 300);
        if (this._gradientEndAlpha >= 1.0) {
            this._gradientEndAlpha = 1.0;
            this._updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    /**
     * ホバー終了時のグラデーションα値を更新
     */
    private updateGradientEndAlphaOnUnhover(): void
    {
        this._gradientEndAlpha = this.getAnimationValue(1.0, 0.3, 300);
        if (this._gradientEndAlpha <= 0.3) {
            this._gradientEndAlpha = 0.3;
            this._updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        super.update();
    }

    protected isHover(): boolean
    {
        return this._appearStatus === AppearStatus.APPEARED && this._title.classList.contains('hover');
    }

    /**
     * ホバー時の処理
     */
    private hover(): void
    {
        this._title.classList.add('hover');
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
        super.terminalNodeHover();
    }

    /**
     * ホバー解除時の処理
     */
    private unhover(): void
    {
        this._title.classList.remove('hover');
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
        super.terminalNodeUnhover();
    }

    protected terminalNodeHover(): void
    {
        this.hover();
    }
    
    protected terminalNodeUnhover(): void
    {
        this.unhover();
    }
    
    /**
     * 接続点を取得する
     * @returns 接続点の座標
     */
    public getConnectionPoint(): {x: number, y: number}
    {
        return this._point.getCenterPosition();
    }
}
