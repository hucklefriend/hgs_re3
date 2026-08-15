# セキュリティ監査レポート（2026-07-05）

対象: `hgs_re3`（HGN / horrorgame.net）ソースコード全体
観点: 認証・認可、インジェクション（SQL/XSS）、CSRF、CORS、機密情報の露出、ファイルアップロード、マスアサインメント等

各項目は **深刻度**（高 / 中 / 低 / 情報）・**内容**・**該当箇所**・**解決案** の形式でまとめる。
「潜在」と付いた項目は、現時点では実際には有効化されていないが、設定変更ひとつで顕在化するリスクを指す。

---

## サマリ

| # | 深刻度 | 概要 |
|---|--------|------|
| 1 | 高 | ログインエンドポイント（`POST /auth`）にレート制限がなく、総当たり攻撃が可能 |
| 2 | 中 | 非本番専用テストAPIが `production` 以外の全環境で有効（webmasterパスワード初期化など） |
| 3 | 中（潜在） | CORSミドルウェアが `Access-Control-Allow-Origin: *` と `Allow-Credentials: true` を併用 |
| 4 | 中 | ソーシャルログインが「メールアドレス一致」で既存アカウントに自動ログインする |
| 5 | 中 | `{!! !!}` による未エスケープ出力（マスターデータ・お知らせ）にストアドXSSの余地 |
| 6 | 低（潜在） | `GptsApiKeyMiddleware` にデフォルトAPIキーと非定時間比較 |
| 7 | 中 | アバター画像アップロードが画素数（ピクセル寸法）を制限しておらず、ピクセル爆弾でDoS可能 |
| 8 | 低 | `RssArticleMatchedFranchise` が `$guarded = []`（マスアサインメント全開放） |
| 9 | 情報 | `.env.example` の `APP_DEBUG=true` / 本番設定の確認 |

---

## 1.【高】ログインにレート制限がない（総当たり攻撃）

### 内容
新規登録・パスワードリセット・OAuth・2段階認証の再送には `throttle` ミドルウェアが付いているが、
本体のログイン処理 `POST /auth` には一切のレート制限がない。攻撃者は 1 アカウントに対してパスワードの
総当たり／クレデンシャルスタッフィングを無制限に試行できる。

### 該当箇所
- [routes/web.php:28](routes/web.php#L28) — `Route::post('/auth', [AccountController::class, 'auth'])->name('Account.Auth');`（`throttle` なし）
- 比較: [routes/web.php:43](routes/web.php#L43), [routes/web.php:47](routes/web.php#L47) 等は `throttle:10,10` 付き
- [app/Http/Controllers/AccountController.php:66](app/Http/Controllers/AccountController.php#L66) — `auth()`

### 解決案
- ルートに `throttle` を付与する。IP だけでなくメールアドレス単位でも絞るのが望ましい。

```php
Route::post('/auth', [AccountController::class, 'auth'])
    ->middleware('throttle:login')   // RouteServiceProvider / AppServiceProvider で定義
    ->name('Account.Auth');
```

```php
// AppServiceProvider::boot() 等
RateLimiter::for('login', function (Request $request) {
    $email = (string) $request->input('email');
    return [
        Limit::perMinute(5)->by($email . '|' . $request->ip()),
        Limit::perMinute(20)->by($request->ip()),
    ];
});
```

- あわせて、`TwoFactor.Verify` / `TwoFactor.Recovery`（[routes/web.php:38](routes/web.php#L38), [routes/web.php:40](routes/web.php#L40)）にもコード総当たり対策としてスロットルを検討する。

---

## 2.【中】非本番専用テストAPIが `production` 以外で有効

### 内容
`routes/api.php` の冒頭で、テスト用APIが `if (! app()->environment('production'))` により登録されている。
判定が「production **ではない**」であるため、`staging` や環境変数が想定外の値になっている本番相当環境でも
これらのエンドポイントが露出する。特に危険なのは以下。

- `POST /api/test/reset-webmaster-password` — `webmaster@horrorgame.net` のパスワードを `testtest` に初期化
- `POST /api/test/create-test-account` — 任意にアカウントを量産
- `GET /api/test/registration-url` / `password-reset-url` / `email-change-url` — メール送信を経ずにトークンURLを取得（アカウント乗っ取りに直結）

いずれも認証不要で、環境判定のみが唯一のガードになっている。

### 該当箇所
- [routes/api.php:22-33](routes/api.php#L22-L33)
- [app/Http/Controllers/Api/Test/AccountController.php:197](app/Http/Controllers/Api/Test/AccountController.php#L197) — `resetWebmasterPasswordForTest()`
- [app/Http/Controllers/Api/Test/AccountController.php:70](app/Http/Controllers/Api/Test/AccountController.php#L70) — パスワードリセットURL取得

### 解決案
- 判定を「production 以外」ではなく **`local`（＋必要なら特定のテスト環境）に限定** する。
  `bootstrap/app.php` では `routes/test-debugbar.php` を `app()->environment('local')` でのみ読み込んでいるので、方針を揃える。

```php
if (app()->environment('local')) {
    // テスト用ルート
}
```

- どうしてもステージングで使う場合は、専用トークン（Sanctum ability）や IP 許可リストで保護する。
- ステージングの `APP_ENV` が確実に `production` 以外の想定値になっているか、デプロイ設定を確認する。

---

## 3.【中・潜在】CORS設定がワイルドカード + 資格情報許可

### 内容
`CrossOriginHeaders` ミドルウェアは、全レスポンスに対して
`Access-Control-Allow-Origin: *` と `Access-Control-Allow-Credentials: true` を同時に付与している。
この 2 つの併用はブラウザ仕様上そもそも不正で、実際には資格情報付きリクエストは通らないが、
将来「`*` を動的にリクエスト元 Origin へ反映」するような修正が入ると、**任意サイトから
Cookie 付きで API を叩ける**状態（CSRF/情報漏えい）になる危険な設計。

**現状は `bootstrap/app.php:46` でコメントアウトされており有効化されていない**が、
コードが残っているため誤って有効化されるリスクがある。

### 該当箇所
- [app/Http/Middleware/CrossOriginHeaders.php:22-29](app/Http/Middleware/CrossOriginHeaders.php#L22-L29)
- [bootstrap/app.php:46](bootstrap/app.php#L46) — `// $middleware->append(CrossOriginHeaders::class);`（無効）

### 解決案
- CORS が不要なら、このミドルウェアを削除する。
- 必要なら Laravel 標準の HandleCors（`config/cors.php`）を使い、`allowed_origins` を**明示的な許可リスト**で指定する。
- 資格情報を許可する場合（`supports_credentials => true`）、Origin に `*` を使わない。

---

## 4.【中】ソーシャルログインがメールアドレス一致で自動ログイン

### 内容
OAuth コールバックで、プロバイダ連携が未登録の場合に「同一メールアドレスの既存ユーザー」を検索し、
一致すればそのアカウントとして扱う実装になっている。プロバイダが返すメールが**検証済みである保証がない**場合、
攻撃者が被害者のメールアドレスを自分のソーシャルアカウントに設定してログインすることで、
アカウント乗っ取りにつながる可能性がある（GitHub はプライマリメールを検証済みで返すため比較的安全だが、
X / Steam 等プロバイダごとに検証状況は異なる）。

### 該当箇所
- [app/Http/Controllers/AccountController.php:414](app/Http/Controllers/AccountController.php#L414) — GitHub
- 同様のメール突合ロジックが X（`handleXCallback`）・Steam（`handleSteamCallback`）にも存在

### 解決案
- プロバイダが「検証済みメール」を返す場合のみ突合を許可する（GitHub は verified email API を利用）。
- メール検証が保証できないプロバイダでは、自動突合を行わず、
  ログイン中ユーザーによる明示的な「アカウント連携」フロー経由のみで紐付ける。

---

## 5.【中】未エスケープ出力（`{!! !!}`）によるストアドXSSの余地

### 内容
一般ユーザー投稿（レビュー本文・怖さメーターコメント等）は `nl2br(e(...))` で適切にエスケープされているが、
ゲームマスターデータやお知らせなど**管理者・APIトークン経由で編集されるフィールド**が
エスケープなしで出力されている。管理者アカウントの侵害や `game_master.api` トークンの漏えい時、
これらの経路からスクリプトが混入するとストアドXSSになる（多層防御の観点で要対応）。

MCP／ゲームマスターAPI 経由で更新可能な `description` / `description_source` が
未エスケープで描画されている点は特に注意（[docs/claude/mcp-server.md](docs/claude/mcp-server.md) 参照）。

### 該当箇所（抜粋）
- [resources/views/game/franchise_detail.blade.php:7](resources/views/game/franchise_detail.blade.php#L7) — `{!! nl2br($franchise->description) !!}`
- [resources/views/game/maker_detail.blade.php:8](resources/views/game/maker_detail.blade.php#L8) / [:11](resources/views/game/maker_detail.blade.php#L11) — `description` / `description_source`
- [resources/views/game/platform_detail.blade.php:8](resources/views/game/platform_detail.blade.php#L8) / [:11](resources/views/game/platform_detail.blade.php#L11)
- [resources/views/game/title_detail.blade.php:154](resources/views/game/title_detail.blade.php#L154) / [:177](resources/views/game/title_detail.blade.php#L177) — `pkgGroup->description` / `shop->img_tag`
- [resources/views/infomation_detail.blade.php:29](resources/views/infomation_detail.blade.php#L29) — `{!! nl2br($info->{'sub_text_' . $i}) !!}`
- [resources/views/game/franchises.blade.php:38](resources/views/game/franchises.blade.php#L38)

### 解決案
- HTML を意図しないフィールド（`description`, `description_source`, `node_name`, `sub_text_*` 等）は
  `{!! nl2br(e($value)) !!}` のように**エスケープしてから** `nl2br` する。
- `shop->img_tag` のように HTML タグ格納が仕様のフィールドは、保存時に許可タグ・属性を
  ホワイトリスト方式でサニタイズする（例: `<img>` の `src`/`alt` のみ許可、`onerror` 等は除去）。
- サーバー側でエスケープが漏れると HTML 応答へ反映されるため、防御の起点はサーバー側の出力に置く。

---

## 6.【低・潜在】GptsApiKeyMiddleware のデフォルトキーと非定時間比較

### 内容
API キー検証ミドルウェアに 2 つの弱点がある。
1. `config('app.gpts_api_key')` のデフォルト値が `'your-default-api-key'`。環境変数未設定時に
   このキーで認証を通過できる（fail-open）。
2. 比較が `!==` による単純比較でタイミング攻撃に対して非安全。

**現状このミドルウェアはどのルートにも適用されていない**（デッドコード）が、将来利用する際にそのまま流用されると危険。

### 該当箇所
- [app/Http/Middleware/GptsApiKeyMiddleware.php:22](app/Http/Middleware/GptsApiKeyMiddleware.php#L22)
- [config/app.php:126](config/app.php#L126) — `'gpts_api_key' => env('GPTS_API_KEY', 'your-default-api-key')`

### 解決案
- デフォルト値を撤廃し、未設定時は認証を必ず拒否する（fail-closed）。
- 比較は `hash_equals()` を使用する。
- 使用予定がないなら、ミドルウェアと config エントリごと削除する。

```php
$expected = config('app.gpts_api_key');
if (empty($expected) || ! is_string($apiKey) || ! hash_equals($expected, $apiKey)) {
    return response()->json(['message' => 'Unauthorized'], 401);
}
```

---

## 7.【中】アバター画像アップロードの画素数（ピクセル寸法）が無制限（ピクセル爆弾によるDoS）

### 内容
ユーザーが直接アップロードできる画像はアバターのみ。バリデーションは
`['required', 'image', 'mimes:jpeg,png,gif,webp', 'max:2048']` で、**ファイルのバイトサイズ（2MB）は制限されているが、
画像の縦横ピクセル数（`dimensions` ルール）が未指定**。

PNG / WebP は圧縮率が高いため、2MB 未満の小さなファイルでも展開すると巨大なビットマップになり得る。
例えば 30000×30000px の画像はファイルとしては数百KB〜数MBに収まるが、`$manager->read()`（Imagick ドライバ）が
デコードした瞬間にメモリ上へ `30000 × 30000 × 4 byte ≈ 3.6GB` を確保しようとする。
すなわち `max:2048` を通過した無害に見えるファイルで **PHP-FPM ワーカーのメモリ枯渇（OOM）→ プロセスクラッシュ／サーバー全体のDoS**
を引き起こせる（いわゆる decompression bomb / ピクセル爆弾）。Imagick は特にこの攻撃に弱い。
問題の本質は、寸法チェックがないまま**先にフルデコードしてしまう**点にある。

### 該当箇所
- [app/Http/Controllers/User/MyNodeAvatarController.php:17-19](app/Http/Controllers/User/MyNodeAvatarController.php#L17-L19) — バリデーション（`dimensions` なし）
- [app/Http/Controllers/User/MyNodeAvatarController.php:25](app/Http/Controllers/User/MyNodeAvatarController.php#L25) — `$manager->read(...)` によるフルデコード

### 解決案
1. `dimensions` バリデーションを追加する。Laravel の `dimensions` は `getimagesize()` でヘッダから寸法を読むだけなので、
   フルデコード前に安全に弾ける。

```php
$request->validate([
    'avatar' => [
        'required', 'image', 'mimes:jpeg,png,gif,webp', 'max:2048',
        'dimensions:max_width=5000,max_height=5000',
    ],
]);
```

2. 多層防御として、`read()` の前に Imagick 側のリソース上限も設定する（GIF のフレーム数爆発などにも有効）。

```php
\Imagick::setResourceLimit(\Imagick::RESOURCETYPE_MEMORY, 256 * 1024 * 1024);
\Imagick::setResourceLimit(\Imagick::RESOURCETYPE_MAP, 512 * 1024 * 1024);
```

---

## 8.【低】RssArticleMatchedFranchise のマスアサインメント全開放

### 内容
`protected $guarded = [];` により全カラムがマスアサインメント可能。現状は内部処理（RSS 取り込み）専用で
外部入力を直接流し込む箇所は見当たらないが、将来的な誤用に備えて明示的に絞るのが望ましい。

### 該当箇所
- [app/Models/RssArticleMatchedFranchise.php:13](app/Models/RssArticleMatchedFranchise.php#L13)

### 解決案
- `$fillable` で必要なカラムのみを列挙する。

---

## 9.【情報】APP_DEBUG / 本番設定の確認

### 内容
`.env.example` は `APP_ENV=local` / `APP_DEBUG=true`（開発用途としては妥当）。本番で `APP_DEBUG=true` のまま
運用されるとスタックトレース・環境変数・DB 情報がエラーページに露出する。設定ミスの定番のため、デプロイ設定を確認する。

### 該当箇所
- [.env.example:2](.env.example#L2), [.env.example:4](.env.example#L4)

### 解決案
- 本番 `.env` で `APP_DEBUG=false` / `APP_ENV=production` を保証する（デプロイ手順・CI でのチェックを推奨）。
- セッション Cookie 設定（`config/session.php`）は `secure=true` / `http_only=true` / `same_site=lax` が
  既定になっており良好。本番で HTTPS 前提（`SESSION_SECURE_COOKIE=true`）を維持すること。

---

## 良好だった点（参考）

- レビュー・怖さメーターの取得／削除は `where('user_id', Auth::user()->id)` でスコープされ、IDOR がない
  （[app/Http/Controllers/User/ReviewController.php](app/Http/Controllers/User/ReviewController.php)）。
- フォロー／ブロック／ミュートは `Auth::user()` 起点で操作対象を決めており、権限昇格の余地がない
  （[app/Http/Controllers/Api/UserRelationController.php](app/Http/Controllers/Api/UserRelationController.php)）。
- SQL は概ね Eloquent／クエリビルダ経由。`orderByRaw` は許可リスト（`in_array($sort, $allowedSorts, true)`）で
  ユーザー入力を弾いており、SQL インジェクションは確認されなかった
  （[app/Http/Controllers/GameReviewController.php:31-61](app/Http/Controllers/GameReviewController.php#L31-L61)）。
- アバターアップロードは Intervention Image で再エンコード（WebP 化）しており、埋め込みスクリプト等は無害化される
  （[app/Http/Controllers/User/MyNodeAvatarController.php:24-30](app/Http/Controllers/User/MyNodeAvatarController.php#L24-L30)）。
  ※ ただしピクセル寸法の制限がなく、DoS の観点では **#7** を要対応。
- 一般ユーザー投稿（レビュー本文・コメント）は `e()` でエスケープ済み。
- ゲームマスターAPI／MCP は Sanctum + 管理者ロール + トークン ability の三重チェック
  （[app/Http/Middleware/EnsureGameMasterApiTokenAbility.php](app/Http/Middleware/EnsureGameMasterApiTokenAbility.php)）。

---

## 優先対応の推奨順

1. **#1 ログインのレート制限**（実装コスト小・効果大）
2. **#2 テストAPIの `local` 限定化**（設定ミス時の被害が甚大）
3. **#7 アバターアップロードの寸法制限**（実装コスト小・DoS対策）
4. **#4 ソーシャルログインのメール突合**（プロバイダ別の検証状況を整理）
5. **#5 未エスケープ出力のサニタイズ**（多層防御）
6. #3・#6 は不要コードの削除、または有効化前の修正
7. #8・#9 は運用・保守の観点で対応
