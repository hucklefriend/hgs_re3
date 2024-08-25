<?php
/**
 * 商品のデフォルトイメージ
 */

namespace App\Enums;

enum ProductDefaultImage: int
{
    case GAME_PACKAGE = 1;
    case GAME_DISTRIBUTION = 2;
    case DISC = 4;
    case VIDEO_STREAMING = 3;
    case BOOK = 5;
    case DIGITAL_BOOK = 6;
    case RENTAL = 7;

    /**
     * テキストを取得
     *
     * @return string
     */
    public function text(): string
    {
        return match($this) {
            ProductDefaultImage::GAME_PACKAGE => 'ゲームパッケージ',
            ProductDefaultImage::GAME_DISTRIBUTION => 'ダウンロード販売',
            ProductDefaultImage::DISC => 'ディスク',
            ProductDefaultImage::VIDEO_STREAMING => '動画配信',
            ProductDefaultImage::BOOK => '本',
            ProductDefaultImage::DIGITAL_BOOK => '電子書籍',
            ProductDefaultImage::RENTAL => '宅配レンタル',
        };
    }

    /**
     * 画像URLを取得
     *
     * @return string
     */
    public function imgUrl(): string
    {
        return match($this) {
            ProductDefaultImage::GAME_PACKAGE => asset('img/pdi/pkg.png'),
            ProductDefaultImage::GAME_DISTRIBUTION => asset('img/pdi/dl.png'),
            ProductDefaultImage::DISC => asset('img/pdi/disc.png'),
            ProductDefaultImage::VIDEO_STREAMING => asset('img/pdi/vod.png'),
            ProductDefaultImage::BOOK => asset('img/pdi/book.png'),
            ProductDefaultImage::DIGITAL_BOOK => asset('img/pdi/ebook.png'),
            ProductDefaultImage::RENTAL => asset('img/pdi/rental.png'),
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
