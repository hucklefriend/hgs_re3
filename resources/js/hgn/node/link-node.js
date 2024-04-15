import {Vertex} from '../vertex.js';
import {Param} from '../param.js';
import {Network} from '../network.js';
import {PointNode} from './point-node.js';
import {OctaNodeConnect, PointNodeConnect, Bg2Connect} from './connect.js';
import {HorrorGameNetwork} from '../../hgn.js';
import {DOMNode} from './octa-node.js';


export class LinkNode extends DOMNode
{
    constructor(DOM, notchSize = 15)
    {
        super(DOM, notchSize);

        this.isHover = false;

        DOM.addEventListener('mouseenter', () => this.mouseEnter());
        DOM.addEventListener('mouseleave', () => this.mouseLeave());
        DOM.addEventListener('click', () => this.mouseClick());

        if (Param.IS_TOUCH_DEVICE) {
            DOM.addEventListener('touchstart', () => this.mouseEnter());
            DOM.addEventListener('touchend', () => this.mouseLeave());
        }

        this.subNodes = [];
    }

    mouseEnter()
    {
        this.isHover = true;
        this.DOM.classList.add('active');

        const hgn = HorrorGameNetwork.getInstance();
        hgn.setRedraw();
    }

    mouseLeave()
    {
        this.isHover = false;
        this.DOM.classList.remove('active');

        const hgn = HorrorGameNetwork.getInstance();
        hgn.setRedraw();
    }

    mouseClick()
    {
        const a = this.DOM.querySelector('a');
        if (a) {
            a.click();
        }
    }

    touchStart()
    {
        this.mouseEnter();
    }

    touchEnd()
    {
        this.mouseLeave();
    }

    draw(ctx)
    {
        if (this.isHover) {
            ctx.strokeStyle = "rgba(0, 180, 0, 0.4)"; // 線の色と透明度
            ctx.shadowColor = "lime"; // 影の色
            ctx.shadowBlur = 10; // 影のぼかし効果
            ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        } else {
            ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
            ctx.shadowColor = "rgb(0,150, 0)"; // 影の色
            ctx.shadowBlur = 8; // 影のぼかし効果
            ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
        }
        ctx.lineWidth = 2; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル

        super.setShapePath(ctx);
        ctx.stroke();
        ctx.fill();



    }
}

export class HgsTitleLinkNode extends LinkNode
{

    constructor(DOM)
    {
        super(DOM, 20);
    }

    draw(ctx)
    {
        if (this.isHover) {
            ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"; // 線の色と透明度
            ctx.shadowColor = "lime"; // 影の色
            ctx.shadowBlur = 15; // 影のぼかし効果
            ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        } else {
            ctx.strokeStyle = "rgba(0, 200, 0, 0.6)"; // 線の色と透明度
            ctx.shadowColor = "rgb(0,150, 0)"; // 影の色
            ctx.shadowBlur = 8; // 影のぼかし効果
            ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
        }
        ctx.lineWidth = 7; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル

        super.setShapePath(ctx);
        ctx.stroke();
        ctx.fill();
    }
}


export class BackNode extends LinkNode
{
    constructor(DOM)
    {
        super(DOM, 10);
    }
}