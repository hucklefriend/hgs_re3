<?php
/**
 * 怖さメーター
 */

namespace App\Enums;

enum FearMeter: int
{
    case NotScary = 0;
    case SomewhatScary = 1;
    case ModerateFear = 2;
    case VeryScary = 3;
    case TooScary = 4;

    /**
     * テキストを取得
     *
     * @return string
     */
    public function text(): string
    {
        return match($this) {
            FearMeter::NotScary => '全く怖くない',
            FearMeter::SomewhatScary => 'ところどころ怖く感じるところはある',
            FearMeter::ModerateFear => '程よい怖さ',
            FearMeter::VeryScary => 'めちゃくちゃ怖かった',
            FearMeter::TooScary => '怖すぎて途中でやめた',
        };
    }

    /**
     * ラベルを取得
     *
     * @return string
     */
    public function label(): string
    {
        return match($this) {
            FearMeter::NotScary => '0',
            FearMeter::SomewhatScary => '1',
            FearMeter::ModerateFear => '2',
            FearMeter::VeryScary => '3',
            FearMeter::TooScary => '死',
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
