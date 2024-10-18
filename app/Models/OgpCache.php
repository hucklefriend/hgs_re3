<?php

namespace App\Models;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OgpCache extends \Eloquent
{
    protected $fillable = ['url', 'title', 'description', 'image', 'type'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * 指定URLのOGP情報を取得する。
     *
     *
     * @param  string  $url
     * @return self
     */
    public static function findOrNewByUrl(string $url): self
    {
        $hash = hash('sha256', $url);
        $model = self::where('hash', $hash)->first();
        return $model ?: new self(['hash' => $hash, 'url' => $url]);
    }

    /**
     * OGP情報を取得してマージする
     *
     * @return self
     */
    public function fetch(): self
    {
        $ogpData = array_merge([
            'title'       => null,
            'description' => null,
            'url'         => null,
            'image'       => null,
            'type'        => null,
        ], self::getOGPInfo($this->url));

        $this->fill($ogpData);

        if ($this->url === null) {
            $this->hash = null;
        } else {
            $this->hash = hash('sha256', $this->url);

            // hashが重複しているかチェック
            $model = self::where('hash', $this->hash)->first();
            if ($model) {
                $this->exists = true;
                $this->id = $model->id;
            } else {
                $this->exists = false;
            }
        }

        return $this;
    }

    /**
     * 保存または削除する
     *
     * @return void
     */
    public function saveOrDelete(): void
    {
        if (empty($this->url)) {
            if ($this->exists) {
                $this->delete();
            }
            $this->id = null;
        } else {
            $this->save();
        }
    }

    /**
     * 指定URLのOGP情報を取得する。
     *
     * @param string $url
     * @return array
     * @throws ConnectionException
     */
    public static function getOGPInfo(string $url): array
    {
        // ブラウザのUser-Agentを設定
        $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
            . 'AppleWebKit/537.36 (KHTML, like Gecko) '
            . 'Chrome/85.0.4183.83 Safari/537.36';

        // Fetch the HTML content
        // 日本からのアクセスとしてリクエストを送信する
        $response = Http::withHeaders([
            'User-Agent' => $userAgent,
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language' => 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer' => $url,
        ])->get($url);

        if ($response->failed()) {
            // Handle error, return empty array or throw an exception
            Log::warning("Ogp: request failed {$url}.(" . $response->status() . ")");
            return [];
        }

        $html = $response->body();

        // Suppress warnings due to malformed HTML
        libxml_use_internal_errors(true);

        // Load HTML into DOMDocument
        $doc = new \DOMDocument();
        $doc->loadHTML('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' . $html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        // Create a new DOMXPath instance
        $xpath = new \DOMXPath($doc);

        // Query for meta tags with property starting with 'og:'
        $metaTags = $xpath->query("//meta[starts-with(@property, 'og:')]");

        $ogpData = [];

        $hasData = false;

        foreach ($metaTags as $tag) {
            $property = $tag->getAttribute('property');
            $content = $tag->getAttribute('content');

            // Remove 'og:' prefix from property to use as key
            $key = substr($property, 3);

            switch($key) {
                case 'title':
                case 'description':
                case 'image':
                case 'type':
                    $hasData = true;
                case 'url':
                    // <br> <br/> <br />などを\r\nに変換
                    $content = preg_replace('/<br\s*\/?>/', "\r\n", $content);

                    // htmlタグを全て除去
                    $content = strip_tags($content);
                    $ogpData[$key] = $content;
                    break;
                default:
                    break;
            }
        }

        if ($hasData && !isset($ogpData['url'])) {
            $ogpData['url'] = $url;
        }

        // imageがhttp(s)で始まっていない場合は、絶対URLに変換
        if (isset($ogpData['image']) && !preg_match('/^https?:\/\//', $ogpData['image'])) {
            $ogpData['image'] = $ogpData['url'] . $ogpData['image'];
        }

        // imageが//で始まっている場合は、$ogpData['url']のスキームを付与
        if (isset($ogpData['image']) && preg_match('/^\/\//', $ogpData['image'])) {
            $ogpData['image'] = parse_url($ogpData['url'], PHP_URL_SCHEME) . ':' . $ogpData['image'];
        }

        // Restore error handling
        libxml_clear_errors();
        libxml_use_internal_errors(false);

        return $ogpData;
    }
}
