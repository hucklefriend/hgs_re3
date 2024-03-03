<?php
/**
 * R指定
 */

namespace App\Enums;

enum RatedR: int
{
    case None = 0;
    case R15  = 1;
    case R18  = 2;

    /**
     * テキストを取得
     *
     * @return string
     */
    public function text(): string
    {
        return match($this) {
            RatedR::None => '全年齢',
            RatedR::R15  => 'R-15',
            RatedR::R18  => 'R-18',
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
