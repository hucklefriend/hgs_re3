import {Bg2OctaNode, OctaNode} from './node/octa-node.js';
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
        this.setCanvasSize();

        this.ctx = null;

        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
        }

        this.nodes = [];
        this.seed = 1;
        this.json = {octagons:[], arcs: [], lines: []};

        this.nodes = [];
        this.generateNodes();
    }

    setCanvasSize()
    {
        this.canvas.width = 300;
        this.canvas.height = 800;
        this.canvas.style.width = this.canvas.width * Param.BG3_SIZE_RATE;
        this.canvas.style.height = this.canvas.height * Param.BG3_SIZE_RATE;

        this.resize();
    }

    generateNodes()
    {
        let node = null;
        let x = this.canvas.width / Param.BG3_SIZE_RATE + this.random(-20, 20);
        let y = this.canvas.height / Param.BG3_SIZE_RATE + this.random(-20, 20);

        // 最初のノード
        if (this.random(0, 1) === 0) {
            node = this.generateRandomOctaNode(x, y);
        } else {
            node = this.generateRandomPointNode(x, y);
        }
        this.nodes.push(node);

        // 最初のノードをべースに広げていく
        this.addConnectedNode(node, 1);
    }

    generateRandomOctaNode(x, y)
    {
        let wh = 7;
        return new OctaNode(x, y, wh, wh, 2);
    }

    generateRandomPointNode(x, y)
    {
        return new PointNode(x, y, 1);
    }

    addConnectedNode(node, depth)
    {
        if (depth >= 1000) {
            return ;
        }

        // とりあえず8方向へ
        for (let i = 0; i < 8; i++) {
            if (this.random(0, 1) === 0) {
                continue;
            }
            let retry = 0;

            let x = 0;
            let y = 0;
            switch (i) {
                case 0:
                case 7:
                    x = -1;
                    y = -1;
                    break;
                case 1:
                case 2:
                    x = 1;
                    y = -1;
                    break;
                case 3:
                case 4:
                    x = 1;
                    y = 1;
                    break;
                case 5:
                case 6:
                    x = -1;
                    y = 1;
                    break;
            }

            let w = node instanceof OctaNode ? node.w : node.r;
            x = node.x + (w + this.random(10, 20)) * x;
            y = node.y + (w + this.random(10, 20)) * y;

            if (x < 0 || y < 0 || x > this.canvas.width || y > this.canvas.height) {
                continue;
            }

            let newNode = null;
            if (this.random(0, 2) === 0) {
                newNode = this.generateRandomOctaNode(x, y);
            } else {
                newNode = this.generateRandomPointNode(x, y);
            }

            if (!this.isHitAll(newNode)) {
                if (newNode instanceof OctaNode) {
                    if (node instanceof OctaNode) {
                        let nearPoint = this.findClosestVertexNo(node.vertices[i], newNode.vertices);
                        node.connect2OctaNode(i, newNode, nearPoint);
                    } else {
                        let nearPoint = this.findClosestVertexNo(node, newNode.vertices);
                        node.connect2OctaNode(newNode, nearPoint);
                    }
                } else {
                    newNode = this.generateRandomPointNode(x, y);
                    if (node instanceof OctaNode) {
                        node.connect2PointNode(i, newNode);
                    } else {
                        node.connect2PointNode(newNode);
                    }
                }

                this.nodes.push(newNode);
                this.addConnectedNode(newNode, depth + 1);
            } else {
                newNode = null;

                if (retry < 3) {
                    i--;
                    retry++;
                }
            }
        }
    }

    findClosestVertexNo(v, arr)
    {
        let closestNo = null;
        let minDistance = Infinity;

        arr.forEach((vertex, no) => {
            const distance = Math.sqrt((v.x - vertex.x) ** 2 + (v.y - vertex.y) ** 2);
            if (distance < minDistance) {
                closestNo = no;
                minDistance = distance;
            }
        });

        return closestNo;
    }


    isHitAll(newNode)
    {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.isHit(this.nodes[i], newNode)) {
                return true;
            }
        }

        return false;
    }

    isHit(node1, node2)
    {
        if (node1 instanceof OctaNode) {
            if (node2 instanceof OctaNode) {
                return this.isRectOverlap(node1, node2);
            } else if (node2 instanceof PointNode) {
                return this.isVertexNearRect(node2, node1);
            }
        } else if (node1 instanceof PointNode) {
            if (node2 instanceof OctaNode) {
                return this.isVertexNearRect(node1, node2);
            } else if (node2 instanceof PointNode) {
                return this.isVertexNearVertex(node2, node1);
            }
        }
    }

    isVertexNearVertex(vertex1, vertex2, margin = 15)
    {
        const distance = Math.sqrt((vertex1.x - vertex2.x) ** 2 + (vertex1.y - vertex2.y) ** 2);
        return distance <= margin;
    }

    isVertexNearRect(vertex, rect, margin = 7)
    {
        // VertexがRectの辺界+マージン内にあるか判断
        const isWithinLeftBound = vertex.x >= (rect.left - margin);
        const isWithinRightBound = vertex.x <= (rect.right + margin);
        const isWithinTopBound = vertex.y >= (rect.top - margin);
        const isWithinBottomBound = vertex.y <= (rect.bottom + margin);

        return isWithinLeftBound && isWithinRightBound && isWithinTopBound && isWithinBottomBound;
    }

    isRectOverlap(rect1, rect2, margin = 15)
    {
        // rect1がrect2の右側にある場合（マージンを考慮）
        if (rect1.left > rect2.right + margin) return false;
        // rect1がrect2の左側にある場合（マージンを考慮）
        if (rect1.right < rect2.left - margin) return false;
        // rect1がrect2の上側にある場合（マージンを考慮）
        if (rect1.top > rect2.bottom + margin) return false;
        // rect1がrect2の下側にある場合（マージンを考慮）
        if (rect1.bottom < rect2.top - margin) return false;

        // どの条件も満たさなければ、少なくとも一部が重なっている
        return true;
    }

    draw()
    {
        this.drawLight();
        this.drawNodeNetwork();
    }

    drawLight()
    {
        let centerX = this.canvas.width / 2;
        let centerY = window.innerHeight / (Param.BG3_SIZE_RATE * 2) + Param.BG3_OFFSET;

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

    drawNodeNetwork()
    {
        this.ctx.strokeStyle = "rgba(30, 50, 30, 0.6)"; // 線の色と透明度
        this.ctx.lineWidth = 1; // 線の太さ
        this.ctx.shadowColor = "rgb(50, 80, 50)"; // 影の色
        this.ctx.shadowBlur = 30; // 影のぼかし効果
        this.ctx.fillStyle = "rgba(40, 80, 40, 0.6)"; // 線の色と透明度

        this.nodes.forEach(node => {
            node.draw(this.ctx);
            node.connects.forEach((connect, vertexNo) => {
                if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING) {
                    let x = node.x;
                    let y = node.y;
                    if (node instanceof OctaNode) {
                        x = node.vertices[vertexNo].x;
                        y = node.vertices[vertexNo].y;
                    }

                    let targetVertex = connect.getVertex();

                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y);
                    this.ctx.lineTo(targetVertex.x, targetVertex.y);
                    this.ctx.stroke();
                }
            });
        });
    }

    random(min, max)
    {
        let x = Math.sin(this.seed++) * 10000;
        let random = x - Math.floor(x);
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
        this.canvas.style.top = (Param.BG3_OFFSET * -1) - (window.scrollY / 6) + 'px';
    }
}

