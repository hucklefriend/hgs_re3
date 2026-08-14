# 公開フロントエンド実装規約

## 基本構成

公開画面は Laravel Blade が完全な HTML 文書を返し、同一オリジンの GET リンクもブラウザー標準の文書遷移を行う。Ajax によるページ差し替え、History API による擬似遷移、ツリー深度管理は使用しない。

- エントリーポイント: `resources/ts/app.ts`
- 公開アプリルート: `resources/ts/site/public-site-app.ts`
- ページ内機能: `resources/ts/components/**`
- 共通レイアウト: `resources/views/layout.blade.php`
- 公開CSS: `resources/css/site/**`
- 管理画面は公開Viteエントリーポイントを読み込まず、変更対象外とする。

`PublicSiteApp` は `[data-public-app]` がある文書だけで起動する。各文書ロードにつき一度だけ共通グリッド、遷移演出、ページコントローラ、`ComponentManager` を開始し、`pagehide` で破棄する。

## Blade

Blade テンプレート内へ JavaScript を直接書かない。インタラクションは `resources/ts/components/` または `resources/ts/site/` に実装する。

ページ構造は次のどちらかを使う。

1. 専用ページ: `@section('site-content')` でページ全体の構造を定義する。
2. 標準ページ: `current-node-title`、`current-node-content`、`nodes` セクションを定義する。レイアウトが `.site-standard-page` の共通グリッドUIへ包む。

標準ページのセクション名と一部の `.node` クラスは既存Bladeとの互換用のHTML表現であり、旧ツリーランタイムを意味しない。新規画面では意味のある `article`、`section`、`nav`、見出し階層を優先する。

OGP の `og:image` と `twitter:image` は `url()` を使った絶対URLにする。ページ固有値はコントローラから `$ogpTitle`、`$ogpDescription`、`$ogpImage`、`$ogpUrl`、`$ogpType` として渡すか、`ogp` セクションを定義する。

## リンクとフォーム

内部リンクへ `data-hgn-scope` を付けない。通常の `href` だけで文書遷移できる状態を正とする。

- 同一オリジン GET: ブラウザー標準の文書遷移。対応可能なリンクだけ共通の退場演出を経由する。
- ハッシュ、ダウンロード、別タブ、外部オリジン、修飾キー付きクリック: ブラウザー標準動作を維持する。
- POST、PUT、PATCH、DELETE: 通常のフォーム送信を基本とする。
- リアクション、フォロー、お気に入り、下書き保存など即時応答が必要な操作だけ、専用コンポーネント内でAPI通信する。
- JavaScriptが無効でも主要本文、GETリンク、通常フォームを利用できるようにする。
- `rel="noreferrer"` は付けない。

ページネーションは `App\Support\Pager` と `common.pager` を使う。

```php
$items = SomeModel::query()->paginate(30);
$pager = new Pager(
    $items->currentPage(),
    $items->lastPage(),
    'Route.Name',
    ['param' => $value],
);
```

```blade
@include('common.pager', ['pager' => $pager])
```

## TypeScriptコンポーネント

ページ内コンポーネントは `Component` を継承し、コンストラクタで対象DOMを取得してイベントを登録する。登録したイベント、タイマー、Observerなどは必ず `dispose()` で解除する。

コントローラはBladeへ次の形式で初期化設定を渡す。

```php
return $this->tree(
    view('some.view', compact('items')),
    options: ['components' => ['ComponentName' => ['key' => 'value']]],
);
```

新しいコンポーネントは `ComponentManager` のマップへ登録する。Ajax再hydrateを前提にせず、完全な文書ロード直後のDOMだけを初期化する。通常フォームの `submit` を横取りして部分HTMLを差し替えない。

ページ全体に固有の演出や状態管理は `resources/ts/site/pages/` の `PageController` として実装し、`PublicSiteApp.createPageController()` で `data-page-kind` に対応付ける。

## CSSとアクセシビリティ

Bootstrapは公開画面で新規利用しない。TailwindCSSまたは `resources/css/site/` の自前CSSを使う。

- 色、グリッド寸法、モーション時間は `site/tokens.css` のカスタムプロパティを使う。
- 共通UIは `site/components.css`、標準ページは `site/pages/standard.css`、専用ページは `site/pages/*.css` に置く。
- セレクタは `.site-page` または `[data-public-app]` 以下へスコープし、管理画面へ影響させない。
- 主要操作はキーボードだけで完了可能にし、`:focus-visible` を消さない。
- `prefers-reduced-motion: reduce` では情報を隠さず、背景信号と大きな移動を停止または短縮する。
- モバイル幅で横スクロールを発生させない。
- TypeScriptまたはCSSを変更したら `npx tsc --noEmit` と `npm run build` を実行する。

## テスト

最低限、変更内容に応じて次を実行する。

```bash
npx tsc --noEmit
npm run test:unit
npm run build
php artisan view:clear
php artisan view:cache
npm run test:e2e
```

Playwrightは固定秒数の `waitForTimeout` を避け、`[data-public-app][data-page-ready="true"]`、URL、対象要素の表示、APIレスポンスなど意味のある完了条件を待つ。公開画面の変更時はデスクトップ、モバイル、低減モーション、JavaScript無効時の主要導線と、`/admin/login` の非影響を確認する。

