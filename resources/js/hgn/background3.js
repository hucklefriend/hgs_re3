import {OctaNode} from './node/octa-node.js';
import {PointNode} from './node/point-node.js';
import {Param} from './param.js';
import {Bg3Network} from './network.js';

export class Background3
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        this.dom = document.querySelector('#bg3');

    }

    scroll()
    {
        this.dom.style.backgroundPositionY = (Param.BG3_OFFSET * -1) - (window.scrollY / Param.BG3_SCROLL_RATE) + 'px';
    }
}

