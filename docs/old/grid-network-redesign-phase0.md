# グリッドネットワークデザイン Phase 0 実施記録

## 1. 基準点

2026-08-13 05:28 JST 時点の移行前状態を基準とする。

| 項目 | 値 |
|---|---|
| ブランチ | `feature/new_design` |
| コミット | `9617b09e46f77baf694cf94f9e7f60c9984c89d4` |
| PHP / Laravel | PHP 8.4.20 / Laravel 12.36.1 |
| Node.js / npm | Node.js 20.20.2 / npm 10.8.2 |
| Vite / Playwright | Vite 5.4.8 / Playwright 1.56.1 |
| 公開レイアウト | `resources/views/layout.blade.php` |
| 公開 Vite エントリー | `resources/css/app.css`, `resources/ts/app.ts` |
| 管理レイアウト | `resources/views/admin/layout.blade.php`（公開 Vite エントリーを読み込まない） |

公開コントローラーは `Controller::tree()` を通じ、通常リクエストでは公開レイアウトを含む HTML、Ajax リクエストでは部分 HTML または JSON を返す。Phase 0 ではこの挙動を変更しない。

## 2. 公開 GET ルートと Blade の対応

`php artisan route:list --json` で確認した名前付き公開 GET ルートは 65 件である。OAuth、ログアウト、メール確認などのリダイレクト専用ルートも移行対象 URL には含めるが、対応 Blade は持たない。

### 2.1 共通・情報・問い合わせ

| ルート | Blade | 備考 |
|---|---|---|
| `/` (`Root`) | `root.blade.php` | トップ |
| `/logo` (`Logo`) | `logo.blade.php` | ロゴ説明 |
| `/privacy` (`PrivacyPolicy`) | `privacy_policy.blade.php` | プライバシーポリシー |
| `/about` (`About`) | `about.blade.php` | サイト説明 |
| `/timeline` (`Timeline`) | `timeline.blade.php` | 公開タイムライン |
| `/info` (`Informations`) | `infomations.blade.php` | お知らせ一覧。既存の綴りを維持 |
| `/info/{info}` (`InformationDetail`) | `infomation_detail.blade.php` | お知らせ詳細。既存の綴りを維持 |
| `/contact` (`Contact`) | `contact/form.blade.php` | 問い合わせ入力 |
| `/contact/{token}` (`Contact.Show`) | `contact/show.blade.php` | 該当なし時は `contact/not_found.blade.php` |
| 問い合わせ POST 後 | `contact/complete.blade.php` | GET ルートを持たない応答画面 |

### 2.2 アカウント

| ルート | Blade | 備考 |
|---|---|---|
| `/login` (`Account.Login`) | `account/login.blade.php` | 公開ログイン |
| `/register` (`Account.Register`) | `account/register.blade.php` | POST 後は `account/register-pending.blade.php` |
| `/register/complete/{token}` (`Account.Register.Complete`) | `account/complete-register.blade.php` | 登録完了入力 |
| `/password-reset` (`Account.PasswordReset`) | `account/password-reset.blade.php` | POST 後は `account/password-reset-sent.blade.php` |
| `/password-reset/complete/{token}` (`Account.PasswordReset.Complete`) | `account/password-reset-complete.blade.php` | パスワード再設定 |
| `/two-factor` (`TwoFactor.Show`) | `account/two-factor.blade.php` | OTP 入力 |
| `/logout`, `/auth/{github,x,steam}` と callback | なし | 認証処理またはリダイレクト。通常リンク判定では別扱いが必要 |

`account/verify-email-pending.blade.php` はメール確認待ち応答用で、独立した名前付き GET ルートを持たない。

### 2.3 ゲーム

| ルート | Blade | 備考 |
|---|---|---|
| `/game/lineup` (`Game.Lineup`) | `game/lineup.blade.php` | Ajax 更新用に `game/lineup_nodes.blade.php` も使用 |
| `/game/franchises/{prefix?}` (`Game.Franchises`) | `game/franchises.blade.php` | フランチャイズ一覧 |
| `/game/franchise/{franchiseKey}` (`Game.FranchiseDetail`) | `game/franchise_detail.blade.php` | フランチャイズ詳細 |
| `/game/franchise/{franchiseKey}/timeline` (`Game.FranchiseTimeline`) | `game/franchise_timeline.blade.php` | フランチャイズ更新履歴 |
| `/game/maker` (`Game.Maker`) | `game/makers.blade.php` | メーカー一覧 |
| `/game/maker/{makerKey}` (`Game.MakerDetail`) | `game/maker_detail.blade.php` | メーカー詳細 |
| `/game/platform` (`Game.Platform`) | `game/platforms.blade.php` | プラットフォーム一覧 |
| `/game/platform/{platformKey}` (`Game.PlatformDetail`) | `game/platform_detail.blade.php` | プラットフォーム詳細 |
| `/game/media-mix/{mediaMixKey}` (`Game.MediaMixDetail`) | `game/media_mix_detail.blade.php` | メディアミックス詳細 |
| `/game/title/{titleKey}` (`Game.TitleDetail`) | `game/title_detail.blade.php` | タイトル詳細 |
| `/game/title/{titleKey}/fear-meter-comments` (`Game.TitleFearMeterComments`) | `game/title_fear_meter_comments.blade.php` | 怖さメーターコメント |
| `/game/reviews` (`Game.Reviews`) | `game/reviews.blade.php` | 全レビュー一覧 |
| `/game/title/{titleKey}/reviews` (`Game.TitleReviews`) | `game/title_reviews.blade.php` | タイトル別レビュー一覧 |
| `/game/title/{titleKey}/review/{reviewKey}` (`Game.TitleReview`) | `game/title_review.blade.php` | レビュー詳細 |

### 2.4 ユーザー・コミュニティ

| ルート群 | Blade |
|---|---|
| `/user/fear-meter`, `/user/fear-meter/{titleKey}/form` | `user/fear_meter/index.blade.php`, `user/fear_meter/form.blade.php` |
| `/user/review`, `/user/review/{titleKey}/form` | `user/review/index.blade.php`, `user/review/form.blade.php` |
| `/user/follow/favorite-titles`, `/user/my-node/review-likes` | `user/follow/favorite_titles.blade.php`, `user/my_node/review_likes.blade.php` |
| `/user/my-node` | `user/my_node/top.blade.php` |
| `/user/my-node/profile`, `/email`, `/password`, `/withdraw` | 対応する `user/my_node/{profile,email,password,withdraw}.blade.php`。パスワード未設定時は `password_set.blade.php` |
| `/user/my-node/login-settings`, `/login-settings/totp/setup`, `/login-settings/recovery-codes` | `login_settings.blade.php`, `totp_setup.blade.php`, `recovery_codes.blade.php` |
| `/user/my-node/social-accounts` | `user/my_node/social_accounts.blade.php` |
| `/user/my-node/timeline`, `/timeline-settings` | `timeline.blade.php`, `timeline_settings.blade.php` |
| `/user/my-node/{following,followers,blocking,muting}` | 同名の `user/my_node/*.blade.php` |
| `/user/{show_id}` | `user/profile/show.blade.php` |
| `/user/{show_id}/{timeline,fear-meters,reviews,following,followers}` | 同名の `user/profile/*.blade.php` |

`/user/my-node/email/verify/{token}` と `/user/my-node/social-accounts/link/{provider}` は処理・リダイレクト用で、専用 Blade を持たない。認証必須ルートは未認証時に `/login` へ遷移する。

### 2.5 共通 partial とエラー画面

- `resources/views/common/**` は OGP、パンくず相当の shortcut、ページャー、商品、タイムラインイベント、旧ツリーノードを共有する。
- `resources/views/errors/{401,403,404,405,419,429,500,502,503}.blade.php` は公開 `layout` を使用する。
- `resources/views/rating_check.blade.php` は年齢確認用の公開応答画面である。
- 公開ページと partial は 108 Blade。管理 Blade とメール Blade はこの数から除外した。

## 3. ページ内 TypeScript コンポーネント対応表

すべて `resources/ts/component-manager.ts` に登録され、`window.components` を `HgnTree` の `CurrentNode` が初期化する。Ajax 差し替え後は `ScopedHydrator` が再初期化する。

| コンポーネント | 主な Blade / 画面 | 主な DOM 契約 |
|---|---|---|
| `AvatarUpload` | `user/my_node/profile.blade.php` | `#avatar-file-input`, `#avatar-preview`, 保存・削除ボタン |
| `LineupSearch` | `game/lineup.blade.php` | 詳細検索、メーカー候補、検索リセット |
| `TitleDetailFavorite` | `game/title_detail.blade.php` | `.favorite-toggle-form` |
| `FearMeterCommentReaction` | `game/title_detail.blade.php`, `game/title_fear_meter_comments.blade.php` | `.fear-meter-reaction-form` |
| `FearMeterFormInput` | `user/fear_meter/form.blade.php`, `user/review/form.blade.php` | `.js-fear-meter-input`, 下書きフォーム |
| `ReviewFormInput` | `user/review/form.blade.php` | `.js-review-form`, 評点・補正値・下書き保存 |
| `ReviewReaction` | `game/title_review.blade.php` | `.review-reaction-form`, 通報 dialog |
| `SpoilerToggle` | `game/title_review.blade.php` | `.js-spoiler-btn`, `.js-spoiler-content` |
| `OtpInput` | `account/two-factor.blade.php`, `user/my_node/totp_setup.blade.php` | `.js-otp-input-wrapper` |
| `SortTabs` | `game/reviews.blade.php` | `[data-sort-tabs]` |
| `UserRelation` | `user/profile/show.blade.php`, `user/my_node/{following,followers,blocking,muting}.blade.php` | `.js-follow-toggle`, `.js-block-toggle`, `.js-mute-toggle` |

Phase 1 以降では、上記 DOM 契約を維持しながら全文書ロード時の一度だけの初期化へ移行する。

## 4. 管理画面の保護境界

次のパスは明示的な保護対象とし、公開画面の移行差分へ含めない。

- `resources/views/admin/**`
- `resources/views/components/admin/**`
- `app/Http/Controllers/Admin/**`
- `routes/web.php` の `/admin` ルートグループ
- `public/assets/**`
- `public/admin_assets/**`
- 管理画面だけが参照する `resources/js/editor/**`

各フェーズの差分確認では次を実行する。

```bash
git diff --name-only -- \
  resources/views/admin \
  resources/views/components/admin \
  app/Http/Controllers/Admin \
  public/assets \
  public/admin_assets \
  resources/js/editor
```

`routes/web.php` を変更する場合は、`/admin` グループの差分を個別に確認する。管理レイアウトと管理ログインは公開用 `resources/css/app.css` および `resources/ts/app.ts` を読み込まない状態を維持する。

## 5. 固定スモーク対象

| 区分 | 代表 URL | 確認内容 |
|---|---|---|
| トップ | `/` | HTTP 200、本文、公開 JS エラー |
| ラインナップ | `/game/lineup` | 検索フォーム、一覧、ページャー |
| タイトル詳細 | `/game/title/identity-v` | タイトル本文、怖さメーター、レビュー導線 |
| 公開ログイン | `/login` | フォーム表示、認証後遷移 |
| ユーザーページ | `/user/my-node` | 認証済み表示。未認証時は `/login` リダイレクト |
| 管理ログイン | `/admin/login` | 管理 CSS/JS のみでフォームが表示される |
| 管理ダッシュボード | `/admin` | 管理メニューと本文 |
| 管理一覧 | `/admin/manage/contact` | 代表一覧の検索・テーブル表示 |

直接スモークでは `/`、`/game/lineup`、`/game/title/identity-v`、`/login`、`/admin/login` の HTTP 200 と本文表示を Chromium で確認した。既存アカウント E2E が変更した共有テストユーザーは、明示的な承認後にローカル専用 API で復元した。その後の単独スモークで `/admin` へのログイン成功と、`/admin/manage/contact` の HTTP 200、見出し、検索欄、一覧表の表示を確認した。両画面で JavaScript のページ例外とコンソールエラーは発生しなかった。

## 6. 移行前テスト基準

### 6.1 結果

| コマンド | 結果 | 基準として扱う内容 |
|---|---|---|
| `npm run build` | 成功 | 49 modules、CSS 46.93 kB、JS 103.11 kB。Browserslist データ期限警告あり |
| `php artisan test` | 失敗 | 11 passed / 32 failed、196 assertions、198.03 秒 |
| `npm run test:e2e` | 失敗 | Chromium 10 passed / 12 failed、約 4.5 分 |

PHP テストは DB 接続可能な環境で再実行した結果を採用する。主な既存失敗は、テスト DB の未反映スキーマ（`title_fear_meter_statistics`、`timeline_events`、`search_synonyms`）、外部通知の認証失敗、旧スキーマに起因する JSON 期待値不一致である。Phase 0 ではマイグレーション操作を実行していない。

### 6.2 既存 Playwright 失敗

以下の 12 件を既存失敗として固定する。

1. 新規登録して、ログインしマイページで設定を行い、退会する
2. パスワードリセット申請して、パスワードを変更しログインできる
3. 問い合わせフォームから問い合わせを送信できる
4. 投稿内容にひらがな・カタカナが含まれていなかったら、投稿時点ではじかれること
5. 未ログイン時、ゲームタイトル照会画面で「あなたの怖さメーター」リンクが表示されない
6. ログイン後、怖さメーターを入力して成功メッセージが表示される
7. ログイン後、他ユーザーのレビューにいいねできる
8. ログイン後、レビューを通報できる
9. ログイン後、レビューを投稿して成功メッセージが表示され、タイトル詳細に反映される
10. 下書きを保存した後で公開できる
11. 投稿したレビューをソフトデリートできる
12. ネタバレフラグ付きのレビューは本文が折りたたまれて表示される

失敗箇所は、旧ツリー内の期待テキスト欠落、リンクまたは管理メニューが見つからない、レビュー公開レスポンス待ちのタイムアウトに大別される。残り 10 件は成功した。

### 6.3 差分判定ルール

- build の失敗はすべて新規失敗として扱う。
- PHP テストは 32 件の既存失敗から件数だけでなくテスト名と例外種別を比較する。
- Playwright は上記 12 件以外の失敗、または既存 12 件の失敗地点の前進・後退を差分として記録する。
- DB スキーマと外部通知設定が修正された場合は基準を取り直し、この文書の日付、コミット、件数を更新する。
- E2E は共有ユーザーを変更するシナリオを並列実行しているため、認証失敗は競合の有無を単独実行でも確認する。

## 7. Phase 0 完了チェック

- [x] 公開ルート、公開 Blade、TypeScript コンポーネントを一覧化した。
- [x] 管理画面の保護対象パスと差分確認方法を固定した。
- [x] build、PHP、Playwright の基準結果を記録した。
- [x] トップ、ラインナップ、タイトル詳細、ログイン、ユーザー、管理画面の代表 URL を固定した。
- [x] 公開 4 画面と管理ログインの現状表示を確認した。
- [x] 共有テストユーザーを復元し、認証必須の管理ダッシュボードと代表一覧を単独スモークした。

以上により Phase 0 を完了とする。
