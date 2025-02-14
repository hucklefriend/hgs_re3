/**
 * サブネットワークワーカー
 * サブネットワークはワーカーで処理している
 */

const MATH_PI_2 = Math.PI * 2;
const SUB_NETWORK_SCROLL_RATE = 1.2;
const LTT = 0;
const RTT = 1;
const RRT = 2;
const RRB = 3;
const RBB = 4;
const LBB = 5;
const LLB = 6;
const LLT = 7;


export class SubNetworkWorker
{
    /**
     * コンストラクタ
     */
    constructor(canvas)
    {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.networks = {};

        this.fadeCnt = 7;
    }

    addNetwork(data)
    {
        this.networks[data.id] = new SimpleSubNetwork(data);
    }

    updateParent(parentData)
    {
        this.networks[parentData.id].parentNode = parentData.parent;
    }

    /**
     * クリア
     */
    clear()
    {
        // TODO これは各ノード側がやるべきで、いずれは消す
        Object.keys(this.networks).forEach((key) => {
            this.networks[key].clear();
            delete this.networks[key];
        });

        this.networks = {};
    }

    /**
     * 描画
     */
    draw(viewRect)
    {
        let offsetX = viewRect.left - (viewRect.left / SUB_NETWORK_SCROLL_RATE);
        let offsetY = viewRect.top - (viewRect.top / SUB_NETWORK_SCROLL_RATE);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
        this.ctx.lineWidth = 1; // 線の太さ
        this.ctx.shadowColor = "lime"; // 影の色
        this.ctx.shadowBlur = 3; // 影のぼかし効果
        this.ctx.fillStyle = "rgba(0, 150, 0, 0.8)";

        Object.keys(this.networks).forEach((key) => {
            this.networks[key].draw(this.ctx, viewRect, offsetX, offsetY);
        });
    }

    addFadeCnt(addCnt)
    {
        this.fadeCnt += addCnt;
        if (this.fadeCnt > 7) {
            this.fadeCnt = 7;
        } else if (this.fadeCnt < 0) {
            this.fadeCnt = 0;
        }

        this.setStrokeStyle();
    }

    setStrokeStyle()
    {
        let alpha = this.fadeCnt / 10;
        this.ctx.strokeStyle = "rgba(0, 70, 0, " + alpha + ")"; // 線の色と透明度
    }

    /**
     * ウィンドウサイズの変更
     */
    resize(width, height)
    {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    /**
     * スクロール
     */
    scroll()
    {
    }
}

class SimpleSubNetwork
{
    constructor(data)
    {
        this.id = data.id;
        this.parentNode = new SubNetworkOctaNode(data.parent);
        this.nodes = {};
        this.minDrawDepth = data.minDrawDepth;
        this.maxDrawDepth = data.maxDrawDepth;

        Object.keys(data.nodes).forEach((key) => {
            const nodeData = data.nodes[key];

            if (nodeData.type === 'pt') {
                this.nodes[key] = new SubNetworkPointNode(nodeData);
            } else if (nodeData.type === 'octa') {
                this.nodes[key] = new SubNetworkOctaNode(nodeData);
            }
        });
    }

    draw(ctx, viewRect, offsetX, offsetY)
    {
        this.parentNode.setIsDraw(viewRect, 0, 0, this);

        Object.values(this.nodes).forEach(node => {
            node.draw(ctx, viewRect, offsetX, offsetY, this);
        });
    }

    /**
     * ノードの取得
     * 
     * @param {int} no 
     * @returns {SubNetworkPointNode|SubNetworkOctaNode|null} 
     */
    getNode(no)
    {
        if (no == -1) {
            return this.parentNode;
        }

        return this.nodes[no] || null;
    }
}

class SubNetworkOctaNode
{
    constructor(nodeData)
    {
        this.depth = nodeData.depth;
        this.vertices = nodeData.vertices;
        this.connects = nodeData.connects;
        this.isDraw = false;
    }

    setIsDraw(viewRect, offsetX, offsetY, network)
    {
        this.isDraw = true;

        // 描画対象の深さではない場合はスルー
        if (this.depth < network.minDrawDepth || this.depth > network.maxDrawDepth) {
            this.isDraw = false;
        }

        if (viewRect !== null) {
            // 表示領域外にあったら描画しない
            const drawLeft = this.vertices[LLT].x + offsetX;
            const drawRight = this.vertices[RRB].x + offsetX;
            const drawTop = this.vertices[LTT].y + offsetY;
            const drawBottom = this.vertices[LBB].y + offsetY;

            if (drawRight < viewRect.left) {
                this.isDraw = false;
            } else if (drawLeft > viewRect.right) {
                this.isDraw = false;
            } else if (drawBottom < viewRect.top) {
                this.isDraw = false;
            } else if (drawTop > viewRect.bottom) {
                this.isDraw = false;
            }
        }
    }

    /**
     * 描画
     * 
     * @param ctx 
     * @param viewRect 
     * @param offsetX 
     * @param offsetY 
     * @param {SimpleSubNetwork} network
     */
    draw(ctx, viewRect, offsetX, offsetY, network)
    {
        this.setIsDraw(viewRect, offsetX, offsetY, network);

        // 接続先が描画されているならエッジを描画
        this.connects.forEach(connect => {
            const [vertexNo, targetNo, targetVertexNo] = connect;

            const targetNode = network.getNode(targetNo);
            if (targetNode && targetNode.isDraw) {
                ctx.beginPath();
                ctx.moveTo(this.vertices[vertexNo].x + offsetX, this.vertices[vertexNo].y + offsetY);

                if (targetNode instanceof SubNetworkPointNode) {
                    ctx.lineTo(targetNode.x + offsetX, targetNode.y + offsetY);
                } else if (targetNo == -1) {
                    ctx.lineTo(targetNode.vertices[targetVertexNo].x,
                        targetNode.vertices[targetVertexNo].y);
                } else {
                    ctx.lineTo(targetNode.vertices[targetVertexNo].x + offsetX,
                        targetNode.vertices[targetVertexNo].y + offsetY);
                }
                
                ctx.stroke();
            }
        });

        if (this.isDraw) {
            this.setShapePath(ctx, offsetX, offsetY);
            ctx.stroke();
        }
    }

    /**
     * 図形パスの設定
     */
    setShapePath(ctx, offsetX = 0, offsetY = 0)
    {
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x + offsetX, this.vertices[0].y + offsetY);
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x + offsetX, this.vertices[i].y + offsetY);
        }
        ctx.closePath();
    }
}

class SubNetworkPointNode
{
    /**
     * コンストラクタ
     *
     * @param nodeData
     */
    constructor(nodeData)
    {
        this.x = nodeData.x;
        this.y = nodeData.y;
        this.r = nodeData.r;
        this.depth = nodeData.depth;
        this.connects = nodeData.connects;

        this.isDraw = false;
    }

    /**
     * 描画
     *
     * @param ctx
     * @param {Rect|null}viewRect
     * @param offsetX
     * @param offsetY
     * @param {SimpleSubNetwork} network
     */
    draw(ctx, viewRect, offsetX, offsetY, network)
    {
        this.isDraw = true;

        // 描画対象の深さではない場合はスルー
        if (this.depth < network.minDrawDepth || this.depth > network.maxDrawDepth) {
            //console.log('depth', this.depth, network.minDrawDepth, network.maxDrawDepth);
            this.isDraw = false;
        }

        if (viewRect !== null) {
            const drawX = this.x + offsetX;
            const drawY = this.y + offsetY;

            if (drawX < viewRect.left) {
                //console.log('drawX out of bounds', drawX, viewRect.left);
                this.isDraw = false;
            } else if (drawX > viewRect.right) {
                //console.log('drawX out of bounds', drawX, viewRect.right);
                this.isDraw = false;
            } else if (drawY < viewRect.top) {
                //console.log('drawY out of bounds', drawY, viewRect.top);
                this.isDraw = false;
            } else if (drawY > viewRect.bottom) {
                //console.log('drawY out of bounds', drawY, viewRect.bottom);
                this.isDraw = false;
            }
        }

        // 接続先が描画されているならエッジを描画
        this.connects.forEach(connect => {
            const [targetNo, targetVertexNo] = connect;

            const targetNode = network.getNode(targetNo);
            if (targetNode && targetNode.isDraw) {
                ctx.beginPath();
                ctx.moveTo(this.x + offsetX, this.y + offsetY);

                if (targetNode instanceof SubNetworkPointNode) {
                    ctx.lineTo(targetNode.x + offsetX, targetNode.y + offsetY);
                } else if (targetNo == -1) {
                    ctx.lineTo(targetNode.vertices[targetVertexNo].x,
                        targetNode.vertices[targetVertexNo].y);
                } else {
                    ctx.lineTo(targetNode.vertices[targetVertexNo].x + offsetX,
                        targetNode.vertices[targetVertexNo].y + offsetY);
                }
                
                ctx.stroke();
            }
        });

        if (this.isDraw) {
            ctx.beginPath();
            ctx.arc(this.x + offsetX, this.y + offsetY, this.r, 0, MATH_PI_2, false);
            ctx.fill();
        }
    }
}

let subNetworkWorker = null;
let animId = null;

self.onmessage = function(event) {
    switch (event.data.type) {
        case 'init':
            subNetworkWorker = new SubNetworkWorker(event.data.canvas);
            break;

        case 'clear':
            console.log('clear');
            subNetworkWorker.clear();
            break;

        case 'add-network':
            console.log('add-network', event.data.subNetwork);
            subNetworkWorker.addNetwork(event.data.subNetwork);
            break;

        case 'update-parent':
            console.log('update-parent');
            subNetworkWorker.updateParent(event.data.parentData);
            break;

        case 'resize':
            subNetworkWorker.resize(event.data.width, event.data.height, event.data.parentNodePositions);
            break;

        case 'draw':
            if (animId !== null) {
                cancelAnimationFrame(animId);
                animId = null;
            }
            animId = requestAnimationFrame(() => {
                animId = null;
                subNetworkWorker.draw(event.data.viewRect);
            });
            break;
    }
};

export default null;