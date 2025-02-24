import { HorrorGameNetwork } from '../horror-game-network.js';
import { DOMNode, TextNode, SubOctaNode } from '../node/octa-node.js';
import { SubPointNode } from '../node/point-node.js';
import { LinkNode } from '../node/link-node.js';
import { EntranceNode } from '../node/entrance-node.js';
import { ContentLinkNode } from '../node/content-node.js';
import { Head1Node, Head2Node, Head3Node } from '../node/head-node.js';
import { PopupLinkNode } from '../node/popup-node.js';
import { Param } from '../common/param.js';
import { Util } from '../common/util.js';
import { HR } from './hr.js';
import { Rect } from '../common/rect.js';
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
}