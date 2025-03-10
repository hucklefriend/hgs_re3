import { MainFranchiseNetwork } from '../network/main-franchise-network.js';
import { ViewerBase } from './viewer-base.js';
import { Param } from '../common/param.js';
import { Vertex } from "../common/vertex.js";
import { Rect } from "../common/rect.js";
import LZString from 'lz-string';

/**
 * マップビューア
 */
export class MapViewer extends ViewerBase
{
    get TYPE()
    {
        return 'map';
    }

    /**
     * コンストラクタ
     */
    constructor()
    {
        super();

        this.mapDOM = null;

        this.isDragging = false;
        this.isFlicking = false;

        this.dragOffset = new Vertex(0, 0);
        this.dragVelocity = new Vertex(0, 0);
        this.dragLastPos = new Vertex(0, 0);

        this.networkRect = new Rect();
        this.viewRect = new Rect();
        this.viewRect1 = new Rect();
        this.viewRect2 = new Rect();
        this.viewRect3 = new Rect();
        this.viewRect4 = new Rect();
        this.viewRect2OffsetX = 0;
        this.viewRect3OffsetY = 0;
        this.cameraPos = new Vertex(0, 0);     // 表示中心位置
        this.origin = new Vertex(0, 0);        // 原点位置

        this.mapDOM = document.querySelector('#map');
        this.mapDOM.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.mapDOM.addEventListener('mouseup', (e) => this.mouseUp(e));
        this.mapDOM.addEventListener('mousemove', (e) => this.mouseMove(e));
        this.mapDOM.addEventListener('mouseleave', (e) => this.mouseLeave(e));
        this.mapDOM.addEventListener('touchstart', (e) => this.mouseDown(e));
        this.mapDOM.addEventListener('touchend', (e) => this.mouseUp(e));
        this.mapDOM.addEventListener('touchmove', (e) => this.mouseMove(e));
        this.mapDOM.style.display = 'none';

        this.dataCache = null;
        this.isWait = false;
    }

    /**
     * 高さを取得
     * マップビューワは常にウィンドウと同じ大きさ
     */
    get height() 
    {
        return window.innerHeight;
    }
    
    /**
     * 番号を指定して表示領域を取得
     * 
     * @param {number} no
     * @returns {Rect}
     */
    getViewRectByNo(no)
    {
        switch (no) {
            case 1:
                return this.viewRect1;
            case 2:
                return this.viewRect2;
            case 3:
                return this.viewRect3;
            case 4:
                return this.viewRect4;
            default:
                return null;
        }
    }

    /**
     * ビュー切り替えの準備
     */
    prepare(data)
    {
        this.dataCache = data;
        this.isWait = true;
    }

    /**
     * 起動
     * 
     * @param {boolean} isRenderCache
     */
    start(isRenderCache)
    {
        this.mapDOM.style.display = 'block';
        this.cameraPos.reload(0, 0);

        let data = null;
        let x = 0;
        let y = 0;
        if (isRenderCache) {
            // windowタイトルの変更
            if (this.dataCache.title) {
                document.title = this.dataCache.title;
            }

            // 戻るで来てなければURLを更新
            if (!(this.dataCache.isBack ?? false)) {
                window.history.pushState({type: this.TYPE, title: this.dataCache.title}, null, this.dataCache.url);
            }

            data = JSON.parse(LZString.decompressFromEncodedURIComponent(this.dataCache.map));
            this.dataCache = null;
        } else {
            data = JSON.parse(LZString.decompressFromEncodedURIComponent(window.map));
            window.map = null;
        }

        this.origin.x = data.origin.x;
        this.origin.y = data.origin.y;

        this.networkRect.setRect(0, data.width, 0, data.height);
        this.viewRect.setRect(0, window.innerWidth, 0, window.innerHeight);

        this.moveCamera(x, y);

        // ネットワークの初期化
        this.networks = [];
        data.networks.forEach(networkData => {
            let n = MainFranchiseNetwork.create(
                this.mapDOM,
                networkData
            );
            this.networks.push(n);
        });

        this.debugDOM = document.querySelector('#main-network-debug');

        window.hgn.setDrawMain(false);
    }

    /**
     * 終了
     */
    end()
    {
        this.mapDOM.style.display = 'none';

        this.networks.forEach(network => {
            network.delete();
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
        this.mapDOM.style.cursor = 'grabbing';

        if (e.type === 'touchstart') {
            this.dragLastPos.x = e.touches[0].clientX;
            this.dragLastPos.y = e.touches[0].clientY;
        } else {
            this.dragLastPos.x = e.clientX;
            this.dragLastPos.y = e.clientY;
        }

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
        let clientX, clientY;

        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // 移動量を計算
        const deltaX = clientX - this.dragLastPos.x;
        const deltaY = clientY - this.dragLastPos.y;

        // オフセットを更新
        this.dragOffset.x += deltaX;
        this.dragOffset.y += deltaY;

        // 中央位置を移動
        this.moveCamera(-deltaX, -deltaY);

        // 背景のスクロール（ドラッグと逆方向に移動）
        window.hgn.background.scrollBy(-deltaX, -deltaY);

        // 速度を計算（フリックのために保持）
        this.dragVelocity.x = deltaX;
        this.dragVelocity.y = deltaY;

        this.dragLastPos.x = clientX;
        this.dragLastPos.y = clientY;

        window.hgn.setDrawMain(false);
    }

    /**
     * ドラッグ終了
     *
     * @param e
     */
    mouseUp(e)
    {
        this.isDragging = false;
        this.mapDOM.style.cursor = 'grab';

        if (!this.isStopFlicking()) {
            this.isFlicking = true;
            // フリック開始時の速度を背景スクロールにも適用
            window.hgn.background.scrollBy(
                -this.dragVelocity.x,
                -this.dragVelocity.y
            );
        }
    }

    /**
     * マウスリーブ
     * 
     * @param {*} e 
     */
    mouseLeave(e)
    {
        this.isDragging = false;
        this.mapDOM.style.cursor = 'grab';
    }

    /**
     * TODO: ホイールイベント
     * 
     * @param {*} element 
     */

    initWheel(element)
    {
        this.element = element;
        this.threshold = 50;      // 感度の閾値
        this.accumulatedX = 0;    // 水平方向の累積値
        this.accumulatedY = 0;    // 垂直方向の累積値

        this.handleWheel = this.handleWheel.bind(this);
        this.element.addEventListener('wheel', this.handleWheel, { passive: false });
    }

    handleWheel(event) {
        event.preventDefault();

        // 累積値の更新
        this.accumulatedX += event.deltaX;
        this.accumulatedY += event.deltaY;

        // 水平方向（チルト）の処理
        if (Math.abs(this.accumulatedX) >= this.threshold) {
            if (this.accumulatedX < 0) {
                this.onTiltLeft();
            } else {
                this.onTiltRight();
            }
            this.accumulatedX = 0;
        }

        // 垂直方向の処理
        if (Math.abs(this.accumulatedY) >= this.threshold) {
            if (this.accumulatedY < 0) {
                this.onScrollUp();
            } else {
                this.onScrollDown();
            }
            this.accumulatedY = 0;
        }
    }

    onTiltLeft() {
        console.log('左チルト検出');
    }

    onTiltRight() {
        console.log('右チルト検出');
    }

    onScrollUp() {
        console.log('上スクロール');
    }

    onScrollDown() {
        console.log('下スクロール');
    }

    /**
     * ウィンドウサイズの変更
     *
     * @param e
     */
    resize(e)
    {
        this.viewRect.right = window.innerWidth;
        this.viewRect.bottom = window.innerHeight;
        this.viewRect.calcSize();
        this.moveCamera(0, 0);
    }

    /**
     * アニメーションフレーム更新
     */
    update()
    {
        if (this.isFlicking) {
            this.flick();
        }

        this.networks.forEach(network => {
            if (!this.viewRect1.isEmpty() && this.viewRect1.overlapWith(network.rect)) {
                network.update(this.viewRect1, 1);
                network.show();
            } else if (!this.viewRect2.isEmpty() && this.viewRect2.overlapWith(network.rect)) {
                network.update(this.viewRect2, 2);
                network.show();
            } else if (!this.viewRect3.isEmpty() && this.viewRect3.overlapWith(network.rect)) {
                network.update(this.viewRect3, 3);
                network.show();
            } else if (!this.viewRect4.isEmpty() && this.viewRect4.overlapWith(network.rect)) {
                network.update(this.viewRect4, 4);
                network.show();
            } else {
                network.hide();
            }
        });
    }

    /**
     * TODO: フリック
     */
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

    /**
     * カメラ位置のセット
     *
     * @param {number} x
     * @param {number} y
     */
    moveCamera(x, y)
    {
        this.cameraPos.x += Math.round(x);
        this.cameraPos.y += Math.round(y);

        if (this.cameraPos.x < this.networkRect.left) {
            this.cameraPos.x = this.networkRect.right - (this.networkRect.left - this.cameraPos.x);
        }
        if (this.cameraPos.x > this.networkRect.right) {
            this.cameraPos.x = this.networkRect.left + (this.cameraPos.x - this.networkRect.right);
        }
        if (this.cameraPos.y < this.networkRect.top) {
            this.cameraPos.y = this.networkRect.bottom - (this.networkRect.top - this.cameraPos.y);
        }
        if (this.cameraPos.y > this.networkRect.bottom) {
            this.cameraPos.y = this.networkRect.top + (this.cameraPos.y - this.networkRect.bottom);
        }

        this.updateViewRect();
    }

    /**
     * ビューレクトの更新
     */
    updateViewRect()
    {
        this.viewRect1.setRect(
            this.cameraPos.x,
            this.cameraPos.x + window.innerWidth,
            this.cameraPos.y,
            this.cameraPos.y + window.innerHeight
        );

        this.viewRect2.setEmpty();
        this.viewRect3.setEmpty();
        this.viewRect4.setEmpty();

        // 無限スクロールのため、上下左右にはみ出した分の描画領域を作成
        let xDiff = 0;
        let yDiff = 0;
        this.viewRect2OffsetX = 0;
        if (this.viewRect1.left < this.networkRect.left) {
            // 表示領域が左にはみ出している場合、右側に表示領域を作成
            xDiff = this.networkRect.left - this.viewRect1.left;
            //this.viewRect1.left = this.networkRect.left;

            this.viewRect2.setRect(
                this.viewRect1.left + this.networkRect.width,
                this.viewRect1.right + this.networkRect.width,
                this.viewRect1.top,
                this.viewRect1.bottom
            );

            this.viewRect2OffsetX = -this.networkRect.width;
        } else if (this.viewRect1.right > this.networkRect.right) {
            // 表示領域が右にはみ出している場合、左側に表示領域を作成
            xDiff = this.viewRect1.right - this.networkRect.right;
            //this.viewRect1.right = this.networkRect.right;

            this.viewRect2.setRect(
                this.viewRect1.left - this.networkRect.width,
                this.viewRect1.right - this.networkRect.width,
                this.viewRect1.top,
                this.viewRect1.bottom
            );

            this.viewRect2OffsetX = this.networkRect.width;
        }

        this.viewRect3OffsetY = 0;
        if (this.viewRect1.top < this.networkRect.top) {
            // 表示領域が上にはみ出している場合、下側に表示領域を作成
            yDiff = this.networkRect.top - this.viewRect1.top;
            //this.viewRect1.top = this.networkRect.top;

            this.viewRect3.setRect(
                this.viewRect1.left,
                this.viewRect1.right,
                this.viewRect1.top + this.networkRect.height,
                this.viewRect1.bottom + this.networkRect.height
            );

            this.viewRect3OffsetY = -this.networkRect.height;
        } else if (this.viewRect1.bottom > this.networkRect.bottom) {
            // 表示領域が下にはみ出している場合、上側に表示領域を作成
            yDiff = this.viewRect1.bottom - this.networkRect.bottom;
            //this.viewRect1.bottom = this.networkRect.bottom;

            this.viewRect3.setRect(
                this.viewRect1.left,
                this.viewRect1.right,
                this.viewRect1.top - this.networkRect.height,
                this.viewRect1.bottom - this.networkRect.height
            );

            this.viewRect3OffsetY = this.networkRect.height;
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

    /**
     * 出現開始
     */
    appear()
    {
        this.networks.forEach(network => {
            network.appear();
        });
    }

    /**
     * 消失開始
     */
    disappear()
    {
        this.networks.forEach(network => {
            network.disappear();
        });
    }

    /**
     * 描画
     * 
     * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
     */
    draw(ctx)
    {
        // css変数の設定
        document.documentElement.style.setProperty('--mn-camera-x1', this.cameraPos.x + 'px');
        document.documentElement.style.setProperty('--mn-camera-y1', this.cameraPos.y + 'px');
        document.documentElement.style.setProperty('--mn-camera-x2', this.cameraPos.x - this.viewRect2OffsetX + 'px');
        document.documentElement.style.setProperty('--mn-camera-y2', this.cameraPos.y + 'px');
        document.documentElement.style.setProperty('--mn-camera-x3', this.cameraPos.x + 'px');
        document.documentElement.style.setProperty('--mn-camera-y3', this.cameraPos.y - this.viewRect3OffsetY + 'px');
        document.documentElement.style.setProperty('--mn-camera-x4', this.cameraPos.x - this.viewRect2OffsetX + 'px');
        document.documentElement.style.setProperty('--mn-camera-y4', this.cameraPos.y - this.viewRect3OffsetY + 'px');

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // 描画領域内にあるネットワークを描画
        this.networks.forEach(network => {
            if (network.isShow) {
                network.draw(ctx, this.getViewRectByNo(network.viewRectNo));
            }
        });

        //this.drawMiniMap(ctx);
    }

    /**
     * ミニマップの描画
     */
    drawMiniMap(ctx)
    {
        const MINIMAP_WIDTH = 200;
        let rate = MINIMAP_WIDTH / this.networkRect.width;

        ctx.save();

        // this.networkRectをcanvasの右上に、MINIMAP_WIDTH x MINIMAP_HEIGHTで描画
        let x = window.innerWidth - MINIMAP_WIDTH - 10;
        let y = 10;
        let height = window.innerHeight * rate;

        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.strokeRect(x, y, MINIMAP_WIDTH, height);

        // 中央点
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + this.origin.x * rate, y + this.origin.y * rate, 3, 0, Param.MATH_PI_2, false);
        ctx.fill();

        // カメラの中央点
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(x + this.cameraPos.x * rate, y + this.cameraPos.y * rate, 3, 0, Param.MATH_PI_2, false);
        ctx.fill();

        // 表示領域の描画
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.moveTo(x + this.viewRect1.left * rate, y + this.viewRect1.top * rate);
        ctx.lineTo(x + this.viewRect1.right * rate, y + this.viewRect1.top * rate);
        ctx.lineTo(x + this.viewRect1.right * rate, y + this.viewRect1.bottom * rate);
        ctx.lineTo(x + this.viewRect1.left * rate, y + this.viewRect1.bottom * rate);
        ctx.lineTo(x + this.viewRect1.left * rate, y + this.viewRect1.top * rate);
        ctx.stroke();

        if (!this.viewRect2.isEmpty()) {
            ctx.moveTo(x + this.viewRect2.left * rate, y + this.viewRect2.top * rate);
            ctx.lineTo(x + this.viewRect2.right * rate, y + this.viewRect2.top * rate);
            ctx.lineTo(x + this.viewRect2.right * rate, y + this.viewRect2.bottom * rate);
            ctx.lineTo(x + this.viewRect2.left * rate, y + this.viewRect2.bottom * rate);
            ctx.lineTo(x + this.viewRect2.left * rate, y + this.viewRect2.top * rate);
            ctx.stroke();
        }

        if (!this.viewRect3.isEmpty()) {
            ctx.moveTo(x + this.viewRect3.left * rate, y + this.viewRect3.top * rate);
            ctx.lineTo(x + this.viewRect3.right * rate, y + this.viewRect3.top * rate);
            ctx.lineTo(x + this.viewRect3.right * rate, y + this.viewRect3.bottom * rate);
            ctx.lineTo(x + this.viewRect3.left * rate, y + this.viewRect3.bottom * rate);
            ctx.lineTo(x + this.viewRect3.left * rate, y + this.viewRect3.top * rate);
            ctx.stroke();
        }

        if (!this.viewRect4.isEmpty()) {
            ctx.moveTo(x + this.viewRect4.left * rate, y + this.viewRect4.top * rate);
            ctx.lineTo(x + this.viewRect4.right * rate, y + this.viewRect4.top * rate);
            ctx.lineTo(x + this.viewRect4.right * rate, y + this.viewRect4.bottom * rate);
            ctx.lineTo(x + this.viewRect4.left * rate, y + this.viewRect4.bottom * rate);
            ctx.lineTo(x + this.viewRect4.left * rate, y + this.viewRect4.top * rate);
            ctx.stroke();
        }

        ctx.restore();
    }

    debug()
    {
        let html = '';
        html += `canvas: ${window.hgn.mainCanvas.width}, ${window.hgn.mainCanvas.height}<br>`;
        html += `cameraPos: ${this.cameraPos.x}, ${this.cameraPos.y}<br>`;
        html += `origin: ${this.origin.x}, ${this.origin.y}<br>`;
        html += `networkRect: ${this.networkRect.left}, ${this.networkRect.right}, ${this.networkRect.top}, ${this.networkRect.bottom}<br>`;
        html += `viewRect1: ${this.viewRect1.left}, ${this.viewRect1.right}, ${this.viewRect1.top}, ${this.viewRect1.bottom}<br>`;
        html += `viewRect2: ${this.viewRect2.left}, ${this.viewRect2.right}, ${this.viewRect2.top}, ${this.viewRect2.bottom}<br>`;
        html += `viewRect3: ${this.viewRect3.left}, ${this.viewRect3.right}, ${this.viewRect3.top}, ${this.viewRect3.bottom}<br>`;
        html += `viewRect4: ${this.viewRect4.left}, ${this.viewRect4.right}, ${this.viewRect4.top}, ${this.viewRect4.bottom}<br>`;

        this.debugDOM.innerHTML = html;
    }
}
