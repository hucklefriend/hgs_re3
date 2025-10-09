<?php
/**
 * ゲームプラットフォーム種別
 */

namespace App\Enums;

enum GamePlatformType: int
{
    case HOME_CONSOLE = 1;
    case HANDHELD_CONSOLE = 2;
    case ARCADE = 3;
    case PC_OS = 4;
    case ONLINE_DISTRIBUTION = 5;
    case BROWSER_GAME = 6;
    case MOBILE = 7;
    case OTHER = 8;

    /**
     * テキストを取得
     *
     * @return string
     */
    public function text(): string
    {
        return match($this) {
            GamePlatformType::HOME_CONSOLE => '家庭用ゲーム機',
            GamePlatformType::HANDHELD_CONSOLE => '家庭用携帯ゲーム機',
            GamePlatformType::ARCADE => '業務用ゲーム機',
            GamePlatformType::PC_OS => 'パソコン/OS',
            GamePlatformType::ONLINE_DISTRIBUTION => 'オンライン配信プラットフォーム',
            GamePlatformType::BROWSER_GAME => 'ブラウザゲームプラットフォーム',
            GamePlatformType::MOBILE => 'スマホ/フィーチャーフォン',
            GamePlatformType::OTHER => 'その他',
        };
    }

    /**
     * input[type=select]に渡す用のリスト作成
     *
     * @param array $prepend
     * @return string[]
     */
    public static function selectList(array $prepend = []): array
    {
        $result = $prepend;

        foreach (self::cases() as $case) {
            $result[$case->value] = $case->text();
        }

        return $result;
    }
}

