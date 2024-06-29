

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
}
