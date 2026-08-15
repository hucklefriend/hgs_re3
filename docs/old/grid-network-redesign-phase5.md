# グリッドネットワークデザイン Phase 5 実施記録

## 1. 実施結果

2026-08-14 にトップ、ホラーゲームラインナップ、タイトル詳細の主要3画面を public/new_design2 の視覚・操作モデルへ移行した。

3画面はLaravelの実データをBladeでサーバーサイドレンダリングし、検索、ページネーション、認証状態、お気に入り、怖さメーター、レビュー、パッケージ、SEOメタ情報を維持する。ページ遷移はPhase 4の通常全文書遷移と接続演出を継続し、HTMLの部分取得やAjaxナビゲーションは追加していない。

管理画面のBlade、コントローラー、ルート、アセットには変更を加えていない。マイグレーション操作も実行していない。

## 2. 共通レイアウトと移行境界

resources/views/layout.blade.php に site-content セクションを追加した。

- 移行済み3画面はページ固有の全幅グリッドレイアウトを描画する。
- 未移行の公開画面は従来の current-node / nodes 構造をそのまま描画する。
- bodyの data-public-app、data-page-kind、data-page-ready、ヘッダー、背景グリッド、フッターは共通のまま維持する。
- resources/ts/app.ts は .site-page を持つ移行済み画面で旧 HgnTree を起動せず、未移行画面だけ互換起動する。

## 3. トップページ

resources/views/root.blade.php をタイトル画面型の構成へ置き換えた。

- 二段ロゴと共通ヘッダーの下に、タイトルコピーと4項目のメインメニューを配置した。
- メニューはラインナップ、プラットフォーム、新着タイムライン、レビューの実ルートへ接続した。
- 下部の新着欄は TimelineEventService::fetchForRoot() の実データをイベント種別ごとの表示へ変換する。
- RSS記事、レビュー、タイトル更新、お知らせは、それぞれ対応する実URLへ接続する。
- 認証状態に応じ、ログイン・登録またはマイノード・ログアウトを表示する。

## 4. ラインナップ

resources/views/game/lineup.blade.php をゲーム設定画面風の検索コンソールへ置き換えた。

- タイトル検索と詳細条件を ConsoleTabs で切り替える。
- 既存のGETパラメーター、プラットフォーム、メーカー候補、怖さ範囲、発売年範囲、リセットを維持する。
- 詳細条件が指定された再表示では、詳細条件パネルを初期選択する。
- フランチャイズ、シリーズ、タイトルの実データを検索結果ノードとして表示する。
- Pager による通常GETページネーションを維持する。
- LineupSearch によるメーカー候補取得だけをページ内API通信として維持する。

## 5. タイトル詳細

resources/views/game/title_detail.blade.php をヒーローと情報セクションの構成へ置き換えた。

- OGP画像または代替ビジュアル、作品名、説明、発売日、プラットフォーム、フランチャイズを実データで表示する。
- タイトル固有のOGP title、description、image、URL、article typeを明示する。
- ログイン中のお気に入り切替は既存 TitleDetailFavorite へ接続する。
- 怖さメーターの平均値、ラベル、コメント導線を表示する。
- レビュー統計と新着レビューを表示し、ネタバレ本文は一覧上で露出しない。
- パッケージグループ、機種、発売日、ショップリンクを表示する。
- シリーズ作品がある場合は関連エントリーとして表示する。
- SectionSpy で概要、怖さ、レビュー、パッケージの現在位置をページ内メニューへ反映する。

## 6. TypeScriptとCSS

ページ固有のライフサイクルを resources/ts/site/pages/ へ追加した。

- PageController / RevealingPageController
- HomePageController
- LineupPageController
- TitleDetailPageController
- ConsoleTabs
- SectionSpy

共通表示部品は resources/css/site/components.css、ページ固有規則は resources/css/site/pages/ の home.css、lineup.css、title-detail.css へ分離した。16/12/4列の既存グリッド変数を利用し、390px幅で横方向のオーバーフローがないことをE2Eで確認した。低減モーション時は表示要素を直ちに可視化する。

## 7. 検証結果

| 検証 | 結果 |
|---|---|
| npm run test:unit | 成功。5 files / 39 tests |
| npm run build | 成功。70 modules、CSS 95.47 kB、JS 133.63 kB |
| php artisan view:cache | 成功 |
| Phase 4ページ遷移Playwright | 成功。3 tests |
| Phase 5主要画面Playwright | 成功。3 tests |
| 実サーバー応答 | /、/game/lineup、/game/title/zero が200 |
| SEOメタ | 実タイトル名、説明、画像URLを確認 |
| モバイル | 390px幅でタイトル詳細の横オーバーフローなし |
| 管理領域差分 | 管理Blade、管理コントローラー、管理ルート、管理アセットに差分なし |

php artisan test 全体は実行時間上限を超えた。対象を絞った既存 ExampleTest は、テスト用スキーマに既存の timeline_events テーブルがないため500となった。これは今回のBlade・TypeScript・CSS変更より前にあるテストスキーマ不足であり、AGENTS.mdの規定に従いマイグレーション操作は実行していない。

アプリ内ブラウザによる手動表示確認は、ブラウザ制御環境のサンドボックス初期化エラーにより利用できなかったため、ローカルHTTP応答とChromium Playwrightで代替した。

## 8. Phase 5 完了チェック

- [x] トップページをタイトル画面型へ移行し、下部へ実データの新着情報を配置した。
- [x] ラインナップを検索コンソール型へ移行した。
- [x] タイトル詳細を作品情報、評価、レビュー、パッケージ構成へ移行した。
- [x] public/new_design2 の視覚と操作感をBlade、CSS、TypeScriptへ移植した。
- [x] 実データ、検索条件、ページネーション、認証状態、レビュー、お気に入りを接続した。
- [x] デスクトップとスマートフォンで主要操作をE2E確認した。
- [x] SEOメタ情報とサーバー描画本文を維持した。
- [x] Phase 4の通常全文書遷移と接続演出を維持した。
- [x] 未移行画面と管理画面の互換境界を維持した。
