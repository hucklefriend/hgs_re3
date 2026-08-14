# グリッドネットワークデザイン Phase 4 実施記録

## 1. 実施結果

2026-08-14 に公開画面の Ajax ナビゲーションを通常の全文書遷移へ切り替え、接続端子からヘッダー常設ノードへ信号を引き渡す演出を追加した。

旧 `HgnTree` は Phase 5 以降の画面移行までツリーの初期描画に利用するが、公開レイアウトへ `data-navigation-mode="document"` を設定し、アンカー、通常フォーム、`popstate`、History API を旧ナビゲーションへ接続しない。リアクションや下書き保存など、専用コンポーネントが担当するページ内 API 通信は維持している。

管理画面の Blade、コントローラー、ルート、アセットには変更を加えていない。

## 2. リンク判定と接続端子

### 2.1 LinkClassifier

`resources/ts/site/navigation/link-classifier.ts` に DOM から分離して検証できるリンク判定を追加した。

演出対象は、左クリックまたはキーボード操作による同一オリジンの通常リンクだけとする。次はブラウザー標準動作へ渡す。

- 外部オリジン、`mailto:`、`tel:`、`javascript:`
- ページ内ハッシュと同一文書のハッシュ付き URL
- `target`、`download`、`rel="external"`、`data-hgn-scope="external"` を持つリンク
- Ctrl、Command、Shift、Alt、中央ボタンによる操作
- `/admin` をパス区間に持つ管理画面 URL
- 既に別のハンドラーが `preventDefault()` した操作

### 2.2 ConnectionTerminalController

演出対象リンクへ一定サイズの接続端子を付加する。Blade で明示した `x-site.connection-terminal` を優先し、未指定リンクには同じ DOM を自動生成する。

- ヘッダーナビゲーションとパンくずは Blade 側で端子を明示した。
- 大きなカードや画像リンクもリンク本体ではなく端子中心を出発点にする。
- `GridPlaneController` の実測変更を購読し、レスポンシブ変更後に端子の縦位置を最寄りのグリッド行方向へ補正する。
- hover、`:focus-visible`、接続中、選択中を CSS 状態として表現する。
- 自動生成した端子と購読は `dispose()` で破棄する。

## 3. 経路、描画、スクロール追従

### 3.1 HandoffRoutePlanner

端子中心の文書座標を最寄り交点へ短い直交区間で接続し、そこからヘッダー常設ノードまでグリッド線上を移動する。全線分は水平または垂直で、ゼロ長線分は除去する。

単体テストでは任意の長い文書座標、グリッド交点上の始点、ヘッダー到着点、全線分の直交性を検証した。

### 3.2 HandoffAnimationController

- 遷移ノードと通過済みの発光経路を、ビューポート固定ではなく文書座標で描画する。
- 距離に応じて320〜880msへ補正し、長いページでも演出時間を制限する。
- 経路進行86%でヘッダー到着位置へ吸着して発光を開始し、発光の完了を待たず通常遷移を開始する。
- 完了、キャンセル、安全タイムアウトを Promise で返す。
- 到着時はヘッダー常設ノードを短く発光させる。
- ノード、軌跡、AnimationFrame、タイマーは完了・例外・ページ離脱で破棄する。

### 3.3 ScrollFollowController

端子をクリックした時点の画面内 Y 座標を基準に、移動ノードの文書 Y 座標へスクロールを追従させる。ヘッダー到着時はスクロール位置も上端へ戻る。低減モーション時は追従しない。

ローカル Chromium の長いトップページでは、開始スクロール位置2703px、端子文書Y座標3159.94pxから、100ms後にスクロール位置1705px、ノード文書Y座標2161.92pxを記録した。ノードが画面上端へ固定表示されず、文書座標上を移動しながら画面が追従している。

## 4. 通常遷移と到着処理

### 4.1 PageTransitionController

- 対象リンクの多重クリックをロックする。
- 選択リンク以外の表示要素を短時間で減光する。
- Handoff と ScrollFollow を並行実行する。
- `TransitionStore` へ遷移元、遷移先、開始時刻を保存する。
- ヘッダー到着発光の開始時に `window.location.assign()` を実行し、残りの発光とドキュメント取得を並行させる。
- 到着前に例外が発生した場合、または1300msの安全タイムアウト時も `window.location.assign()` を実行する。
- 次ページ HTML の `fetch`、XHR、DOM 部分置換は行わない。

演出処理全体を `try` / `finally` で囲み、AnimationFrame を意図的に例外化したブラウザーテストでも通常遷移が完了することを確認した。

### 4.2 TransitionStore

`sessionStorage` に保存した情報は15秒で期限切れとし、遷移先 URL と一致した場合だけ一度読み出す。期限切れ、別 URL、不正 JSON、ストレージ利用不可はいずれも到着画面の表示を妨げない。

### 4.3 PageArrivalController

Phase 2 の `PageRevealController` を置き換えた。

- 接続遷移後は620ms、直接アクセスは420msの対角到着演出を行う。
- 低減モーション、非表示タブ、例外時は直ちに `data-page-ready="true"` を設定する。
- ハッシュ付き URL の標準スクロールを変更しない。
- BFCache の `pageshow` で遷移ロック、減光、ノード、軌跡、到着状態をリセットする。

## 5. 旧 Ajax ナビゲーションとの境界

公開画面では次の旧処理を起動しない。

- `CurrentNode` と `BasicNode` のアンカー横取り
- 通常 GET / POST フォームの Ajax 送信
- `HgnTree` の `beforeunload` 用状態、`popstate` 復元、初期 `history.replaceState`
- リンクノード見出しによる修飾キー付きクリックの抑止

ツリーの初期出現、接続線、アコーディオン、「さらに表示」、既存コンポーネント専用 API は互換層として残す。旧コード本体の削除は Phase 8 で参照確認後に行う。

## 6. 検証結果

| 検証 | 結果 |
|---|---|
| `npm run test:unit` | 成功。5 files / 39 tests |
| `npx tsc --noEmit` | 成功 |
| `npm run build` | 成功。64 modules、CSS 64.15 kB、JS 129.98 kB |
| `php artisan view:cache` | 成功 |
| Phase 4 Playwright | 成功。3 tests |
| 既存基本ページ Playwright | 成功。4 tests |
| 通常リンク | `/` から `/game/lineup` へ `document` 1件、XHRヘッダーなし |
| 接続演出 | 離脱状態、遷移ノード1個、直交経路を確認 |
| 遷移開始タイミング | 長いページで到着発光開始から3ms後にドキュメントリクエスト開始 |
| 到着・戻る | `data-page-ready=true`、BFCache復元後にロック・ノード残留なし |
| ハッシュ | `#site-main` へ標準移動し、離脱演出なし |
| 修飾キー・外部リンク | 元ページを維持して別タブを開き、離脱演出なし |
| 通常フォーム | ラインナップ検索が XHR なしの `document` GET |
| 低減モーション | 遷移ノード・減光を作らず `document` 遷移 |
| 例外フォールバック | 強制した AnimationFrame 例外後も `/game/lineup` へ遷移 |
| 管理URL | `/admin/login` へ演出なしの `document` 遷移、公開ルート要素なし |
| 保護領域差分 | 管理Blade、管理コントローラー、管理ルート、管理アセットに差分なし |

PHP コードを変更していないため、既存 DB スキーマに起因する失敗を含む `php artisan test` 全体は再実行していない。マイグレーション操作は実行していない。

## 7. Phase 4 完了チェック

- [x] `LinkClassifier`、`ConnectionTerminalController`、`HandoffRoutePlanner` を実装した。
- [x] `HandoffAnimationController`、`ScrollFollowController`、`PageTransitionController` を実装した。
- [x] `TransitionStore` と `PageArrivalController` を実装した。
- [x] 大きなリンクも小さな接続端子を出発点にした。
- [x] 長いページで文書座標を使い、画面をノードへ追従させた。
- [x] 公開リンクと通常フォームをブラウザーの全文書遷移へ切り替えた。
- [x] 外部リンク、修飾キー、新規タブ、ダウンロード、ハッシュ、管理URLを演出対象外にした。
- [x] 連打、戻る・進む、BFCache、例外、低減モーション用の復旧経路を実装した。
- [x] ページ遷移用 HTML の `fetch` / XHR が発生しないことを確認した。
- [x] 公開画面だけへ適用し、管理画面の保護境界を維持した。
