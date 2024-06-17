

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
     * 描画
     *
     * @param ctx
     */
    draw(ctx)
    {
        let width = this.dom.offsetWidth / 5;
        let w = width;

        ctx.beginPath();
        ctx.moveTo(this.dom.offsetLeft, this.dom.offsetTop);
        ctx.lineTo(this.dom.offsetLeft + w, this.dom.offsetTop);
        w += 10;
        ctx.lineTo(this.dom.offsetLeft + w, this.dom.offsetTop - 10);
        w += width;
        ctx.lineTo(this.dom.offsetLeft + w, this.dom.offsetTop - 10);
        w += 25;
        ctx.lineTo(this.dom.offsetLeft + w, this.dom.offsetTop + 15);
        w += width;
        ctx.lineTo(this.dom.offsetLeft + w, this.dom.offsetTop + 15);
        w += 20;
        ctx.lineTo(this.dom.offsetLeft + w, this.dom.offsetTop + 5);
        w += width;
        ctx.lineTo(this.dom.offsetLeft + w, this.dom.offsetTop + 5);
        w += 5;
        ctx.lineTo(this.dom.offsetLeft + w, this.dom.offsetTop);
        ctx.lineTo(this.dom.offsetLeft + this.dom.offsetWidth, this.dom.offsetTop);
        ctx.stroke();
    }
}
