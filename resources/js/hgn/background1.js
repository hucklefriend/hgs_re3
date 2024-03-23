import {OctaNode, LinkNode} from '../hgn/node.js';
import {Param} from '../hgn/param.js';
import {Vertex} from '../hgn/vertex.js';

/**
 * 背景1、メインと背景2のノードを繋ぐエッジや移動するアニメーションを描画
 * スクロール時のメインのノードとの接点のズレが発生しないようにするためこうなった
 * 再描画頻度も高いし分離
 */
export class Background1
{
    /**
     * コンストラクタ
     *
     * @param network
     */
    constructor(network)
    {
        this.scrollRate = 1.5;

        this.canvas = document.querySelector('#bg1');
        this.canvas.width = document.documentElement.scrollWidth;
        this.canvas.height = document.documentElement.scrollHeight;

        this.ctx = null;
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');

            this.ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
            this.ctx.lineWidth = 1; // 線の太さ
            this.ctx.shadowColor = "lime"; // 影の色
            this.ctx.shadowBlur = 5; // 影のぼかし効果
            this.ctx.fillStyle = "rgba(0, 150, 0, 0.8)"; // 線の色と透明度
        }
    }

    draw(network, bg2)
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resize(network)
    {
        this.canvas.width = document.documentElement.scrollWidth;
        this.canvas.height = document.documentElement.scrollHeight;
    }

    scroll(network, bg2)
    {
    }
}
