# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Overview

HGN (Horror Game Network) is a community-driven horror game database and social platform at horrorgame.net. Built with Laravel 12 (PHP 8.3+) backend, Blade templating for server-side rendering, and a custom TypeScript frontend (no React/Vue — vanilla TS with a `PublicSiteApp` lifecycle root). UI is styled with TailwindCSS. The application UI is primarily in Japanese.

## Commands

### Development
```bash
npm install && php composer.phar install   # Install all dependencies
npm run dev                        # Start Vite dev server (HMR)
php artisan serve                  # Start Laravel dev server
```

### Build
```bash
npm run build                      # Production Vite build
```

### Testing
```bash
php artisan test                   # Run all PHP tests
php artisan test --filter=TestName # Run a single PHP test

npm run test:e2e                   # Playwright E2E (Chromium)
npm run test:e2e:ui                # Playwright interactive UI
npm run test:stg                   # Run E2E against staging
npm run test:e2e:report            # View HTML test report
```

### Database
```bash
php artisan db:seed                # Seed database
php artisan tinker                 # Interactive REPL
```

`php artisan migrate` およびロールバック等のマイグレーション操作（`migrate:rollback`, `migrate:reset`, `migrate:refresh`, `migrate:fresh` 等）は**コマンドを提示するのみとし、実行はユーザーに委ねる**。

### Cache Generation
`php artisan view:cache` など、`storage/framework` または `bootstrap/cache` にキャッシュファイルを作成・再生成するコマンドは、Webサーバーとのグループ書き込み権限を維持するため、**同じシェル内で生成前に `umask 0002` を設定してから実行する**。

```bash
umask 0002
php artisan view:cache
```

## Architecture

### Backend (Laravel 12)
- **Routes:** `routes/web.php` (Blade views), `routes/api.php` (REST `/api/v1/*`)
- **Controllers:** Split into `Admin/`, `Api/`, and `User/` namespaces
- **Models:** 40+ Eloquent models for game data (`GameTitle`, `GameFranchise`, `GamePlatform`, etc.)
- **Auth:** Laravel Sanctum (PAT tokens) + GitHub OAuth2 via Socialite
- **Authorization:** Custom `UserRole` enum with `is_admin_user()` helper
- **Search:** Meilisearch via Laravel Scout
- **Helpers:** Global functions in `app/helpers.php` (e.g., `menu_active`, `is_admin_user`, synonym normalization)

### Frontend (TypeScript)
- Entry point: `resources/ts/app.ts`
- **No framework** — `PublicSiteApp` starts once per full document load; public GET navigation uses normal browser document transitions
- Page components live in `resources/ts/components/`; grid, navigation effects, and page controllers live in `resources/ts/site/`
- CSS: TailwindCSS in `resources/css/`, compiled via Vite

### Rust Tools (`/src/hgn_rust_tools`)
- 別リポジトリ（`/src/hgn_rust_tools`）に Rust 製のマイクロツール群がある
- **ogp-generator**: OGP画像をサーバーサイドで生成するバイナリ。Laravel の Queue Job から呼び出す
- 詳細は `docs/Codex/ogp-generator.md` を参照

### Branches & Deployment
- `main` → production (auto-deploys via GitHub Actions SSH)
- `develop` → staging (auto-deploys via GitHub Actions SSH)
- Feature branches merge into `develop`

## Feature Documentation

機能の実装詳細（使い方・クラス設計・追加手順など）は `docs/Codex/` 配下に機能ごとのファイルとして書く。AGENTS.md には書かない。

公開画面の文言を追加・変更する実装では、空状態を含む文章表現を統一するため `docs/Codex/public-copy-guidelines.md` を読むこと。

@docs/Codex/frontend-conventions.md
@docs/Codex/public-copy-guidelines.md
@docs/Codex/grid-network-design.md
@docs/Codex/discord-webhook.md
@docs/Codex/ogp-generator.md
@docs/Codex/artisan-commands.md

## Archived Documentation

`docs/old/` は旧実装の設計資料と履歴を保管するアーカイブである。ユーザーから明示的な指示がない限り、この配下のファイルを読んだり、検索・要約したり、実装判断の根拠として使用したりしない。

## Implementation Plans

未実装・実装途中の機能の設計資料は `docs/plan/` 配下に置く。

| 機能 | 資料 |
|---|---|
| タイムライン | `docs/plan/timeline.md` |

## Key Conventions
- 問題・不具合を修正した際は、完了報告で「何が原因だったか」と「どのように修正したか」を具体的に説明する。
- リンクの視覚表現は、外部リンクには右上を向いた矢印、内部リンクには接続線を用いる。
- ゲームパッケージのエディション名（`node_name`）は、プラットフォーム略称が前方に付く前提で命名されている。表示時は両者を同じ行で連結する（例: `PS` + `one books` → `PS one books`）。
- `app/Console/Commands/` にコマンドを追加・変更した場合、または `database/seeders/` にシーダーを追加・変更した場合は、`docs/Codex/artisan-commands.md` も合わせて更新する。
- 三項演算子の真の値・偽の値にはロジック処理や関数呼び出しを書かない。値や変数の参照は可。処理が必要な場合は if 文で書く。


- PSR-4 autoloading under the `App\` namespace
- Form validation via Laravel Form Requests (`app/Http/Requests/`)
- Game Master API uses Sanctum token abilities configured via `GAME_MASTER_API_TOKEN_ABILITY` env var
- Default database is SQLite (see `.env.example`); configurable for other drivers
