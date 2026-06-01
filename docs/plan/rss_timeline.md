# RSSタイムライン機能 設計資料

## 概要

4Gamer・AUTOMATON・Game Watch・Game*Spark の RSS フィードを定期取得し、「ホラーゲーム」というキーワード、または `game_titles` のタイトル名・シノニム、あるいは `game_franchises` / `game_series` の名前に一致する記事をタイムラインに表示する。

- **ルートタイムライン**: マッチした記事を全件掲載
- **ユーザー個人タイムライン**: 「ホラーゲーム」キーワードを含む記事 + お気に入りタイトルが属するフランチャイズ配下のタイトルにマッチした記事を掲載

### コンテンツの扱い方針

各サイトの利用規約は無断転載を禁止しているが、OGP メタデータ（`og:title` 等）はサイト側が SNS 連携用に公開しているものであり、Twitter・Slack 等のリンクプレビューと同等の利用形態となる。

- **RSS から保存するのは URL と判定フラグのみ**。記事タイトル・本文・概要は DB に保存しない
- **マッチング判定**は RSS テキスト（タイトル + description）をメモリ上で処理し、永続化しない
- **タイムライン表示**は既存の `OgpCache` モデル経由で OGP 情報を取得して表示する

---

## DB テーブル設計

### `rss_sources`（RSS配信元）

| カラム | 型 | NULL | 説明 |
|---|---|---|---|
| `id` | BIGINT PK | | |
| `name` | VARCHAR(255) | NO | サイト名（例: ファミ通） |
| `url` | VARCHAR(2048) | NO | RSS フィード URL |
| `is_active` | BOOLEAN | NO | 取得有効フラグ（DEFAULT TRUE） |
| `last_fetched_at` | TIMESTAMP | YES | 最終取得日時 |
| `created_at` | TIMESTAMP | | |
| `updated_at` | TIMESTAMP | | |

### `rss_articles`（取得済み記事）

記事タイトル・本文は保存しない。URL のみを保持し、表示時は `OgpCache` から取得する。

| カラム | 型 | NULL | 説明 |
|---|---|---|---|
| `id` | BIGINT PK | | |
| `rss_source_id` | BIGINT FK → rss_sources.id | NO | |
| `guid` | VARCHAR(2048) | NO | RSS の `<guid>` or `<link>`（重複判定キー） |
| `url` | VARCHAR(2048) | NO | 記事URL（OGP取得・リンク先） |
| `has_horror_keyword` | BOOLEAN | NO | 「ホラーゲーム」を含むか（DEFAULT FALSE） |
| `published_at` | TIMESTAMP | YES | RSS の配信日時 |
| `created_at` | TIMESTAMP | | |

- UNIQUE INDEX: `(rss_source_id, guid)` ← 重複取得防止
- INDEX: `(published_at DESC)` ← タイムライン取得用

### `rss_article_matched_titles`（記事とマッチしたタイトルの紐付け）

`game_titles.name` または `search_synonyms` でマッチした場合に記録する。

| カラム | 型 | 説明 |
|---|---|---|
| `rss_article_id` | BIGINT FK → rss_articles.id (cascade) | |
| `game_title_id` | BIGINT FK → game_titles.id (cascade) | |

- PK: `(rss_article_id, game_title_id)`
- INDEX: `(game_title_id)` ← タイトル側からの逆引き用

### `rss_article_matched_franchises`（記事とマッチしたフランチャイズの紐付け）

`game_franchises.name` または `game_series.name` でマッチした場合に記録する。
シリーズ名でマッチした場合もそのシリーズの `game_franchise_id` を使ってフランチャイズ単位で記録する。
これにより未登録の新作タイトルの発表記事も、フランチャイズ名から確実に拾える。

| カラム | 型 | 説明 |
|---|---|---|
| `rss_article_id` | BIGINT FK → rss_articles.id (cascade) | |
| `game_franchise_id` | BIGINT FK → game_franchises.id (cascade) | |

- PK: `(rss_article_id, game_franchise_id)`
- INDEX: `(game_franchise_id)` ← フランチャイズ側からの逆引き用

---

## 新規 Enum 値

### `TimelineEventType`

| 追加ケース | 値 | label |
|---|---|---|
| `RssArticlePosted` | `'rss_article_posted'` | `'ゲーム情報が公開されました'` |

### `TimelineSubjectType`

| 追加ケース | 値 |
|---|---|
| `RssArticle` | `'rss_article'` |

---

## タイムラインイベントのカラム使用

| event_type | actor_type | actor_id | subject_type | subject_id | recipient_user_id | payload |
|---|---|---|---|---|---|---|
| `rss_article_posted` | `'system'` | NULL | `'rss_article'` | rss_articles.id | NULL | — |

---

## クラス設計

### `App\Models\RssSource`

- `articles(): HasMany` → `RssArticle`

### `App\Models\RssArticle`

- `source(): BelongsTo` → `RssSource`
- `matchedTitles(): BelongsToMany` → `GameTitle` via `rss_article_matched_titles`
- `matchedFranchises(): BelongsToMany` → `GameFranchise` via `rss_article_matched_franchises`
- `ogpCache(): HasOne` → `OgpCache`（`url` の SHA256 ハッシュで紐付け）

### `App\Models\RssArticleMatchedTitle`（中間テーブル）

### `App\Models\RssArticleMatchedFranchise`（中間テーブル）

### `App\Services\Rss\RssMatcherService`

マッチング専門サービス。取得時に1度だけ全タイトルをロードしてキャッシュする。

```php
// 全マッチング用語をビルドしてインスタンス変数に保持。
// タームリストは Laravel Cache に1時間キャッシュし、毎回DBアクセスしない。
public function buildTerms(): void;

// テキストに対してマッチングを実行
// returns: MatchResult { matched_title_ids: int[], matched_franchise_ids: int[], has_horror_keyword: bool }
public function match(string $text): MatchResult;
```

**マッチング仕様:**

| マッチ元 | 対象語 | MatchResult への記録 |
|---|---|---|
| `game_titles.name` | タイトル名（trim後） | `matched_title_ids` |
| `game_titles.search_synonyms` | 改行分割した各語（trim後） | `matched_title_ids` |
| `game_franchises.name` | フランチャイズ名（trim後） | `matched_franchise_ids` |
| `game_series.name` | シリーズ名（trim後）→ 紐づく `franchise_id` | `matched_franchise_ids` |

- 対象テキスト = RSS `<title>` + `<description>` を結合した文字列（メモリ内のみ、DB 保存なし）
- `"ホラーゲーム"` を含む → `has_horror_keyword = true`
- **最低文字数フィルタ**: 2文字以下のシノニムはスキップ（誤マッチ防止）
- すべてが空・false の記事は取り込まない（`has_horror_keyword = false` かつ両 matched_ids が空）

### `App\Services\Rss\RssFetchService`

RSS取得・保存のメインサービス。

```php
// アクティブな全ソースを取得・処理
public function fetchAll(): void;

// 1ソースを処理
private function fetchSource(RssSource $source): void;
```

**フロー（`fetchSource`）:**
1. `Http::get($source->url)` でRSSを取得
2. `simplexml_load_string()` でパース（RSS2.0 / Atom 両対応）
3. 各アイテムを処理:
   a. `rss_articles` に `(rss_source_id, guid)` で存在チェック → 存在すればスキップ
   b. `RssMatcherService::match(title + description)` でマッチング（テキストはメモリ内のみ）
   c. マッチなし（both false & empty）ならスキップ
   d. `rss_articles` に URL・フラグのみ INSERT（タイトル・本文は保存しない）
   e. `rss_article_matched_titles` に matched_title_ids を INSERT
   f. `rss_article_matched_franchises` に matched_franchise_ids を INSERT
   g. `FetchRssArticleOgp` ジョブをキューに積む（OGP取得は非同期・後述）
   h. `timeline_events` に `rss_article_posted` イベントを INSERT（`TimelineEventService::recordRssArticleEvent()` 経由）
4. `rss_sources.last_fetched_at` を更新

**エラーハンドリング:**
- HTTP取得失敗時はそのソースをスキップしてログに記録、他のソースの処理は継続

### `App\Jobs\FetchRssArticleOgp`（新規）

OGP取得は外部HTTPリクエストのため、`rss:fetch` 本体から切り離してキューで非同期処理する。
`rss:fetch` コマンド自体はHTTP通信なしで即終了し、サーバー負荷を分散できる。

```
rss:fetch 実行
  └─ 記事保存 → FetchRssArticleOgp ジョブをキューに積む → 即終了
                        ↓（Queue Worker が非同期で処理）
               OgpCache::findOrNewByUrl($url)->fetch()->saveOrDelete()
```

OGP取得に失敗した場合は自動リトライ（Laravel Queue の標準機能）。
タイムライン表示時に OGP が未取得の場合は `rss_source.name` をフォールバック表示する。

---

## TimelineEventService への追加

### `recordRssArticleEvent(int $rssArticleId): void`（追加）

```php
TimelineEvent::create([
    'event_type'   => TimelineEventType::RssArticlePosted,
    'actor_type'   => TimelineActorType::System,
    'actor_id'     => null,
    'subject_type' => TimelineSubjectType::RssArticle,
    'subject_id'   => $rssArticleId,
    'created_at'   => now(),
]);
```

### `fetchForRoot()` の変更

`whereIn('event_type', [...])` に `rss_article_posted` を追加。`toDisplayArray()` で `RssArticle`（`source` リレーション込み）をロードして返す。

### `fetchForUser()` の変更

**フランチャイズ傘下タイトルIDの取得:**

```php
// ユーザーのお気に入りタイトルのフランチャイズIDを収集
// （直接franchise / series経由franchiseの両方を考慮）
$favoriteTitles = GameTitle::with('franchise', 'series.franchise')
    ->whereIn('id', $favoriteTitleIds)
    ->get();
$franchiseIds = $favoriteTitles
    ->map(fn ($t) => $t->getFranchise()?->id)
    ->filter()->unique()->values();

// そのフランチャイズに属する全タイトルID
$franchiseTitleIds = GameTitle::where(function ($q) use ($franchiseIds) {
    $q->whereIn('game_franchise_id', $franchiseIds)
      ->orWhereHas('series', fn ($q2) => $q2->whereIn('game_franchise_id', $franchiseIds));
})->pluck('id');
```

**クエリへの追加条件:**

```php
->orWhere(function ($q) use ($franchiseIds, $franchiseTitleIds) {
    $q->where('event_type', TimelineEventType::RssArticlePosted->value)
      ->where(function ($q2) use ($franchiseIds, $franchiseTitleIds) {
          // 「ホラーゲーム」キーワードありの記事
          $q2->whereIn('subject_id', function ($sub) {
                  $sub->select('id')
                      ->from('rss_articles')
                      ->where('has_horror_keyword', true);
              })
              // お気に入りフランチャイズ傘下の登録済みタイトルにマッチした記事
              ->orWhereIn('subject_id', function ($sub) use ($franchiseTitleIds) {
                  $sub->select('rss_article_id')
                      ->from('rss_article_matched_titles')
                      ->whereIn('game_title_id', $franchiseTitleIds);
              })
              // お気に入りフランチャイズ名・シリーズ名にマッチした記事（未登録の新作にも対応）
              ->orWhereIn('subject_id', function ($sub) use ($franchiseIds) {
                  $sub->select('rss_article_id')
                      ->from('rss_article_matched_franchises')
                      ->whereIn('game_franchise_id', $franchiseIds);
              });
      });
})
```

### `toDisplayArray()` の変更

`subject_type === TimelineSubjectType::RssArticle` のときに返す配列:

記事タイトルは `RssArticle.url` をキーに `OgpCache` から取得する。

```php
[
    ...base,
    'rss_article_url'    => $article?->url,
    'rss_source_name'    => $article?->source?->name,
    'ogp_title'          => $ogp?->title,   // OgpCache.title
    'ogp_image'          => $ogp?->image,   // OgpCache.image（サムネイル）
    'published_at'       => $article?->published_at,
    // 既存のgame_title系フィールドはnull
]
```

---

## Artisan コマンド

`App\Console\Commands\FetchRssFeedsCommand` (`rss:fetch`)

- `RssFetchService::fetchAll()` を呼ぶ
- オプション: `--source-id=X` で1ソースのみ実行（デバッグ用）

スケジュール（`routes/console.php`）:

```php
Schedule::command('rss:fetch')->everyThirtyMinutes();
```

---

## 管理画面（RSSソース管理）

`Admin\Manage\RssSourceController` + Blade ビュー

| 機能 | ルート |
|---|---|
| 一覧 | GET `/admin/manage/rss-sources` |
| 作成 | GET / POST `/admin/manage/rss-sources/create` |
| 編集 | GET / PUT `/admin/manage/rss-sources/{id}/edit` |
| 削除 | DELETE `/admin/manage/rss-sources/{id}` |
| 手動取得実行 | POST `/admin/manage/rss-sources/{id}/fetch` |

---

## RSS パース仕様

`simplexml_load_string()` で対応。RSS 2.0 / Atom 1.0 両方をサポートする。

| フィールド | RSS 2.0 | Atom 1.0 |
|---|---|---|
| タイトル | `<title>` | `<title>` |
| URL | `<link>` | `<link href="">` |
| GUID | `<guid>` → なければ `<link>` | `<id>` |
| 概要 | `<description>` | `<summary>` or `<content>` |
| 配信日時 | `<pubDate>` | `<updated>` or `<published>` |

---

## 変更ファイル一覧

### 新規作成

| ファイル | 内容 |
|---|---|
| `database/migrations/xxxx_create_rss_sources_table.php` | |
| `database/migrations/xxxx_create_rss_articles_table.php` | |
| `database/migrations/xxxx_create_rss_article_matched_titles_table.php` | |
| `database/migrations/xxxx_create_rss_article_matched_franchises_table.php` | |
| `app/Models/RssSource.php` | |
| `app/Models/RssArticle.php` | |
| `app/Models/RssArticleMatchedTitle.php` | |
| `app/Models/RssArticleMatchedFranchise.php` | |
| `app/Services/Rss/RssMatcherService.php` | |
| `app/Services/Rss/RssFetchService.php` | |
| `app/Jobs/FetchRssArticleOgp.php` | OGP取得の非同期 Queue Job |
| `app/Http/Controllers/Admin/Manage/RssSourceController.php` | |
| `app/Console/Commands/FetchRssFeedsCommand.php` | |
| `resources/views/admin/manage/rss_source/` | 管理画面Blade |

### 更新

| ファイル | 変更内容 |
|---|---|
| `app/Enums/TimelineEventType.php` | `RssArticlePosted` 追加 |
| `app/Enums/TimelineSubjectType.php` | `RssArticle` 追加 |
| `app/Services/Timeline/TimelineEventService.php` | `recordRssArticleEvent()` 追加、`fetchForRoot()` / `fetchForUser()` / `toDisplayArray()` 更新 |
| `routes/console.php` | スケジュール追加 |
| `routes/web.php` | 管理画面ルート追加 |
| `resources/views/common/timeline_event.blade.php` | `rss_article_posted` 表示対応 |
| `docs/plan/timeline.md` | イベント種別表に追加 |
| `docs/claude/artisan-commands.md` | `rss:fetch` コマンド追加 |

---

## 初期データ（RSS ソース）

| name | url | 形式 |
|---|---|---|
| 4Gamer | `https://www.4gamer.net/rss/index.xml` | RDF/RSS 1.0 |
| AUTOMATON | `https://automaton-media.com/feed/` | RSS 2.0 |
| Game Watch | `https://game.watch.impress.co.jp/data/rss/1.0/gmw/feed.rdf` | RDF/RSS 1.0 |
| Game*Spark | `https://www.gamespark.jp/rss20/index.rdf` | RSS 2.0 |

初期データは DB シーダーまたはマイグレーション内で投入する。

---

## パフォーマンス設計

文字列マッチング（2,000語 × 80記事 ≒ 160,000回の `str_contains`）は PHP でも数十ミリ秒程度であり問題ない。
実際のボトルネックは HTTP 通信であるため、以下の2点で対処する。

| 対策 | 効果 |
|---|---|
| **OGP取得を Queue Job に非同期化**（`FetchRssArticleOgp`） | `rss:fetch` 本体の実行時間が RSS 取得のみになり、HTTP 待ちが分散される |
| **タームリストを Laravel Cache に1時間キャッシュ**（`RssMatcherService::buildTerms()`） | 毎回 DB から全タイトル・フランチャイズ・シリーズを読み込む処理が省略される |

---

## 留意点

- `search_synonyms` の各行は改行で分割後、trim・空行除去してから使用する（`GameTitle::toSearchableArray()` の既存ロジックに準じる）
- 2文字以下のシノニムはマッチングから除外する（「RE」「2」等の誤マッチ防止）
- RSS取得はHTTP通信を伴うため必ずバックグラウンドジョブかArtisanコマンド経由で行い、Webリクエスト内では実行しない
- マッチングに使う RSS テキスト（タイトル + description）はメモリ内で処理し、DB に保存しない。`strip_tags()` で HTML タグを除去してから使う
- 同一記事の重複登録は `(rss_source_id, guid)` のUNIQUE制約で防ぐ
- OGP 取得は記事保存と同一トランザクションで行わず、失敗しても記事自体は保存済みとする（OGP は再取得可能なキャッシュのため）
- OGP の `og:title` が取得できなかった場合のフォールバックとして `rss_source.name` + 「の記事」を表示する
