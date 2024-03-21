
import {Node, DOMNode, BackNode, TitleNode, ChildNode} from '../hgn/node.js';
import {Vertex} from '../hgn/vertex.js';
import {Background1} from '../hgn/background1.js';
import {Background3Maker} from '../hgn/background3.js';
import {Param} from '../hgn/param.js';

export class MainNetwork
{
    constructor()
    {
        this.mainCanvas = document.getElementById('lineCanvas');

        this.mainCanvas.width = document.documentElement.scrollWidth;
        this.mainCanvas.height = document.documentElement.scrollHeight;

        this.mainCtx = null;

        if (this.mainCanvas.getContext) {
            this.mainCtx = this.mainCanvas.getContext('2d');
        }

        this.titleNode = null;
        this.backNode = null;
        this.childNodes = [];
        this.contentNodes = [];

        this.loadNodes();

        this.bg12 = new Background1(this);
        this.bg12.draw();

        this.bg3 = new Background3Maker('backgroundCanvas3')
        this.bg3.draw();

        this.prevScrollX = -99999;
        this.prevScrollY = -99999;


        this.update = this.update.bind(this);
        window.requestAnimationFrame(this.update);
    }

    loadNodes()
    {
        let titleElem = document.getElementById('title-node');
        this.titleNode = new TitleNode(titleElem);

        let backElem = document.getElementById('back-node');
        if (backElem) {
            this.backNode = new BackNode(backElem);
        }

        let childNodeElems = [...document.getElementsByClassName('child-node')];
        childNodeElems.forEach(nodeElem => {
            this.childNodes.push(new ChildNode(nodeElem));
        });

        let contentNodeElems = [...document.getElementsByClassName('content-node')];
        contentNodeElems.forEach(nodeElem =>  {
            this.contentNodes.push(new ContentNode(nodeElem));
        });
    }

    start()
    {
        this.draw();
    }

    draw()
    {
        this.drawConnectLine();
        this.drawOctagons();
    }

    drawConnectLine()
    {
        if (this.backNode) {
            // titleNodeとbackNodeを線でつなげる
            this.mainCtx.beginPath();
            this.mainCtx.moveTo(this.titleNode.vertices[0].x, this.titleNode.vertices[0].y);
            this.mainCtx.lineTo(this.backNode.vertices[4].x, this.backNode.vertices[4].y);
            this.mainCtx.strokeStyle = "rgba(255, 255, 0, 0.8)";
            this.mainCtx.lineWidth = 1;
            this.mainCtx.stroke();
        }


    }

    drawOctagons()
    {
        this.titleNode.draw(this.mainCtx);

        if (this.backNode) {
            this.backNode.draw(this.mainCtx);
        }

        this.childNodes.forEach(childNode => {
            childNode.draw(this.mainCtx);
        });

        this.contentNodes.forEach(contentNode => {
            contentNode.draw(this.mainCtx);
        });
    }

    drawBackground3()
    {

    }

    update()
    {
        this.scroll();

        window.requestAnimationFrame(this.update);
    }

    scroll() {

        if (this.prevScrollX == window.scrollX && this.prevScrollY == window.scrollY) {
            return;
        }

        this.bg12.scroll();
        this.bg12.drawConnection();
        this.bg3.scroll();

        this.prevScrollX = window.scrollX;
        this.prevScrollY = window.scrollY;
    }
}
