import './bootstrap';
import './hgn.js';
import {MainFranchiseNetwork} from './hgn/main-franchise-network.js';
import {Param} from './hgn/param.js';
import {Util} from "./hgn/util.js";
import {Vertex} from "./hgn/vertex.js";
import {Rect} from "./hgn/rect.js";


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
        this.viewRect = new Rect();
        this.showCenter = new Vertex(0, 0);     // 表示中心位置
        this.screenOffset = new Vertex(0, 0);

        this.lazyDraw = null;
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

        this.body.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.body.addEventListener('mouseup', (e) => this.mouseUp(e));
        this.body.addEventListener('mousemove', (e) => this.mouseMove(e));
        this.body.addEventListener('mouseleave', (e) => this.mouseLeave(e));

        this.networkRect.setRect(left, right, top, bottom);
        this.setCenter(x, y);
        this.setScreenOffset();

        // ネットワークの初期化
        this.networks = [];
        networks.forEach(network => {
            let n = MainFranchiseNetwork.create(this.body, network.x, network.y, network.data, this.screenOffset);
            this.networks.push(n);
        });

        this.debugDOM = document.querySelector('#main-network-debug');

        this.isDraw = true;
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
        this.setCenter(this.showCenter.x + deltaX, this.showCenter.y + deltaY);

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

        if (this.isDraw) {
            this.draw();
            this.isDraw = false;
        }

        this.debug();

        window.requestAnimationFrame(this.update);
    }

    flick()
    {
        this.setCenter(
            Math.round(this.showCenter.x - this.dragVelocity.x),
            this.showCenter.y = Math.round(this.showCenter.y - this.dragVelocity.y)
        );

        this.dragVelocity.x = this.dragVelocity.x * Param.DRAG_FLICK_RATE;
        this.dragVelocity.y = this.dragVelocity.y * Param.DRAG_FLICK_RATE;

        if (this.isStopFlicking()) {
            this.isFlicking = false;
        }
    }

    setCenter(x, y)
    {
        this.showCenter.x = x;
        this.showCenter.y = y;

        if (this.showCenter.x < this.networkRect.left) {
            this.showCenter.x = this.networkRect.right - (this.networkRect.left - this.showCenter.x);
        }
        if (this.showCenter.x > this.networkRect.right) {
            this.showCenter.x = this.networkRect.left + (this.showCenter.x - this.networkRect.right);
        }
        if (this.showCenter.y < this.networkRect.top) {
            this.showCenter.y = this.networkRect.bottom - (this.networkRect.top - this.showCenter.y);
        }
        if (this.showCenter.y > this.networkRect.bottom) {
            this.showCenter.y = this.networkRect.top + (this.showCenter.y - this.networkRect.bottom);
        }

        this.viewRect.setRect(
            this.showCenter.x - this.canvas.width / 2,
            this.showCenter.x + this.canvas.width / 2,
            this.showCenter.y - this.canvas.height / 2,
            this.showCenter.y + this.canvas.height / 2
        );
    }

    isStopFlicking()
    {
        return (Math.abs(this.dragVelocity.x) <= 0.1 || Math.abs(this.dragVelocity.y) <= 0.1);
    }

    setScreenOffset()
    {
        this.screenOffset.x = this.canvas.width / 2 + this.showCenter.x;
        this.screenOffset.y = this.canvas.height / 2 + this.showCenter.y;
    }

    draw()
    {
        // 描画する領域
        let width = this.canvas.width;
        let height = this.canvas.height;

        let left = this.showCenter.x - width / 2;
        let right = left + width;
        let top = this.showCenter.y - height / 2;
        let bottom = top + height;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 描画領域内にあるネットワークを描画
        this.networks.forEach(network => {
            if (this.viewRect.isOverlap(network.viewRect)) {
                network.draw(this.ctx, this.screenOffset);
            }
        });

        // CSS変数を動的に更新
        document.documentElement.style.setProperty('--mntx', `${this.showCenter.x}px`);
        document.documentElement.style.setProperty('--mnty', `${this.showCenter.y}px`);
    }

    debug()
    {
        let html = '';
        html += `showCenter: ${this.showCenter.x}, ${this.showCenter.y}<br>`;
        html += `screenOffset: ${this.screenOffset.x}, ${this.screenOffset.y}<br>`;

        this.debugDOM.innerHTML = html;
    }
}

window.mainNetwork = new MainNetwork();
