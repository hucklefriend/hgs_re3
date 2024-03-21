import {Vertex} from '../hgn/vertex.js';
import {Param} from '../hgn/param.js';

export class Node
{
    constructor(x = 0, y = 0, w = 0, h = 0, notchSize = 0)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.notchSize = notchSize;
        this.vertices = [];

        if (w > 0 && h > 0 && notchSize > 0) {
            this.setOctagon();
        }
    }

    setOctagon()
    {
        this.vertices = [
            new Vertex(this.x + this.notchSize, this.y),
            new Vertex(this.x + this.w - this.notchSize, this.y),
            new Vertex(this.x + this.w, this.y + this.notchSize),
            new Vertex(this.x + this.w, this.y + this.h - this.notchSize),
            new Vertex(this.x + this.w - this.notchSize, this.y + this.h),
            new Vertex(this.x + this.notchSize, this.y + this.h),
            new Vertex(this.x, this.y + this.h - this.notchSize),
            new Vertex(this.x, this.y +  this.notchSize),
        ];
    }

    setShapePath(ctx, offsetX = 0, offsetY = 0)
    {
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x + offsetX, this.vertices[0].y + offsetY);
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x + offsetX, this.vertices[i].y + offsetY);
        }
        ctx.closePath();
    }

    setShapeVertexArc(ctx, r)
    {
        this.vertices.forEach(vertex => {
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, r, 0, Param.MATH_PI_2, false);
            ctx.fill();
        });
    }

    move(offsetX, offsetY)
    {
        this.x += offsetX;
        this.y += offsetY;
        this.setOctagon();
    }
}

export class DOMNode extends Node
{
    constructor(DOM, notchSize) {
        super(DOM.offsetLeft, DOM.offsetTop, DOM.offsetWidth, DOM.offsetHeight, notchSize);
    }
}

export class TitleNode extends DOMNode
{
    constructor(DOM) {
        super(DOM, 15);
    }

    draw(ctx) {
        super.setShapePath(ctx);

        ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 3; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル
        ctx.shadowColor = "lime"; // 影の色
        ctx.shadowBlur = 15; // 影のぼかし効果
        ctx.stroke();
    }
}


export class BackNode extends DOMNode
{
    constructor(DOM) {
        super(DOM, 10);
    }

    draw(ctx) {
        super.setShapePath(ctx);

        // Set line color
        ctx.strokeStyle = "rgba(0, 180, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 2; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル
        ctx.shadowColor = "lime"; // 影の色
        ctx.shadowBlur = 10; // 影のぼかし効果
        ctx.stroke();
    }
}

export class ChildNode extends DOMNode
{
    constructor(DOM) {
        super(DOM, 15);
    }

    draw(ctx) {
        super.setShapePath(ctx);

        // Set line color
        ctx.strokeStyle = "rgba(0, 180, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 2; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル
        ctx.shadowColor = "lime"; // 影の色
        ctx.shadowBlur = 10; // 影のぼかし効果
        ctx.stroke();

        // ctx.fillStyle = "rgba(0, 2550, 0, 0.8)";
        // ctx.shadowColor = "lime"; // 影の色
        // ctx.shadowBlur = 10; // 影のぼかし効果
        // super.setShapeVertexArc(ctx, 3)
    }
}


class ContentNode extends DOMNode
{
    constructor(DOM) {
        super(DOM, 50);
    }

    draw(ctx) {
        super.setShapePath(ctx);

        // Set line color
        ctx.strokeStyle = "rgba(0, 180, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 2; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル
        ctx.shadowColor = "lime"; // 影の色
        ctx.shadowBlur = 10; // 影のぼかし効果
        ctx.stroke();
    }
}

