import {OctaNode} from './node/octa-node.js';
import {PointNode} from './node/point-node.js';
import {Param} from './param.js';
import {Bg3Network} from './network.js';

export class Background3
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        this.canvas = document.querySelector('#bg3');
        this.setCanvasSize();
        this.ctx = null;
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
        }

        this.networks = [];

        this.generateNetwork();
    }

    /**
     * canvasのサイズ設定
     */
    setCanvasSize()
    {
        this.canvas.width = 300;
        this.canvas.height = 800;
        this.canvas.style.width = this.canvas.width * Param.BG3_SIZE_RATE;
        this.canvas.style.height = this.canvas.height * Param.BG3_SIZE_RATE;

        this.resize();
    }

    generateNetwork()
    {
        this.networks.push(this.generateNetwork2(140, 100));
        this.networks.push(this.generateNetwork1(100, 50));
        this.networks.push(this.generateNetwork2(180, 70));
        this.networks.push(this.generateNetwork2(120, 110));
        this.networks.push(this.generateNetwork1(180, 140));
        this.networks.push(this.generateNetwork1(170, 120));
        this.networks.push(this.generateNetwork1(120, 200));
        this.networks.push(this.generateNetwork2(120, 300));
        this.networks.push(this.generateNetwork2(200, 340));
        this.networks.push(this.generateNetwork1(120, 400));
        this.networks.push(this.generateNetwork2(120, 500));
        this.networks.push(this.generateNetwork1(120, 600));
        this.networks.push(this.generateNetwork1(120, 700));
    }

    generateNetwork1(x, y)
    {
        let parent = this.createOctaNode(x, y);
        let network = new Bg3Network(parent, true);

        let no = 0;
        let n1 = 0;
        no = network.addOctaNode(parent, -10, -8);
        network.addOctaNode(no, -4, -10);

        no = network.addOctaNode(parent, 10, -10);
        network.addOctaNode(no, 8, 8);
        n1 = network.addPointNode(no, -5, -6);
        network.addOctaNode(n1, 0, -8);
        network.addPointNode(no, 5, -6);

        network.addOctaNode(parent, 10, 10);
        no = network.addPointNode(parent, -8, 10);
        network.addOctaNode(no, -12, -2);
        network.addOctaNode(no, -2, 7);

        return network;
    }

    generateNetwork2(x, y)
    {
        let parent = this.createOctaNode(x, y);
        let network = new Bg3Network(parent, true);

        let no = 0;
        let n1 = 0;
        no = network.addOctaNode(parent, -10, -8);

        no = network.addPointNode(parent, 0, -13);
        network.addOctaNode(no, -8, -10);
        network.addOctaNode(no, 9, -13);


        no = network.addOctaNode(parent, 10, -8);
        network.addOctaNode(parent, 10, 10);

        no = network.addPointNode(parent, -8, 10);
        n1 = network.addOctaNode(no, -8, 8);
        network.addOctaNode(n1, -10, 10);
        n1 = network.addOctaNode(no, -10, -5);

        return network;
    }

    createOctaNode(x, y)
    {
        return new OctaNode(x, y, 6, 6, 2);
    }

    draw()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawLight();
        // this.networks.forEach(network => {
        //
        //     this.ctx.font = '8px Arial';
        //     this.ctx.strokeStyle = "rgba(30, 50, 30, 0.8)"; // 線の色と透明度
        //     this.ctx.lineWidth = 1; // 線の太さ
        //     this.ctx.shadowColor = "rgb(50, 80, 50)"; // 影の色
        //     this.ctx.shadowBlur = 3; // 影のぼかし効果
        //     this.ctx.fillStyle = "rgba(40, 80, 40, 0.6)"; // 線の色と透明度
        //
        //     network.draw(this.ctx, 0, 0, Param.BG3_MAKE_NETWORK_MODE);
        // });
    }

    drawLight()
    {
        let centerX = this.canvas.width / 2;
        let centerY = 110;

        // グラデーションを作成
        let gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 400 / Param.BG3_SIZE_RATE);
        gradient.addColorStop(0, 'rgba(80, 90, 80, 0.5)');
        gradient.addColorStop(0.3, 'rgba(10, 30, 10, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.01)');

        // グラデーションを塗りつぶしスタイルに設定
        this.ctx.fillStyle = gradient;

        this.ctx.arc(centerX, centerY, this.canvas.width / 3, 0, Param.MATH_PI_2);

        this.ctx.shadowColor = "rgba(50, 100, 50, 0.4)"; // 影の色
        this.ctx.shadowBlur = 20; // 影のぼかし効果

        // 楕円形を塗りつぶす
        this.ctx.fill();
    }

    resize()
    {
        // キャンバスのサイズよりウィンドウサイズの方が小さくなった時に、キャンバスのleftを調整して中央になるようにする
        if (window.innerWidth < this.canvas.width * Param.BG3_SIZE_RATE) {
            this.canvas.style.left = (window.innerWidth - this.canvas.width * Param.BG3_SIZE_RATE) / 2 + 'px';
        } else {
            this.canvas.style.left = 0;
        }
    }

    scroll()
    {
        this.canvas.style.top = (Param.BG3_OFFSET * -1) - (window.scrollY / Param.BG3_SCROLL_RATE) + 'px';
    }
}

