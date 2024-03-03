<?php
/**
 * ショップ
 */

namespace App\Enums\Game;

enum Shop: int
{
    case Amazon = 1;
    case Steam = 11;
    case PlayStationStore = 12;
    case MicrosoftStore = 13;
    case NintendoStore = 14;
    case NintendoEShop = 15;
    case DMM_GAMES = 16;
    case EGG = 17;
    case XboxStore = 18;
    case APP_STORE = 31;
    case GooglePlay = 32;
    case SQM = 33;
    case Getchu = 41;
    case DLsite = 42;
    case DMM = 43;
    case FANZA = 44;
    case FANZA_GAMES = 45;

    /**
     * ショップ名
     *
     * @return string
     */
    public function name(): string
    {
        return match($this) {
            self::Amazon           => 'Amazon',
            self::Steam            => 'Steam',
            self::PlayStationStore => 'PlayStation Store',
            self::MicrosoftStore   => 'Microsoft ストア',
            self::NintendoStore    => 'My Nintendo Store',
            self::NintendoEShop    => 'Nintendo eShop',
            self::DMM_GAMES        => 'DMM GAMES',
            self::EGG              => 'EGG',
            self::XboxStore        => 'XBOX ストア',
            self::APP_STORE        => 'App Store',
            self::GooglePlay       => 'Google Play',
            self::SQM              => 'スクエニマーケット',
            self::Getchu           => 'Getchu.com',
            self::DLsite           => 'DLsite',
            self::DMM              => 'DMM.com',
            self::FANZA            => 'FANZA',
            self::FANZA_GAMES      => 'FANZA Games'
        };
    }

    /**
     * Font awesomeのマーク
     *
     * @return string
     */
    public function mark(): string
    {
        return match ($this) {
            self::Amazon           => '<i class="fab fa-amazon"></i>',
            self::Steam            => '<i class="fab fa-steam"></i>',
            self::PlayStationStore => '<i class="fab fa-playstation"></i>',
            self::APP_STORE        => '<i class="fab fa-apple"></i>',
            self::GooglePlay       => '<i class="fab fa-google-play"></i>',
            self::MicrosoftStore   => '<i class="fab fa-microsoft"></i>',
            self::NintendoStore, self::NintendoEShop => '<i class="fab fa-nintendo-switch"></i>',
            self::XboxStore        => '<i class="fab fa-xbox"></i>',
            default                => '',
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
            $result[$case->value] = $case->name();
        }

        return $result;
    }
}
