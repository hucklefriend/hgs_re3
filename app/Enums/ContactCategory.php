<?php

namespace App\Enums;

enum ContactCategory: int
{
    case BUG_REPORT = 0;      // 不具合報告
    case GAME_INFO_ERROR = 1; // ゲーム情報の誤り
    case DELETE_PERSONAL_INFO = 2; // 個人情報の削除
    case OTHER = 3;           // その他

    /**
     * カテゴリ名を取得
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this)
        {
            self::BUG_REPORT => '不具合報告',
            self::GAME_INFO_ERROR => 'ゲーム情報の誤り',
            self::DELETE_PERSONAL_INFO => '個人情報の削除',
            self::OTHER => 'その他',
        };
    }

    /**
     * すべてのカテゴリを配列で取得
     *
     * @return array
     */
    public static function toArray(): array
    {
        return array_map(
            fn($case) => [
                'value' => $case->value,
                'name' => $case->name,
                'label' => $case->label(),
            ],
            self::cases()
        );
    }

    /**
     * ラベルから対応するEnumを取得
     *
     * @param string $label
     * @return ContactCategory|null
     */
    public static function fromLabel(string $label): ?ContactCategory
    {
        foreach (self::cases() as $case)
        {
            if ($case->label() === $label) {
                return $case;
            }
        }
        return null;
    }
}

