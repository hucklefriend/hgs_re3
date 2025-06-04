import { MainNodeBase } from "./main-node-base";
import { NodePoint } from "./parts/node-point";

export class LinkNode extends MainNodeBase
{
    private point: NodePoint;
    private anchor: HTMLAnchorElement;
    private updateGradientEndAlphaFunc: (() => void) | null;

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this.point = new NodePoint(nodeElement.querySelector('.node-head .node-pt') as HTMLSpanElement);
        this.anchor = nodeElement.querySelector('.node-head .network-link') as HTMLAnchorElement;
        this.updateGradientEndAlphaFunc = null;

        // ホバーイベントの設定
        this.anchor.addEventListener('mouseenter', () => this.hover());
        this.anchor.addEventListener('mouseleave', () => this.unhover());
    }

    /**
     * ホバー開始時のグラデーションα値を更新
     */
    private updateGradientEndAlphaOnHover(): void
    {
        this.gradientEndAlpha = this.getAnimationValue(0.3, 1.0, 300);
        this.maxSubEndOpacity = this.getAnimationValue(0.5, 0.7, 200);
        this.minSubEndOpacity = this.getAnimationValue(0.1, 0.5, 200);
        if (this.gradientEndAlpha >= 1.0) {
            this.gradientEndAlpha = 1.0;
            this.updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    /**
     * ホバー終了時のグラデーションα値を更新
     */
    private updateGradientEndAlphaOnUnhover(): void
    {
        this.gradientEndAlpha = this.getAnimationValue(1.0, 0.3, 300);
        this.maxSubEndOpacity = this.getAnimationValue(0.7, 0.5, 200);
        this.minSubEndOpacity = this.getAnimationValue(0.5, 0.1, 200);
        if (this.gradientEndAlpha <= 0.3) {
            this.gradientEndAlpha = 0.3;
            this.updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        super.update();

        if (this.updateGradientEndAlphaFunc !== null) {
            this.updateGradientEndAlphaFunc();
        }
    }

    /**
     * ホバー時の処理
     */
    private hover(): void
    {
        this.subNodeContainer.classList.add('hover');
        this.animationStartTime = (window as any).hgn.timestamp;
        this.updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
    }

    /**
     * ホバー解除時の処理
     */
    private unhover(): void
    {
        this.subNodeContainer.classList.remove('hover');
        this.animationStartTime = (window as any).hgn.timestamp;
        this.updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
    }

    /**
     * 接続点を取得する
     * @returns 接続点の座標
     */
    public getConnectionPoint(): {x: number, y: number}
    {
        return this.point.getCenterPosition();
    }
} 
