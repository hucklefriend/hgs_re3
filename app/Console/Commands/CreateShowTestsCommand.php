<?php

namespace App\Console\Commands;

use App\Models\GameFranchise;
use App\Models\GameMaker;
use App\Models\GamePlatform;
use App\Models\GameTitle;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class CreateShowTestsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:create-show-tests {type? : テストタイプ (basic/franchise/maker/platform/title)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Playwrightの基本的なページアクセステストを生成します';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->argument('type');
        
        // 引数が指定されていない場合は全て実行
        if (!$type) {
            $this->generateBasicPagesTest();
            $this->generateFranchisePagesTest();
            $this->generateMakerPagesTest();
            $this->generatePlatformPagesTest();
            $this->generateTitlePagesTest();
        } else {
            // 指定されたテストのみ実行
            switch (strtolower($type)) {
                case 'basic':
                    $this->generateBasicPagesTest();
                    break;
                case 'franchise':
                    $this->generateFranchisePagesTest();
                    break;
                case 'maker':
                    $this->generateMakerPagesTest();
                    break;
                case 'platform':
                    $this->generatePlatformPagesTest();
                    break;
                case 'title':
                    $this->generateTitlePagesTest();
                    break;
                default:
                    $this->error("無効なテストタイプです: {$type}");
                    $this->info('使用可能なタイプ: basic, franchise, maker, platform, title');
                    return Command::FAILURE;
            }
        }
        
        $this->info('✓ テスト生成が完了しました！');
        return Command::SUCCESS;
    }

    /**
     * basic-pages.spec.tsを生成
     */
    private function generateBasicPagesTest(): void
    {
        $targetRoutes = ['Root', 'PrivacyPolicy', 'About', 'Informations'];
        
        $this->info('ベーシックページのテストを生成しています...');
        
        // Laravelのroute()メソッドを使用してルート情報を抽出
        $routes = $this->extractRoutes($targetRoutes);
        
        if (empty($routes)) {
            $this->error('指定されたルートが見つかりませんでした。');
            return;
        }

        $this->info('以下のルートのテストを生成します:');
        foreach ($routes as $route) {
            $this->line("  - {$route['name']}: {$route['url']}");
        }

        // Playwrightテストファイルを生成
        $testContent = $this->generateTestFile($routes);
        
        // tests/e2e/basic-pages.spec.ts に保存
        $testFilePath = base_path('tests/e2e/basic-pages.spec.ts');
        File::put($testFilePath, $testContent);
        
        $this->info("テストファイルを生成しました: {$testFilePath}");
    }

    /**
     * franchise-pages.spec.tsを生成
     */
    private function generateFranchisePagesTest(): void
    {
        $this->info('フランチャイズページのテストを生成しています...');
        
        $routes = [];
        
        // Game.Franchises（一覧ページ、prefixなし）
        try {
            $url = route('Game.Franchises', [], false);
            $url = ltrim($url, '/');
            $routes[] = [
                'name' => 'Game.Franchises',
                'url' => $url,
            ];
        } catch (\Exception $e) {
            $this->warn("ルート 'Game.Franchises' が見つかりませんでした: {$e->getMessage()}");
        }
        
        // Game.FranchiseDetail（詳細ページ）
        $franchises = GameFranchise::all();
        
        if ($franchises->isEmpty()) {
            $this->warn('フランチャイズデータが見つかりませんでした。');
        } else {
            foreach ($franchises as $franchise) {
                try {
                    $url = route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key], false);
                    $url = ltrim($url, '/');
                    $routes[] = [
                        'name' => "Game.FranchiseDetail ({$franchise->name})",
                        'url' => $url,
                    ];
                } catch (\Exception $e) {
                    $this->warn("フランチャイズ '{$franchise->name}' のルート生成に失敗しました: {$e->getMessage()}");
                }
            }
        }
        
        if (empty($routes)) {
            $this->error('フランチャイズページのルートが見つかりませんでした。');
            return;
        }

        $this->info('以下のルートのテストを生成します:');
        foreach ($routes as $route) {
            $this->line("  - {$route['name']}: {$route['url']}");
        }

        // Playwrightテストファイルを生成
        $testContent = $this->generateFranchiseTestFile($routes);
        
        // tests/e2e/franchise-pages.spec.ts に保存
        $testFilePath = base_path('tests/e2e/franchise-pages.spec.ts');
        File::put($testFilePath, $testContent);
        
        $this->info("テストファイルを生成しました: {$testFilePath}");
    }

    /**
     * Laravelのroute()メソッドを使用してルート情報を抽出
     */
    private function extractRoutes(array $routeNames): array
    {
        $routes = [];

        foreach ($routeNames as $routeName) {
            try {
                // route()メソッドで相対URLを取得
                $url = route($routeName, [], false);
                
                // URLの先頭の/を削除（baseURLを有効にするため）
                $url = ltrim($url, '/');
                
                $routes[] = [
                    'name' => $routeName,
                    'url' => $url,
                ];
            } catch (\Exception $e) {
                // ルートが見つからない場合はスキップ
                $this->warn("ルート '{$routeName}' が見つかりませんでした: {$e->getMessage()}");
            }
        }

        return $routes;
    }

    /**
     * Playwrightテストファイルの内容を生成
     */
    private function generateTestFile(array $routes): string
    {
        $tests = [];
        
        foreach ($routes as $route) {
            $testName = $this->generateTestName($route['name']);
            $url = $route['url'];
            
            $tests[] = $this->generateTestCase($testName, $url, $route['name']);
        }

        $testsContent = implode("\n\n", $tests);

        return <<<TS
import { test, expect } from '@playwright/test';

/**
 * 基本ページのE2Eテスト
 * 各ページにアクセスしてJavaScriptエラーやコンソールエラーが発生しないことを確認
 */

{$testsContent}

TS;
    }

    /**
     * 個別のテストケースを生成
     */
    private function generateTestCase(string $testName, string $url, string $routeName): string
    {
        // シングルクォートをエスケープ
        $escapedTestName = str_replace("'", "\\'", $testName);
        
        return <<<TS
test('{$escapedTestName}', async ({ page }) =>
{
  // JavaScriptエラーを収集
  const jsErrors: Error[] = [];
  const consoleErrors: string[] = [];
  
  // ページエラー（未処理の例外など）を捕捉
  page.on('pageerror', (error) =>
  {
    jsErrors.push(error);
  });
  
  // コンソールエラーを捕捉
  page.on('console', (msg) =>
  {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('{$url}');
  
  // ページが正常に読み込まれたことを確認
  await expect(page.locator('body')).toBeVisible();
  
  // JavaScriptエラーがないことを確認
  expect(jsErrors, `JavaScriptエラーが発生しました: \${jsErrors.map(e => e.message).join(', ')}`).toHaveLength(0);
  expect(consoleErrors, `コンソールエラーが発生しました: \${consoleErrors.join(', ')}`).toHaveLength(0);
});
TS;
    }

    /**
     * ルート名から読みやすいテスト名を生成
     */
    private function generateTestName(string $routeName): string
    {
        $nameMap = [
            'Root' => 'トップページが正常に表示される',
            'PrivacyPolicy' => 'プライバシーポリシーページが正常に表示される',
            'About' => 'aboutページが正常に表示される',
            'Informations' => 'お知らせ一覧ページが正常に表示される',
        ];

        return $nameMap[$routeName] ?? "{$routeName}ページが正常に表示される";
    }

    /**
     * フランチャイズページ用のPlaywrightテストファイルの内容を生成
     */
    private function generateFranchiseTestFile(array $routes): string
    {
        $tests = [];
        
        foreach ($routes as $route) {
            $testName = $this->generateFranchiseTestName($route['name']);
            $url = $route['url'];
            
            $tests[] = $this->generateTestCase($testName, $url, $route['name']);
        }

        $testsContent = implode("\n\n", $tests);

        return <<<TS
import { test, expect } from '@playwright/test';

/**
 * フランチャイズページのE2Eテスト
 * 各ページにアクセスしてJavaScriptエラーやコンソールエラーが発生しないことを確認
 */

{$testsContent}

TS;
    }

    /**
     * フランチャイズページ用のテスト名を生成
     */
    private function generateFranchiseTestName(string $routeName): string
    {
        if ($routeName === 'Game.Franchises') {
            return 'フランチャイズ一覧ページが正常に表示される';
        }
        
        // Game.FranchiseDetail (フランチャイズ名) の場合
        if (preg_match('/Game\.FranchiseDetail \((.+)\)/', $routeName, $matches)) {
            return "フランチャイズ詳細ページ「{$matches[1]}」が正常に表示される";
        }
        
        return "{$routeName}ページが正常に表示される";
    }

    /**
     * maker-pages.spec.tsを生成
     */
    private function generateMakerPagesTest(): void
    {
        $this->info('メーカーページのテストを生成しています...');
        
        $routes = [];
        
        // Game.Maker（一覧ページ）
        try {
            $url = route('Game.Maker', [], false);
            $url = ltrim($url, '/');
            $routes[] = [
                'name' => 'Game.Maker',
                'url' => $url,
            ];
        } catch (\Exception $e) {
            $this->warn("ルート 'Game.Maker' が見つかりませんでした: {$e->getMessage()}");
        }
        
        // Game.MakerDetail（詳細ページ）
        $makers = GameMaker::all();
        
        if ($makers->isEmpty()) {
            $this->warn('メーカーデータが見つかりませんでした。');
        } else {
            foreach ($makers as $maker) {
                try {
                    $url = route('Game.MakerDetail', ['makerKey' => $maker->key], false);
                    $url = ltrim($url, '/');
                    $routes[] = [
                        'name' => "Game.MakerDetail ({$maker->name})",
                        'url' => $url,
                    ];
                } catch (\Exception $e) {
                    $this->warn("メーカー '{$maker->name}' のルート生成に失敗しました: {$e->getMessage()}");
                }
            }
        }
        
        if (empty($routes)) {
            $this->error('メーカーページのルートが見つかりませんでした。');
            return;
        }

        $this->info('以下のルートのテストを生成します:');
        foreach ($routes as $route) {
            $this->line("  - {$route['name']}: {$route['url']}");
        }

        // Playwrightテストファイルを生成
        $testContent = $this->generateMakerTestFile($routes);
        
        // tests/e2e/maker-pages.spec.ts に保存
        $testFilePath = base_path('tests/e2e/maker-pages.spec.ts');
        File::put($testFilePath, $testContent);
        
        $this->info("テストファイルを生成しました: {$testFilePath}");
    }

    /**
     * メーカーページ用のPlaywrightテストファイルの内容を生成
     */
    private function generateMakerTestFile(array $routes): string
    {
        $tests = [];
        
        foreach ($routes as $route) {
            $testName = $this->generateMakerTestName($route['name']);
            $url = $route['url'];
            
            $tests[] = $this->generateTestCase($testName, $url, $route['name']);
        }

        $testsContent = implode("\n\n", $tests);

        return <<<TS
import { test, expect } from '@playwright/test';

/**
 * メーカーページのE2Eテスト
 * 各ページにアクセスしてJavaScriptエラーやコンソールエラーが発生しないことを確認
 */

{$testsContent}

TS;
    }

    /**
     * メーカーページ用のテスト名を生成
     */
    private function generateMakerTestName(string $routeName): string
    {
        if ($routeName === 'Game.Maker') {
            return 'メーカー一覧ページが正常に表示される';
        }
        
        // Game.MakerDetail (メーカー名) の場合
        if (preg_match('/Game\.MakerDetail \((.+)\)/', $routeName, $matches)) {
            return "メーカー詳細ページ「{$matches[1]}」が正常に表示される";
        }
        
        return "{$routeName}ページが正常に表示される";
    }

    /**
     * platform-pages.spec.tsを生成
     */
    private function generatePlatformPagesTest(): void
    {
        $this->info('プラットフォームページのテストを生成しています...');
        
        $routes = [];
        
        // Game.Platform（一覧ページ）
        try {
            $url = route('Game.Platform', [], false);
            $url = ltrim($url, '/');
            $routes[] = [
                'name' => 'Game.Platform',
                'url' => $url,
            ];
        } catch (\Exception $e) {
            $this->warn("ルート 'Game.Platform' が見つかりませんでした: {$e->getMessage()}");
        }
        
        // Game.PlatformDetail（詳細ページ）
        $platforms = GamePlatform::all();
        
        if ($platforms->isEmpty()) {
            $this->warn('プラットフォームデータが見つかりませんでした。');
        } else {
            foreach ($platforms as $platform) {
                try {
                    $url = route('Game.PlatformDetail', ['platformKey' => $platform->key], false);
                    $url = ltrim($url, '/');
                    $routes[] = [
                        'name' => "Game.PlatformDetail ({$platform->name})",
                        'url' => $url,
                    ];
                } catch (\Exception $e) {
                    $this->warn("プラットフォーム '{$platform->name}' のルート生成に失敗しました: {$e->getMessage()}");
                }
            }
        }
        
        if (empty($routes)) {
            $this->error('プラットフォームページのルートが見つかりませんでした。');
            return;
        }

        $this->info('以下のルートのテストを生成します:');
        foreach ($routes as $route) {
            $this->line("  - {$route['name']}: {$route['url']}");
        }

        // Playwrightテストファイルを生成
        $testContent = $this->generatePlatformTestFile($routes);
        
        // tests/e2e/platform-pages.spec.ts に保存
        $testFilePath = base_path('tests/e2e/platform-pages.spec.ts');
        File::put($testFilePath, $testContent);
        
        $this->info("テストファイルを生成しました: {$testFilePath}");
    }

    /**
     * プラットフォームページ用のPlaywrightテストファイルの内容を生成
     */
    private function generatePlatformTestFile(array $routes): string
    {
        $tests = [];
        
        foreach ($routes as $route) {
            $testName = $this->generatePlatformTestName($route['name']);
            $url = $route['url'];
            
            $tests[] = $this->generateTestCase($testName, $url, $route['name']);
        }

        $testsContent = implode("\n\n", $tests);

        return <<<TS
import { test, expect } from '@playwright/test';

/**
 * プラットフォームページのE2Eテスト
 * 各ページにアクセスしてJavaScriptエラーやコンソールエラーが発生しないことを確認
 */

{$testsContent}

TS;
    }

    /**
     * プラットフォームページ用のテスト名を生成
     */
    private function generatePlatformTestName(string $routeName): string
    {
        if ($routeName === 'Game.Platform') {
            return 'プラットフォーム一覧ページが正常に表示される';
        }
        
        // Game.PlatformDetail (プラットフォーム名) の場合
        if (preg_match('/Game\.PlatformDetail \((.+)\)/', $routeName, $matches)) {
            return "プラットフォーム詳細ページ「{$matches[1]}」が正常に表示される";
        }
        
        return "{$routeName}ページが正常に表示される";
    }

    /**
     * title-pages.spec.tsを生成
     */
    private function generateTitlePagesTest(): void
    {
        $this->info('タイトルページのテストを生成しています...');
        
        $routes = [];
        
        // Game.TitleDetail（詳細ページのみ）
        $titles = GameTitle::all();
        
        if ($titles->isEmpty()) {
            $this->warn('タイトルデータが見つかりませんでした。');
        } else {
            foreach ($titles as $title) {
                try {
                    $url = route('Game.TitleDetail', ['titleKey' => $title->key], false);
                    $url = ltrim($url, '/');
                    $routes[] = [
                        'name' => "Game.TitleDetail ({$title->name})",
                        'url' => $url,
                    ];
                } catch (\Exception $e) {
                    $this->warn("タイトル '{$title->name}' のルート生成に失敗しました: {$e->getMessage()}");
                }
            }
        }
        
        if (empty($routes)) {
            $this->error('タイトルページのルートが見つかりませんでした。');
            return;
        }

        $this->info('以下のルートのテストを生成します:');
        foreach ($routes as $route) {
            $this->line("  - {$route['name']}: {$route['url']}");
        }

        // Playwrightテストファイルを生成
        $testContent = $this->generateTitleTestFile($routes);
        
        // tests/e2e/title-pages.spec.ts に保存
        $testFilePath = base_path('tests/e2e/title-pages.spec.ts');
        File::put($testFilePath, $testContent);
        
        $this->info("テストファイルを生成しました: {$testFilePath}");
    }

    /**
     * タイトルページ用のPlaywrightテストファイルの内容を生成
     */
    private function generateTitleTestFile(array $routes): string
    {
        $tests = [];
        
        foreach ($routes as $route) {
            $testName = $this->generateTitleTestName($route['name']);
            $url = $route['url'];
            
            $tests[] = $this->generateTestCase($testName, $url, $route['name']);
        }

        $testsContent = implode("\n\n", $tests);

        return <<<TS
import { test, expect } from '@playwright/test';

/**
 * タイトルページのE2Eテスト
 * 各ページにアクセスしてJavaScriptエラーやコンソールエラーが発生しないことを確認
 */

{$testsContent}

TS;
    }

    /**
     * タイトルページ用のテスト名を生成
     */
    private function generateTitleTestName(string $routeName): string
    {
        // Game.TitleDetail (タイトル名) の場合
        if (preg_match('/Game\.TitleDetail \((.+)\)/', $routeName, $matches)) {
            return "タイトル詳細ページ「{$matches[1]}」が正常に表示される";
        }
        
        return "{$routeName}ページが正常に表示される";
    }
}

