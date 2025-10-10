<?php
/**
 * ゲームメーカー種別
 */

namespace App\Enums;

enum GameMakerType: int
{
    case COMMERCIAL = 1;
    case INDIE = 2;
    case DOUJIN = 3;

    /**
     * テキストを取得
     *
     * @return string
     */
    public function text(): string
    {
        return match($this) {
            GameMakerType::COMMERCIAL => '商業メーカー',
            GameMakerType::INDIE => 'インディーメーカー',
            GameMakerType::DOUJIN => '同人サークル',
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
