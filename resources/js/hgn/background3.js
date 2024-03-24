import {OctaNode} from './node/octa-node.js';
import {PointNode} from './node/point-node.js';
import {Param} from './param.js';
import {Vertex} from './vertex.js';

export class Background3
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        this.canvas = document.querySelector('#bg3');

        this.canvas.width = window.innerWidth + 100;
        this.canvas.height = window.innerHeight + 100;

        this.ctx = null;

        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
        }

        this.seed = 0;

        this.json = {octagons:[], arcs: [], lines: []};
    }

    draw()
    {
        this.drawLight();
        this.draw1();
    }

    drawLight()
    {
        this.ctx.beginPath();
        this.ctx.ellipse(this.canvas.width/2, this.canvas.height/2, this.canvas.width / 3, this.canvas.height, 0, 0, Param.MATH_PI_2);
        this.ctx.closePath();

        // グラデーションを作成
        let gradient = this.ctx.createRadialGradient(this.canvas.width/2, this.canvas.height/2, 0, this.canvas.width/2, this.canvas.height/2, 150);
        gradient.addColorStop(0, 'rgba(80, 80, 80, 0.7)');
        gradient.addColorStop(0.3, 'rgba(30, 60, 30, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');

        // グラデーションを塗りつぶしスタイルに設定
        this.ctx.fillStyle = gradient;

        this.ctx.shadowColor = "rgba(50, 100, 50, 0.4)"; // 影の色
        this.ctx.shadowBlur = 20; // 影のぼかし効果

        // 楕円形を塗りつぶす
        this.ctx.fill();
    }

    draw2()
    {
        this.ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
        this.ctx.lineWidth = 1; // 線の太さ
        this.ctx.shadowColor = "lime"; // 影の色
        this.ctx.shadowBlur = 10; // 影のぼかし効果
        this.ctx.fillStyle = "rgba(0, 130, 0, 0.8)"; // 線の色と透明度

        this.seed = 11;

        let hexNum = 15;
        let nodes = [];
        for (let i = 0; i < hexNum; i++) {
            let size = this.random(20, 40)
            let n = new OctaNode(this.random(100, 300), this.random(100, 300), size, size, size / 3);
            nodes.push(n);
        }

        nodes[2].move(40, 40);
        nodes[3].move(-140, -100);
        nodes[4].move(150, -10);
        nodes[5].move(0, -30);
        nodes[7].move(-40, -30);
        nodes[8].move(-60, -60);
        nodes[9].move(30, 0);

        this.seed = 200;
        let ptNum = 3;
        let points = [];
        for (let i = 0; i < ptNum; i++) {
            let v = new Vertex(this.random(100, 300), this.random(100, 300));

            switch (i) {
                case 0:
                    v.move(-40, -60);
                    break;
                case 1:
                    v.move(0, 10);
                    break;
            }

            points.push(v);
        }

        let nn1 = 3;
        let nn2 = 3;
        let nv1 = 0;
        let nv2 = 3;
        let pn1 = 0;
        let pn2 = 0;
        this.drawLine(nodes[nn1].vertices[nv1].x, nodes[nn1].vertices[nv1].y, points[pn1].x, points[pn1].y);

        nv1 = 3;
        pn1 = 1;
        this.drawLine(nodes[nn1].vertices[nv1].x, nodes[nn1].vertices[nv1].y, points[pn1].x, points[pn1].y);

        nn1 = 13;
        nv1 = 0;
        pn1 = 1;
        this.drawLine(nodes[nn1].vertices[nv1].x, nodes[nn1].vertices[nv1].y, points[pn1].x, points[pn1].y);

        nodes.forEach(node => {
            this.drawOctagon(node);
        });

        points.forEach(node => {
            //this.drawArc(node);
        });
    }

    random(min, max)
    {
        var x = Math.sin(this.seed++) * 10000;
        var random = x - Math.floor(x);
        return Math.floor(random * (max - min + 1)) + min;
    }

    draw1()
    {
        // Set line color
        this.ctx.strokeStyle = "rgba(0, 40, 0, 0.5)"; // 線の色と透明度
        this.ctx.lineWidth = 1; // 線の太さ
        this.ctx.shadowColor = "lime"; // 影の色
        this.ctx.shadowBlur = 10; // 影のぼかし効果
        this.ctx.fillStyle = "rgba(0, 50, 0, 0.5)"; // 線の色と透明度
        this.ctx.font = '24px Arial';

        let json = {octagons:[], arcs: [], lines: []};
        let n1 = new OctaNode(300, 300, 30, 30, 9);
        this.drawOctagon(n1, 1);

        let v = 1;
        let v1 = new Vertex(280, 288);
        this.drawArc(v1, v);
        this.drawLine(n1.vertices[7].x, n1.vertices[7].y, v1.x, v1.y);

        let n2 = new OctaNode(330, 250, 30, 30, 9);
        this.drawOctagon(n2, 2);
        this.drawLine(n1.vertices[1].x, n1.vertices[1].y, n2.vertices[5].x, n2.vertices[5].y);

        let v2 = new Vertex(240, 350);
        this.drawArc(v2, ++v);
        this.drawLine(v1.x, v1.y, v2.x, v2.y);

        let n3 = new OctaNode(350, 370, 30, 30, 9);
        this.drawOctagon(n3, 3);
        this.drawLine(n3.vertices[0].x, n3.vertices[0].y, n1.vertices[4].x, n1.vertices[4].y);

        let n4 = new OctaNode(160, 270, 40, 40, 12);
        this.drawOctagon(n4, 4);
        this.drawLine(n4.vertices[3].x, n4.vertices[3].y, v2.x, v2.y);

        let v3 = new Vertex(150, 330);
        this.drawArc(v3, ++v);
        this.drawLine(n4.vertices[5].x, n4.vertices[5].y, v3.x, v3.y);

        let v4 = new Vertex(130, 230);
        this.drawArc(v4, ++v);
        this.drawLine(n4.vertices[0].x, n4.vertices[0].y, v4.x, v4.y);

        let v5 = new Vertex(130, 200);
        this.drawArc(v5, ++v);
        this.drawLine(v5.x, v5.y, v4.x, v4.y);

        let n5 = new OctaNode(180, 370, 25, 25, 8);
        this.drawOctagon(n5, 5);
        this.drawLine(n5.vertices[2].x, n5.vertices[2].y, v2.x, v2.y);

        let v6 = new Vertex(260, 240);
        this.drawArc(v6, ++v);
        this.drawLine(v6.x, v6.y, v1.x, v1.y);

        let n6 = new OctaNode(290, 170, 25, 25, 8);
        this.drawOctagon(n6, 6);
        this.drawLine(n6.vertices[6].x, n6.vertices[6].y, v6.x, v6.y);

        let v7 = new Vertex(350, 180);
        this.drawArc(v7, ++v);
        this.drawLine(v7.x, v7.y, v1.x, v1.y);
        this.drawLine(v7.x, v7.y, n6.vertices[3].x, n6.vertices[3].y);

        let n7 = new OctaNode(370, 170, 25, 25, 8);
        this.drawOctagon(n7, 7);
        this.drawLine(n7.vertices[6].x, n7.vertices[6].y, v7.x, v7.y);

        let n8 = new OctaNode(410, 230, 23, 23, 7);
        this.drawOctagon(n8, 8);
        this.drawLine(n7.vertices[4].x, n7.vertices[4].y, n8.vertices[0].x, n8.vertices[0].y);

        let v8 = new Vertex(380, 250);
        this.drawArc(v8, ++v);
        this.drawLine(v8.x, v8.y, n2.vertices[2].x, n2.vertices[2].y);
        this.drawLine(n7.vertices[4].x, n7.vertices[4].y, n8.vertices[0].x, n8.vertices[0].y);

        let v9 = new Vertex(400, 300);
        this.drawArc(v9, ++v);
        this.drawLine(v8.x, v8.y, v9.x, v9.y);

        this.drawLine2(n3.vertices[1], v9);


        let v10 = new Vertex(300, 370);
        this.drawArc(v10, ++v);
        this.drawLine2(n1.vertices[5], v10);

        let v11 = new Vertex(270, 410);
        this.drawArc(v11, ++v);
        this.drawLine2(v11, v10);

        let v12 = new Vertex(330, 400);
        this.drawArc(v12, ++v);
        this.drawLine2(v12, v10);

        let v13 = new Vertex(200, 150);
        this.drawArc(v13, ++v);


        this.drawLine2(n3.vertices[5], v12);

        console.debug(JSON.stringify(json));
    }

    drawOctagon(node, i)
    {
        this.json.octagons.push(node);
        node.setShapePath(this.ctx);
        this.ctx.stroke();

        //this.ctx.fillText(i.toString(), node.x, node.y)
    }

    drawArc(v, i)
    {
        this.json.arcs.push({x: v.x, y: v.y});
        this.ctx.beginPath();
        this.ctx.arc(v.x, v.y, 3, 0, Param.MATH_PI_2, false);
        this.ctx.fill();

        //this.ctx.fillText(i.toString(), v.x, v.y)
    }

    drawLine(x1, y1, x2, y2)
    {
        this.json.lines.push({x1: x1, y1: y1, x2: x2, y2: y2});
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawLine2(v1, v2)
    {
        this.json.lines.push({x1: v1.x, y1: v1.y, x2: v2.x, y2: v2.y});
        this.ctx.beginPath();
        this.ctx.moveTo(v1.x, v1.y);
        this.ctx.lineTo(v2.x, v2.y);
        this.ctx.stroke();
    }

    scroll() {
        this.canvas.style.top = -50 - (window.scrollY / 4) + 'px';
    }
}

