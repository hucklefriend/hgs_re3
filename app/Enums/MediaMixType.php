<?php
/**
 * メディアミックス種別
 */

namespace App\Enums;

enum MediaMixType: int
{
    case MOVIE = 1;
    case MANGA = 2;
    case ANIME = 3;
    case NOVEL = 4;
    case DRAMA = 5;

    /**
     * テキストを取得
     *
     * @return string
     */
    public function text(): string
    {
        return match($this) {
            MediaMixType::MOVIE => '映画',
            MediaMixType::MANGA => '漫画',
            MediaMixType::ANIME => 'アニメ',
            MediaMixType::NOVEL => '小説',
            MediaMixType::DRAMA => 'ドラマ',
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
