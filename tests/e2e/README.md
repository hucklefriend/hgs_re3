# E2Eテスト (Playwright)

このディレクトリには、Playwrightを使用したE2E（End-to-End）テストが含まれています。

## セットアップ

### 初回のみ

```bash
# Playwrightブラウザのインストール（root権限が必要）
sudo npx playwright install --with-deps chromium
```

## テストの実行

```bash
# すべてのテストを実行
npm run test:e2e

# UIモードでテストを実行（インタラクティブ）
npm run test:e2e:ui

# デバッグモードでテストを実行
npm run test:e2e:debug

# テストレポートを表示
npm run test:e2e:report
```

## テストの書き方

`tests/e2e/`ディレクトリ内に`*.spec.ts`ファイルを作成します。

```typescript
import { test, expect } from '@playwright/test';

test('テストの説明', async ({ page }) =>
{
  // baseURLのトップページに遷移（''を使用）
  await page.goto('');
  
  // サブページに遷移する場合は相対パス
  await page.goto('about');
  
  // アサーション
  await expect(page).toHaveTitle(/期待するタイトル/);
});
```

### 重要: URL指定について

- **トップページ**: `page.goto('')` を使用
- **サブページ**: `page.goto('about')` のように相対パスを使用
- **注意**: `page.goto('/')` を使うと、baseURLのパス部分が無視されてしまいます

## 設定

テスト設定は`playwright.config.ts`で管理されています。

- **ベースURL**: `APP_URL`環境変数または`http://localhost:8000`
- **ブラウザ**: Chromium（Desktop Chrome設定）
- **スクリーンショット**: テスト失敗時のみ
- **ビデオ録画**: テスト失敗時のみ保存
- **トレース**: リトライ時に有効化

## 参考資料

- [Playwright公式ドキュメント](https://playwright.dev/)
- [Test API Reference](https://playwright.dev/docs/api/class-test)

