# AI支援によるゲームマスターJSON更新

管理者が「マスターのJSONをAI（ChatGPT / Claude / Gemini いずれでも可）に渡して最新情報で書き換えてもらい、それを管理画面に貼り付けると現状との差分が出て、問題なければ登録」する仕組みの設計資料。

AIとの通信はアプリ側では行わない。**人間がJSONをコピペで運ぶ**方式のため、API連携・課金管理・Queueは不要。アプリが持つのは「JSONエクスポート画面」と「JSON取り込み＋差分＋登録画面」の2つだけ。

---

## 0. 全体アーキテクチャ（MCP連携）

この機能は最終的に **Claude Desktop + ローカルMCPサーバー** と組み合わせて使うことを前提にした設計にする。

```
[Claude Desktop（会話）]
  ↓ MCPツール経由でローカルDBを参照・JSON生成
[MCPサーバー（ローカル環境のみ）]
  ↓ エクスポートJSONを生成・修正
[この機能：差分確認画面]  ← 人間がレビューするゲート
  ↓ 問題なければインポート
[ローカルDB]
  ↓ ダンプして本番へ
[本番DB]
```

### MCP設計方針

- **ローカル環境のみ**（本番サーバーには設置しない。書き込みミスのリスク回避＋セキュリティ）
- **MCPの役割はJSON生成・修正のみ**（DBを直接操作しない）
- 差分確認画面が「AIの提案を人間がレビューするゲート」として機能する
- **Claude Desktop のプロジェクト機能**にシステム全体の概要を記述（毎回自動付与）
- **MCP Resources** に詳細スキーマ・リレーション説明を置く（AIが必要なときに参照）
- コンテキスト節約のため、1回の会話ではタイトル単位・フランチャイズ単位で作業する（100KB以内を目安）
- MCP詳細設計は `docs/plan/mcp-server.md`（別ドキュメント）にまとめる

---

## 1. ゴール

ゲームマスター系の各詳細画面に、以下2機能を追加する。

- **機能A（エクスポート）**: AIに渡すJSONを画面表示し、ワンクリックでクリップボードへコピー。
- **機能B（インポート）**: AIが書き換えたJSONを貼り付け、「変更前（テキスト）」と「変更後（form）」を並べて差分表示。保存ボタンでDB反映。

対象エンティティ（実装順に記載）：

| エンティティ | ルート集約（JSONに含める範囲） | Phase |
|---|---|---|
| ゲームタイトル | タイトル本体 ＋ パッケージグループ ＋ パッケージ ＋ ショップ | 1 |
| メディアミックス | メディアミックス本体 ＋ 関連商品 ＋ 関連商品ショップ | 1 |
| フランチャイズ | フランチャイズ本体（create/delete追加） | 2 |
| シリーズ | シリーズ本体 ＋ フランチャイズとの紐づけ | 2 |
| メーカー | メーカー本体 | 2 |
| メディアミックスグループ | メディアミックスグループ本体 ＋ フランチャイズとの紐づけ | 2 |
| リレーション管理 | タイトル↔シリーズ／タイトル↔フランチャイズ等の紐づけ操作 | 2 |

---

## 2. スコープと用語の整理（実装前に要確認）

実コードを確認した結果、ユーザーの当初イメージと実データ構造に差異がある。**ここを最初に合意しておかないと差分・適用ロジックが破綻する。**

### 2-1. タイトル→パッケージは「パッケージグループ」を挟む多対多

```
GameTitle ──(M:N: game_title_package_group_link)── GamePackageGroup
GamePackageGroup ──(M:N: game_package_group_package_link)── GamePackage
GamePackage ──(1:N)── GamePackageShop
```

- タイトルとパッケージの間に **`GamePackageGroup`** が入る（`GameTitle::packageGroups()`）。直接の `title→package` リンクは無い。
- パッケージもパッケージグループも **多対多で共有され得る**。→ **「タイトルJSON経由でパッケージを編集すると、同じパッケージを共有する他タイトルにも影響する」**。この副作用を許容するか、JSONからのパッケージ編集は本体属性のみに限定するかを決める必要がある。
- 本資料では構造をロスレスにするため **packageGroups 階層を JSON に明示的に含める** 前提で設計する（フラット化しない）。

### 2-2. メディアミックスは「パッケージ」ではなく「関連商品」を持つ

```
GameMediaMix ──(M:N: game_media_mix_related_product_link)── GameRelatedProduct
GameRelatedProduct ──(1:N)── GameRelatedProductShop
```

- `GameMediaMix` に `packages` リレーションは無い。持っているのは **`relatedProducts()`（関連商品）**。
- よって「メディアミックスに紐づくパッケージ」は **「関連商品（GameRelatedProduct）」** と読み替える。ショップは `GameRelatedProductShop`。

> **要確認**: 上記2点（パッケージ共有の副作用、メディアミックス＝関連商品の読み替え）でよいか。

---

## 3. 対象テーブルのカラム

`$guarded = ['id']` 運用。enum cast に注意（`rating` 等）。

### game_titles
`id, key, game_franchise_id, game_series_id, name, phonetic, node_name, original_game_package_id, description, description_source, ogp_cache_id, use_ogp_description, first_release_int, rating, issue, search_synonyms`

- **AI編集可**: `name, phonetic, node_name, description, description_source, rating, issue, search_synonyms`
- **システム/派生（JSONでは read-only もしくは除外）**: `id`（突合キー）, `key`, `first_release_int`（パッケージから自動算出 / `setFirstReleaseInt()`）, `ogp_cache_id, use_ogp_description`, `original_game_package_id`, `game_franchise_id, game_series_id`（関連付けは別画面の責務）
- 注: モデルの `originalPackage()` は外部キーに `original_package_id` を指定しているが、実カラムは `original_game_package_id`。本機能では触らないが留意。

### game_packages
`id, game_platform_id, name, acronym, node_name, sort_order, release_at, default_img_type, rating`

- **AI編集可**: `name, acronym, node_name, release_at, sort_order, rating, game_platform_id`
- `default_img_type` は enum（`ProductDefaultImage`）。

### game_package_shops
`id, game_package_id, shop_id, url, img_tag, ogp_cache_id, param1, param2, param3, updated_timestamp`

- **AI編集可**: `shop_id, url, param1, param2, param3`
- `shop_id` は `Shop` enum 値。

### game_media_mixes
`id, key, type, name, node_name, game_franchise_id, game_media_mix_group_id, rating, sort_order, description, description_source, ogp_cache_id, use_ogp_description, og_url`

- **AI編集可**: `type, name, node_name, rating, sort_order, description, description_source, og_url`
- `type` は enum（`MediaMixType`）。

### game_related_products
`id, name, node_name, description, description_source, rating, sort_order, default_img_type`

- **AI編集可**: `name, node_name, description, description_source, rating, sort_order`

### game_related_product_shops
`id, game_related_product_id, shop_id, subtitle, url, img_tag, ogp_cache_id, param1, param2`

- **AI編集可**: `shop_id, subtitle, url, param1, param2`

---

## 4. JSONスキーマ設計

### 4-1. 基本方針

1. **安定IDを全エンティティ・全リレーションに必須化**。名前一致での突合は禁止（改名で誤マッチするため）。
2. **適用は「宣言的置換」ではなく「明示オペレーション」**。各エンティティに `_op`（`update` / `create` / `delete`）を持たせ、**JSONから欠落したもの・`_op`の無いものは一切触らない**。AIが長いJSONの一部を黙って落としても削除事故が起きないようにする。
3. **参照用フィールド（`_ref`）を併記**。`game_platform_id` に対する `platform_name`、`shop_id` に対する `shop_name`、`rating` のラベル等を read-only で出力し、AIが文脈を理解できるようにする。**取り込み時は `_ref` を無視**（IDのみ採用）。
4. **楽観ロック用メタ情報**をルートに持たせる（`_meta`）。エクスポート時点のスナップショットを表す。

### 4-2. タイトルJSONの形（例）

```json
{
  "_meta": {
    "schema": "game_title",
    "schema_version": 1,
    "exported_at": "2026-06-18T12:00:00+09:00",
    "lock": {
      "game_title": { "id": 42, "updated_at": "2026-06-01T10:00:00+09:00" },
      "game_packages": { "101": "2026-05-20T00:00:00+09:00" },
      "game_package_shops": { "5001": "2026-05-20T00:00:00+09:00" }
    }
  },
  "game_title": {
    "id": 42,
    "_op": "update",
    "name": "バイオハザード RE:2",
    "phonetic": "ばいおはざーどあーるいーつー",
    "node_name": "biohazard_re2",
    "description": "...",
    "description_source": "...",
    "rating": "Z",
    "issue": "...",
    "search_synonyms": "BIOHAZARD RE:2\nResident Evil 2"
  },
  "package_groups": [
    {
      "id": 77,
      "_op": "update",
      "name": "通常版",
      "packages": [
        {
          "id": 101,
          "_op": "update",
          "game_platform_id": 3,
          "_ref": { "platform_name": "PlayStation 4" },
          "name": "バイオハザード RE:2",
          "acronym": "PS4",
          "release_at": "2019-01-25",
          "rating": "Z",
          "sort_order": 20190125,
          "shops": [
            {
              "id": 5001,
              "_op": "update",
              "shop_id": 1,
              "_ref": { "shop_name": "Amazon" },
              "url": "https://...",
              "param1": "...",
              "param2": null,
              "param3": null
            }
          ]
        }
      ]
    }
  ]
}
```

### 4-3. メディアミックスJSONの形（例）

```json
{
  "_meta": { "schema": "game_media_mix", "schema_version": 1, "exported_at": "...", "lock": { } },
  "game_media_mix": {
    "id": 9, "_op": "update", "type": "MOVIE", "name": "...", "node_name": "...",
    "rating": "...", "sort_order": 1, "description": "...", "description_source": "...", "og_url": "..."
  },
  "related_products": [
    {
      "id": 301, "_op": "update", "name": "...", "node_name": "...",
      "description": "...", "rating": "...", "sort_order": 0,
      "shops": [
        { "id": 7001, "_op": "update", "shop_id": 1, "_ref": { "shop_name": "Amazon" },
          "subtitle": "...", "url": "https://...", "param1": null, "param2": null }
      ]
    }
  ]
}
```

### 4-4. `_op` の意味

| `_op` | id | 意味 |
|---|---|---|
| `update` | 既存ID | そのレコードのフィールドを更新（差分のあるカラムのみ） |
| `create` | null / 省略 | 新規作成。`_ref` で新規参照先（platform/shop）を人間が確認できるように |
| `delete` | 既存ID | そのレコードを削除（子のショップも連動削除。モデルの `delete()` がショップ連動削除を実装済み） |
| 無し | — | **何もしない**（安全側） |

新規作成（`create`）はMVPでは**任意機能**。まずは `update` / `delete` を確実に動かし、`create`（特にメーカー・プラットフォーム等の新規参照先解決）は段階的に。

---

## 5. シリアライザ / 差分エンジン / アプライヤ

3つを「鏡像」の関係で実装し、`docs/plan` のスキーマ定義を単一の真実とする。

```
App\Services\MasterJson\
├── TitleJsonSerializer.php        # GameTitle集約 → 配列（_meta/_ref付き）
├── MediaMixJsonSerializer.php     # GameMediaMix集約 → 配列
├── MasterJsonDiffer.php           # 現DB配列 vs 取り込みJSON → 差分ツリー
├── TitleJsonApplier.php           # 差分（採用分）→ DB反映（トランザクション）
├── MediaMixJsonApplier.php
└── Schema/                        # フィールド定義（編集可カラム・型・enum・参照解決）
    ├── TitleJsonSchema.php
    └── MediaMixJsonSchema.php
```

- **シリアライザ**: 対象を eager load（`packageGroups.packages.shops` 等）し、編集可カラム＋`_ref`＋`_meta.lock` を組み立てる。エクスポート画面とAIへの「フォーマット定義」を兼ねる。
- **差分エンジン**: 取り込みJSONの各エンティティを `id` で現DBに突合し、`update`=フィールド単位の before/after、`create`/`delete` を抽出。**`_ref` と `_meta` は比較対象外**。
- **アプライヤ**: 採用された差分のみを **1トランザクション**で反映。enum は cast 任せ。タイトルは反映後に `setFirstReleaseInt()->save()` と `franchise/series` の `setTitleParam()`（既存 `update()` と同じ後処理）を踏襲。

---

## 6. バリデーション（取り込みJSONは信頼しない）

`App\Http\Requests\Admin\Game\MasterJsonImportRequest`（または専用 Validator サービス）で段階チェック。失敗時は差分画面を出さずエラー表示。

1. **JSONパース**: 壊れたJSON → エラー。
2. **スキーマ整合**: 未知キーは拒否 or 警告。`_meta.schema` が画面の対象種別と一致するか。
3. **型/enum**: `rating` は `Rating`、`shop_id` は `Shop`、`type` は `MediaMixType`、`release_at` は日付として妥当か。
4. **参照整合**: `game_platform_id` / `shop_id` 等が実在するか。`create` 時の新規参照先が未解決なら警告。
5. **編集不可カラムの混入**: `id` 以外のシステムカラム（`first_release_int` 等）が変更されていても**無視**（採用しない）。

---

## 7. 楽観ロック（エクスポート以降の競合検出）

- エクスポートJSONの `_meta.lock` に、対象集約の各行の `updated_at` を埋め込む。
- 取り込み時、現DBの `updated_at` と照合。**食い違う行があれば「エクスポート後に他で更新されています」と警告し、該当行を強調**。
- 既定は「警告して続行可」だが、運用次第で「強制ブロック」も選べるようにしておく。

---

## 8. 差分画面のUI（機能B）

ユーザー要望どおり「変更前＝テキスト」「変更後＝form」で並べる。

- 上段：**変更前JSON（read-only textarea）** — 現DBのシリアライズ結果。
- 中段：**変更後JSON貼り付け欄（textarea）** — ここにAI出力を貼る → 「差分チェック」ボタンでサーバへPOST。
- 下段：**差分ツリー（form）** — エンティティ／フィールド単位で before → after を表示。各行に**採用チェックボックス**（ハルシネーション除去の最後の砦）。`create`/`delete` は色分け。`_ref` の出典URL（AIに付けさせる）があれば横に表示。
- **保存ボタン**：チェックされた差分のみ適用。

> 管理画面は **Bootstrap ベース（AdminLTEテンプレート、`panel`/`btn`/`alert` 等）**。公開画面のフロントエンド規約は**adminには適用されない**。差分チェックのAJAXとクリップボードコピーは、admin の既存流儀（blade内 `<script>` ＋ `vendor.min.js`）で実装してよい。

---

## 9. ルート・コントローラ・画面構成

既存 `routes/web.php` の admin game グループ（title / media_mix プレフィックス）に追加。

### タイトル（`Admin.Game.Title.*` に追加）
```php
Route::get('{title}/json_export',  [TitleController::class, 'jsonExport'])->name("{$basename}.JsonExport");
Route::get('{title}/json_import',  [TitleController::class, 'jsonImport'])->name("{$basename}.JsonImport");
Route::post('{title}/json_diff',   [TitleController::class, 'jsonDiff'])->name("{$basename}.JsonDiff");   // 差分プレビュー(AJAX)
Route::put('{title}/json_apply',   [TitleController::class, 'jsonApply'])->name("{$basename}.JsonApply"); // 反映
```
メディアミックスも `MediaMixController` に同形で追加。

### 画面
```
resources/views/admin/game/title/json_export.blade.php
resources/views/admin/game/title/json_import.blade.php   # 変更前テキスト + 貼り付け + 差分form
resources/views/admin/game/media_mix/json_export.blade.php
resources/views/admin/game/media_mix/json_import.blade.php
```
各 `detail.blade.php` に「JSONエクスポート」「JSONインポート」ボタンを追加（既存 Edit ボタン付近）。

---

## 10. 監査ログ

`master_json_import_logs` テーブル（新規）に1件ずつ記録：

- `admin_id`, `target_type`（title / media_mix）, `target_id`
- `before_json`(text), `imported_json`(text), `applied_diff_json`(text：実際に採用した差分)
- `created_at`

> マイグレーションは**コマンド提示のみ**とし、実行はユーザーに委ねる（プロジェクトルール）。

---

## 11. AIに渡すプロンプト指針（運用ドキュメント化する）

エクスポート画面に「AIへの指示文サンプル」を併記すると運用が安定する。

- 「このJSONフォーマットを**維持したまま**、最新情報で変わった箇所のみ書き換えよ。`id` と `_op` は維持・付与すること」
- 「**Webで一次情報（公式サイト/ストア）を確認**し、各変更に出典URLを添えよ」（ブラウジング前提）
- 「削除すべきものは `_op:"delete"` を明示せよ。確信が持てないものは変更するな」
- 「`_ref` は参考情報。書き換えるのは編集可フィールドのみ」

---

## 12. 段階的実装計画

### Phase 1: タイトル・メディアミックスの完成（現ブランチ）

エンジンはフルスキーマで作り、**検証は段階的に有効化**してデータ事故を防ぐ。

1. **Schema定義＋シリアライザ**（タイトル）→ エクスポート画面（機能A）先行リリース。フォーマットの実用性を検証。
2. **差分エンジン＋取り込み画面**（`update` のみ・スカラー＋ショップ）→ フィールド単位採用・楽観ロック・監査ログ。
3. **`delete` 対応** → 連動削除の挙動確認。
4. **`create` 対応**（新規参照先の解決フロー含む）。
5. **メディアミックス**へ横展開（同じエンジン・スキーマ定義の差し替え）。

### Phase 2: 未対応エンティティのJSON機能追加

同じエンジンを再利用し、スキーマ定義を追加する形で横展開する。

| エンティティ | 現状 | 追加内容 |
|---|---|---|
| GameFranchise（フランチャイズ） | 属性 update のみ | create / delete を追加 |
| GameSeries（シリーズ） | 未対応 | 属性 CRUD ＋ フランチャイズ紐づけ |
| GameMaker（メーカー） | 未対応 | 属性 CRUD |
| GameMediaMixGroup（メディアミックスグループ） | 未対応 | 属性 CRUD ＋ フランチャイズ紐づけ |
| リレーション管理 | 未対応 | 下記の紐づけ操作を JSON で表現・適用 |

リレーション管理が対象とする操作：
- タイトル ↔ シリーズの紐づけ / 変更
- タイトル ↔ フランチャイズの直接紐づけ / 変更
- シリーズ ↔ フランチャイズの紐づけ / 変更
- メディアミックス ↔ メディアミックスグループの紐づけ / 変更

各エンティティのカラム定義（AI編集可 / システム除外）は実装着手時に本ドキュメントへ追記する。

### Phase 3: MCPサーバー実装

詳細設計は `docs/plan/mcp-server.md` にまとめる。

**MCPツール（最小構成）:**
- `list_tables` — テーブル一覧・構造確認
- `get_schema` — テーブル定義・リレーション説明
- `execute_query` — SELECT（読み取り専用）
- `export_json` — 対象エンティティのエクスポートJSON取得
- `validate_json` — JSONのスキーマ検証（インポート前チェック）

**Claude Desktop設定:**
- プロジェクトのシステムプロンプト：HGNシステム全体の概要・操作ルール（毎回自動付与）
- MCP Resources：詳細スキーマ・リレーション図・enum値一覧（AIが必要時に参照）

### Phase 4: 運用整備

- Claude Desktop プロジェクト設定の整備
- MCP Resources の整備（スキーマ詳細、テーブル間リレーション説明、enum値一覧）
- 運用マニュアル作成（エクスポート → AI更新 → 差分確認 → インポート → 本番反映の手順）

---

## 13. 留意点まとめ

- パッケージ／パッケージグループは多対多共有 → タイトルJSON経由の編集は**他タイトルへ波及**する。要合意。
- メディアミックスの「パッケージ」は実体が**関連商品**。
- `id` 必須・`_op` 必須・欠落は無変更（削除事故防止）。
- 取り込みJSONは**信頼しない**（厳格バリデーション）。
- enum / 日付 / 参照整合を必ず検証。
- 反映は**1トランザクション**＋既存の後処理（`setFirstReleaseInt`, `setTitleParam`）踏襲。
- 管理画面は Bootstrap。SPAフロントの規約は非適用。
