# タイムライン機能 設計資料

## 概要

マイノードのタイムライン機能のテーブル設計。
フォロー中ユーザーの活動・お気に入りタイトルの更新・自分のレビューへのいいねを時系列で表示する。

---

## イベント種別

| event_type | 表示テキスト | 説明 |
|---|---|---|
| `review_posted` | レビューを投稿しました | フォロー中ユーザーがレビューを新規投稿 |
| `review_updated` | レビューを更新しました | フォロー中ユーザーがレビューを更新 |
| `fear_meter_posted` | 怖さメーターを投稿しました | フォロー中ユーザーが怖さメーターを初回登録 |
| `fear_meter_updated` | 怖さメーターを更新しました | フォロー中ユーザーが怖さメーターを更新 |
| `game_title_updated` | データが更新されました | お気に入りタイトルのデータが更新された |
| `review_liked` | レビューにいいねしてくれました | 自分のレビューに誰かがいいねした |

---

## テーブル設計

### `user_follows`（フォロー機能実装時に追加）

| カラム | 型 | 説明 |
|---|---|---|
| `follower_id` | BIGINT FK → users.id (cascade) | フォローする側 |
| `followee_id` | BIGINT FK → users.id (cascade) | フォローされる側 |
| `created_at` | TIMESTAMP | |

- PK: `(follower_id, followee_id)`
- Index: `(followee_id)` — フォロワー一覧取得用

### `timeline_events`

| カラム | 型 | NULL | 説明 |
|---|---|---|---|
| `id` | BIGINT PK | | |
| `event_type` | VARCHAR | NO | `TimelineEventType` (string backed Enum) |
| `actor_type` | VARCHAR | YES | `TimelineActorType` (string backed Enum) |
| `actor_id` | BIGINT | YES | actor_type='user' のとき users.id。NULL はシステム起因 |
| `subject_type` | VARCHAR | NO | `TimelineSubjectType` (string backed Enum) |
| `subject_id` | BIGINT | NO | subject_type に対応する ID（ポリモーフィックのため FK なし） |
| `recipient_user_id` | BIGINT FK → users.id (cascade) | YES | 通知先ユーザー（通知系イベント共通） |
| `payload` | JSON | YES | 付随情報（怖さメーターラベルなど） |
| `created_at` | TIMESTAMP | NO | イベント発生日時 |

#### イベント種別ごとのカラム使用

| event_type | actor_type | actor_id | subject_type | subject_id | recipient_user_id | payload 例 |
|---|---|---|---|---|---|---|
| `review_posted` | 'user' | 投稿者 user_id | 'review' | review_id | NULL | — |
| `review_updated` | 'user' | 投稿者 user_id | 'review' | review_id | NULL | — |
| `fear_meter_posted` | 'user' | 投稿者 user_id | 'game_title' | game_title_id | NULL | `{"fear_meter_label": "かなり怖い"}` |
| `fear_meter_updated` | 'user' | 投稿者 user_id | 'game_title' | game_title_id | NULL | `{"fear_meter_label": "めちゃくちゃ怖い"}` |
| `game_title_updated` | 'system' | NULL | 'game_title' | game_title_id | NULL | — |
| `review_liked` | 'user' | いいねした user_id | 'review' | review_id | レビュー所有者 user_id | — |

#### インデックス

| インデックス | 用途 |
|---|---|
| `(actor_type, actor_id, created_at DESC)` | フォロー中ユーザーの活動を時系列取得 |
| `(subject_type, subject_id, created_at DESC)` | 特定タイトル・レビューのイベント取得 |
| `(recipient_user_id, created_at DESC)` | 通知系イベントの取得 |

#### `recipient_user_id` を設ける理由

通知系イベントの取得に `subject` → review → user_id のJOINを使うとインデックスが効かない。
`recipient_user_id` を非正規化カラムとして持つことでインデックス検索が可能になる。
今後の通知系イベント追加時もこのカラムを使い回せるためカラム追加不要。

---

## タイムライン取得クエリのイメージ

```sql
SELECT te.*
FROM timeline_events te
WHERE
    -- フォロー中ユーザーのレビュー・怖さメーター投稿
    (te.event_type IN ('review_posted', 'review_updated', 'fear_meter_posted', 'fear_meter_updated')
        AND te.actor_type = 'user'
        AND te.actor_id IN (
            SELECT followee_id FROM user_follows WHERE follower_id = :me
        ))
    -- お気に入りタイトルの更新
    OR (te.event_type = 'game_title_updated'
        AND te.subject_id IN (
            SELECT game_title_id FROM user_favorite_game_titles WHERE user_id = :me
        ))
    -- 自分への通知（いいねなど）
    OR te.recipient_user_id = :me
ORDER BY te.created_at DESC
LIMIT 20
```

---

## イベント書き込みタイミング

| event_type | 書き込みタイミング |
|---|---|
| `review_posted` | `UserGameTitleReview` 作成時 |
| `review_updated` | `UserGameTitleReview` 更新時 |
| `fear_meter_posted` | `UserGameTitleFearMeterLog` で `old_fear_meter IS NULL`（初回登録）の時 |
| `fear_meter_updated` | `UserGameTitleFearMeterLog` で `old_fear_meter IS NOT NULL`（更新）の時 |
| `game_title_updated` | `GameTitle` 更新時 |
| `review_liked` | `UserGameTitleReviewLike` 作成時 |

### TimelineEventService による登録

`App\Services\Timeline\TimelineEventService` に登録メソッドが実装済み。各書き込みタイミングでこのサービスを呼ぶ。

```php
// レビュー投稿・更新（review_posted / review_updated）
$timelineEventService->recordReviewEvent(int $userId, int $reviewId, bool $isNew);

// 怖さメーター投稿・更新（fear_meter_posted / fear_meter_updated）
// ※ 怖さメーターの値が変わらない場合は呼ばない
$timelineEventService->recordFearMeterEvent(int $userId, int $gameTitleId, bool $isNew, int $fearMeterValue);
```

**実装済みの呼び出し箇所：**

| 呼び出し元 | 登録されるイベント |
|---|---|
| `User\ReviewController::publish()` | `review_posted` または `review_updated`（常に）+ `fear_meter_posted` または `fear_meter_updated`（値が変わった場合のみ） |
| `User\FearMeterController::store()` | `fear_meter_posted` または `fear_meter_updated`（値が変わった場合のみ） |
| `Admin\Game\TitleController::recordTimeline()` | `game_title_updated`（管理画面の「タイムラインに登録」ボタンから手動実行） |

**未実装の呼び出し箇所：**

| event_type | 実装予定箇所 |
|---|---|
| `review_liked` | `UserGameTitleReviewLike` 作成時のコントローラー |

**10分以内の連続更新について：**

更新系イベント（`review_updated` / `fear_meter_updated`）は、同じ actor + subject の組み合わせで過去10分以内にイベントが存在する場合は登録しない（`TimelineEventService::hasRecentEventForSubject()` で判定）。

### レビューと怖さメーターの同時発火

怖さメーターはレビューとセットで動くケースがあり、以下の場合に複数イベントが同時生成される。
同時生成されたイベントは `created_at` が同一になるためタイムライン上に連続して表示される。

| 操作 | 生成されるイベント |
|---|---|
| レビュー新規投稿・怖さメーターも初回登録 | `review_posted` + `fear_meter_posted` |
| レビュー新規投稿・怖さメーターは既存 | `review_posted` のみ |
| レビュー更新・怖さメーター値も変更 | `review_updated` + `fear_meter_updated` |
| レビュー更新・怖さメーター値は変わらず | `review_updated` のみ |
| 怖さメーター単体で初回登録 | `fear_meter_posted` のみ |
| 怖さメーター単体で更新 | `fear_meter_updated` のみ |

---

## 留意点

- ゲームタイトル名は常に `game_titles` マスターから取得する。タイトル名変更時はタイムラインにも反映される
- `payload` はゲームタイトル名以外の付随情報（怖さメーターラベルなど）のみ使用する
- ユーザー物理削除時（退会100日後）は CASCADE DELETE でそのユーザーが起因・宛先の `timeline_events` を全削除する
- 猶予期間中（`withdrawn_at` がセット済み・物理削除前）は `withdrawn_at` を確認してユーザー名を「（退会ユーザー）」として表示する
- フォロー機能（`user_follows` テーブル）は未実装。タイムライン本実装時に合わせて追加する
