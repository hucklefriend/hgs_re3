export class OffscreenRenderer {
    constructor() {
        this.offscreenCtx = null;
        this.animationId = 0;
    }

    setCanvas(canvas) {
        this.offscreenCtx = canvas.getContext('2d');
        this.startDrawLoop();
    }

    startDrawLoop() {
        const drawLoop = () => {
            if (!this.offscreenCtx) return;

            // 背景をクリア
            this.offscreenCtx.clearRect(0, 0, this.offscreenCtx.canvas.width, this.offscreenCtx.canvas.height);

            // 任意の描画を実行
            this.offscreenCtx.fillStyle = 'red';
            this.offscreenCtx.fillRect(50, 50, 100, 100);

            // ループ継続
            this.animationId = requestAnimationFrame(drawLoop);
        };
        this.animationId = requestAnimationFrame(drawLoop);
    }

    stopDrawLoop() {
        cancelAnimationFrame(this.animationId);
    }

    resize(width, height) {
        if (!this.offscreenCtx) return;
        this.offscreenCtx.canvas.width = width;
        this.offscreenCtx.canvas.height = height;
    }
}

let renderer = new OffscreenRenderer();

self.onmessage = (e) => {
    if (e.data.canvas) {
        renderer.setCanvas(e.data.canvas);
    }
    if (e.data.type === 'resize') {
        renderer.resize(e.data.width, e.data.height);
    }
};