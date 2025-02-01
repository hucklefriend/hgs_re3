import {Vertex} from "./hgn/vertex.js";
import {Rect} from "./hgn/rect.js";
import {EditNetwork} from "./hgn/edit-network.js";
import {Util} from "./hgn/util.js";
import LZString from 'lz-string';

/**
 * メインネットワークエディタ
 */
export class MainNetworkEditor
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        // #network-editor
        this.editorDOM = document.querySelector('#network-editor');

        // #network-editor-container なければ body
        this.containerDOM = document.querySelector('#network-editor-container');
        if (this.containerDOM === null) {
            this.containerDOM = document.body;
        }

        // #size-checker
        this.sizeCheckerDOM = document.querySelector('#size-checker');

        // ネットワーク
        this.networks = {};
        this.draggingNetwork = null;

        this.screenOffset = new Vertex(this.editorDOM.offsetWidth / 2, this.editorDOM.offsetHeight / 2);

        this.data = null;
    }

    /**
     * エディタ起動
     */
    start(initialPosition, data)
    {
        this.data = data;

        // containerDOMのスクロール位置をeditorDOMの中央に
        this.containerDOM.scrollTop = this.editorDOM.offsetTop - (this.containerDOM.offsetHeight - this.editorDOM.offsetHeight) / 2;
        this.containerDOM.scrollLeft = this.editorDOM.offsetLeft - (this.containerDOM.offsetWidth - this.editorDOM.offsetWidth) / 2;

        this.editorDOM.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.editorDOM.addEventListener('mousemove', (e) => this.mouseMove(e));
        this.editorDOM.addEventListener('mouseup', (e) => this.mouseUp(e));
        this.containerDOM.addEventListener('mouseleave', (e) => this.mouseUp(e));

        // 配置済みネットワークの読み込み
        initialPosition.forEach(pos => {
            this.addNetwork(pos.id, pos.x, pos.y);
        });

        this.writeJson();
    }

    /**
     * ネットワーク登録済みか
     *
     * @param id
     * @returns {*|boolean}
     */
    hasNetwork(id)
    {
        return this.networks.hasOwnProperty(id);
    }

    /**
     * ネットワーク追加
     *
     * @param id
     * @param x
     * @param y
     */
    addNetwork(id, x = null, y = null)
    {
        if (this.hasNetwork(id)) {
            console.error("Network " + id + " already exists.");
            return;
        }

        if (!this.data.hasOwnProperty(id)) {
            console.error("Network " + id + " not found in data.");
            return;
        }

        this.networks[id] = EditNetwork.create(this.data[id], this.screenOffset);

        // x, yがnullなら現在のスクロール位置の中心に配置
        if (x === null) {
            x = Math.round((this.containerDOM.scrollLeft - this.screenOffset.x) + this.containerDOM.offsetWidth / 2);
        }
        if (y === null) {
            y = Math.round(this.containerDOM.scrollTop - this.screenOffset.y + this.containerDOM.offsetHeight / 2);
        }

        this.networks[id].setPos(x, y, this.screenOffset);

        this.writeJson();
    }

    /**
     * ネットワークの削除
     *
     * @param id
     */
    removeNetwork(id)
    {
        if (this.networks.hasOwnProperty(id)) {
            this.editorDOM.removeChild(this.networks[id].containerDOM);

            this.networks[id].delete();
            delete this.networks[id];

            this.writeJson();
        }
    }

    /**
     * マウスダウン
     *
     * @param e
     */
    mouseDown(e)
    {
        this.startDrag(e);
    }

    /**
     * EditNetworkからドラッグ開始
     *
     * @param e
     * @param network
     */
    mouseDownInEditNetwork(e, network)
    {
        this.draggingNetwork = network;
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

            this.offsetX = e.clientX;
            this.offsetY = e.clientY;
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
            let moveX = e.clientX - this.offsetX;
            let moveY = e.clientY - this.offsetY;

            if (this.draggingNetwork !== null) {
                // ノードの移動
                this.draggingNetwork.dragging(moveX, moveY, this.screenOffset);
            } else {
                // スクロール
                this.containerDOM.scrollLeft -= moveX;
                this.containerDOM.scrollTop -= moveY;
            }

            this.offsetX = e.clientX;
            this.offsetY = e.clientY;
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

        if (this.draggingNetwork !== null) {
            this.draggingNetwork.mouseUp(e);
            this.draggingNetwork = null;

            this.writeJson();
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
     * ネットワークの削除
     *
     * @param id
     */
    removeNode(id)
    {
        if (this.hasNetwork(id)) {
            this.editorDOM.removeChild(this.networks[id].containerDOM);

            this.networks[id].delete();
            delete this.networks[id];

            this.writeJson();
        }
    }

    /**
     * JSONを書き込み
     */
    writeJson()
    {
        let json = this.toJson();
        document.querySelector('#json').value = JSON.stringify(json.edit);
        document.querySelector('#json2').value = LZString.compressToEncodedURIComponent(JSON.stringify(json.main));
    }

    /**
     * JSON化
     */
    toJson()
    {
        let networks = [];
        let rect = new Rect(0, 0, 0, 0);

        for (let id in this.networks) {
            networks.push(this.networks[id].toJson(id));

            let r = this.networks[id].getRect(this.screenOffset);
            rect.merge(r);
        }

        this.setSizeChecker(rect);

        return {
            edit: {
                networks: networks,
                rect: rect.toJson()
            },
            main: this.toJsonForMainNetwork(rect)
        };
    }

    /**
     * サイズチェッカーの設定
     *
     * @param rect
     */
    setSizeChecker(rect)
    {
        this.sizeCheckerDOM.style.left = this.screenOffset.x + rect.left + 'px';
        this.sizeCheckerDOM.style.top = this.screenOffset.y + rect.top + 'px';
        this.sizeCheckerDOM.style.width = (rect.right - rect.left) + 'px';
        this.sizeCheckerDOM.style.height = (rect.bottom - rect.top) + 'px';
    }

    /**
     * メインネットワーク表示用のJSONを生成
     * スクリーン座標になっている
     *
     * @returns {{x, y}}
     */
    toJsonForMainNetwork(rect)
    {
        let networks = [];

        let screenLeft = this.screenOffset.x + rect.left;
        let screenTop = this.screenOffset.y + rect.top;

        for (let id in this.networks) {
            networks.push(this.networks[id].toJsonForMainNetwork(
                rect, this.screenOffset, screenLeft, screenTop));
        }

        return {
            networks: networks,
            origin: {x: -rect.left, y: -rect.top},
            width: rect.width,
            height: rect.height,
        };
    }
}

window.mainNetworkEditor = new MainNetworkEditor();
window.hgn = window.networkEditor;
