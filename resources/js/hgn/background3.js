import {Param} from './param.js';
import {HorrorGameNetwork} from "../hgn.js";

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
        const hgn = HorrorGameNetwork.getInstance();

        this.dom.style.backgroundPositionY = (Param.BG3_OFFSET * -1) - (hgn.getScrollY() / Param.BG3_SCROLL_RATE) + 'px';
    }
}

