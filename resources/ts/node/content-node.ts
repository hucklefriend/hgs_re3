import { MainNodeBase } from "./main-node-base";

export class ContentNode extends MainNodeBase
{
    private anchor: HTMLAnchorElement;
    private updateGradientEndAlphaFunc: (() => void) | null;

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this.anchor = nodeElement.querySelector('.content-link') as HTMLAnchorElement;
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
        this.animationStartTime = (window as any).hgn.timestamp;
        this.updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
    }

    /**
     * ホバー解除時の処理
     */
    private unhover(): void
    {
        this.animationStartTime = (window as any).hgn.timestamp;
        this.updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
    }

    /**
     * 接続点を取得する
     * @returns 接続点の座標
     */
    public getConnectionPoint(): {x: number, y: number}
    {
        return {
            x: this.anchor.offsetLeft,
            y: this.anchor.offsetTop + this.anchor.offsetHeight / 2
        };
    }
}
