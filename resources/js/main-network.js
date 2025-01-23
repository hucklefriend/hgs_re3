import './bootstrap';
import './hgn.js';
import {MainFranchiseNetwork} from './hgn/main-franchise-network.js';
import {Param} from './hgn/param.js';
import {Util} from "./hgn/util.js";
import {Vertex} from "./hgn/vertex.js";
import {Rect, ViewRect} from "./hgn/rect.js";
import {DOMNode} from "./hgn/node/octa-node.js";


/**
 * メインネットワーク
 */
export class MainNetwork
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        this.body = null;

        this.isDragging = false;
        this.isFlicking = false;

        this.isDraw = false;

        this.dragOffset = new Vertex(0, 0);
        this.dragVelocity = new Vertex(0, 0);
        this.dragLastPos = new Vertex(0, 0);

        this.networkRect = new Rect();
        this.viewRect1 = new Rect();
        this.viewRect2 = new Rect();
        this.viewRect3 = new Rect();
        this.viewRect4 = new Rect();
        this.viewRect2OffsetX = 0;
        this.viewRect3OffsetY = 0;
        this.screenOffset = new Vertex(0, 0);
        this.cameraPos = new Vertex(0, 0);     // 表示中心位置
    }

    /**
     * 起動
     */
    start(networks, left, right, top, bottom, x, y)
    {
        this.body = document.querySelector('body');
        this.canvas = document.querySelector('#main-network-canvas');
        this.canvas.width = this.body.offsetWidth;
        this.canvas.height = this.body.offsetHeight;
        this.ctx = null;
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
        }

        this.debugCanvas = document.querySelector('#main-network-debug-canvas');

        this.body.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.body.addEventListener('mouseup', (e) => this.mouseUp(e));
        this.body.addEventListener('mousemove', (e) => this.mouseMove(e));
        this.body.addEventListener('mouseleave', (e) => this.mouseLeave(e));

        this.networkRect.setRect(left, right, top, bottom);
        this.moveCamera(x, y);
        this.setScreenOffset();

        // ネットワークの初期化
        this.networks = [];
        networks.forEach(network => {
            let n = MainFranchiseNetwork.create(
                this.body,
                network.x,
                network.y,
                network.data,
                this.screenOffset
            );
            this.networks.push(n);
        });

        this.debugDOM = document.querySelector('#main-network-debug');



        this.debugCtx = this.debugCanvas.getContext('2d');
        this.debugCanvas.width = this.networkRect.width;
        this.debugCanvas.height = this.networkRect.height;
        this.drawDebugCanvas();

        this.isDraw = true;
        this.update = this.update.bind(this);
        window.requestAnimationFrame(this.update);
    }

    drawDebugCanvas()
    {
        let offsetX = Math.abs(this.networkRect.left);
        let offsetY = Math.abs(this.networkRect.top);

        this.debugCtx.clearRect(0, 0, this.debugCanvas.width, this.debugCanvas.height);
        this.debugCtx.fillStyle = "red";


        this.networks.forEach(network => {
            let x = 0;
            let y = 0;

            Object.values(network.nodes).forEach(node => {
                if (node instanceof DOMNode) {
                    x = node.pos.x + offsetX + network.pos.x;
                    y = node.pos.y + offsetY + network.pos.y;
                } else {
                    x = node.x + offsetX + network.pos.x;
                    y = node.y + offsetY + network.pos.y;
                }

                this.debugCtx.beginPath();
                this.debugCtx.arc(x, y, 5, 0, Param.MATH_PI_2, false);
                this.debugCtx.fill();
            });
        });
    }

    /**
     * マウスダウン
     *
     * @param e
     */
    mouseDown(e)
    {
        this.isDragging = true;
        this.body.style.cursor = 'grabbing';
        this.dragLastPos.x = e.clientX;
        this.dragLastPos.y = e.clientY;

        this.dragVelocity.x = 0;
        this.dragVelocity.y = 0;

        this.isFlicking = false;
    }

    /**
     * ドラッグ中
     *
     * @param e
     */
    mouseMove(e)
    {
        if (!this.isDragging){
            return;
        }

        // 移動量を計算
        const deltaX = e.clientX - this.dragLastPos.x;
        const deltaY = e.clientY - this.dragLastPos.y;

        // オフセットを更新
        this.dragOffset.x += deltaX;
        this.dragOffset.y += deltaY;

        // 中央位置を移動
        this.moveCamera(-deltaX, -deltaY);

        // 速度を計算（フリックのために保持）
        this.dragVelocity.x = deltaX;
        this.dragVelocity.y = deltaY;

        this.dragLastPos.x = e.clientX;
        this.dragLastPos.y = e.clientY;

        this.setScreenOffset();

        // if (this.lazyDraw !== null) {
        //     clearTimeout(this.lazyDraw);
        // }
        // this.lazyDraw = setTimeout(() => {
        //     this.isDraw = true;
        // }, 100);

        this.isDraw = true;
    }

    /**
     * ドラッグ終了
     *
     * @param e
     */
    mouseUp(e)
    {
        this.isDragging = false;
        this.body.style.cursor = 'grab';

        if (!this.isStopFlicking()) {
            //this.isFlicking = true;
        }
    }

    mouseLeave(e)
    {
        this.isDragging = false;
        this.body.style.cursor = 'grab';
    }

    update()
    {
        if (this.isFlicking) {
            this.flick();
        }

        if (this.isDraw) {
            this.draw();
            this.isDraw = false;
        }

        this.debug();

        window.requestAnimationFrame(this.update);
    }

    flick()
    {
        this.moveCamera(
            Math.round(this.dragVelocity.x),
            Math.round(this.dragVelocity.y)
        );

        this.dragVelocity.x = this.dragVelocity.x * Param.DRAG_FLICK_RATE;
        this.dragVelocity.y = this.dragVelocity.y * Param.DRAG_FLICK_RATE;

        if (this.isStopFlicking()) {
            this.isFlicking = false;
        }
    }

    moveCamera(x, y)
    {
        this.cameraPos.x += x;
        this.cameraPos.y += y;
        let hw = this.canvas.width / 2;
        let hh = this.canvas.height / 2;

        this.debugCanvas.style.left = `${this.networkRect.left-this.cameraPos.x+hw}px`;
        this.debugCanvas.style.top = `${this.networkRect.top-this.cameraPos.y+hh}px`;


        if (this.cameraPos.x + hw < this.networkRect.left) {
            this.cameraPos.x = this.networkRect.right - (this.networkRect.left - this.cameraPos.x) + hw;
        }
        if (this.cameraPos.x - hw > this.networkRect.right) {
            this.cameraPos.x = this.networkRect.left + (this.cameraPos.x - this.networkRect.right) - hw;
        }
        if (this.cameraPos.y < this.networkRect.top - hh) {
            this.cameraPos.y = this.networkRect.bottom - (this.networkRect.top - this.cameraPos.y) + hh;
        }
        if (this.cameraPos.y > this.networkRect.bottom + hh) {
            this.cameraPos.y = this.networkRect.top + (this.cameraPos.y - this.networkRect.bottom) - hh;
        }

        this.viewRect1.setRect(
            this.cameraPos.x - this.canvas.width / 2,
            this.cameraPos.x + this.canvas.width / 2,
            this.cameraPos.y - this.canvas.height / 2,
            this.cameraPos.y + this.canvas.height / 2
        );

        // 無限スクロールのため、上下左右にはみ出した分の描画領域を作成
        let xDiff = 0;
        let yDiff = 0;
        this.viewRect2OffsetX = 0;
        if (this.viewRect1.left < this.networkRect.left) {
            // 表示領域が左にはみ出している場合、右側に表示領域を作成
            let xDiff = this.networkRect.left - this.viewRect1.left;
            //this.viewRect1.left = this.networkRect.left;

            this.viewRect2.setRect(
                this.networkRect.right - xDiff,
                this.networkRect.right,
                this.viewRect1.top,
                this.viewRect1.bottom
            );

            this.viewRect2OffsetX = this.networkRect.width;
        } else if (this.viewRect1.right > this.networkRect.right) {
            // 表示領域が右にはみ出している場合、左側に表示領域を作成
            let xDiff = this.viewRect1.right - this.networkRect.right;
            //this.viewRect1.right = this.networkRect.right;

            this.viewRect2.setRect(
                this.networkRect.left,
                this.networkRect.left + xDiff,
                this.viewRect1.top,
                this.viewRect1.bottom
            );

            this.viewRect2OffsetX = -this.networkRect.width;
        }

        this.viewRect3OffsetY = 0;
        if (this.viewRect1.top < this.networkRect.top) {
            // 表示領域が上にはみ出している場合、下側に表示領域を作成
            let yDiff = this.networkRect.top - this.viewRect1.top;
            //this.viewRect1.top = this.networkRect.top;

            this.viewRect3.setRect(
                this.viewRect1.left,
                this.viewRect1.right,
                this.networkRect.bottom - yDiff,
                this.networkRect.bottom
            );

            this.viewRect3OffsetY = this.networkRect.height;
        } else if (this.viewRect1.bottom > this.networkRect.bottom) {
            // 表示領域が下にはみ出している場合、上側に表示領域を作成
            let yDiff = this.viewRect1.bottom - this.networkRect.bottom;
            //this.viewRect1.bottom = this.networkRect.bottom;

            this.viewRect3.setRect(
                this.viewRect1.left,
                this.viewRect1.right,
                this.networkRect.top,
                this.networkRect.top + yDiff
            );

            this.viewRect3OffsetY = -this.networkRect.height;
        }

        if (xDiff !== 0 && yDiff !== 0) {
            // 左右も上下もはみ出していた場合、4つ目の表示領域を作成
            this.viewRect4.setRect(
                this.viewRect2.left,
                this.viewRect2.right,
                this.viewRect3.top,
                this.viewRect3.bottom
            );
        }

        this.viewRect1.calcSize();
    }

    isStopFlicking()
    {
        return (Math.abs(this.dragVelocity.x) <= 0.1 || Math.abs(this.dragVelocity.y) <= 0.1);
    }

    setScreenOffset()
    {
        this.screenOffset.x = this.cameraPos.x + this.canvas.width / 2;
        this.screenOffset.y = this.cameraPos.y + this.canvas.height / 2;
    }

    draw()
    {
        // 描画する領域
        let width = this.canvas.width;
        let height = this.canvas.height;

        let left = this.cameraPos.x - width / 2;
        let right = left + width;
        let top = this.cameraPos.y - height / 2;
        let bottom = top + height;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let offset = new Vertex(this.screenOffset.x - this.cameraPos.x*2, this.screenOffset.y - this.cameraPos.y*2);

        // 描画領域内にあるネットワークを描画
        this.networks.forEach(network => {
            if (!this.viewRect1.isEmpty() && this.viewRect1.isOverlap(network.viewRect)) {
                network.draw(this.ctx, this.viewRect1, offset);
            } else if (!this.viewRect2.isEmpty() && this.viewRect2.isOverlap(network.viewRect)) {
                //network.draw(this.ctx, {x: this.screenOffset.x + this.viewRect2OffsetX, y: this.screenOffset.y});
            } else if (!this.viewRect3.isEmpty() && this.viewRect3.isOverlap(network.viewRect)) {
                //network.draw(this.ctx, {x: this.screenOffset.x, y: this.screenOffset.y + this.viewRect3OffsetY});
            } else if (!this.viewRect4.isEmpty() && this.viewRect4.isOverlap(network.viewRect)) {
                //network.draw(this.ctx, {x: this.screenOffset.x + this.viewRect2OffsetX, y: this.screenOffset.y + this.viewRect3OffsetY});
            }
        });

        // CSS変数を動的に更新
        document.documentElement.style.setProperty('--mntx', `${-this.cameraPos.x}px`);
        document.documentElement.style.setProperty('--mnty', `${-this.cameraPos.y}px`);

        this.drawMiniMap();
    }

    drawMiniMap()
    {
        const MINIMAP_WIDTH = 200;
        let rate = MINIMAP_WIDTH / this.networkRect.width;

        this.ctx.save();

        // this.networkRectをcanvasの右上に、MINIMAP_WIDTH x MINIMAP_HEIGHTで描画
        let x = this.canvas.width - MINIMAP_WIDTH - 10;
        let y = 10;
        let height = this.networkRect.height * rate;
        let centerX = x + Math.abs(Math.round(this.networkRect.left * rate));
        let centerY = y + Math.abs(Math.round(this.networkRect.top * rate));

        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.strokeRect(x, y, MINIMAP_WIDTH, height);

        // 中央点
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 3, 0, Param.MATH_PI_2, false);
        this.ctx.fill();

        // カメラの中央点
        this.ctx.fillStyle = 'yellow';
        this.ctx.beginPath();
        this.ctx.arc(centerX + this.cameraPos.x * rate, centerY + this.cameraPos.y * rate, 3, 0, Param.MATH_PI_2, false);
        this.ctx.fill();

        // 表示領域の描画
        this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
        this.ctx.moveTo(centerX + this.viewRect1.left * rate, centerY + this.viewRect1.top * rate);
        this.ctx.lineTo(centerX + this.viewRect1.right * rate, centerY + this.viewRect1.top * rate);
        this.ctx.lineTo(centerX + this.viewRect1.right * rate, centerY + this.viewRect1.bottom * rate);
        this.ctx.lineTo(centerX + this.viewRect1.left * rate, centerY + this.viewRect1.bottom * rate);
        this.ctx.lineTo(centerX + this.viewRect1.left * rate, centerY + this.viewRect1.top * rate);
        this.ctx.stroke();

        this.ctx.restore();
    }

    debug()
    {
        let html = '';
        html += `canvas: ${this.canvas.width}, ${this.canvas.height}<br>`;
        html += `cameraPos: ${this.cameraPos.x}, ${this.cameraPos.y}<br>`;
        html += `screenOffset: ${this.screenOffset.x}, ${this.screenOffset.y}<br>`;
        html += `networkRect: ${this.networkRect.left}, ${this.networkRect.right}, ${this.networkRect.top}, ${this.networkRect.bottom}<br>`;
        html += `viewRect1: ${this.viewRect1.left}, ${this.viewRect1.right}, ${this.viewRect1.top}, ${this.viewRect1.bottom}<br>`;

        this.debugDOM.innerHTML = html;
    }
}

window.mainNetwork = new MainNetwork();
