export class Util
{
    /**
     * URLにGETパラメーターa=1を付与する
     * @param url 元のURL文字列
     * @returns パラメーターが付与されたURL
     */
    public static addParameterA(url: string): string
    {
        try {
            const urlObj = new URL(url);
            urlObj.searchParams.set('a', '1');
            return urlObj.toString();
        } catch (error) {
            // URLが無効な場合は、元のURLに?または&を付けてa=1を追加
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}a=1`;
        }
    }
} 