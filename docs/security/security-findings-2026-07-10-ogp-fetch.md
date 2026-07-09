# セキュリティ調査メモ（2026-07-10）— OGP画像取得処理

[security-audit-2026-07-05.md](security-audit-2026-07-05.md) の **#7（アバター画像アップロードのピクセル爆弾対策）** 対応時、
「同じ問題がOGP画像取得にも仕込まれていないか」を確認した副産物として見つかった2点をまとめる。

対象: `app/Models/OgpCache.php` — `getOGPInfo()`（OGP情報の取得処理全体）

---

## サマリ

| # | 深刻度 | 概要 |
|---|--------|------|
| 1 | 低 | OGP取得元HTMLの `Http::get($url)` にタイムアウト・レスポンスサイズ上限が無い |
| 2 | 情報 | `getimagesize()` で取得した `image_width` / `image_height` に上限チェックが無く無制限に保存される |

### 前提（ピクセル爆弾そのものへの結論）

`getOGPInfo()` は画像自体を GD/Imagick でデコードしておらず、`getimagesize()`（[app/Models/OgpCache.php:201](../../app/Models/OgpCache.php#L201)）でヘッダのみを読んでいる。
再エンコードもせず、URL文字列をそのまま保存し `<img src="...">` としてブラウザに描画させている（[resources/views/common/ogp.blade.php:5](../../resources/views/common/ogp.blade.php#L5)）。
そのため **サーバー側でフルデコードが起きる古典的な decompression bomb のリスクはこの経路には無い**（#7と同種の問題ではない）。

また `getOGPInfo()` の呼び出し元は管理画面（`ogp_url` を入力する `Admin/Game/*Controller`）とRSSフィード取り込み（`FetchRssArticleOgp` / `TimelineEventService::fetchMissingOgp`）のみで、
一般ユーザーが任意URLを直接投稿してこの経路に到達させる手段は無い（レビュー・タイムライン投稿からは到達しない）。そのため深刻度は低めに評価している。

---

## 1.【低】OGP取得元HTMLの `Http::get($url)` にタイムアウト・サイズ上限が無い

### 内容
`getOGPInfo()` 冒頭のHTML取得リクエストにはタイムアウトもレスポンスサイズの上限も設定されていない。

```php
$response = Http::withHeaders([...])->get($url);
```

一方、直後の画像サイズ取得（`getimagesize()`）には60秒のタイムアウトが明示的に設定されている（[app/Models/OgpCache.php:196-200](../../app/Models/OgpCache.php#L196-L200)）ため、
HTML取得側だけ対策が抜けている状態。応答が極端に遅い、または巨大なレスポンスを返す先を指定された場合、
そのリクエストを処理しているワーカー（キューワーカー含む）が長時間占有される可能性がある。

呼び出し元は管理画面とRSSフィード取り込みに限られるため、外部ユーザーが直接悪用できる経路ではないが、
- 管理画面: 管理者が誤って/騙されて悪意あるURLを入力するケース
- RSSフィード: フィード提供元（4gamer/automaton/game_watch/game_spark）の記事URLが乗っ取られた・改ざんされたケース

は多層防御の観点で考慮の余地がある。

### 該当箇所
- [app/Models/OgpCache.php:101-107](../../app/Models/OgpCache.php#L101-L107) — `Http::get($url)`（タイムアウト・サイズ上限なし）
- 比較: [app/Models/OgpCache.php:196-200](../../app/Models/OgpCache.php#L196-L200) — `getimagesize()` 側は60秒タイムアウト設定済み

### 解決案
```php
$response = Http::withHeaders([...])
    ->timeout(10)          // 接続+応答の合計タイムアウト
    ->get($url);
```

Laravel の `Http` クライアント（Guzzle）はレスポンスサイズ自体の上限オプションを持たないため、
サイズ対策が必要な場合はストリーミング取得＋一定バイト数で打ち切る実装、
またはWebサーバー/リバースプロキシ側でのアウトバウンドタイムアウト設定と組み合わせる。

---

## 2.【情報】`image_width` / `image_height` の保存に上限チェックが無い

### 内容
`getimagesize()` が返す寸法情報をそのままDBへ保存しており（[app/Models/OgpCache.php:203-204](../../app/Models/OgpCache.php#L203-L204)）、上限チェックが無い。

```php
$imageSize = @getimagesize($ogpData['image'], $context);
if ($imageSize !== false) {
    $ogpData['image_width'] = $imageSize[0];
    $ogpData['image_height'] = $imageSize[1];
}
```

画像そのものはサーバー側でデコードしないため直接のDoSには繋がらないが、
最終的に `<img>` タグでブラウザに描画されるため、極端な寸法を宣言する画像（decompression bomb）を
そのまま参照した場合の挙動は**ブラウザのデコーダ実装に依存**する（多くの現代ブラウザはタブ単位のプロセス分離やデコード上限で
影響を局所化するが、環境によっては表示崩れ・タブのハング等が起こり得る）。

### 該当箇所
- [app/Models/OgpCache.php:201-205](../../app/Models/OgpCache.php#L201-L205)

### 解決案（対応する場合の案。現時点では情報共有のみで対応不要と判断）
- `image_width` / `image_height` が極端な値（例: 10000px超）の場合は `image` を保存しない、
  もしくはフロントで `loading="lazy"` に加えて表示サイズを明示のCSSで固定しレイアウト崩れのみ防ぐ。
- 呼び出し元が管理画面・信頼済みRSSフィードに限定されていることを踏まえると、優先度は低い。

---

## 関連ドキュメント
- [security-audit-2026-07-05.md](security-audit-2026-07-05.md) — #7 アバター画像アップロードのピクセル寸法制限（本調査のきっかけ）
