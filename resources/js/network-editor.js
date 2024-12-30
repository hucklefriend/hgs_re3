import {EditNode} from './hgn/node/edit-node.js';
import {PointNode} from './hgn/node/point-node.js';
// import {Param} from './hgn/param.js';
// import {Util} from './hgn/util.js';

/**
 * ネットワークエディタ
 */
export class NetworkEditor
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        // #network-editor
        this.editorDOM = document.querySelector('#network-editor');

        // #network-editor-canvas
        this.canvas = document.querySelector('#network-editor-canvas');
        this.ctx = null;
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
        }
        this.canvas.width = this.editorDOM.offsetWidth;
        this.canvas.height = this.editorDOM.offsetHeight;

        // #network-editor-container なければ body
        this.containerDOM = document.querySelector('#network-editor-container');
        if (this.containerDOM === null) {
            this.containerDOM = document.body;
        }

        // ノード
        this.nodes = {};
        this.points = [];
        this.connections = [];

        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;

        this.draggingNode = null;

        this.center = {x: 0, y: 0};
    }

    /**
     * エディタ起動
     */
    start(nodes)
    {
        // containerDOMのスクロール位置をeditorDOMの中央に
        this.containerDOM.scrollTop = this.editorDOM.offsetTop - (this.containerDOM.offsetHeight - this.editorDOM.offsetHeight) / 2;
        this.containerDOM.scrollLeft = this.editorDOM.offsetLeft - (this.containerDOM.offsetWidth - this.editorDOM.offsetWidth) / 2;
        this.center.x = this.editorDOM.offsetWidth / 2;
        this.center.y = this.editorDOM.offsetHeight / 2;

        this.editorDOM.addEventListener('mousedown', (e) => this.startDrag(e));
        this.editorDOM.addEventListener('mousemove', (e) => this.mouseMove(e));
        this.editorDOM.addEventListener('mouseup', (e) => this.mouseUp(e));
        this.containerDOM.addEventListener('mouseleave', (e) => this.mouseUp(e));

        // ノードの読み込み
        nodes.nodes.forEach(node => {
            this.nodes[node.id] = EditNode.create(node, this.center);
        });

        this.draw();
    }

    /**
     * エディットノードからドラッグ開始
     *
     * @param e
     * @param node
     */
    mouseDownInEditNode(e, node)
    {
        this.draggingNode = node;
        this.startDrag(e);
    }

    /**
     * ドラッグ開始
     *
     * @param e
     */
    startDrag(e)
    {
        if (!this.isDragging) {
            this.isDragging = true;

            if (this.draggingNode !== null) {
                this.offsetX = this.draggingNode.getOffsetX(e);
                this.offsetY = this.draggingNode.getOffsetY(e);
            } else {
                // ノードがドラッグされない場合はスクロール
                this.offsetX = e.clientX - this.containerDOM.scrollLeft;
                this.offsetY = e.clientY - this.containerDOM.scrollTop;
            }
        }
    }

    /**
     * ドラッグ中
     *
     * @param e
     */
    mouseMove(e)
    {
        if (this.isDragging) {
            if (this.draggingNode !== null) {
                // ノードの移動
                this.draggingNode.mouseMove(e, this.offsetX, this.offsetY);
            } else {
                // スクロール
                this.containerDOM.scrollLeft = e.clientX - this.offsetX;
                this.containerDOM.scrollTop = e.clientY - this.offsetY;
            }

            this.draw();
        }
    }

    /**
     * ドラッグ終了
     *
     * @param e
     */
    mouseUp(e)
    {
        this.isDragging = false;

        if (this.draggingNode !== null) {
            this.draggingNode.mouseUp(e);
            this.draggingNode = null;
        }
    }


    /**
     * 高さの取得
     *
     * @returns {number}
     */
    getHeight()
    {
        return this.containerDOM.offsetHeight;
    }

    /**
     * Windowサイズ変更などによるNodeの再読取り
     */
    reloadNodes()
    {

    }

    /**
     * ノードのクリア
     */
    clearNodes()
    {
        Object.values(this.nodes).forEach(node => {
            node.delete();
        });
        this.nodes = {};
    }

    removeNode(id)
    {
        if (this.nodes.hasOwnProperty(id)) {
            this.editorDOM.removeChild(this.nodes[id].DOM);

            this.nodes[id].delete();
            delete this.nodes[id];

            this.draw();
        }
    }

    /**
     * 描画
     */
    draw()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        Object.values(this.nodes).forEach(node => {
            node.draw(this.ctx, this.center.x, this.center.y);
        });
    }

    /**
     * 更新
     */
    update()
    {

    }

    /**
     * ウィンドウサイズの変更
     */
    changeSize()
    {

    }

    /**
     * スクロール
     */
    scroll()
    {

    }

    getScrollX()
    {
        return 0;
    }

    getScrollY()
    {
        return 0;
    }
}

window.networkEditor = new NetworkEditor();
window.hgn = window.networkEditor;
