
import {Bg2Network} from './network.js';
import {Param} from './param.js';
import {HorrorGameNetwork} from "../hgn.js";

export class Background2
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        this.canvas = document.querySelector('#bg2');
        this.ctx = this.canvas.getContext('2d');

        this.parentNodes = [];
        this.networks = [];

        this.fadeCnt = 7;

        this.resize();

        if (Param.BG3_MAKE_NETWORK_MODE) {
            this.canvas.style.backdropFilter = "blur(0px)";
        }
    }

    /**
     * 親ノードの追加
     *
     * @param node
     */
    addParentNode(node)
    {
        this.parentNodes.push(node);
    }

    /**
     * リロード
     */
    reload()
    {
        // TODO これは各ノード側がやるべきで、いずれは消す
        this.networks.forEach(network => {
            network.reload();
        });
    }

    /**
     * 表示クリア
     */
    clear()
    {
        this.parentNodes = [];

        // TODO これは各ノード側がやるべきで、いずれは消す
        this.networks.forEach(network => {
            network.delete();
        });

        this.networks = [];
    }

    /**
     * 描画
     */
    draw()
    {
        const hgn = HorrorGameNetwork.getInstance();

        let offsetX = hgn.getScrollX() - (hgn.getScrollX() / Param.BG2_SCROLL_RATE);
        let offsetY = hgn.getScrollY() - (hgn.getScrollY() / Param.BG2_SCROLL_RATE);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.parentNodes.forEach(node => {
            node.drawSubNetwork(this.ctx, offsetX, offsetY);
        });

        // TODO これは各ノード側がやるべきで、いずれは消す
        this.networks.forEach(network => {
            network.draw(this.ctx, offsetX, offsetY, Param.BG2_MAKE_NETWORK_MODE);
        });
    }

    addFadeCnt(addCnt)
    {
        this.fadeCnt += addCnt;
        if (this.fadeCnt > 7) {
            this.fadeCnt = 7;
        } else if (this.fadeCnt < 0) {
            this.fadeCnt = 0;
        }

        this.setStrokeStyle();
    }

    setStrokeStyle()
    {
        let alpha = this.fadeCnt / 10;
        this.ctx.strokeStyle = "rgba(0, 70, 0, " + alpha + ")"; // 線の色と透明度
    }

    /**
     * ウィンドウサイズの変更
     */
    resize()
    {
        const hgn = HorrorGameNetwork.getInstance();

        this.canvas.width = document.documentElement.scrollWidth;
        this.canvas.height = hgn.getHeight();

        let alpha = this.fadeCnt / 10;
        this.ctx.strokeStyle = "rgba(0, 70, 0, " + alpha + ")"; // 線の色と透明度
        this.ctx.lineWidth = 3; // 線の太さ
        // this.ctx.shadowColor = "lime"; // 影の色
        // this.ctx.shadowBlur = 5; // 影のぼかし効果
        this.ctx.fillStyle = "rgba(0, 150, 0, 0.8)";
        this.ctx.font = '20px Arial';

        this.reload();
    }

    /**
     * スクロール
     */
    scroll()
    {
    }
}
