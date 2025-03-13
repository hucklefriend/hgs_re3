import { HorrorGameNetwork } from '../horror-game-network.js';

/**
 * @type {HorrorGameNetwork}
 */
window.hgn;

/**
 * ビューアの基底クラス
 */
export class ViewerBase
{
    constructor()
    {
        this._nodeCnt = 0;
        this._appearedNodeCnt = 0;
        this._appearedNodes = {};
        
        this._nodesIdHash = {};
    }

    /**
     * ノードカウントを取得
     */
    get nodeCnt()
    {
        return this._nodeCnt;
    }

    /**
     * 出現済みノードカウントを取得
     */
    get appearedNodeCnt()
    {
        return this._appearedNodeCnt;
    }

    /**
     * ノードカウントを増やす
     */
    incrementNodeCnt()
    {
        this._nodeCnt++;
    }

    /**
     * 出現済みノードカウントを増やす
     */
    incrementAppearedNodeCnt()
    {
        this._appearedNodeCnt++;
    }

    /**
     * 出現済みノードカウントを減らす
     */
    decrementAppearedNodeCnt()
    {
        this._appearedNodeCnt--;
    }

    /**
     * 出現済みノードを追加
     * 
     * @param {*} id 
     * @returns 
     */
    addAppearedNode(id)
    {
        if (this._appearedNodes.hasOwnProperty(id)){
            console.error(`Node with id "${id}" already exists.`);
            return;
        }
        this._appearedNodes[id] = 1;
        this.incrementAppearedNodeCnt();
    }

    /**
     * 出現済みノードを削除
     * 
     * @param {*} id 
     */
    delAppearedNode(id)
    {        
        if (!this._appearedNodes.hasOwnProperty(id)) {
            console.error(`Node with id "${id}" does not exist.`);
            return;
        }

        delete this._appearedNodes[id];
        this.decrementAppearedNodeCnt();
    }

    /**
     * ノードカウントをリセット
     */
    resetNodeCnt()
    {
        this._nodeCnt = 0;
        this._appearedNodeCnt = 0;
        this._appearedNodes = {};
    }

    /**
     * 出現したノードを表示
     */
    showAppearedNodes()
    {
        //console.log(this._nodeCnt, this._appearedNodeCnt, this._appearedNodes);
    }

    /**
     * 全てのノードが出現完了したか
     * 
     * @returns {boolean}
     */
    isAllNodeAppeared()
    {
        return this.nodeCnt === this.appearedNodeCnt;
    }

    /**
     * 全てのノードが消失完了したか
     * 
     * @returns {boolean}
     */
    isAllNodeDisappeared()
    {
        return this.appearedNodeCnt <= 0;
    }

    /**
     * ノードIDハッシュに追加
     * 
     * @param {} id 
     * @param {*} node 
     * @returns 
     */
    addNodeIdHash(id, node)
    {
        if (this._nodesIdHash.hasOwnProperty(id)){
            console.error(`Node with id "${id}" already exists.`);
            return;
        }
        this._nodesIdHash[id] = node;
    }

    /**
     * ノードIDハッシュから削除
     * 
     * @param {*} id 
     */
    delNodeIdHash(id)
    {
        delete this._nodesIdHash[id];
    }

    /**
     * ノードIDからノードを取得
     * 
     * @param {*} id 
     * @returns
     */
    getNodeById(id)
    {
        return this._nodesIdHash[id] ?? null;
    }

    /**
     * ノードを全て削除
     */
    clearNodes()
    {
        this.resetNodeCnt();
        this._nodesIdHash = {};
    }

    /**
     * スクロール
     */
    scroll()
    {
        
    }

    /**
     * ウィンドウの大きさ変更
     */
    resize()
    {
        
    }
}