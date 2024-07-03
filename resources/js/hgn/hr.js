import {Util} from './util.js';

/**
 * 水平線
 */
export class HR
{
    /**
     * コンストラクタ
     *
     * @param dom
     */
    constructor(dom)
    {
        this.dom = dom;

        this.leftX = 0;
        this.rightX = 0;
        this.animFunc = null;
    }

    /**
     * 削除
     * ガベージコレクションに任せる
     */
    delete()
    {
        this.dom = null;
    }

    /**
     * リロード
     */
    reload()
    {
        if (this.animFunc === null) {
            this.leftX = this.dom.offsetLeft;
            this.rightX = this.dom.offsetLeft + this.dom.offsetWidth;
        }
    }

    /**
     * 描画
     *
     * @param ctx
     */
    draw(ctx)
    {
        let width = this.dom.offsetWidth / 5;
        let lx = 0;
        let rx = 0;
        let ratio = 0;

        if (this.leftX === this.rightX) {
            return;
        }

        let startPos = null;
        let lineVertices = [];

        lx = this.dom.offsetLeft;
        rx = lx + width;
        if (rx > this.rightX) {
            rx = this.rightX;
        }
        if (this.leftX <= rx) {
            startPos = {x: this.leftX, y: this.dom.offsetTop};
            lineVertices.push({x: rx, y: this.dom.offsetTop});
        }
        lx += width;
        rx += 5;
        if (rx > this.rightX) {
            rx = this.rightX;
        }
        if (this.leftX <= rx) {
            if (startPos === null) {
                ratio = (this.leftX - lx) / 5;
                startPos = {x: this.leftX, y: this.dom.offsetTop - Util.getMidpoint(0, 5, ratio)};
            }
            lineVertices.push({x: rx, y: this.dom.offsetTop - 5});
        }
        lx += 5;
        rx += width;
        if (rx > this.rightX) {
            rx = this.rightX;
        }
        if (this.leftX <= rx) {
            if (startPos === null) {
                startPos = {x: this.leftX, y: this.dom.offsetTop - 5};
            }
            lineVertices.push({x: rx, y: this.dom.offsetTop - 5});
        }
        lx += width;
        rx += 10;
        if (rx > this.rightX) {
            rx = this.rightX;
        }
        if (this.leftX <= rx) {
            if (startPos === null) {
                ratio = (this.leftX - lx) / 10;
                startPos = {x: this.leftX, y: this.dom.offsetTop + Util.getMidpoint(0, 10, ratio)};
            }
            lineVertices.push({x: rx, y: this.dom.offsetTop + 5});
        }
        lx += 10;
        rx += width;
        if (rx > this.rightX) {
            rx = this.rightX;
        }
        if (this.leftX <= rx) {
            if (startPos === null) {
                startPos = {x: this.leftX, y: this.dom.offsetTop + 5};
            }
            lineVertices.push({x: rx, y: this.dom.offsetTop + 5});
        }
        lx += width;
        rx += 15;
        if (rx > this.rightX) {
            rx = this.rightX;
        }
        if (this.leftX <= rx) {
            if (startPos === null) {
                ratio = (this.leftX - lx) / 15;
                startPos = {x: this.leftX, y: this.dom.offsetTop - Util.getMidpoint(0, 15, ratio)};
            }
            lineVertices.push({x: rx, y: this.dom.offsetTop - 10});
        }
        lx += 15;
        rx += width;
        if (rx > this.rightX) {
            rx = this.rightX;
        }
        if (this.leftX <= rx) {
            if (startPos === null) {
                startPos = {x: this.leftX, y: this.dom.offsetTop - 10};
            }
            lineVertices.push({x: rx, y: this.dom.offsetTop - 10});
        }
        lx += width;
        rx += 10;
        if (rx > this.rightX) {
            rx = this.rightX;
        }
        if (this.leftX <= rx) {
            if (startPos === null) {
                ratio = (this.leftX - lx) / 10;
                startPos = {x: this.leftX, y: this.dom.offsetTop - Util.getMidpoint(0, 10, ratio)};
            }
            lineVertices.push({x: rx, y: this.dom.offsetTop});
        }
        lx += 10;
        rx += width;
        if (rx > this.rightX) {
            rx = this.rightX;
        }
        if (this.leftX <= rx) {
            if (startPos === null) {
                startPos = {x: this.leftX, y: this.dom.offsetTop};
            }
            lineVertices.push({x: rx, y: this.dom.offsetTop});
        }

        ctx.beginPath();

        ctx.moveTo(startPos.x, startPos.y);
        lineVertices.forEach((v) => {
            ctx.lineTo(v.x, v.y);
        });
        //ctx.lineTo(this.dom.offsetLeft + this.dom.offsetWidth, this.dom.offsetTop);


        ctx.stroke();
    }

    calcRetio(x1, x2)
    {

    }

    /**
     * 更新
     */
    update()
    {
        if (this.animFunc !== null) {
            this.animFunc();
        }
    }

    /**
     * 出現
     */
    appear()
    {
        this.leftX = this.dom.offsetLeft;
        this.rightX = this.dom.offsetLeft;
        this.animFunc = this.appearAnimation;
    }

    /**
     * 出現アニメーション
     */
    appearAnimation()
    {
        if (window.hgn.animCnt < 20) {
            this.rightX = Util.getMidpoint(this.leftX, this.dom.offsetLeft + this.dom.offsetWidth,
                window.hgn.animCnt / 20);
        } else {
            this.leftX = this.dom.offsetLeft;
            this.rightX = this.dom.offsetLeft + this.dom.offsetWidth;
            this.animFunc = null;
        }
    }

    /**
     * 消える
     */
    disappear()
    {
        this.animFunc = this.disappearAnimation;
    }

    /**
     * 消えるアニメーション
     */
    disappearAnimation()
    {
        if (window.hgn.animCnt < 20) {
            this.leftX = Util.getMidpoint(this.dom.offsetLeft, this.dom.offsetLeft + this.dom.offsetWidth,
                window.hgn.animCnt / 20);
        } else {
            this.leftX = 0;
            this.rightX = 0;
            this.animFunc = null;
        }
    }
}
