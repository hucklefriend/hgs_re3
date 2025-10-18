<?php

namespace App\Enums;

enum ContactStatus: int
{
    case PENDING = 0;      // 未対応
    case IN_PROGRESS = 1;  // 対応中
    case RESOLVED = 2;     // 完了
    case CLOSED = 3;       // クローズ
    case CANCELLED = 4;    // 取り消し

    /**
     * ステータス名を取得
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::PENDING => '未対応',
            self::IN_PROGRESS => '対応中',
            self::RESOLVED => '完了',
            self::CLOSED => 'クローズ',
            self::CANCELLED => '取り消し',
        };
    }

    /**
     * すべてのステータスを配列で取得
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

