# グリッドネットワークデザイン Phase 6〜9 実装記録

実装日: 2026年8月14日

## 結果

Phase 6〜9の公開画面移行、コミュニティ機能移行、旧ツリー基盤撤去、回帰確認と文書化を完了した。公開画面はBladeが完全なHTML文書を返し、GETリンクはブラウザー標準の文書遷移を行う。管理画面のBlade、CSS、TypeScript、コントローラー、ルートには変更を加えていない。

## Phase 6: その他の公開ページ

- 共通レイアウトの既存セクションを `.site-standard-page` へ収め、専用レイアウトを持たない公開ページを共通グリッドUIへ移行した。
- `resources/css/site/pages/standard.css` にカード、一覧、テーブル、フォーム、アラート、空状態、ページネーション、レスポンシブ表示を集約した。
- フランチャイズ、メーカー、プラットフォーム、メディアミックス、タイムライン、サイト説明、問い合わせ、プライバシー、エラー、認証系ページを通常文書として表示できるようにした。
- 旧アコーディオンに依存していたフランチャイズ索引は、JavaScript無効時にも全項目を利用できる構造へ変更した。

## Phase 7: アカウント・コミュニティ機能

- ログイン、登録、プロフィール、マイページ、フォロー、レビュー、怖さメーターの既存DOMを共通公開レイアウトへ接続した。
- レビュー公開は通常フォーム送信へ戻し、いいね・通報など即時応答が必要な操作だけ専用コンポーネントの通信を維持した。
- レビューリアクション送信中はボタンを無効化し、`aria-busy` で処理状態を表すようにした。
- 成功メッセージ、未ログイン導線、レビューと怖さメーターの主要操作を現行DOMに合わせてE2E化した。

## Phase 8: 旧公開基盤の撤去

次の旧公開ランタイムと専用表示資産を参照検索後に削除した。

- `resources/ts/hgn-tree.ts`
- `resources/ts/node/**`
- `resources/ts/navigation/**` の旧Ajaxナビゲーション
- `resources/ts/depth/**`
- `resources/ts/animation/**`
- `resources/ts/hydrate/**`
- 旧ランタイムだけが使っていた `common/**` と `enum/**`
- `resources/css/tree.css`
- `resources/views/common/nodes/**`
- `resources/views/game/lineup_nodes.blade.php`

あわせて、公開コントローラーの部分HTML・子ノードJSON応答、`internal_node`、`children_only`、`viewerType`、`data-hgn-scope`、Pagerの旧scope引数を削除した。互換クエリが送られても通常のHTML文書を返す。

## Phase 9: 品質確認と文書化

- 正式な規約を `docs/Codex/frontend-conventions.md` にまとめ、旧Ajax方針より本計画を優先することを `docs/plan/in-page-animation-shift.md` に明記した。
- 公開E2Eの固定秒数待機と `networkidle` 依存を、`data-page-ready`、URL、表示要素、APIレスポンス待ちへ置き換えた。
- モバイル幅、低減モーション、JavaScript無効、旧Ajaxクエリ、管理画面非影響を専用E2Eで確認した。
- 管理画面はログイン後にメーカーの一覧、詳細、編集画面を読み取り専用で巡回し、公開アプリが混入しないことを確認した。

## 検証結果

| 検証 | 結果 |
|---|---|
| `npx tsc --noEmit` | 成功 |
| `npm run build` | 成功。36 modules、JS 57.71 kB（gzip 14.79 kB） |
| `npm run test:unit` | 5 files / 39 tests 成功 |
| Blade view clear/cache | 成功 |
| `php artisan test tests/Unit/ExampleTest.php` | 1 test 成功 |
| 公開Playwright E2E（1 worker） | 34 tests 成功 |
| Phase 6〜9専用E2E | 6 tests 成功（CLS・Long Task計測を含む） |

`tests/Feature/ExampleTest.php` は、既存テストDBに `timeline_events` テーブルがないため実行環境上で失敗する。今回の差分による失敗ではなく、リポジトリ規約に従ってマイグレーション操作は実行していない。

## 保留事項

`public/new_design2` は視覚比較用モックとして残している。不要になったとユーザーが確認した後に削除を検討する。
