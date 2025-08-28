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

    public static getAnimationProgress(startTime: number, duration: number): number
    {
        const currentTime = (window as any).hgn.timestamp;
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime <= duration) {
            return elapsedTime / duration;
        }
        return 1.0;
    }

    

    /**
     * 現在のスタックトレースをコンソールに出力する
     */
    public static logStackTrace(): void
    {
        try {
            // Errorオブジェクトを使用してスタックトレースを取得
            const error = new Error();
            if (error.stack) {
                console.log('=== スタックトレース ===');
                console.log(error.stack);
                console.log('=====================');
            } else {
                // スタックトレースが取得できない場合の代替手段
                console.log('=== スタックトレース（代替） ===');
                console.trace('現在の呼び出しスタック');
                console.log('============================');
            }
        } catch (e) {
            console.log('スタックトレースの取得に失敗しました:', e);
        }
    }
} 