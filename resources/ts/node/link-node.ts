import { MainNodeBase } from "./main-node-base";
import { NodePoint } from "./parts/node-point";

export class LinkNode extends MainNodeBase
{
    private _point: NodePoint;
    private _anchor: HTMLAnchorElement;
    private _updateGradientEndAlphaFunc: (() => void) | null;

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
        this._updateGradientEndAlphaFunc = null;

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
        this.gradientEndAlpha = this.getAnimationValue(0.3, 1.0, 300);
        this.maxSubEndOpacity = this.getAnimationValue(0.3, 0.5, 200);
        this.minSubEndOpacity = this.getAnimationValue(0.1, 0.2, 200);
        if (this.gradientEndAlpha >= 1.0) {
            this.gradientEndAlpha = 1.0;
            this._updateGradientEndAlphaFunc = null;
        }
        this.setDraw();
    }

    /**
     * ホバー終了時のグラデーションα値を更新
     */
    private updateGradientEndAlphaOnUnhover(): void
    {
        this.gradientEndAlpha = this.getAnimationValue(1.0, 0.3, 300);
        this.maxSubEndOpacity = this.getAnimationValue(0.5, 0.3, 200);
        this.minSubEndOpacity = this.getAnimationValue(0.2, 0.1, 200);
        if (this.gradientEndAlpha <= 0.3) {
            this.gradientEndAlpha = 0.3;
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

    /**
     * ホバー時の処理
     */
    private hover(): void
    {
        this.subNodeContainer.classList.add('hover');
        this.animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnHover;
    }

    /**
     * ホバー解除時の処理
     */
    private unhover(): void
    {
        this.subNodeContainer.classList.remove('hover');
        this.animationStartTime = (window as any).hgn.timestamp;
        this._updateGradientEndAlphaFunc = this.updateGradientEndAlphaOnUnhover;
    }

    /**
     * クリック時の処理
     * @param e クリックイベント
     */
    private click(e: MouseEvent): void
    {
        // デフォルトの動作を防ぐ
        e.preventDefault();
        
        // クリック時の処理をここに実装
        console.log('LinkNode clicked:', this._anchor.id);

        this.moveTree(false);
    }

    public moveTree(isFromPopState: boolean): void
    {
        const hgn = (window as any).hgn;
        hgn.treeView.disappear(this);
/*
        const url = this._anchor.href;
        
        if (!isFromPopState) {
            // pushStateで履歴に追加（content-nodeで行ったことを記録）
            const stateData = {
                type: 'content-node',
                url: url,
                anchorId: this._anchor.id,
                timestamp: Date.now()
            };
            history.pushState(stateData, '', url);
            console.log('stateData:', stateData);
        }

        fetch(url, {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then(data => {
                //console.log('取得したデータ:', data);
                hgn.contentNodeView.setContent(data);
            })
            .catch(error => {
                console.error('データの取得に失敗しました:', error);
            });
*/
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
        if (freePt) {
            const connectionPoint = this.getConnectionPoint();
            const nodeHeadY = this.nodeElement.offsetTop - this._point.element.clientHeight / 2;

            const pos = this.getQuadraticBezierPoint(
                0, 0,
                0, connectionPoint.y,
                connectionPoint.x - freePt.clientWidth / 2, connectionPoint.y,
                1
            );


            // freePt.style.left = (connectionPoint.x - 5) + 'px';
            // freePt.style.top = (connectionPoint.y + nodeHeadY) + 'px';

            this._freePtPos.x = this.nodeElement.offsetLeft;
            this._freePtPos.y = this.nodeElement.offsetTop - freePt.clientHeight / 2;
            freePt.style.left = this._freePtPos.x + pos.x + 'px';
            freePt.style.top = this._freePtPos.y + pos.y + 'px';
        }
        
        this.subLinkNodes.forEach(subLinkNode => subLinkNode.element.classList.add('disappear'));
        this.subCurveAppearProgress = [0,0,0,0];
        this.animationStartTime = hgn.timestamp;
        this.gradientEndAlpha = 0;
        this._point.element.style.visibility = 'hidden';
        this.nodeHead.classList.add('disappear');
        this.isDraw = true;

        this.appearAnimationFunc = this.selectedDisappearAnimation;
    }

    /**
     * 消滾アニメーション
     */
    protected selectedDisappearAnimation(): void
    {
        const connectionPoint = this.getConnectionPoint();

        const hgn = (window as any).hgn;

        this.curveAppearProgress = 1 - this.getAnimationProgress(1000);
        if (this.curveAppearProgress <= 0) {
            this.curveAppearProgress = 0;
            this.gradientEndAlpha = 0;
            this.appearAnimationFunc = this.selectedDisappearAnimation2;

            this.animationStartTime = hgn.timestamp;
            hgn.treeView.mainLine.disappear(0, true);

            const headerNode = hgn.treeView.headerNode;
            const pt = headerNode.point;
            pt.element.classList.add('fade-out');
        } else {
            this.drawCurvedLine(
                15,
                0,
                connectionPoint.x,
                connectionPoint.y
            );
        }

        const freePt = hgn.treeView.freePt;
        if (freePt) {
            const pos = this.getQuadraticBezierPoint(
                0, 0,
                0, connectionPoint.y,
                connectionPoint.x - freePt.clientWidth / 2, connectionPoint.y,
                this.curveAppearProgress
            );
            freePt.style.left = (this._freePtPos.x + pos.x) + 'px';
            freePt.style.top = (this._freePtPos.y + pos.y) + 'px';
        }
        
        this.isDraw = true;
    }

    protected selectedDisappearAnimation2(): void
    {
        const headerNode = (window as any).hgn.treeView.headerNode;
        const freePt = (window as any).hgn.treeView.freePt;
        const headerPoint = headerNode.point;
        const posY = headerPoint.element.offsetTop;

        const progress = 1 - this.getAnimationProgress(300);
        if (progress <= 0) {
            this.appearAnimationFunc = null;
            freePt.style.top = headerPoint.element.offsetTop + 'px';
        } else {
            freePt.style.top = posY + (this._freePtPos.y - posY) * progress + 'px';
        }
    }
} 
