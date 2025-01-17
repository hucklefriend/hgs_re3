import {Param} from './hgn/param.js';
import {Util} from "./hgn/util.js";
import {Vertex} from "./hgn/vertex.js";

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

        this.dragOffset = new Vertex(0, 0);
        this.dragVelocity = new Vertex(0, 0);
        this.dragLastPos = new Vertex(0, 0);

        this.center = new Vertex(0, 0);
    }

    /**
     * 起動
     */
    start(networks, left, right, top, bottom, x, y)
    {
        this.networks = networks;

        this.body = document.querySelector('body');
        this.canvas = document.querySelector('#main-network-canvas');
        this.canvas.width = this.body.innerWidth;
        this.canvas.height = this.body.innerHeight;
        this.ctx = null;
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
        }

        this.body.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.body.addEventListener('mouseup', (e) => this.mouseUp(e));
        this.body.addEventListener('mousemove', (e) => this.mouseMove(e));
        this.body.addEventListener('mouseleave', (e) => this.mouseLeave(e));

        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;

        this.center.x = x;
        this.center.y = y;

        this.debugDOM = document.querySelector('#main-network-debug');

        this.update = this.update.bind(this);
        window.requestAnimationFrame(this.update);
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
        if (!this.isDragging) return;

        // 移動量を計算
        const deltaX = e.clientX - this.dragLastPos.x;
        const deltaY = e.clientY - this.dragLastPos.y;

        // オフセットを更新
        this.dragOffset.x += deltaX;
        this.dragOffset.y += deltaY;

        // 中央位置を移動
        this.setCenter(this.center.x - deltaX, this.center.y - deltaY);

        // 速度を計算（フリックのために保持）
        this.dragVelocity.x = deltaX;
        this.dragVelocity.y = deltaY;

        this.dragLastPos.x = e.clientX;
        this.dragLastPos.y = e.clientY;
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
            this.isFlicking = true;
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

        this.debug();

        window.requestAnimationFrame(this.update);
    }

    flick()
    {
        this.setCenter(
            Math.round(this.center.x - this.dragVelocity.x),
            this.center.y = Math.round(this.center.y - this.dragVelocity.y)
        );

        this.dragVelocity.x = this.dragVelocity.x * Param.DRAG_FLICK_RATE;
        this.dragVelocity.y = this.dragVelocity.y * Param.DRAG_FLICK_RATE;

        if (this.isStopFlicking()) {
            this.isFlicking = false;
        }
    }

    setCenter(x, y)
    {
        this.center.x = x;
        this.center.y = y;

        if (this.center.x < this.left) {
            this.center.x = this.right - (this.left - this.center.x);
        }
        if (this.center.x > this.right) {
            this.center.x = this.left + (this.center.x - this.right);
        }
        if (this.center.y < this.top) {
            this.center.y = this.bottom - (this.top - this.center.y);
        }
        if (this.center.y > this.bottom) {
            this.center.y = this.top + (this.center.y - this.bottom);
        }
    }

    isStopFlicking()
    {
        return (Math.abs(this.dragVelocity.x) <= 0.1 || Math.abs(this.dragVelocity.y) <= 0.1);
    }

    draw()
    {
        // 描画する領域
        let width = this.canvas.width;
        let height = this.canvas.height;

        let left = this.center.x - width / 2;
        let right = left + width;
        let top = this.center.y - height / 2;
        let bottom = top + height;

        // 描画領域内にあるネットワークを描画
    }

    debug()
    {
        let html = '';
        html += `center: ${this.center.x}, ${this.center.y}<br>`;


        this.debugDOM.innerHTML = html;
    }
}

window.mainNetwork = new MainNetwork();
