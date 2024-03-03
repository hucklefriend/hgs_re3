<?php
/**
 * よみがなの種別
 */

namespace App\Enums\Game\Soft;


enum PhoneticType: int
{
    case A  = 1;
    case KA = 2;
    case SA = 3;
    case TA = 4;
    case NA = 5;
    case HA = 6;
    case MA = 7;
    case YA = 8;
    case RA = 9;
    case WA = 10;

    // インターフェイスの規約を満たすための実装
    public function hiragana(): string
    {
        return match($this) {
            PhoneticType::A  => 'あ',
            PhoneticType::KA => 'か',
            PhoneticType::SA => 'さ',
            PhoneticType::TA => 'た',
            PhoneticType::NA => 'な',
            PhoneticType::HA => 'は',
            PhoneticType::MA => 'ま',
            PhoneticType::YA => 'や',
            PhoneticType::RA => 'ら',
            PhoneticType::WA => 'わ',
        };
    }

    /**
     * よみがなからタイプを取得
     *
     * @param string $phonetic
     * @return int
     */
    public static function getTypeByPhonetic(string $phonetic): int
    {
        $patterns = [
            PhoneticType::A->value  => '[あ-お]',
            PhoneticType::KA->value => '[か-こが-ご]',
            PhoneticType::SA->value => '[さ-そざ-ぞ]',
            PhoneticType::TA->value => '[た-とだ-ど]',
            PhoneticType::NA->value => '[な-の]',
            PhoneticType::HA->value => '[は-ほば-ぼぱ-ぽ]',
            PhoneticType::MA->value => '[ま-も]',
            PhoneticType::YA->value => '[や-よ]',
            PhoneticType::RA->value => '[ら-ろ]',
            PhoneticType::WA->value => '[わ-ん]'
        ];

        foreach ($patterns as $phoneticType => $pattern) {
            if (preg_match('/^' . $pattern . '/u', $phonetic)) {
                return $phoneticType;
            }
        }

        return 0;
    }
}
