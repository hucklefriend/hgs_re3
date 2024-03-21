import {Node} from '../hgn/node.js';
import {Param} from '../hgn/param.js';
import {Vertex} from '../hgn/vertex.js';

export class Background1
{

    constructor(network) {
        this.scrollRate = 1.5;

        this.bg1Canvas = document.getElementById('backgroundCanvas1');
        this.bg1Canvas.width = document.documentElement.scrollWidth;
        this.bg1Canvas.height = document.documentElement.scrollHeight;
        this.bg2Canvas = document.getElementById('backgroundCanvas2');
        this.bg2Canvas.width = document.documentElement.scrollWidth;
        this.bg2Canvas.height = document.documentElement.scrollHeight;

        this.bg1Ctx = null;
        if (this.bg1Canvas.getContext) {
            this.bg1Ctx = this.bg1Canvas.getContext('2d');

            this.bg1Ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
            this.bg1Ctx.lineWidth = 1; // 線の太さ
            this.bg1Ctx.shadowColor = "lime"; // 影の色
            this.bg1Ctx.shadowBlur = 5; // 影のぼかし効果
            this.bg1Ctx.fillStyle = "rgba(0, 150, 0, 0.8)"; // 線の色と透明度
        }

        this.bg2Ctx = null;
        if (this.bg2Canvas.getContext) {
            this.bg2Ctx = this.bg2Canvas.getContext('2d');
            this.bg2Ctx.strokeStyle = "rgba(0, 200, 0, 0.8)"; // 線の色と透明度
            this.bg2Ctx.lineWidth = 1; // 線の太さ
            this.bg2Ctx.shadowColor = "lime"; // 影の色
            this.bg2Ctx.shadowBlur = 10; // 影のぼかし効果
            this.bg2Ctx.fillStyle = "rgba(0, 200, 0, 0.8)"; // 線の色と透明度
        }

        this.nodes = [];
        this.connections = [];

        this.init(network);
    }

    init(network) {
        network.childNodes.forEach(child => {
            for (let i = 0; i < 8; i++) {
                if (this.judge()) {
                    this.addNode(i, child.vertices[i]);
                }
            }
        });

        this.scroll();
    }

    judge(rate = 50) {
        //return true;
        return Math.random() * 100 <= 50;
    }

    addNode(i, v) {
        let x = v.x;
        let y = v.y;
        let vn = 0;

        switch (i) {
            case 0:
                x -= 80;
                y -= 80;
                vn = 4
                break;
            case 1:
                x += 80;
                y -= 80;
                vn = 6;
                break;
            case 2:
                x += 80;
                y -= 40;
                vn = 7;
                break;
            case 3:
                x += 100;
                y += 30;
                vn = 0;
                break;
            case 4:
                x += 10;
                y += 40;
                vn = 0;
                break;
            case 5:
                x -= 10;
                y += 40;
                vn = 2;
                break;
            case 6:
                x -= 30;
                y += 70;
                vn = 2;
                break;
            case 7:
                x -= 40;
                y += 40;
                vn = 1;
                break;
        }

        let node = new Node(x, y, 40, 40, 12);
        this.nodes.push(node);

        this.connections.push({v1: v, v2: node.vertices[vn]});
    }

    draw() {
        this.bg1Ctx.clearRect(0, 0, this.bg1Canvas.width, this.bg1Canvas.height);
        this.drawNode();
        this.drawConnection();
    }

    drawNode() {

        let scrollX2 = 0;//window.scrollX / this.scrollRate;
        let scrollY2 = 0;//window.scrollY / this.scrollRate;
        this.nodes.forEach(node => {
            node.setShapePath(this.bg1Ctx, scrollX2, scrollY2);
            this.bg1Ctx.stroke();
        });
    }

    drawConnection() {
        let scrollX1 = window.scrollX;
        let scrollY1 = window.scrollY;
        let scrollX2 = scrollX1;//window.scrollX / this.scrollRate;
        let scrollY2 = window.scrollY / this.scrollRate;

        this.connections.forEach(con => {
            this.bg1Ctx.beginPath();
            this.bg1Ctx.moveTo(con.v1.x/* - scrollX1*/, con.v1.y/* - scrollY1*/);
            this.bg1Ctx.lineTo(con.v2.x, con.v2.y);
            this.bg1Ctx.stroke();
        });
    }

    scroll() {
        this.draw();
        //this.bg1Canvas.style.top = (-window.scrollY / this.scrollRate) + 'px';
    }
}

class Background3Maker
{
    constructor(id) {
        this.canvas = document.getElementById(id);

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
        var gradient = this.ctx.createRadialGradient(this.canvas.width/2, this.canvas.height/2, 0, this.canvas.width/2, this.canvas.height/2, 150);
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
            let n = new Node(this.random(100, 300), this.random(100, 300), size, size, size / 3);
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
        let n1 = new Node(300, 300, 30, 30, 9);
        this.drawOctagon(n1, 1);

        let v = 1;
        let v1 = new Vertex(280, 288);
        this.drawArc(v1, v);
        this.drawLine(n1.vertices[7].x, n1.vertices[7].y, v1.x, v1.y);

        let n2 = new Node(330, 250, 30, 30, 9);
        this.drawOctagon(n2, 2);
        this.drawLine(n1.vertices[1].x, n1.vertices[1].y, n2.vertices[5].x, n2.vertices[5].y);

        let v2 = new Vertex(240, 350);
        this.drawArc(v2, ++v);
        this.drawLine(v1.x, v1.y, v2.x, v2.y);

        let n3 = new Node(350, 370, 30, 30, 9);
        this.drawOctagon(n3, 3);
        this.drawLine(n3.vertices[0].x, n3.vertices[0].y, n1.vertices[4].x, n1.vertices[4].y);

        let n4 = new Node(160, 270, 40, 40, 12);
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

        let n5 = new Node(180, 370, 25, 25, 8);
        this.drawOctagon(n5, 5);
        this.drawLine(n5.vertices[2].x, n5.vertices[2].y, v2.x, v2.y);

        let v6 = new Vertex(260, 240);
        this.drawArc(v6, ++v);
        this.drawLine(v6.x, v6.y, v1.x, v1.y);

        let n6 = new Node(290, 170, 25, 25, 8);
        this.drawOctagon(n6, 6);
        this.drawLine(n6.vertices[6].x, n6.vertices[6].y, v6.x, v6.y);

        let v7 = new Vertex(350, 180);
        this.drawArc(v7, ++v);
        this.drawLine(v7.x, v7.y, v1.x, v1.y);
        this.drawLine(v7.x, v7.y, n6.vertices[3].x, n6.vertices[3].y);

        let n7 = new Node(370, 170, 25, 25, 8);
        this.drawOctagon(n7, 7);
        this.drawLine(n7.vertices[6].x, n7.vertices[6].y, v7.x, v7.y);

        let n8 = new Node(410, 230, 23, 23, 7);
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

