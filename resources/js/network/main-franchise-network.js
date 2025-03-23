import { Param } from '../common/param.js';
import { OctaNode } from '../node/octa-node.js';
import { SimpleNode } from '../node/simple-node.js';
import { DOMNode } from '../node/dom-node.js';
import { LinkNode } from '../node/link-node.js';
import { PointNode } from "../node/point-node.js";
import { Vertex } from '../common/vertex.js';
import { Network } from '../network/network.js';
import { Rect } from "../common/rect.js";

/**
 * メインネットワークに表示する1つのフランチャイズネットワーク
 * スクリーン座標
 */
export class MainFranchiseNetwork extends Network
{
    /**
     * ネットワークの作成
     * 
     * @param {HTMLElement} containerDOM
     * @param {Object} networkData
     * @returns {MainFranchiseNetwork}
     */
    static create(containerDOM, networkData)
    {
        // ネットワーク用divの生成
        let div = document.createElement('div');
        div.classList.add('franchise');
        containerDOM.appendChild(div);

        // ネットワークのインスタンス
        let network = new MainFranchiseNetwork(div, networkData.x, networkData.y,
            networkData.width, networkData.height);

        // ノードの読み込み
        if (networkData.nodes !== undefined) {
            networkData.nodes.forEach(nodeData => {
                let node = null;
                if (nodeData.type === 'pt') {
                    node = new PointNode(nodeData.x, nodeData.y, 6, nodeData.id);
                } else {
                    node = MainFranchiseNetwork.createNode(div, nodeData);
                }

                network.addNode(node);
            });
        }

        // エッジの読み込み
        if (networkData.hasOwnProperty('con')) {
            networkData.con.forEach(connect => {
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

        return network;
    }

    /**
     * ノードの作成
     * 
     * @param {HTMLElement} containerDOM
     * @param {Object} nodeData
     * @returns {Node}
     */
    static createNode(containerDOM, nodeData)
    {
        let DOM = document.createElement('div');
        DOM.id = nodeData.id;

        // idがs_で始まる場合smallにする
        if (nodeData.id.startsWith('s_')) {
            DOM.classList.add('small');
        }

        DOM.classList.add('fade');

        if (nodeData.hasOwnProperty('href') && nodeData.href !== null) {
            DOM.classList.add('link-node');
            let a = document.createElement('a');
            a.href = window.baseUrl + nodeData.href;
            a.innerHTML = nodeData.html;
            DOM.appendChild(a);
        } else {
            DOM.classList.add('dom-node');
            DOM.innerHTML = nodeData.html;
        }

        DOM.style.left = `${nodeData.x}px`;
        DOM.style.top = `${nodeData.y}px`;

        containerDOM.appendChild(DOM);

        let node = null;
        switch (nodeData.type) {
            case 'dom-node':    // TODO 廃止予定
            case 'simple-node':
                node = SimpleNode.createFromDOM(DOM);
                break;
            case 'link-node':
            case 'link-node-a':
            case 'link-node-z':
                node = LinkNode.createFromDOM(DOM);
                break;
            default:
                throw new Error(`Unsupported node type: ${nodeData.type}`);
        }
        node.setForceDraw();

        return node;
    }

    /**
     * コンストラクタ
     * 
     * @param {HTMLElement} DOM
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     */
    constructor(DOM, x, y, w, h)
    {
        super();

        this.DOM = DOM;
        this.rect = new Rect();
        this.w = w;
        this.h = h;

        this.setPos(x, y);

        this._viewRectNo = 0;
        this._isShow = false;
    }

    /**
     * 表示領域番号取得
     *
     * @returns {number}
     */
    get viewRectNo()
    {
        return this._viewRectNo;
    }

    /**
     * 削除
     */
    delete()
    {
        super.delete();
        this.DOM.remove();
        this.DOM = null;
        this.rect = null;
    }

    /**
     * 配置
     *
     * @param {number} x
     * @param {number} y
     */
    setPos(x, y)
    {
        this.x = x;
        this.y = y;

        this.rect.setRect(
            this.x,
            this.x + this.w,
            this.y,
            this.y + this.h
        );
    }

    /**
     * 更新
     * 
     * @param {Rect} viewRect
     * @param {number} viewRectNo
     * @param {boolean} isInViewRectDefault
     */
    update(viewRect, viewRectNo, isInViewRectDefault = true)
    {
        super.update(viewRect, isInViewRectDefault);

        this._viewRectNo = viewRectNo;

        // CSSを使ってノードのDOM表示座標を変更
        Object.values(this.nodes).forEach(node => {
            if (node instanceof DOMNode) {
                node.DOM.classList.remove('view1', 'view2', 'view3', 'view4');
                node.DOM.classList.add('view' + viewRectNo);
            }
        });
    }

    /**
     * 出現開始
     */
    appear()
    {
        Object.values(this.nodes).forEach(node => {
            if (!(node instanceof PointNode)) {
                node.appear();
            }
        });
    }

    /**
     * 消失開始
     */
    disappear()
    {        
        Object.values(this.nodes).forEach(node => {
            if (!(node instanceof PointNode)) {
                node.disappear();
            }
        });
    }

    /**
     * 描画
     *
     * @param ctx
     * @param {Rect|null}viewRect
     */
    draw(ctx, viewRect)
    {
        ctx.restore();

        ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 2; // 線の太さ
        ctx.shadowColor = "lime"; // 影の色
        ctx.shadowBlur = 0; // 影のぼかし効果

        let offsetX = -viewRect.left;
        let offsetY = -viewRect.top;

        Object.values(this.nodes).forEach(node => {
            node.connects.forEach((connect, vertexNo) => {
                if (connect !== null && connect.type === Param.CONNECT_TYPE_OUTGOING){
                    let targetVertex = connect.getVertex();

                    ctx.beginPath();

                    if (node instanceof OctaNode) {
                        ctx.moveTo(node.vertices[vertexNo].x + offsetX, node.vertices[vertexNo].y + offsetY);
                    } else if (node instanceof PointNode) {
                        ctx.moveTo(node.x + offsetX, node.y + offsetY);
                    }
                    ctx.lineTo(targetVertex.x + offsetX, targetVertex.y + offsetY);
                    ctx.stroke();
                }
            });
        });

        ctx.restore();

        Object.values(this.nodes).forEach(node => {
            node.draw(ctx, offsetX, offsetY, false);
        });
    }

    /**
     * 表示
     */
    show()
    {
        this.DOM.style.display = 'block';
        this._isShow = true;
    }

    /**
     * 非表示
     */
    hide()
    {
        this.DOM.style.display = 'none';
        this._isShow = false;
    }

    /**
     * 表示状態取得
     * 
     * @returns {boolean}
     */
    get isShow()
    {
        return this._isShow;
    }
}
