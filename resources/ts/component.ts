import type { Disposable } from './site/core/disposable';

/**
 * コンポーネントの基底クラス
 */
export abstract class Component implements Disposable
{
    /**
     * コンストラクタ
     * @param params 初期化パラメーター（未使用）
     */
    constructor(params: any | null = null)
    {
    }

    dispose(): void
    {
    }
}
