import { Param } from '../common/param.js';

export class Background
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        this.dom = document.querySelector('#bg');
        
        // 現在の背景位置を数値として取得（pxを除去して数値化）
        const style = window.getComputedStyle(this.dom);
        this.currentX = parseInt(style.backgroundPositionX) || 0;
        this.currentY = parseInt(style.backgroundPositionY) || 0;
    }

    /**
     * 指定した位置に背景をスクロール
     * 
     * @param {number} x
     * @param {number} y
     */
    scroll(x, y)
    {
        this.currentX = (Param.BG_OFFSET * -1) - (x / Param.BG_SCROLL_RATE);
        this.currentY = (Param.BG_OFFSET * -1) - (y / Param.BG_SCROLL_RATE);
        this.dom.style.backgroundPositionX = this.currentX + 'px';
        this.dom.style.backgroundPositionY = this.currentY + 'px';
    }

    /**
     * 現在位置から相対的にスクロール
     * 
     * @param {number} deltaX
     * @param {number} deltaY
     */
    scrollBy(deltaX, deltaY)
    {
        this.currentX -= deltaX / Param.BG_SCROLL_RATE;
        this.currentY -= deltaY / Param.BG_SCROLL_RATE;
        this.dom.style.backgroundPositionX = this.currentX + 'px';
        this.dom.style.backgroundPositionY = this.currentY + 'px';
    }
}

