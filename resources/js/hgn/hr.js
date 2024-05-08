

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
        console.log('hr: ' + this.dom.offsetLeft + ', ' + this.dom.offsetTop);

        ctx.beginPath();
        ctx.moveTo(this.dom.offsetLeft, this.dom.offsetTop);
        ctx.lineTo(this.dom.offsetLeft + this.dom.offsetWidth, this.dom.offsetTop);
        ctx.stroke();
    }
}
