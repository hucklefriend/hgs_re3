import { MainNodeBase } from "./main-node-base";
import { NodePoint } from "./parts/node-point";
import { AppearStatus } from "../enum/appear-status";

export class LinkNode extends MainNodeBase
{
    private _point: NodePoint;
    private _anchor: HTMLAnchorElement;

    private _freePtPos: {x: number, y: number};

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement)
    {
        super(nodeElement);

        this._point = new NodePoint(nodeElement.querySelector('.node-head .node-pt') as HTMLSpanElement);
        this._anchor = nodeElement.querySelector('.node-head .network-link') as HTMLAnchorElement;

        // ホバーイベントの設定
        this._anchor.addEventListener('mouseenter', () => this.hover());
        this._anchor.addEventListener('mouseleave', () => this.unhover());
        // クリックイベントの設定
        this._anchor.addEventListener('click', (e) => this.click(e));

        this._freePtPos = {x: 0, y: 0};
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
        this._maxSubEndOpacity = this.getAnimationValue(0.3, 0.5, 200);
        this._minSubEndOpacity = this.getAnimationValue(0.1, 0.2, 200);
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
        this._maxSubEndOpacity = this.getAnimationValue(0.5, 0.3, 200);
        this._minSubEndOpacity = this.getAnimationValue(0.2, 0.1, 200);
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
    private hover(): void
    {
        this._anchor.classList.add('hover');
        if (this._appearStatus !== AppearStatus.APPEARED) {
            return;
        }
        this._subNodeContainer.classList.add('hover');
        this._animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
        super.terminalNodeHover();
    }

    /**
     * ホバー解除時の処理
     */
    private unhover(): void
    {
        this._anchor.classList.remove('hover');
        if (this._appearStatus !== AppearStatus.APPEARED) {
            return;
        }
        this._subNodeContainer.classList.remove('hover');
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
        // デフォルトの動作を防ぐ
        e.preventDefault();

        const treeView = (window as any).hgn.treeView;
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

    public selectedDisappear(): void
    {
        const hgn = (window as any).hgn;
        const freePt = hgn.treeView.freePt;
        const connectionPoint = this.getConnectionPoint();
        this._updateGradientEndAlphaFunc = null;

        const pos = this.getQuadraticBezierPoint(
            0, 0,
            0, connectionPoint.y,
            connectionPoint.x - freePt.clientWidth / 2, connectionPoint.y,
            1
        );

        this._freePtPos.x = this._nodeElement.offsetLeft;
        this._freePtPos.y = this._nodeElement.offsetTop - freePt.clientHeight / 2;
        freePt.style.left = this._freePtPos.x + pos.x + 'px';
        freePt.style.top = this._freePtPos.y + pos.y + 'px';
        
        this._subLinkNodes.forEach(subLinkNode => subLinkNode.element.classList.add('disappear'));
        this._subCurveAppearProgress = [0,0,0,0];
        this._animationStartTime = hgn.timestamp;
        this._appearStatus = AppearStatus.DISAPPEARING;
        this._gradientEndAlpha = 0;
        this._point.element.style.visibility = 'hidden';
        this._nodeHead.classList.add('disappear');
        this._isDraw = true;

        this._appearAnimationFunc = this.selectedDisappearAnimation;
    }

    /**
     * 消滾アニメーション
     */
    protected selectedDisappearAnimation(): void
    {
        const connectionPoint = this.getConnectionPoint();

        const hgn = (window as any).hgn;

        this._curveAppearProgress = 1 - this.getAnimationProgress(1000);
        if (this._curveAppearProgress <= 0) {
            this._curveAppearProgress = 0;
            this._gradientEndAlpha = 0;
            this._appearAnimationFunc = this.selectedDisappearAnimation2;

            this._animationStartTime = hgn.timestamp;
            hgn.treeView.mainLine.disappear(0, true);
            hgn.treeView.headerNode.disappearPoint();
        } else {
            this.drawCurvedLine(
                15,
                0,
                connectionPoint.x,
                connectionPoint.y
            );
        }

        const freePt = hgn.treeView.freePt;
        const pos = this.getQuadraticBezierPoint(
            0, 0,
            0, connectionPoint.y,
            connectionPoint.x - freePt.clientWidth / 2, connectionPoint.y,
            this._curveAppearProgress
        );
        freePt.style.left = (this._freePtPos.x + pos.x) + 'px';
        freePt.style.top = (this._freePtPos.y + pos.y) + 'px';
        freePt.classList.add('visible');
        
        this._isDraw = true;
    }

    protected selectedDisappearAnimation2(): void
    {
        const headerNode = (window as any).hgn.treeView.headerNode;
        const freePt = (window as any).hgn.treeView.freePt;
        const headerPoint = headerNode.point;
        const posY = headerPoint.element.offsetTop;

        const progress = 1 - this.getAnimationProgress(300);
        if (progress <= 0) {
            this._appearAnimationFunc = null;
            freePt.style.top = headerPoint.element.offsetTop + 'px';
            this._appearStatus = AppearStatus.DISAPPEARED;
            (window as any).hgn.treeView.disappeared();
            
            this._point.element.style.visibility = 'visible';
        } else {
            freePt.style.top = posY + (this._freePtPos.y - posY) * progress + 'px';
        }
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
