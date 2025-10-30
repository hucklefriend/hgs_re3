<?php

namespace App\Enums;

enum ContactResponderType: int
{
    case ADMIN = 0;   // 管理者
    case USER = 1;    // ユーザー
    case SYSTEM = 2;  // システム

    /**
     * 返信者タイプ名を取得
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::ADMIN => '管理者',
            self::USER => 'ユーザー',
            self::SYSTEM => 'システム',
        };
    }

    /**
     * すべての返信者タイプを配列で取得
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
}

