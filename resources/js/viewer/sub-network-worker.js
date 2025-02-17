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

    /**
     * ネットワークの追加
     * 
     * @param {Object} data
     * @returns {void}
     */
    addNetwork(data)
    {
        this.networks[data.id] = new SimpleSubNetwork(data);
    }

    /**
     * 1ネットワーク内のノードの位置をセット
     * 
     * @param {Object} data 
     */
    setNodePos(data)
    {
        this.networks[data.id].updateNodes(data);
    }

    /**
     * 1ネットワークの描画深さをセット
     * 
     * @param {int} id
     * @param {int} min
     * @param {int} max
     * @returns {void}
     */
    setDrawDepth(id, min, max)
    {
        if (this.networks[id]) {
            this.networks[id].minDrawDepth = min;
            this.networks[id].maxDrawDepth = max;
        }
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
}

class SimpleSubNetwork
{
    /**
     * コンストラクタ
     * 
     * @param {*} data 
     */
    constructor(data)
    {
        this.id = data.id;
        this.parentNode = new SubNetworkOctaNode(data.parent);
        this.nodes = {};
        this.minDrawDepth = data.minDrawDepth;
        this.maxDrawDepth = data.maxDrawDepth;

        Object.keys(data.nodes).forEach((no) => {
            const nodeData = data.nodes[no];

            if (nodeData.type === 'pt') {
                this.nodes[no] = new SubNetworkPointNode(nodeData);
            } else if (nodeData.type === 'octa') {
                this.nodes[no] = new SubNetworkOctaNode(nodeData);
            }
        });
    }

    /**
     * ノードの更新
     * 
     * @param {*} data 
     */
    updateNodes(data)
    {
        if (data.hasOwnProperty('parent')) {
            this.parentNode.update(data.parent);
        }

        Object.keys(data.nodes).forEach((no) => {
            this.nodes[no].update(data.nodes[no]);
        });
    }

    /**
     * 描画
     * 
     * @param ctx 
     * @param viewRect 
     * @param offsetX 
     * @param offsetY 
     */
    draw(ctx, viewRect, offsetX, offsetY)
    {
        this.parentNode.setDrawFrags(viewRect, 0, 0, this);

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
    /**
     * コンストラクタ
     * 
     * @param {Object} nodeData
     */
    constructor(nodeData)
    {
        this.depth = nodeData.depth;
        this.vertices = nodeData.vertices;
        this.connects = nodeData.connects;

        this.isOutView = false;     // 表示領域の外に出ているフラグ
        this.isOutDepth = false;    // 描画深さの範囲にいないフラグ
    }

    /**
     * ノードの更新
     * 
     * @param {Object} nodeData 
     */
    update(nodeData)
    {
        if (nodeData.hasOwnProperty('depth')) {
            this.depth = nodeData.depth;
        }

        if (nodeData.hasOwnProperty('vertices')) {
            this.vertices = nodeData.vertices;
        }
        
        if (nodeData.hasOwnProperty('connects')) {
            this.connects = nodeData.connects;
        }
    }

    /**
     * 描画対象かどうかを決めるフラグを設定
     * 
     * @param {*} viewRect 
     * @param {*} offsetX 
     * @param {*} offsetY 
     * @param {*} network 
     */
    setDrawFrags(viewRect, offsetX, offsetY, network)
    {
        // 描画対象の深さではない場合はスルー
        if (this.depth < network.minDrawDepth || this.depth > network.maxDrawDepth) {
            this.isOutDepth = true;
        } else {
            this.isOutDepth = false;
        }

        this.isOutView = false;
        if (viewRect !== null) {
            // 表示領域外にあったら描画しない
            const drawLeft = this.vertices[LLT].x + offsetX;
            const drawRight = this.vertices[RRB].x + offsetX;
            const drawTop = this.vertices[LTT].y + offsetY;
            const drawBottom = this.vertices[LBB].y + offsetY;

            if (drawRight < viewRect.left) {
                this.isOutView = true;
            } else if (drawLeft > viewRect.right) {
                this.isOutView = true;
            } else if (drawBottom < viewRect.top) {
                this.isOutView = true;
            } else if (drawTop > viewRect.bottom) {
                this.isOutView = true;
            }
        }
    }
    
    /**
     * 描画するか
     */
    isDraw()
    {
        return !this.isOutView && !this.isOutDepth;
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
        this.setDrawFrags(viewRect, offsetX, offsetY, network);

        // 接続先が描画されていて、自分の描画深度が描画範囲内の場合はエッジを描画
        this.connects.forEach(connect => {
            const [vertexNo, targetNo, targetVertexNo] = connect;

            const targetNode = network.getNode(targetNo);
            if ((targetNode && targetNode.isDraw()) || this.isDraw()) {
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

        if (this.isDraw()) {
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
        this.isOutView = false;     // 表示領域の外に出ているフラグ
        this.isOutDepth = false;    // 描画深さの範囲にいないフラグ
    }   

    /**
     * ノードの更新
     * 
     * @param {Object} nodeData 
     */
    update(nodeData)
    {
        if (nodeData.hasOwnProperty('x')) {
            this.x = nodeData.x;
        }

        if (nodeData.hasOwnProperty('y')) {
            this.y = nodeData.y;
        }

        if (nodeData.hasOwnProperty('r')) {
            this.r = nodeData.r;
        }

        if (nodeData.hasOwnProperty('depth')) {
            this.depth = nodeData.depth;
        }

        if (nodeData.hasOwnProperty('vertices')) {
            this.vertices = nodeData.vertices;
        }
        
        if (nodeData.hasOwnProperty('connects')) {
            this.connects = nodeData.connects;
        }
    }

    /**
     * 描画するか
     */
    isDraw()
    {
        return !this.isOutView && !this.isOutDepth;
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
        // 描画対象の深さではない場合はスルー
        if (this.depth < network.minDrawDepth || this.depth > network.maxDrawDepth) {
            this.isOutDepth = true;
        } else {
            this.isOutDepth = false;
        }

        this.isOutView = false;
        if (viewRect !== null) {
            const drawX = this.x + offsetX;
            const drawY = this.y + offsetY;

            if (drawX < viewRect.left) {
                this.isOutView = true;
            } else if (drawX > viewRect.right) {
                this.isOutView = true;
            } else if (drawY < viewRect.top) {
                this.isOutView = true;
            } else if (drawY > viewRect.bottom) {
                this.isOutView = true;
            }
        }

        // 接続先が描画されているならエッジを描画
        this.connects.forEach(connect => {
            const [targetNo, targetVertexNo] = connect;

            const targetNode = network.getNode(targetNo);
            if (targetNode && targetNode.isDraw() && !this.isOutDepth) {
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

        if (this.isDraw()) {
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
            subNetworkWorker.clear();
            break;

        case 'add-network':
            subNetworkWorker.addNetwork(event.data.subNetwork);
            break;

        case 'set-node-pos':
            subNetworkWorker.setNodePos(event.data.subNetwork);
            break;

        case 'set-draw-depth':
            subNetworkWorker.setDrawDepth(event.data.id, event.data.min, event.data.max);
            break

        case 'resize':
            subNetworkWorker.resize(event.data.width, event.data.height);
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