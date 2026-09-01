<?php

namespace Tests\Unit\Enums;

use App\Enums\FearMeter;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class FearMeterTest extends TestCase
{
    #[DataProvider('averageRangeProvider')]
    public function test_average_range_text(FearMeter $fearMeter, string $expected): void
    {
        $this->assertSame($expected, $fearMeter->averageRangeText());
    }

    /**
     * @return array<string, array{FearMeter, string}>
     */
    public static function averageRangeProvider(): array
    {
        return [
            '全く怖くない' => [FearMeter::NotScary, '0.0–0.4'],
            'ところどころ怖い' => [FearMeter::SomewhatScary, '0.5–1.4'],
            '程よい怖さ' => [FearMeter::ModerateFear, '1.5–2.4'],
            'とても怖い' => [FearMeter::VeryScary, '2.5–3.4'],
            '怖すぎる' => [FearMeter::TooScary, '3.5–4.0'],
        ];
    }
}
