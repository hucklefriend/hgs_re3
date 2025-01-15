import {Param} from './hgn/param.js';
import {Util} from "./hgn/util.js";
import {Vertex} from "./hgn/vertex.js";
import {EditNetwork} from "./hgn/edit-network.js";

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

        // ネットワーク
        this.networks = {};
        this.draggingNetwork = null;

        this.center = new Vertex();
    }

    /**
     * エディタ起動
     */
    start(data)
    {
        // containerDOMのスクロール位置をeditorDOMの中央に
        this.containerDOM.scrollTop = this.editorDOM.offsetTop - (this.containerDOM.offsetHeight - this.editorDOM.offsetHeight) / 2;
        this.containerDOM.scrollLeft = this.editorDOM.offsetLeft - (this.containerDOM.offsetWidth - this.editorDOM.offsetWidth) / 2;
        this.center.x = this.editorDOM.offsetWidth / 2;
        this.center.y = this.editorDOM.offsetHeight / 2;

        this.editorDOM.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.editorDOM.addEventListener('mousemove', (e) => this.mouseMove(e));
        this.editorDOM.addEventListener('mouseup', (e) => this.mouseUp(e));
        this.containerDOM.addEventListener('mouseleave', (e) => this.mouseUp(e));

        // 配置済みネットワークの読み込み
        data.forEach(networkData => {
            this.networks[networkData.id] = EditNetwork.create(networkData);
            this.editorDOM.appendChild(this.networks[networkData.id].DOM);
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
     * @param networkData
     */
    addNetwork(networkData)
    {
        if (this.hasNetwork(networkData.id)) {
            console.error("Network " + networkData.id + " already exists.");
            return;
        }

        this.networks[networkData.id] = EditNetwork.create(networkData);

        // 現在のスクロール位置の中心に配置
        this.networks[networkData.id].setPos(
            this.containerDOM.scrollLeft + this.containerDOM.offsetWidth / 2,
            this.containerDOM.scrollTop + this.containerDOM.offsetHeight / 2
        );
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

            if (this.draggingNetwork !== null) {
                this.offsetX = this.draggingNetwork.getOffsetX(e);
                this.offsetY = this.draggingNetwork.getOffsetY(e);
            } else {
                // ノードがドラッグされない場合はスクロール
                this.offsetX = e.clientX;
                this.offsetY = e.clientY;
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
            if (this.draggingNetwork !== null) {
                // ノードの移動
                this.draggingNetwork.mouseMove(e, this.offsetX, this.offsetY);
            } else {
                // スクロール
                this.containerDOM.scrollLeft -= e.clientX - this.offsetX;
                this.containerDOM.scrollTop -= e.clientY - this.offsetY;
                this.offsetX = e.clientX;
                this.offsetY = e.clientY;
            }
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
        document.querySelector('#json').value = JSON.stringify(this.toJson());
    }

    /**
     * JSON化
     *
     * @returns {}
     */
    toJson()
    {
        return {

        };
    }
}

window.mainNetworkEditor = new MainNetworkEditor();
window.hgn = window.networkEditor;
