import { HorrorGameNetwork } from "../horror-game-network";
import { MainNodeBase } from "./main-node-base";
import { NodePoint } from "./parts/node-point";
import { AppearStatus } from "../enum/appear-status";
import { TreeView } from "../tree-view";
import { FreePoint } from "../common/free-point";
import { Tree } from "../common/tree";

export class LinkNode extends MainNodeBase
{
    private _point: NodePoint;
    private _anchor: HTMLAnchorElement;

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement, parentTree: Tree)
    {
        super(nodeElement, parentTree);

        this._point = new NodePoint(nodeElement.querySelector('.node-head .node-pt') as HTMLSpanElement);
        this._anchor = nodeElement.querySelector('.node-head .network-link') as HTMLAnchorElement;

        // ホバーイベントの設定
        this._anchor.addEventListener('mouseenter', () => this.hover());
        this._anchor.addEventListener('mouseleave', () => this.unhover());
        // クリックイベントの設定
        this._anchor.addEventListener('click', (e) => this.click(e));
    }

    public getAnchorId(): string
    {
        return this._anchor.id;
    }

    /**
     * ホバー開始時のグラデーションα値を更新
     */
    private updateGradientEndAlphaOnHover(): void
    {
        this._gradientEndAlpha = this.getAnimationValue(0.3, 1.0, 300);
        this._maxBehindEndOpacity = this.getAnimationValue(0.3, 0.5, 200);
        this._minBehindEndOpacity = this.getAnimationValue(0.1, 0.2, 200);
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
        this._maxBehindEndOpacity = this.getAnimationValue(0.5, 0.3, 200);
        this._minBehindEndOpacity = this.getAnimationValue(0.2, 0.1, 200);
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

        if (this._updateGradientEndAlphaFunc !== null) {
            this._updateGradientEndAlphaFunc();
        }
    }

    protected isHover(): boolean
    {
        return this._appearStatus === AppearStatus.APPEARED && this._anchor.classList.contains('hover');
    }

    /**
     * ホバー時の処理
     */
    protected hover(): void
    {
        if (this._appearStatus !== AppearStatus.APPEARED) {
            return;
        }
        this._anchor.classList.add('hover');
        this._behindNodeContainer.classList.add('hover');
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
        super.terminalNodeHover();
    }

    /**
     * ホバー解除時の処理
     */
    protected unhover(): void
    {
        if (this._appearStatus !== AppearStatus.APPEARED) {
            return;
        }
        this._anchor.classList.remove('hover');
        this._behindNodeContainer.classList.remove('hover');
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
        super.terminalNodeUnhover();
    }

    /**
     * クリック時の処理
     * @param e クリックイベント
     */
    private click(e: MouseEvent): void
    {
        e.preventDefault();

        if (this._appearStatus !== AppearStatus.APPEARED) {
            return;
        }

        const treeView = (window as any).hgn.treeView as TreeView;
        treeView.moveTree(this._anchor.href, this, false);
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
        return this._point.getAbsoluteCenterPosition();
    }

    public disappear(): void
    {
        if (!this.isSelectedDisappear) {
            super.disappear();
        } else {
            const hgn = (window as any).hgn as HorrorGameNetwork;
            const freePt = hgn.treeView.freePt as FreePoint;
            const connectionPoint = this.getConnectionPoint();
            this._updateGradientEndAlphaFunc = null;
    
            const pos = this.getQuadraticBezierPoint(
                0, 0,
                0, connectionPoint.y,
                connectionPoint.x - freePt.clientWidth / 2, connectionPoint.y,
                1
            );
    
            const rect = this._nodeElement.getBoundingClientRect();
            const x = rect.left + window.scrollX - hgn.main.offsetLeft;
            const y = rect.top + window.scrollY;

            freePt.setPos(x, y - freePt.clientHeight / 2);
            freePt.moveOffset(pos.x, pos.y);
            freePt.show();
            
            this.disappearBehind();

            this._animationStartTime = hgn.timestamp;
            this._appearStatus = AppearStatus.DISAPPEARING;
            this._gradientEndAlpha = 0;
            this._point.element.style.visibility = 'hidden';
            this._nodeHead.classList.add('invisible');
            this._isDraw = true;
    
            this._appearAnimationFunc = this.selectedDisappearAnimation;
        }
    }

    /**
     * 消滾アニメーション
     */
    protected selectedDisappearAnimation(): void
    {
        const connectionPoint = this.getConnectionPoint();

        const hgn = (window as any).hgn as HorrorGameNetwork;
        const treeView = hgn.treeView as TreeView as TreeView;
        const freePt = hgn.treeView.freePt as FreePoint;

        this._curveAppearProgress = 1 - this.getAnimationProgress(200);
        if (this._curveAppearProgress <= 0) {
            this._curveAppearProgress = 0;
            this._gradientEndAlpha = 0;
            this._appearAnimationFunc = this.disappearAnimation2;

            this._animationStartTime = hgn.timestamp;
        } else {
            this.drawCurvedLine(
                15,
                0,
                connectionPoint.x,
                connectionPoint.y
            );
        }

        const pos = this.getQuadraticBezierPoint(
            0, 0,
            0, connectionPoint.y,
            connectionPoint.x - freePt.clientWidth / 2, connectionPoint.y,
            this._curveAppearProgress
        );

        freePt.moveOffset(pos.x, pos.y);
        
        this._isDraw = true;
    }

    public disappearAnimation2(): void
    {
        const hgn = (window as any).hgn as HorrorGameNetwork;
        const treeView = hgn.treeView as TreeView as TreeView;
        const freePt = hgn.treeView.freePt as FreePoint;
        freePt.fixOffset();
        treeView.disappear2();
        this._appearAnimationFunc = null;
    }

    protected terminalNodeHover(): void
    {
        this.hover();
    }
    
    protected terminalNodeUnhover(): void
    {
        this.unhover();
    }
} 
