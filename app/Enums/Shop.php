<?php
/**
 * ショップ
 */

namespace App\Enums;

enum Shop: int
{
    // ネット通販
    case Amazon = 1;
    case DMM = 2;

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
    case FANZA = 44;
    case FANZA_GAMES = 45;

    // 動画配信サービス
    case PRIME_VIDEO = 51;
    case NETFLIX = 52;
    case DMM_TV = 53;
    case PRIME_VIDEO_DUBBING = 54;
    case PRIME_VIDEO_SUBTITLES = 55;

    // 電子書籍
    case KINDLE = 61;
    case DMM_BOOKS = 62;

    // レンタル
    case DMM_RENTAL = 71;

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
            self::DMM              => 'DMM通販',
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
            self::FANZA            => 'FANZA',
            self::FANZA_GAMES      => 'FANZA Games',
            self::PRIME_VIDEO      => 'Prime Video',
            self::NETFLIX          => 'Netflix',
            self::DMM_TV           => 'DMM TV',
            self::PRIME_VIDEO_DUBBING   => 'Prime Video(吹替)',
            self::PRIME_VIDEO_SUBTITLES => 'Prime Video(字幕)',
            self::KINDLE           => 'Kindle',
            self::DMM_BOOKS        => 'DMMブックス',
            self::DMM_RENTAL       => 'DMM宅配レンタル',
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
     * @param string[] $excludeShopList
     * @return string[]
     */
    public static function selectList(array $excludeShopList = []): array
    {
        $result = [];



        $items = [
            self::Amazon,
            self::DMM,
        ];
        foreach ($items as $item) {
            if (!in_array($item->value, $excludeShopList)) {
                self::addItem($result, '通販', $item);
            }
        }

        $items = [
            self::Steam,
            self::PlayStationStore,
            self::MicrosoftStore,
            self::NintendoStore,
            self::NintendoEShop,
            self::DMM_GAMES,
            self::EGG,
            self::XboxStore,
        ];
        foreach ($items as $item) {
            if (!in_array($item->value, $excludeShopList)) {
                self::addItem($result, 'ゲーム配信サイト', $item);
            }
        }


        $items = [
            self::APP_STORE,
            self::GooglePlay,
            self::SQM,
        ];
        foreach ($items as $item) {
            if (!in_array($item->value, $excludeShopList)) {
                self::addItem($result, 'スマホアプリ', $item);
            }
        }

        $items = [
            self::Getchu,
            self::DLsite,
            self::FANZA,
            self::FANZA_GAMES,
        ];
        foreach ($items as $item) {
            if (!in_array($item->value, $excludeShopList)) {
                self::addItem($result, 'アダルト', $item);
            }
        }

        $items = [
            self::PRIME_VIDEO,
            self::PRIME_VIDEO_DUBBING,
            self::PRIME_VIDEO_SUBTITLES,
            self::NETFLIX,
            self::DMM_TV,
        ];
        foreach ($items as $item) {
            if (!in_array($item->value, $excludeShopList)) {
                self::addItem($result, '動画配信サービス', $item);
            }
        }

        $items = [
            self::KINDLE,
            self::DMM_BOOKS,
        ];
        foreach ($items as $item) {
            if (!in_array($item->value, $excludeShopList)) {
                self::addItem($result, '電子書籍', $item);
            }
        }

        $items = [
            self::DMM_RENTAL,
        ];
        foreach ($items as $item) {
            if (!in_array($item->value, $excludeShopList)) {
                self::addItem($result, 'レンタル', $item);
            }
        }

        $items = [
            self::Amazon_SEARCH,
            self::MERCARI_SEARCH,
            self::RAKUTEN_SEARCH,
        ];
        foreach ($items as $item) {
            if (!in_array($item->value, $excludeShopList)) {
                self::addItem($result, '〇〇で検索', $item);
            }
        }

        return $result;
    }

    /**
     * ショップを追加
     *
     * @param array $result
     * @param string $category
     * @param Shop $shop
     * @return void
     */
    private static function addItem(array &$result, string $category, Shop $shop): void
    {
        $result[$category][$shop->value] = $shop->name();
    }
}
