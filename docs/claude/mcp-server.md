# HGN MCPサーバー

Claude Desktop からゲームマスターデータのJSONをエクスポートするためのローカルMCPサーバー。  
ローカル環境専用。本番サーバーには設置しない。

---

## 全体アーキテクチャ

```
Claude Desktop（会話）
    ↓ MCPツール呼び出し（stdio）
hgn-mcp（Node.js プロセス / mcp/ ディレクトリ）
    ↓ HTTP + Bearer トークン
Laravel /api/v1/mcp/* （ローカルサーバー）
    ↓
既存の MasterJsonService 群（SeriesMasterJsonService など）
```

**MCPの役割はJSON取得（読み取り）のみ。**  
書き込みはMCP経由では行わない。AIが書き換えたJSONは、管理画面の「JSON入力」→「差分確認」→「保存」の手順で取り込む。

---

## ファイル構成

```
mcp/
├── package.json          # @modelcontextprotocol/sdk + zod
├── tsconfig.json
├── src/
│   └── index.ts          # MCPツール定義・HTTPクライアント
└── dist/
    └── index.js          # ビルド済みバイナリ（npm run build で生成）
```

Laravel側:

```
app/Http/Controllers/Api/McpController.php   # schema / entities / export の3アクション
routes/api.php                               # /api/v1/mcp/* ルート（auth:sanctum + game_master.api）
```

---

## セットアップ手順

### 1. APIトークンを発行する

```bash
php artisan game-master:issue-token
```

表示されたトークン（平文）を控えておく。再表示できないため注意。

### 2. MCPサーバーをビルドする

```bash
cd mcp
npm install
npm run build
```

`mcp/dist/index.js` が生成される。再ビルドが必要なのは `src/index.ts` を変更したときだけ。

### 3. Claude Desktop に登録する

`claude_desktop_config.json` を編集する（場所は OS によって異なる）。

| OS | パス |
|---|---|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

```json
{
  "mcpServers": {
    "hgn": {
      "command": "node",
      "args": ["/var/www/html/hgs_re3/mcp/dist/index.js"],
      "env": {
        "HGN_API_URL": "http://localhost/hgs_re3/public",
        "HGN_API_TOKEN": "<手順1で発行したトークン>"
      }
    }
  }
}
```

`HGN_API_URL` はローカルの Laravel 開発サーバーの URL に合わせて変更する。

### 4. Claude Desktop を再起動する

設定ファイルの変更は再起動後に反映される。チャット入力欄にツールアイコン（🔧）が表示されれば接続成功。

---

## MCPツール一覧

### `get_schema`

エンティティのフィールド定義を返す。JSONを書き換える前に呼び出して、どのフィールドが編集可能か・型・制約を確認するために使う。

| 引数 | 型 | 内容 |
|---|---|---|
| `type` | string | エンティティ種別（下記参照） |

**例:**
```
get_schema(type: "series")
```

### `list_entities`

エンティティの一覧を取得する。IDを調べるときや作業対象を絞り込むときに使う。

| 引数 | 型 | 内容 |
|---|---|---|
| `type` | string | エンティティ種別 |
| `q` | string（省略可） | 検索キーワード（名前・よみがな） |
| `per_page` | number（省略可） | 1ページの件数（デフォルト20、最大100） |

**例:**
```
list_entities(type: "franchise", q: "バイオ")
```

### `export_json`

エンティティのJSONをエクスポートする。このJSONをClaudeに渡して内容を書き換えてもらい、管理画面の「JSON入力」から取り込む。

| 引数 | 型 | 内容 |
|---|---|---|
| `type` | string | エンティティ種別 |
| `id` | number | エンティティのID |

**例:**
```
export_json(type: "series", id: 42)
```

### `diff_json`

AIが書き換えたJSONを投稿すると、現在のDBの値との差分を返す。変更点をチャット上で確認するために使う。実際の保存は管理画面から行う。

変更がない場合は「変更点はありません。」と返す。変更がある場合は変更フィールドの一覧（`before` / `after`）が返る。

| 引数 | 型 | 内容 |
|---|---|---|
| `type` | string | エンティティ種別 |
| `id` | number | エンティティのID |
| `json` | string | `export_json` で取得したJSONをAIが書き換えたもの |

**例:**
```
diff_json(type: "series", id: 42, json: "{ ... }")
```

---

## 対応エンティティ

| `type` 値 | エンティティ | 編集可能なフィールド |
|---|---|---|
| `series` | シリーズ（`GameSeries`） | name, phonetic, node_name, description, description_source |
| `franchise` | フランチャイズ（`GameFranchise`） | name, phonetic, node_name, description, description_source, rating |
| `media_mix_group` | メディアミックスグループ（`GameMediaMixGroup`） | name, node_name, description |
| `title` | ゲームタイトル（`GameTitle`） | name, phonetic, node_name, description, description_source, rating, issue, search_synonyms（他エンティティと異なり、パッケージグループ・パッケージ・ショップ・パッケージに紐づくメーカーの入れ子構造も `export_json` / `diff_json` の対象に含まれる。詳細は下記「タイトルの入れ子構造」および `TitleMasterJsonService` を参照） |

### タイトルの入れ子構造

`title` タイプの `export_json` は、タイトル本体（`game_title`）に加えて `package_groups` 配列を返す。各要素の構造は以下の通り。

```
game_title: { id, name, phonetic, node_name, description, description_source, rating, issue, search_synonyms }
package_groups: [
    {
        id, name, node_name, sort_order, description, description_source, simple_shop_text,
        packages: [
            {
                id, name, acronym, node_name, release_at, sort_order, default_img_type, rating, game_platform_id,
                game_maker_ids: [1, 2, ...],   // パッケージに紐づくメーカーのID配列（既存メーカーのみ指定可、新規作成不可）
                _ref: { game_platform_id_text, maker_names: [...] },
                shops: [ { id, shop_id, url, img_tag, param1, param2, param3 }, ... ]
            },
            ...
        ]
    },
    ...
]
```

`diff_json` に投稿する際、`game_maker_ids` を書き換えるとメーカーの紐づけ（追加・削除）が差分として検出される。存在しないメーカーIDを指定した場合は警告付きで無視される。メーカー自体の新規作成（`GameMaker` レコードの追加）はこの機能では未対応。

パッケージグループ・パッケージの新規作成もこの機能では未対応（既存IDの指定が必須）。新規作成が必要な場合は管理画面の該当詳細画面から行う。

---

## 標準的な作業フロー

```
1. Claude Desktop でプロジェクトを開く
2. list_entities で対象のIDを調べる
3. export_json でJSONを取得する
4. Claude に「このJSONを最新情報で更新して」と依頼する
5. Claude が書き換えたJSONを diff_json で投稿する
6. 差分をチャット上で確認する（変更点の一覧が返ってくる）
7. 問題なければ管理画面 → 対象エンティティの詳細 → 「JSON入力」に貼り付けて保存する
```

ステップ6の `diff_json` は省略してもよい。変更内容が明らかな場合はそのまま管理画面に貼り付けてよい。

---

## 新規作成時のJSON自動入力

`series` / `franchise` / `media_mix_group` / `title` の管理画面「新規登録」画面には、JSONを貼り付けてフォームに自動入力するウィジェット（`admin.game.master_json._json_autofill`）がある。

- MCPの `export_json` / `get_schema` のレスポンス形式（`_meta.schema` + トップレベルキー）と互換のJSONを貼り付けて「フォームに反映」を押すと、id/name が一致するフォーム項目に値を入力する
- `_meta.schema` が画面の対象エンティティと一致しない場合はエラー表示になる
- JSONに存在してもフォーム側に対応項目がないキー（例: フランチャイズ・シリーズの紐づけIDなど、そもそもMasterJsonServiceの管理対象外のフィールド）は無視され、未対応項目としてメッセージに表示される
- あくまでフォームへの入力補助であり、送信は通常の「Save」ボタン経由（既存の `SeriesRequest` 等のバリデーションを通る）。パッケージグループ・パッケージ・ショップ・メーカーを含む `title` の入れ子構造はこの自動入力の対象外（本体フィールドのみ）

新しいエンティティタイプでこのウィジェットを使う場合は、対象の `add.blade.php` の `panel-body` 内、フォーム本体の `@include` の前に以下を追加する。

```blade
@include('admin.game.master_json._json_autofill', ['schema' => 'game_xxx'])
```

---

## エラーと対処

| エラー | 原因 | 対処 |
|---|---|---|
| `HGN_API_URL is not set` | 環境変数未設定 | `claude_desktop_config.json` の `env` を確認 |
| `HGN_API_TOKEN is not set` | 環境変数未設定 | 同上 |
| `HGN API 401` | トークンが無効 | `php artisan game-master:issue-token` で再発行 |
| `HGN API 403` | トークンのabilityが不一致 | `.env` の `GAME_MASTER_API_TOKEN_ABILITY` を確認 |
| `HGN API 404` | 存在しないエンティティ | IDを確認（`list_entities` で再確認） |
| ツールが表示されない | Claude Desktop に未登録 | `claude_desktop_config.json` と再起動を確認 |

---

## エンティティを追加するには

1. `app/Services/MasterJson/` に新しい `XxxMasterJsonService.php` を作成する
2. `app/Http/Controllers/Api/McpController.php` の `ENTITY_CONFIG` 定数に追加する
3. `export()` メソッドの if-else に分岐を追加する
4. `mcp/src/index.ts` の `ENTITY_TYPE` z.enum に値を追加してリビルドする（`npm run build`）
