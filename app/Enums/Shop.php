<?php
/**
 * ショップ
 */

namespace App\Enums;

enum Shop: int
{
    // ネット通販
    case Amazon = 1;

    // ゲーム配信サイト
    case Steam = 11;
    case PlayStationStore = 12;
    case MicrosoftStore = 13;
    case NintendoStore = 14;
    case NintendoEShop = 15;
    case DMM_GAMES = 16;
    case EGG = 17;
    case XboxStore = 18;

    // スマホアプリ
    case APP_STORE = 31;
    case GooglePlay = 32;
    case SQM = 33;

    // アダルト
    case Getchu = 41;
    case DLsite = 42;
    case DMM = 43;
    case FANZA = 44;
    case FANZA_GAMES = 45;

    // 動画配信サービス
    case PRIME_VIDEO = 51;

    // 〇〇で検索
    case Amazon_SEARCH = 101;
    case MERCARI_SEARCH = 102;
    case RAKUTEN_SEARCH = 103;

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
            self::FANZA_GAMES      => 'FANZA Games',
            self::PRIME_VIDEO      => 'Prime Video',
            self::Amazon_SEARCH    => 'Amazonで探す',
            self::MERCARI_SEARCH   => 'メルカリで探す',
            self::RAKUTEN_SEARCH   => '楽天で探す',
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
