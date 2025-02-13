import { Param } from '../common/param.js';

export class Background
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        this.dom = document.querySelector('#bg');
    }

    /**
     * スクロール
     */
    scroll(x, y)
    {
        this.dom.style.backgroundPositionX = (Param.BG_OFFSET * -1) - (x / Param.BG_SCROLL_RATE) + 'px';
        this.dom.style.backgroundPositionY = (Param.BG_OFFSET * -1) - (y / Param.BG_SCROLL_RATE) + 'px';
    }
}

