import {Network} from './network.js';
import {Param} from './param.js';
import {OctaNode, DOMNode} from "./node/octa-node.js";
import {PointNode} from "./node/point-node.js";
import {Vertex} from "./vertex.js";


/**
 * ネットワーク
 */
export class EditNetwork extends Network
{
    static create(data)
    {
        let containerDOM = document.createElement('div');
        containerDOM.classList.add('edit-network');
        containerDOM.style.width = data.width + 'px';
        containerDOM.style.height = data.height + 'px';
        window.mainNetworkEditor.editorDOM.appendChild(containerDOM);

        let canvasDOM = document.createElement('canvas');
        containerDOM.appendChild(canvasDOM);

        let removeDOM = document.createElement('span');
        removeDOM.classList.add('edit-network-remove');
        removeDOM.innerHTML = '×';
        containerDOM.appendChild(removeDOM);

        // 親ノードの生成
        let parent = DOMNode.create(containerDOM, data.id, data.parent.name, 0, 0, {x: 0, y: 0});
        parent.setForceDraw();

        // ネットワークのインスタンス
        let network = new EditNetwork(containerDOM, canvasDOM, removeDOM, parent);

        if (data.nodes !== undefined) {
            Object.keys(data.nodes).forEach(id => {
                let nodeData = data.nodes[id];
                let node = DOMNode.create(containerDOM, id, nodeData.name, nodeData.x, nodeData.y, network.screenOffset)
                node.setForceDraw();
                network.addNode(node);
            });
        }

        // ポイントノードの読み取り
        if (data.hasOwnProperty('points')) {
            data.points.forEach(point => {
                let x = point.x;
                let y = point.y;
                let node = new PointNode(x, y, 6, point.id);
                node.setForceDraw();
                network.addNode(node);
            });
        }

        // エッジの読み込み
        if (data.hasOwnProperty('connects')) {
            data.connects.forEach(connect => {
                let fromNode = network.getNodeById(connect.from);
                let toNode = network.getNodeById(connect.to);

                if (fromNode !== null && toNode !== null) {
                    if (fromNode instanceof DOMNode) {
                        fromNode.connect(connect.from_vn ?? null, toNode, connect.to_vn ?? null);
                    } else if (fromNode instanceof PointNode) {
                        fromNode.connect(toNode, connect.to_vn ?? null);
                    }
                }
            });
        }

        network.parentNode.setPos(0, 0, network.screenOffset);

        network.reload();
        network.draw();

        return network;
    }

    /**
     * コンストラクタ
     *
     * @param containerDOM
     * @param canvas
     * @param removeDOM
     * @param parentNode
     */
    constructor(containerDOM, canvas, removeDOM, parentNode)
    {
        super(parentNode);

        this.containerDOM = containerDOM;
        this.containerDOM.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.containerDOM.addEventListener('mouseenter', (e) => this.mouseEnter(e));
        this.containerDOM.addEventListener('mouseleave', (e) => this.mouseLeave(e));

        this.canvas = canvas;
        this.ctx = null;
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
            this.ctx.save();
        }

        this.removeDOM = removeDOM;
        this.removeDOM.addEventListener('click', (e) => this.mouseClickRemoveDOM(e));

        this.screenOffset = new Vertex(this.containerDOM.offsetWidth / 2, this.containerDOM.offsetHeight / 2);
    }

    /**
     * 配置座標の設定
     *
     * @param x
     * @param y
     * @param screenOffset
     */
    setPos(x, y, screenOffset)
    {
        super.setPos(x, y);

        this.containerDOM.style.left = Math.round(screenOffset.x + x - this.screenOffset.x) + 'px';
        this.containerDOM.style.top = Math.round(screenOffset.y + y - this.screenOffset.y) + 'px';
    }

    reload()
    {
        this.canvas.width = this.containerDOM.clientWidth;
        this.canvas.height = this.containerDOM.clientHeight;
    }

    /**
     * マウスダウン
     *
     * @param e
     */
    mouseDown(e)
    {
        this.isDragging = true;
        this.containerDOM.style.cursor = "grabbing";

        window.mainNetworkEditor.mouseDownInEditNetwork(e, this);
    }

    /**
     * マウスアップ
     *
     * @param e
     */
    mouseUp(e)
    {
        this.containerDOM.style.cursor = "grab";
    }

    /**
     * マウスエンター
     *
     * @param e
     */
    mouseEnter(e)
    {
        this.containerDOM.style.cursor = "grab";
        if (this.removeDOM !== null) {
            this.removeDOM.style.display = 'inline';
        }
    }

    /**
     * ドラッグ中
     *
     * @param moveX
     * @param moveY
     * @param screenOffset
     */
    dragging(moveX, moveY, screenOffset)
    {
        this.setPos(this.pos.x + moveX, this.pos.y + moveY, screenOffset);
    }

    /**
     * マウスリーブ
     *
     * @param e
     */
    mouseLeave(e)
    {
        if (this.removeDOM !== null) {
            this.removeDOM.style.display = 'none';
        }
    }

    /**
     * removeDOMクリック
     *
     * @param e
     */
    mouseClickRemoveDOM(e)
    {
        window.mainNetworkEditor.removeNetwork(this.parentNode.id);
    }

    draw()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        this.ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
        this.ctx.lineWidth = 1; // 線の太さ
        this.ctx.shadowColor = "lime"; // 影の色
        this.ctx.shadowBlur = 5; // 影のぼかし効果

        this.parentNode.connects.forEach((connect, vertexNo) => {
            if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING){
                let targetVertex = connect.getVertex();

                this.ctx.beginPath();

                this.ctx.moveTo(this.parentNode.vertices[vertexNo].x+this.screenOffset.x, this.parentNode.vertices[vertexNo].y+this.screenOffset.y);
                this.ctx.lineTo(targetVertex.x+this.screenOffset.x, targetVertex.y+this.screenOffset.y);
                this.ctx.stroke();
            }
        });

        Object.values(this.nodes).forEach(node => {
            node.connects.forEach((connect, vertexNo) => {
                if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING){
                    let targetVertex = connect.getVertex();

                    this.ctx.beginPath();

                    if (node instanceof OctaNode) {
                        this.ctx.moveTo(node.vertices[vertexNo].x+this.screenOffset.x, node.vertices[vertexNo].y+this.screenOffset.y);
                    } else if (node instanceof PointNode) {
                        this.ctx.moveTo(node.x+this.screenOffset.x, node.y+this.screenOffset.y);
                    }
                    this.ctx.lineTo(targetVertex.x+this.screenOffset.x, targetVertex.y+this.screenOffset.y);
                    this.ctx.stroke();
                }
            });
        });

        Object.values(this.nodes).forEach(node => {
            this.ctx.restore();
            if (node instanceof DOMNode) {
                this.ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
                this.ctx.lineWidth = 1; // 線の太さ
                this.ctx.shadowColor = "lime"; // 影の色
                this.ctx.shadowBlur = 5; // 影のぼかし効果
                this.ctx.fillStyle = "black";
            } else if (node instanceof PointNode) {
                this.ctx.fillStyle = "rgba(0, 200, 0, 0.8)"; // 線の色と透明度
            }

            node.draw(this.ctx, this.screenOffset.x, this.screenOffset.y);
        });

        if (this.parentNode instanceof DOMNode) {
            this.ctx.restore();
            this.ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
            this.ctx.lineWidth = 1; // 線の太さ
            this.ctx.shadowColor = "lime"; // 影の色
            this.ctx.shadowBlur = 5; // 影のぼかし効果
            this.ctx.fillStyle = "black";
        } else if (node instanceof PointNode) {
            this.ctx.restore();
            this.ctx.fillStyle = "rgba(0, 200, 0, 0.8)"; // 線の色と透明度
        }

        this.parentNode.draw(this.ctx, this.screenOffset.x, this.screenOffset.y);
    }

    getRect()
    {
        let x = this.pos.x;
        let y = this.pos.y;

        let left = x + this.parentNode.pos.x - this.parentNode.DOM.offsetWidth / 2;
        let right = x + this.parentNode.pos.x + this.parentNode.DOM.offsetWidth / 2;
        let top = y + this.parentNode.pos.y - this.parentNode.DOM.offsetHeight / 2;
        let bottom = y + this.parentNode.pos.y + this.parentNode.DOM.offsetHeight / 2;

        let l = 0;
        let r = 0;
        let t = 0;
        let b = 0;

        Object.values(this.nodes).forEach(node => {
            if (node instanceof DOMNode) {
                l = x + node.pos.x - node.DOM.offsetWidth / 2;
                r = x + node.pos.x + node.DOM.offsetWidth / 2;
                t = y + node.pos.y - node.DOM.offsetHeight / 2;
                b = y + node.pos.y + node.DOM.offsetHeight / 2;
            } else if (node instanceof PointNode) {
                l = x + node.x - node.r;
                r = x + node.x + node.r;
                t = y + node.y - node.r;
                b = y + node.y + node.r;
            }

            if (left > l) {
                left = l;
            }
            if (right < r) {
                right = r;
            }
            if (top > t) {
                top = t;
            }
            if (bottom < b) {
                bottom = b;
            }
        });

        return {
            left: left - 15,
            right: right + 15,
            top: top - 15,
            bottom: bottom + 15,
        };
    }

    toJson(id)
    {
        return {
            id: id,
            x: Math.round(this.pos.x),
            y: Math.round(this.pos.y),
        };
    }
}
