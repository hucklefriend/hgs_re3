# グリッドネットワークデザイン Phase 1 実施記録

## 1. 実施結果

2026-08-13 に公開画面の新しい起動・ライフサイクル基盤を追加した。Phase 1 の範囲では見た目と Ajax ナビゲーションを担う旧 `HgnTree` を互換層として残し、ページ内コンポーネントの初回初期化だけを `PublicSiteApp` へ移管した。

管理レイアウトと管理ログインには公開用 Vite エントリーを追加していない。公開 bundle が誤って読み込まれた場合も、`[data-public-app]` が存在しなければ起動しない。

## 2. 追加した基盤

### 2.1 TypeScript

| ファイル | 役割 |
|---|---|
| `resources/ts/site/public-site-app.ts` | 公開画面の構成ルート。初回コンポーネント初期化、`data-page-ready`、破棄を管理 |
| `resources/ts/site/core/disposable.ts` | 共通の `dispose()` 契約 |
| `resources/ts/app.ts` | `[data-public-app]` の存在確認後に新基盤を一度だけ起動 |
| `resources/ts/component-manager.ts` | 全文書ロード用の `initializeDocument()` を追加 |

初回起動順は次のとおり。

1. `load` 後に `app.ts` が `[data-public-app]` を探索する。
2. `PublicSiteApp` が `window.components` を一度だけ初期化して空にする。
3. `data-page-ready="true"` を設定する。
4. Phase 4 までの互換層として `HgnTree` を起動する。

`CurrentNode.start()` から初回コンポーネント初期化を削除したため、同じフォームやボタンへイベントが二重登録されない。旧 Ajax 差し替え後の `initializeComponents()` と `ScopedHydrator` は、移行中の互換性のため残している。

`pagehide` では通常離脱時だけ `PublicSiteApp.dispose()` を実行する。BFCache に保存される場合はインスタンスとイベントを保持し、復元時の二重初期化を避ける。

### 2.2 Blade

`resources/views/layout.blade.php` の公開 `<body>` に次を追加した。

- `data-public-app`
- `data-page-kind`: ルート名を kebab-case に変換したページ種別
- `data-page-ready="false"`: `PublicSiteApp.start()` 後に `true`

JavaScript が無効でも本文は隠さない。`data-page-ready` は状態通知であり、本文表示の必須条件にはしない。

### 2.3 CSS

| ファイル | 役割 |
|---|---|
| `resources/css/site/tokens.css` | 色、フォーカス、モーション、16/12/4 列の基礎トークン |
| `resources/css/site/base.css` | 公開ルートに限定した box-sizing、フォーカス、低減モーション |
| `resources/css/site/layout.css` | 公開レイアウトの基礎レイヤー |

すべて `[data-public-app]` 配下へスコープした。Phase 2 でグリッドとヘッダーが参照する値を先に定義したが、Phase 1 では既存レイアウト寸法を変更していない。

## 3. 旧実装との境界

- `PublicSiteApp` は `HgnTree` を import しない。
- `app.ts` が新基盤と旧互換層を別々に起動する。
- 初回コンポーネントの所有者は `PublicSiteApp` とする。
- Ajax 差し替え時の所有者は、Phase 4 で通常遷移へ切り替えるまで旧 `CurrentNode` とする。
- `resources/ts/hgn-tree.ts`、旧 navigation、node、depth、animation は削除していない。

## 4. 検証結果

| 検証 | 結果 |
|---|---|
| `npx tsc --noEmit` | 成功 |
| `npm run build` | 成功。50 modules、CSS 48.24 kB、JS 103.71 kB |
| `php artisan test` | Phase 0 と同じ 11 passed / 32 failed、196 assertions。新規失敗なし |
| 公開 Chromium スモーク | `/`、`/game/lineup`、`/game/title/identity-v`、`/login` が HTTP 200、`data-page-ready=true`、ページ例外なし |
| コンポーネントスモーク | ラインナップの詳細検索が1クリックで開き、ラベルが「閉じる」へ変化 |
| 管理 Chromium スモーク | `/admin/login`、認証後の `/admin`、`/admin/manage/contact` に `[data-public-app]` と公開 bundle がなく、代表一覧は HTTP 200 で表を表示 |
| 既存基本ページ E2E | 4件中、privacy/about/info の3件成功。トップは並列時に `networkidle` で1回タイムアウトしたが、単独再実行は成功 |

PHP の32失敗は Phase 0 で記録したテスト DB の未反映スキーマ、外部通知認証、旧スキーマ期待値による既存失敗である。マイグレーション操作は実行していない。

## 5. Phase 1 完了チェック

- [x] `site` ディレクトリと `PublicSiteApp` を追加した。
- [x] 公開画面だけにルート属性とデザイントークンを追加した。
- [x] `app.ts` は公開ルートが存在するときだけ起動する。
- [x] 初回コンポーネント初期化を全文書ロードの所有者へ移した。
- [x] 旧ツリーを削除せず、新基盤から直接参照しない境界を作った。
- [x] 公開画面と管理画面が同じ build で共存する。
- [x] 管理画面で新 TypeScript が起動しないことを確認した。
- [x] 型検査、build、PHP 基準比較、公開・管理スモークを実行した。

純粋ロジックの追加がないため、Phase 1 では Vitest を追加していない。`GridMetrics` を実装する Phase 2 で単体テスト環境の追加を再判断する。
