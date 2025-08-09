import { MainNodeBase } from "./main-node-base";
import { AppearStatus } from "../enum/appear-status";
import { NodePoint } from "./parts/node-point";
import { Tree } from "../common/tree";

export class SubTreeNode extends MainNodeBase
{
    private _tree: Tree;

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this._tree = new Tree(
            nodeElement.querySelector('.header-node') as HTMLElement,
            nodeElement.querySelector('.connection-line') as HTMLDivElement
        );

        this._tree.loadNodes(nodeElement.querySelectorAll('.sub-tree-node-container section.node'));
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

    public resize(): void
    {
        super.resize();
        this._tree.resize();
    }

    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        super.update();

        this._tree.update();
    }

    

    protected isHover(): boolean
    {
        return this._appearStatus === AppearStatus.APPEARED;
    }

    /**
     * ホバー時の処理
     */
    private hover(): void
    {
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
        super.terminalNodeHover();
    }

    /**
     * ホバー解除時の処理
     */
    private unhover(): void
    {
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

    public appearAnimation(): void
    {
        super.appearAnimation();

        if (this._curveAppearProgress === 1) {
            this._tree.appear();
            this._gradientEndAlpha = 1;
            this._appearAnimationFunc = this.appearAnimation2;
        }
    }
    

    /**
     * 出現アニメーション
     */
    private appearAnimation2(): void
    {
        this._tree.appearAnimation();

        if (this._tree.connectionLine.isAppeared()) {
            this._appearAnimationFunc = null;
        }
    }
    

    /**
     * サブノードの出現アニメーション
     */
    protected appearSubNodesAnimation(): void
    {
        
    }

    public draw(): void
    {
        super.draw();
        this._tree.draw();
    }
    
    /**
     * 接続点を取得する
     * @returns 接続点の座標
     */
    public getConnectionPoint(): {x: number, y: number}
    {
        let connectionPoint = this._tree.headerNode.getConnectionPoint();
        //connectionPoint.x += this._tree.headerNode.element.offsetLeft;
        return connectionPoint;
    }
}
