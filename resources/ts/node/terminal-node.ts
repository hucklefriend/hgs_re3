import { MainNodeBase } from "./main-node-base";
import { AppearStatus } from "../enum/appear-status";
import { Util } from "../common/util";
import { NodePoint } from "./parts/node-point";
import { Tree } from "../common/tree";

export class TerminalNode extends MainNodeBase
{
    private _point: NodePoint;
    private _title: HTMLSpanElement;

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement, parentNode: MainNodeBase | null, parentTree: Tree)
    {
        super(nodeElement, parentNode, parentTree);

        this._point = new NodePoint(nodeElement.querySelector('.node-head .node-pt') as HTMLSpanElement);
        this._title = nodeElement.querySelector('.terminal-title') as HTMLSpanElement;
        
        // デバッグ用：ターミナルノードコンテナが存在するか確認
        const terminalContainer = nodeElement.querySelector('.terminal-node-container');
        if (terminalContainer) {
            console.log('TerminalNode: terminal-node-container found');
            // 追加のイベントリスナーを設定
            terminalContainer.addEventListener('mouseenter', () => {
                console.log('TerminalNode: mouseenter event fired');
                this.terminalNodeHover();
            });
            terminalContainer.addEventListener('mouseleave', () => {
                console.log('TerminalNode: mouseleave event fired');
                this.terminalNodeUnhover();
            });
        } else {
            console.log('TerminalNode: terminal-node-container not found');
        }
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
    protected hover(): void
    {
        this._title.classList.add('hover');
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
        super.terminalNodeHover();
    }

    /**
     * ホバー解除時の処理
     */
    protected unhover(): void
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

    /**
     * HTML上の絶対座標で接続点を取得する
     * @returns 絶対座標の接続点
     */
    public getAbsoluteConnectionPoint(): {x: number, y: number}
    {
        const rect = this._point.element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }
}
