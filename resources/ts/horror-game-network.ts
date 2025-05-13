export class HorrorGameNetwork
{
    private static instance: HorrorGameNetwork;
    private canvas: HTMLCanvasElement;
    private canvasCtx: CanvasRenderingContext2D;
    private parentTreePoint: HTMLSpanElement;
    private childTreePoints: NodeListOf<HTMLSpanElement>;
    private body: HTMLBodyElement;

    /**
     * コンストラクタ
     */
    private constructor()
    {
        this.canvas = document.querySelector('#canvas') as HTMLCanvasElement;
        this.canvasCtx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.parentTreePoint = document.querySelector('header .tree-pt') as HTMLSpanElement;
        this.childTreePoints = document.querySelectorAll('a.network-link-node .tree-pt');
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
        this.canvasCtx.lineWidth = 1;
        this.canvasCtx.moveTo(startX, startY);
        this.canvasCtx.lineTo(startX, startY + (endY - startY) * 0.7); // 下方向に伸びる（80%の位置まで）
        this.canvasCtx.quadraticCurveTo(controlPoint.x, controlPoint.y, endX, endY);
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
        gradient.addColorStop(0, 'rgba(144, 238, 144, 0.8)');   // 薄い緑色
        gradient.addColorStop(0.5, 'rgba(144, 238, 144, 0.4)'); // 中間
        gradient.addColorStop(1, 'rgba(144, 238, 144, 0.8)');   // 薄い緑色

        // 発光効果の設定
        this.canvasCtx.shadowColor = 'rgba(144, 238, 144, 0.5)';
        this.canvasCtx.shadowBlur = 10;
        this.canvasCtx.shadowOffsetX = 0;
        this.canvasCtx.shadowOffsetY = 0;

        // 親要素の位置情報を取得
        const parentCenterX = this.parentTreePoint.offsetLeft + this.parentTreePoint.offsetWidth / 2;
        const parentCenterY = this.parentTreePoint.offsetTop + this.parentTreePoint.offsetHeight / 2;

        // 子要素の位置情報を取得して線を描画
        this.childTreePoints.forEach(childPoint => {
            const childCenterX = childPoint.offsetLeft + childPoint.offsetWidth / 2;
            const childCenterY = childPoint.offsetTop + childPoint.offsetHeight / 2;

            // 線を描画
            this.drawCurvedLine(
                parentCenterX,
                parentCenterY,
                childCenterX,
                childCenterY,
                gradient
            );
        });
    }
} 