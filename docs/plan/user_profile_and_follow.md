# ユーザープロフィール・フォロー/ブロック/ミュート 設計資料

## 概要

ユーザープロフィールページの新設と、フォロー・ブロック・ミュート機能の実装。
現在 `UserTimelineSetting.show_followed_user_activity` フィールドが既にある（タイムライン設計で先行定義済み）が、
フォロー関係を保持するテーブルはまだ存在しないため、DB 設計から行う。

---

## DB 設計

### users テーブルへの追加カラム（アバター）

```
users
└── avatar_filename   VARCHAR(255)  NULL  DEFAULT NULL
```

- null の場合は Gravatar（identicon フォールバック）を表示
- 値がある場合は `storage/avatars/{avatar_filename}` を表示
- ファイル名はランダムな hex 文字列 + `.webp`（ユーザーID はファイル名に含めない）

---

### user_follows（フォロー関係）

```
user_follows
├── id                BIGINT UNSIGNED  PK AUTO_INCREMENT
├── follower_id       BIGINT UNSIGNED  NOT NULL  FK → users.id
├── following_id      BIGINT UNSIGNED  NOT NULL  FK → users.id  （フォローされる側）
└── created_at        TIMESTAMP
UNIQUE (follower_id, following_id)
INDEX (following_id)  ← フォロワー一覧の取得用
```

### user_blocks（ブロック）

```
user_blocks
├── id                BIGINT UNSIGNED  PK AUTO_INCREMENT
├── blocker_id        BIGINT UNSIGNED  NOT NULL  FK → users.id
├── blocked_id        BIGINT UNSIGNED  NOT NULL  FK → users.id
└── created_at        TIMESTAMP
UNIQUE (blocker_id, blocked_id)
INDEX (blocked_id)
```

### user_mutes（ミュート）

```
user_mutes
├── id                BIGINT UNSIGNED  PK AUTO_INCREMENT
├── muter_id          BIGINT UNSIGNED  NOT NULL  FK → users.id
├── muted_id          BIGINT UNSIGNED  NOT NULL  FK → users.id
└── created_at        TIMESTAMP
UNIQUE (muter_id, muted_id)
INDEX (muted_id)
```

---

## モデル設計

### 新規モデル

| モデル | テーブル | 主なフィールド |
|---|---|---|
| `UserFollow` | `user_follows` | `follower_id`, `following_id` |
| `UserBlock` | `user_blocks` | `blocker_id`, `blocked_id` |
| `UserMute` | `user_mutes` | `muter_id`, `muted_id` |

### User モデルへ追加するリレーション

```php
// フォロー
public function following(): BelongsToMany  // 自分がフォローしているユーザー
public function followers(): BelongsToMany  // 自分をフォローしているユーザー

// ブロック
public function blocking(): BelongsToMany   // 自分がブロックしているユーザー
public function blockedBy(): BelongsToMany  // 自分をブロックしているユーザー

// ミュート
public function muting(): BelongsToMany     // 自分がミュートしているユーザー
public function mutedBy(): BelongsToMany    // 自分をミュートしているユーザー
```

### User モデルへ追加するヘルパーメソッド

```php
public function isFollowing(User $user): bool
public function isFollowedBy(User $user): bool
public function isBlocking(User $user): bool
public function isBlockedBy(User $user): bool
public function isMuting(User $user): bool
public function getAvatarUrl(int $size = 80): string
// avatar_filename があれば storage URL を、なければ Gravatar（identicon）を返す
```

---

## ルーティング

### web.php — プロフィール（公開）

```
GET /user/{show_id}              User.Profile.Show        プロフィールトップ
GET /user/{show_id}/fear-meters  User.Profile.FearMeters  怖さメーター一覧
GET /user/{show_id}/reviews      User.Profile.Reviews     レビュー一覧
GET /user/{show_id}/following    User.Profile.Following   フォロー一覧
GET /user/{show_id}/followers    User.Profile.Followers   フォロワー一覧
```

パラメータ `{show_id}` は `users.show_id`（ユニーク）で解決。
退会済み・無効ユーザーは 404。

**閲覧権限まとめ:**

| ページ | 未ログイン | ログイン済み |
|---|---|---|
| プロフィールトップ | ○ | ○（ブロックされている場合はメッセージのみ） |
| 怖さメーター一覧 | ○ | ○ |
| レビュー一覧 | ○ | ○ |
| フォロー一覧 | フォロー数のみ表示 | ○ |
| フォロワー一覧 | フォロワー数のみ表示 | ○ |

### web.php — マイノード追加（要認証）

```
GET    /user/my-node/following  MyNode.Following      フォロー中一覧（フォロー解除可）
GET    /user/my-node/followers  MyNode.Followers      フォロワー一覧（ブロック可）
GET    /user/my-node/blocking   MyNode.Blocking       ブロック一覧（解除可）
GET    /user/my-node/muting     MyNode.Muting         ミュート一覧（解除可）
POST   /user/my-node/avatar     MyNode.Avatar.Update  アバターアップロード
DELETE /user/my-node/avatar     MyNode.Avatar.Delete  アバター削除
```

アバター操作はプロフィール編集ページ（`/user/my-node/profile`）内に UI を組み込み、
JavaScript（fetch）で非同期送信する。

### api.php — フォロー/ブロック/ミュート操作（要認証: `auth:sanctum`）

```
POST   /api/v1/users/{show_id}/follow   フォローする
DELETE /api/v1/users/{show_id}/follow   フォロー解除
POST   /api/v1/users/{show_id}/block    ブロックする
DELETE /api/v1/users/{show_id}/block    ブロック解除
POST   /api/v1/users/{show_id}/mute     ミュートする
DELETE /api/v1/users/{show_id}/mute     ミュート解除
```

レスポンス形式（共通）:
```json
{ "following": true, "blocked": false, "muted": false }
```

---

## コントローラ設計

### `App\Http\Controllers\User\ProfileController`（新規）

| メソッド | ルート | 概要 |
|---|---|---|
| `show(string $showId)` | `User.Profile.Show` | プロフィールトップ表示 |
| `fearMeters(string $showId)` | `User.Profile.FearMeters` | 怖さメーター一覧（ページネーション） |
| `reviews(string $showId)` | `User.Profile.Reviews` | レビュー一覧（ページネーション） |
| `following(string $showId)` | `User.Profile.Following` | フォロー一覧 |
| `followers(string $showId)` | `User.Profile.Followers` | フォロワー一覧 |

共通処理：
- `show_id` でユーザーを取得（`withdrawn_at IS NULL` を条件に）
- ログイン済みかつブロックされている場合はプロフィール View でメッセージのみ表示（404 にはしない）
- 未ログインユーザーはすべてのプロフィールトップ・怖さメーター・レビュー一覧を閲覧可能
- フォロー一覧・フォロワー一覧は未ログインの場合は件数のみ表示（一覧非表示）

### `App\Http\Controllers\User\MyNodeFollowController`（新規）

| メソッド | ルート |
|---|---|
| `following()` | `MyNode.Following` |
| `followers()` | `MyNode.Followers` |
| `blocking()` | `MyNode.Blocking` |
| `muting()` | `MyNode.Muting` |

### `App\Http\Controllers\User\MyNodeAvatarController`（新規）

| メソッド | ルート | 概要 |
|---|---|---|
| `update(Request $request)` | `MyNode.Avatar.Update` | アバターアップロード・更新 |
| `delete()` | `MyNode.Avatar.Delete` | アバター削除（Gravatar に戻す） |

アップロード処理の流れ：
1. バリデーション（`image|mimes:jpeg,png,gif,webp|max:2048`）
2. Intervention Image で 200×200px の正方形にクロップ（中央寄せ）して WebP に変換
3. `storage/app/public/avatars/{random_hex}.webp` に保存
4. 古い `avatar_filename` がある場合は旧ファイルを削除
5. `users.avatar_filename` を更新
6. JSON レスポンスで新しいアバター URL を返す

### `App\Http\Controllers\Api\UserRelationController`（新規）

| メソッド | エンドポイント |
|---|---|
| `follow(string $showId)` | `POST /follow` |
| `unfollow(string $showId)` | `DELETE /follow` |
| `block(string $showId)` | `POST /block` |
| `unblock(string $showId)` | `DELETE /block` |
| `mute(string $showId)` | `POST /mute` |
| `unmute(string $showId)` | `DELETE /mute` |

---

## ビジネスロジック

### フォロー制約

- 自分自身はフォロー不可
- 自分がブロックしているユーザーはフォロー不可（`422` + 「フォローできません」）
- 自分がブロックされているユーザーにはフォロー不可（`422` + 「フォローできません」。ブロックされていることは伝えない）

### ブロック時の副作用

ブロックすると以下を同時に実行：
1. 双方向のフォロー関係をすべて削除（`follower_id = me AND following_id = target` + 逆）
2. `user_blocks` に INSERT

### ミュートの仕様

- フォロー関係は維持したまま、タイムライン上のアクティビティのみ非表示にする
- プロフィールページは閲覧可能
- ミュートしたことは相手に通知しない

### ブロック時のプロフィール閲覧

- 自分がブロックされているユーザーのプロフィールを開いた場合：
  「このユーザーのプロフィールは表示できません」メッセージを表示（コンテンツは見せない）
- 自分がブロックしているユーザーのプロフィールは閲覧可能（ブロックした側は見られる）
- 未ログインユーザーにはブロック判定を行わない

---

## プロフィールページの表示内容

```
┌──────────────────────────────────────────────┐
│  [アバター]  ユーザー名 (show_id)             │
│             [フォローする] [ミュート] [ブロック] │
├──────────────────────────────────────────────┤
│  お気に入りタイトル（最大5件、全件リンク）       │
├──────────────────────────────────────────────┤
│  怖さメーター: N件  レビュー: N件              │
│  （各一覧ページへのリンク）                   │
├──────────────────────────────────────────────┤
│  フォロー: N人  フォロワー: N人               │
│  （各一覧ページへのリンク）                   │
└──────────────────────────────────────────────┘
```

アバター表示ロジック：
- `users.avatar_filename` が null → Gravatar（`https://www.gravatar.com/avatar/{md5(email)}?s=80&d=identicon`）
- `users.avatar_filename` あり → `Storage::url('avatars/' . $user->avatar_filename)`

アバターのストレージ：
- 保存先: `storage/app/public/avatars/`（`php artisan storage:link` で `public/storage/avatars/` にリンク）
- ファイル形式: WebP（200×200px 正方形）に統一して保存
- 受付形式: JPEG / PNG / GIF / WebP（最大 2MB）
- セキュリティ: 受け取った画像を Intervention Image で再エンコードして XSS を無害化

---

## マイノード top への追加表示

```
フォロー: N人  →  /user/my-node/following
フォロワー: N人  →  /user/my-node/followers
ブロック中: N人  →  /user/my-node/blocking
ミュート中: N人  →  /user/my-node/muting
```

---

## View ファイル一覧

### 新規

```
resources/views/user/profile/
├── show.blade.php          プロフィールトップ
├── fear_meters.blade.php   怖さメーター一覧
├── reviews.blade.php       レビュー一覧
├── following.blade.php     フォロー一覧（公開）
└── followers.blade.php     フォロワー一覧（公開）

resources/views/user/my_node/
├── following.blade.php     マイノード フォロー中一覧
├── followers.blade.php     マイノード フォロワー一覧
├── blocking.blade.php      マイノード ブロック一覧
└── muting.blade.php        マイノード ミュート一覧
```

### 変更

```
resources/views/user/my_node/top.blade.php   フォロー数/フォロワー数を追加
```

---

## TypeScript コンポーネント

| ファイル | 用途 |
|---|---|
| `resources/ts/components/follow-button.ts` | フォロー・フォロー解除トグルボタン |
| `resources/ts/components/block-mute-menu.ts` | ブロック・ミュートのドロップダウンメニュー |
| `resources/ts/components/avatar-upload.ts` | アバター選択・プレビュー・非同期アップロード |

各コンポーネントは API 呼び出し後にボタンの状態を更新する。

`avatar-upload.ts` の動作：
1. ファイル選択ダイアログ → 即座にプレビュー表示
2. 「保存」ボタンで `POST /user/my-node/avatar`（multipart/form-data）を送信
3. 成功後にページ内のアバター画像 `<img>` を新しい URL に差し替え
4. 「削除」ボタンで `DELETE /user/my-node/avatar` を送信 → Gravatar に差し戻し

---

## 依存パッケージ

| パッケージ | 用途 | インストール |
|---|---|---|
| `intervention/image` v3 | 画像リサイズ・クロップ・WebP 変換 | `composer require intervention/image` |

ドライバは Imagick を優先（`config/image.php` で設定）。

---

## マイグレーションファイル名（案）

```
2026_06_XX_000001_add_avatar_filename_to_users_table.php
2026_06_XX_000002_create_user_follows_table.php
2026_06_XX_000003_create_user_blocks_table.php
2026_06_XX_000004_create_user_mutes_table.php
```

---

## View ファイル — 変更（追記）

```
resources/views/user/my_node/profile.blade.php   アバターアップロード UI を追加
```

---

## 実装順序

1. `composer require intervention/image` + `php artisan storage:link`
2. マイグレーション作成（`avatar_filename` to users / user_follows / user_blocks / user_mutes）
3. モデル作成（UserFollow / UserBlock / UserMute）
4. User モデル更新（リレーション・`getAvatarUrl()` 等のヘルパーメソッド追加）
5. MyNodeAvatarController 実装 + Web ルーティング追加
6. API コントローラ実装（UserRelationController）+ API ルーティング追加
7. ProfileController 実装 + Web ルーティング追加（プロフィールページ）
8. プロフィール View 作成
9. マイノード top 更新 + MyNodeFollowController + View 作成
10. マイノード profile.blade.php にアバターアップロード UI 追加
11. TypeScript コンポーネント作成（avatar-upload / follow-button / block-mute-menu）
12. `npm run build`
