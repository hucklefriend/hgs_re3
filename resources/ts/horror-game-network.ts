export class HorrorGameNetwork
{
    private static instance: HorrorGameNetwork;
    private canvas: HTMLCanvasElement;
    private canvasCtx: CanvasRenderingContext2D;
    private headNodePoint: HTMLSpanElement;
    private nodePoints: {[id: string]: HTMLSpanElement};
    private contentLinks: {[id: string]: HTMLAnchorElement};
    private childNodePoints: {[id: string]: HTMLSpanElement[]};
    private body: HTMLBodyElement;

    /**
     * コンストラクタ
     */
    private constructor()
    {
        this.canvas = document.querySelector('#canvas') as HTMLCanvasElement;
        this.canvasCtx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.headNodePoint = document.querySelector('header .node-pt') as HTMLSpanElement;
        
        this.nodePoints = {};
        this.childNodePoints = {};
        this.contentLinks = {};

        const mainNodes = document.querySelectorAll('section.node');
        mainNodes.forEach(mainNode => {
            const mainNodeId = mainNode.id;
            const head = mainNode.querySelector('.node-head') as HTMLDivElement;
            if (head) {
                const mainNodePt = head.querySelector('.main-node-pt') as HTMLSpanElement;
                if (mainNodePt) {
                    this.nodePoints[mainNodeId] = mainNodePt;
                }

                const contentLink = head.querySelector('.content-link') as HTMLAnchorElement;
                if (contentLink) {
                    this.contentLinks[mainNodeId] = contentLink;
                }
            }

            const subNodeContainer = mainNode.querySelector('.sub-node-container') as HTMLDivElement;
            if (subNodeContainer) {
                const childPoints = subNodeContainer.querySelectorAll('.node-pt') as NodeListOf<HTMLSpanElement>;
                this.childNodePoints[mainNodeId] = Array.from(childPoints);
            }
        });

        this.body = document.querySelector('body') as HTMLBodyElement;
    }

    /**
     * インスタンスを返す
     */
    public static getInstance(): HorrorGameNetwork
    {
        if (!HorrorGameNetwork.instance) {
            HorrorGameNetwork.instance = new HorrorGameNetwork();
        }
        return HorrorGameNetwork.instance;
    }

    /**
     * カーブの制御点を計算する
     * @param startX 開始点のX座標
     * @param startY 開始点のY座標
     * @param endX 終了点のX座標
     * @param endY 終了点のY座標
     * @returns 制御点の座標 {x: number, y: number}
     */
    private calculateControlPoint(startX: number, startY: number, endX: number, endY: number): {x: number, y: number}
    {
        // 制御点は開始点のX座標と終了点のY座標を使用
        return {
            x: startX,
            y: endY
        };
    }

    /**
     * カーブ線を描画する
     * @param startX 開始点のX座標
     * @param startY 開始点のY座標
     * @param endX 終了点のX座標
     * @param endY 終了点のY座標
     * @param gradient グラデーション
     */
    private drawCurvedLine(startX: number, startY: number, endX: number, endY: number, gradient: CanvasGradient): void
    {
        const controlPoint = this.calculateControlPoint(startX, startY, endX, endY);
        
        this.canvasCtx.beginPath();
        this.canvasCtx.strokeStyle = gradient;
        this.canvasCtx.lineWidth = 2;
        //this.canvasCtx.moveTo(startX, startY);
        //this.canvasCtx.lineTo(startX, startY + (endY - startY) * 0.7); // 下方向に伸びる（80%の位置まで）
        this.canvasCtx.moveTo(startX, endY - 30);
        this.canvasCtx.quadraticCurveTo(controlPoint.x, controlPoint.y, endX, endY);
        this.canvasCtx.stroke();
    }

    /**
     * 子要素へのカーブ線を描画する
     * @param startX 開始点のX座標
     * @param startY 開始点のY座標
     * @param endX 終了点のX座標
     * @param endY 終了点のY座標
     * @param gradient グラデーション
     */
    private drawChildCurvedLine(startX: number, startY: number, endX: number, endY: number, gradient: CanvasGradient): void
    {
        // 線の透明度と色を徐々に変化させるためのグラデーション
        const lineGradient = this.canvasCtx.createLinearGradient(startX, startY, endX, endY);
        lineGradient.addColorStop(0, 'rgba(70, 150, 70, 0.8)');     // 開始点（明るい緑、不透明）
        lineGradient.addColorStop(0.5, 'rgba(50, 125, 50, 0.6)');   // 中間点（やや暗い緑、中間の透明度）
        lineGradient.addColorStop(1, 'rgba(30, 100, 30, 0.1)');       // 終了点（暗い緑、半透明）

        this.canvasCtx.beginPath();
        this.canvasCtx.strokeStyle = lineGradient;
        this.canvasCtx.lineWidth = 2;  // 開始点の太さ
        this.canvasCtx.moveTo(startX, startY);
        this.canvasCtx.quadraticCurveTo(startX + (endX - startX) * 0.1, endY, endX, endY);
        this.canvasCtx.stroke();
    }

    public start(): void
    {
        this.setCanvasSize();
        this.draw();

        // リサイズイベントの登録
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * リサイズ時の処理
     */
    private resize(): void
    {
        this.setCanvasSize();
        this.draw();
    }

    /**
     * キャンバスのサイズを設定する
     */
    public setCanvasSize(): void
    {
        this.canvas.width = this.body.offsetWidth;
        this.canvas.height = this.body.offsetHeight;
    }

    /**
     * 描画処理
     */
    public draw(): void
    {
        // キャンバスをクリア
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 発光効果のためのグラデーション
        const gradient = this.canvasCtx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(144, 255, 144, 0.8)');   // 薄い緑色
        gradient.addColorStop(0.5, 'rgba(144, 255, 144, 0.4)'); // 中間
        gradient.addColorStop(1, 'rgba(70, 150, 70, 0.8)');   // 薄い緑色

        // 発光効果の設定
        this.canvasCtx.shadowColor = 'rgba(144, 238, 144, 0.5)';
        this.canvasCtx.shadowBlur = 10;
        this.canvasCtx.shadowOffsetX = 0;
        this.canvasCtx.shadowOffsetY = 0;

        const canvasRect = this.canvas.getBoundingClientRect();
        const canvasOffsetLeft = canvasRect.left;
        const canvasOffsetTop = canvasRect.top;

        // headNodePoint の位置情報を取得
        const headRect = this.headNodePoint.getBoundingClientRect();
        const headParentCenterX = headRect.left + headRect.width / 2 - canvasOffsetLeft;
        const headParentCenterY = headRect.top + headRect.height / 2 - canvasOffsetTop;

        // nodePoints の位置情報を取得し、headNodePoint からの線を描画
        Object.values(this.nodePoints).forEach(mainNodePoint => {
            const mainRect = mainNodePoint.getBoundingClientRect();
            const mainNodePointCenterX = mainRect.left + mainRect.width / 2 - canvasOffsetLeft;
            const mainNodePointCenterY = mainRect.top + mainRect.height / 2 - canvasOffsetTop;

            this.drawCurvedLine(
                headParentCenterX,
                headParentCenterY,
                mainNodePointCenterX,
                mainNodePointCenterY,
                gradient
            );
        });

        // headParentCenterXからcanvasの下端まで直線を引く
        this.canvasCtx.beginPath();
        this.canvasCtx.strokeStyle = 'rgb(144, 255, 144)';
        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.moveTo(headParentCenterX, headParentCenterY);
        this.canvasCtx.lineTo(headParentCenterX, this.canvas.height);
        this.canvasCtx.stroke();

        Object.values(this.contentLinks).forEach(contentLink => {
            const contentLinkRect = contentLink.getBoundingClientRect();
            const contentLinkLeftX = contentLinkRect.left - canvasOffsetLeft;
            const contentLinkCenterY = contentLinkRect.top + contentLinkRect.height / 2 - canvasOffsetTop;
            
            this.drawCurvedLine(
                headParentCenterX,
                headParentCenterY,
                contentLinkLeftX,
                contentLinkCenterY,
                gradient
            );
        });

        // nodePoints から childNodePoints への線を描画
        Object.keys(this.nodePoints).forEach(key => {
            const parentPoint = this.nodePoints[key];
            const parentRect = parentPoint.getBoundingClientRect();
            const parentCenterX = parentRect.left + parentRect.width / 2 - canvasOffsetLeft;
            const parentCenterY = parentRect.top + parentRect.height / 2 - canvasOffsetTop;

            if (this.childNodePoints[key]) {
                this.childNodePoints[key].forEach(childPoint => {
                    const childRect = childPoint.getBoundingClientRect();
                    const childCenterX = childRect.left + childRect.width / 2 - canvasOffsetLeft;
                    const childCenterY = childRect.top + childRect.height / 2 - canvasOffsetTop;

                    this.drawChildCurvedLine(
                        parentCenterX,
                        parentCenterY,
                        childCenterX,
                        childCenterY,
                        gradient
                    );
                });
            }
        });
    }
} 