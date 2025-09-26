/**
 * アプリケーション全体の設定を管理するクラス
 */
export class Config
{
    // シングルトンインスタンス
    private static instance: Config | null = null;

    // 設定プロパティ（定数）
    public readonly BEHIND_CURVE_LINE_MAX_OPACITY: number;
    public readonly BEHIND_CURVE_LINE_MIN_OPACITY: number;

    /**
     * プライベートコンストラクタ（シングルトンパターン）
     */
    private constructor()
    {
        // デフォルト設定値
        this.BEHIND_CURVE_LINE_MAX_OPACITY = 0.3;
        this.BEHIND_CURVE_LINE_MIN_OPACITY = 0.1;
    }

    /**
     * シングルトンインスタンスを取得
     * @returns Configインスタンス
     */
    public static getInstance(): Config
    {
        if (Config.instance === null) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    /**
     * 設定を更新する
     * @param config 更新する設定オブジェクト
     */
    public updateConfig(config: Partial<Config>): void
    {
        Object.assign(this, config);
    }

    /**
     * 設定をリセットする
     */
    public resetConfig(): void
    {
        Config.instance = null;
        Config.instance = new Config();
    }

    /**
     * 現在の設定を取得する
     * @returns 設定オブジェクト
     */
    public getConfig(): Partial<Config>
    {
        return {
            BEHIND_CURVE_LINE_MAX_OPACITY: this.BEHIND_CURVE_LINE_MAX_OPACITY,
            BEHIND_CURVE_LINE_MIN_OPACITY: this.BEHIND_CURVE_LINE_MIN_OPACITY
        };
    }
}
