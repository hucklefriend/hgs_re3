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
        this.parentNode = data.parent;
        this.nodes = {};
        this.minDrawDepth = data.minDrawDepth;
        this.maxDrawDepth = data.maxDrawDepth;

        Object.keys(data.nodes).forEach((key) => {
            const nodeData = data.nodes[key];

            if (nodeData.type === 'pt') {
                this.nodes[key] = new SubNetworkPointNode(nodeData.x, nodeData.y, nodeData.r, nodeData.depth);
            } else if (nodeData.type === 'octa') {
                this.nodes[key] = new SubNetworkOctaNode(nodeData.depth, nodeData.vertices);
            }
        });
    }

    draw(ctx, viewRect, offsetX, offsetY)
    {
        Object.values(this.nodes).forEach(node => {
            node.draw(ctx, viewRect, offsetX, offsetY, this.minDrawDepth, this.maxDrawDepth);
        });
    }
}

class SubNetworkOctaNode
{
    constructor(depth, vertices)
    {
        this.depth = depth;
        this.vertices = vertices;
        this.connects = new Array(8).fill(null);
    }

    draw(ctx, viewRect, offsetX, offsetY, minDepth, maxDepth)
    {
        // 描画対象の深さではない場合はスルー
        if (this.depth < minDepth || this.depth > maxDepth) {
            //console.log('depth', this.depth, minDepth, maxDepth);
            return;
        }

        if (viewRect !== null) {
            // 表示領域外にあったら描画しない
            const drawLeft = this.vertices[LLT].x + offsetX;
            const drawRight = this.vertices[RRB].x + offsetX;
            const drawTop = this.vertices[LTT].y + offsetY;
            const drawBottom = this.vertices[LBB].y + offsetY;

            if (drawRight < viewRect.left) {
                //console.log('right', drawRight, viewRect.left);
                return;
            }
            if (drawLeft > viewRect.right) {
                //console.log('left', drawLeft, viewRect.right);
                return;
            }
            if (drawBottom < viewRect.top) {
                //console.log('bottom', drawBottom, viewRect.top);
                return;
            }
            if (drawTop > viewRect.bottom) {
                //console.log('top', drawTop, viewRect.bottom);
                return;
            }
        }

        this.setShapePath(ctx, offsetX, offsetY);
        ctx.stroke();
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
     * @param x
     * @param y
     * @param depth
     */
    constructor(x, y, r, depth)
    {
        this.x = x;
        this.y = y;
        this.r = r;
        this.depth = depth;
    }

    /**
     * 描画
     *
     * @param ctx
     * @param offsetX
     * @param offsetY
     * @param {Rect|null}viewRect
     */
    draw(ctx, viewRect, offsetX, offsetY, minDepth, maxDepth)
    {
        // 描画対象の深さではない場合はスルー
        if (this.depth < minDepth || this.depth > maxDepth) {
            console.log('depth', this.depth, minDepth, maxDepth);
            return;
        }

        if (viewRect !== null) {
            const drawX = this.x + offsetX;
            if (drawX < viewRect.left) {
                
                console.log('drawX out of bounds', drawX, viewRect.left);
                return;
            }
            if (drawX > viewRect.right) {
                console.log('drawX out of bounds', drawX, viewRect.right);
                return;
            }

            const drawY = this.y + offsetY;
            if (drawY < viewRect.top) {
                console.log('drawY out of bounds', drawY, viewRect.top);
                return;
            }
            if (drawY > viewRect.bottom) {
                console.log('drawY out of bounds', drawY, viewRect.bottom);
                return;
            }
        }

        ctx.beginPath();
        ctx.arc(this.x + offsetX, this.y + offsetY, this.r, 0, MATH_PI_2, false);
        ctx.fill();
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