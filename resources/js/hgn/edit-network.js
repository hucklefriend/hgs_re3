import {Network} from './network.js';
import {Param} from './param.js';
import {OctaNode, DOMNode} from "./node/octa-node.js";
import {PointNode} from "./node/point-node.js";


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
        let parent = DOMNode.create(containerDOM, data.width, data.height, data.id, data.parent.name, 0, 0);
        parent.setForceDraw();

        // ネットワークのインスタンス
        let network = new EditNetwork(containerDOM, canvasDOM, removeDOM, parent);

        if (data.nodes !== undefined) {
            Object.keys(data.nodes).forEach(id => {
                let nodeData = data.nodes[id];
                let node = DOMNode.create(containerDOM, data.width, data.height, id, nodeData.name, nodeData.x, nodeData.y)
                node.setForceDraw();
                network.addNode(node);
            });
        }

        // ポイントノードの読み取り
        if (data.hasOwnProperty('points')) {
            data.points.forEach(point => {
                let x = point.x + data.width / 2;
                let y = point.y + data.height / 2;
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
        console.log(parentNode);

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

        this.x = 0;
        this.y = 0;
    }

    setPos(x, y)
    {
        this.x = Math.round(x);
        this.y = Math.round(y);

        this.containerDOM.style.left = Math.round(x - this.containerDOM.clientWidth / 2) + 'px';
        this.containerDOM.style.top = Math.round(y - this.containerDOM.clientHeight / 2) + 'px';
    }

    reload()
    {
        super.reload();
        this.canvas.width = this.containerDOM.clientWidth;
        this.canvas.height = this.containerDOM.clientHeight;
    }

    /**
     * オフセットX取得
     *
     * @param e
     * @returns {number}
     */
    getOffsetX(e)
    {
        return e.clientX - this.x;
    }

    /**
     * オフセットY取得
     *
     * @param e
     * @returns {number}
     */
    getOffsetY(e)
    {
        return e.clientY - this.y;
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
     * @param centerX
     * @param centerY
     * @param moveX
     * @param moveY
     */
    dragging(centerX, centerY, moveX, moveY)
    {
        this.setPos(this.x + moveX, this.y + moveY);
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

                this.ctx.moveTo(this.parentNode.vertices[vertexNo].x, this.parentNode.vertices[vertexNo].y);
                this.ctx.lineTo(targetVertex.x, targetVertex.y);
                this.ctx.stroke();
            }
        });

        Object.values(this.nodes).forEach(node => {
            node.connects.forEach((connect, vertexNo) => {
                if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING){
                    let targetVertex = connect.getVertex();

                    this.ctx.beginPath();

                    if (node instanceof OctaNode) {
                        this.ctx.moveTo(node.vertices[vertexNo].x, node.vertices[vertexNo].y);
                    } else if (node instanceof PointNode) {
                        this.ctx.moveTo(node.x, node.y);
                    }
                    this.ctx.lineTo(targetVertex.x, targetVertex.y);
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

            node.draw(this.ctx, 0, 0);
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

        this.parentNode.draw(this.ctx, 0, 0);
    }

    getRect(centerX, centerY)
    {
        let x = this.x - centerX - this.containerDOM.offsetWidth / 2;
        let y = this.y - centerY - this.containerDOM.offsetHeight / 2;


        let left = x + this.parentNode.x - this.parentNode.DOM.offsetWidth / 2;
        let right = x + this.parentNode.x + this.parentNode.DOM.offsetWidth / 2;
        let top = y + this.parentNode.y - this.parentNode.DOM.offsetHeight / 2;
        let bottom = y + this.parentNode.y + this.parentNode.DOM.offsetHeight / 2;
        console.log(y, this.parentNode.y, this.parentNode.DOM.offsetHeight / 2);
        let l = 0;
        let r = 0;
        let t = 0;
        let b = 0;

        Object.values(this.nodes).forEach(node => {
            if (node instanceof DOMNode) {
                l = x + node.x - node.DOM.offsetWidth / 2;
                r = x + node.x + node.DOM.offsetWidth / 2;
                t = y + node.y - node.DOM.offsetHeight / 2;
                b = y + node.y + node.DOM.offsetHeight / 2;
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
            left: left,
            right: right,
            top: top,
            bottom: bottom,
        };
    }

    toJson(id, centerX, centerY)
    {
        return {
            id: id,
            x: Math.round(this.x - centerX),
            y: Math.round(this.y - centerY),
        };
    }
}
