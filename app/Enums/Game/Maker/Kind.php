<?php
/**
 * メーカーの属性
 */

namespace App\Enums\Game\Maker;


enum Kind: int
{
    case None = 0;
    case Company = 1;

    /**
     * テキスト
     *
     * @return string
     */
    public function text(): string
    {
        return match($this) {
            Kind::None    => '未指定',
            Kind::Company => '会社',
        };
    }

    /**
     * input[type=select]に渡す用のリスト作成
     *
     * @return string[]
     */
    public static function selectList(): array
    {
        $result = [];

        foreach (self::cases() as $case) {
            $result[$case->value] = $case->text();
        }

        return $result;
    }
}
