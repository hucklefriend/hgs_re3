/**
 * イベントや監視処理を持つオブジェクトの共通破棄契約。
 */
export interface Disposable
{
    dispose(): void;
}
