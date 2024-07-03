

export class Util
{
    /**
     * 2つの値の中間値を取得
     *
     * @param value1
     * @param value2
     * @param ratio
     * @returns {*}
     */
    static getMidpoint(value1, value2, ratio)
    {
        if (ratio < 0) {
            ratio = 0;
        } else if (ratio > 1) {
            ratio = 1;
        }

        return value1 + (value2 - value1) * ratio;
    }

    /**
     * 指定された範囲内からランダムで1つの整数を返す関数
     * @param {number} min - 最小値（含む）
     * @param {number} max - 最大値（含む）
     * @returns {number} - ランダムな整数
     */
    static getRandomInt(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
