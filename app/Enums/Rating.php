<?php
/**
 * レーティング
 */

namespace App\Enums;

enum Rating: int
{
    case None = 0;
    // 諸事情で1は欠番
    case R18Z = 2;
    case R18A = 3;

    /**
     * テキストを取得
     *
     * @return string
     */
    public function text(): string
    {
        return match($this) {
            Rating::None => '全年齢',
            Rating::R18Z => 'R-18Z',
            Rating::R18A => 'R-18A',
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
