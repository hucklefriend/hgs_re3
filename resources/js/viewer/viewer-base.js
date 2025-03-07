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

    get nodeCnt()
    {
        return this._nodeCnt;
    }

    get appearedNodeCnt()
    {
        return this._appearedNodeCnt;
    }

    incrementNodeCnt()
    {
        this._nodeCnt++;
    }

    incrementAppearedNodeCnt()
    {
        this._appearedNodeCnt++;
    }

    decrementAppearedNodeCnt()
    {
        this._appearedNodeCnt--;
    }

    addAppearedNode(id)
    {
        if (this._appearedNodes.hasOwnProperty(id))
        {
            console.error(`Node with id "${id}" already exists.`);
            return;
        }
        this._appearedNodes[id] = 1;
        this.incrementAppearedNodeCnt();
    }

    delAppearedNode(id)
    {
        delete this._appearedNodes[id];
        this.decrementAppearedNodeCnt();
    }

    resetNodeCnt()
    {
        this._nodeCnt = 0;
        this._appearedNodeCnt = 0;
        this._appearedNodes = {};
    }

    showAppearedNodes()
    {
        console.log(this._nodeCnt, this._appearedNodeCnt, this._appearedNodes);
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
}