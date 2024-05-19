<?php

use App\Http\Controllers\HgnController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


use App\Http\Controllers\Admin;
// 管理用
Route::group(['prefix' => 'admin'], function () {
    // ログイン系
    Route::get('login', [Admin\AdminController::class, 'login'])->name('Admin.Login');
    Route::post('auth', [Admin\AdminController::class, 'auth'])->name('Admin.Auth');
    Route::post('logout', [Admin\AdminController::class, 'logout'])->name('Admin.Logout');

    // ここからは認証が必要
    Route::group(['middleware' => ['auth', 'can:admin', 'admin']], function () {
        // 管理トップ
        Route::get('', [Admin\AdminController::class, 'top'])->name('Admin');

        // マスター
        Route::group(['prefix' => 'master'], function () {
            // メーカー
            $prefix = 'maker';
            Route::group(['prefix' => 'maker'], function () use ($prefix) {
                $basename = 'Admin.MasterData.Maker';
                $class = Admin\MasterData\GameMakerController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // プラットフォーム
            $prefix = 'platform';
            Route::group(['prefix' => 'platform'], function () use ($prefix) {
                $basename = 'Admin.MasterData.Platform';
                $class = Admin\MasterData\GamePlatformController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // フランチャイズ
            $prefix = 'franchise';
            Route::group(['prefix' => 'franchise'], function () use ($prefix) {
                $basename = 'Admin.MasterData.Franchise';
                $class = Admin\MasterData\GameFranchiseController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/link_series', [$class, 'linkSeries'])->name("{$basename}.LinkSeries");
                Route::post('{' . $prefix . '}/link_series', [$class, 'syncSeries'])->name("{$basename}.SyncSeries");
                Route::get('{' . $prefix . '}/link_title', [$class, 'linkTitle'])->name("{$basename}.LinkTitle");
                Route::post('{' . $prefix . '}/link_title', [$class, 'syncTitle'])->name("{$basename}.SyncTitle");
                Route::get('{' . $prefix . '}/link_tree', [$class, 'linkTree'])->name("{$basename}.LinkTree");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // シリーズ
            $prefix = 'series';
            Route::group(['prefix' => $prefix], function () use ($prefix) {
                $basename = 'Admin.MasterData.Series';
                $class = Admin\MasterData\GameSeriesController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/link_franchise', [$class, 'linkFranchise'])->name("{$basename}.LinkFranchise");
                Route::post('{' . $prefix . '}/link_franchise', [$class, 'syncFranchise'])->name("{$basename}.SyncFranchise");
                Route::get('{' . $prefix . '}/link_title', [$class, 'linkTitle'])->name("{$basename}.LinkTitle");
                Route::post('{' . $prefix . '}/link_title', [$class, 'syncTitle'])->name("{$basename}.SyncTitle");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // タイトル
            $prefix = 'title';
            Route::group(['prefix' => $prefix], function () use ($prefix) {
                $basename = 'Admin.MasterData.Title';
                $class = Admin\MasterData\GameTitleController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/link_franchise', [$class, 'linkFranchise'])->name("{$basename}.LinkFranchise");
                Route::post('{' . $prefix . '}/link_franchise', [$class, 'syncFranchise'])->name("{$basename}.SyncFranchise");
                Route::get('{' . $prefix . '}/link_series', [$class, 'linkSeries'])->name("{$basename}.LinkSeries");
                Route::post('{' . $prefix . '}/link_series', [$class, 'syncSeries'])->name("{$basename}.SyncSeries");
                Route::get('{' . $prefix . '}/link_package', [$class, 'linkPackage'])->name("{$basename}.LinkPackage");
                Route::post('{' . $prefix . '}/link_package', [$class, 'syncPackage'])->name("{$basename}.SyncPackage");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // パッケージ
            $prefix = 'package';
            Route::group(['prefix' => $prefix], function () use ($prefix) {
                $basename = 'Admin.MasterData.Package';
                $class = Admin\MasterData\GamePackageController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/copy', [$class, 'copy'])->name("{$basename}.Copy");
                Route::post('{' . $prefix . '}/copy', [$class, 'makeCopy'])->name("{$basename}.MakeCopy");
                Route::get('{' . $prefix . '}/link_title', [$class, 'linkTitle'])->name("{$basename}.LinkTitle");
                Route::post('{' . $prefix . '}/link_title', [$class, 'syncTitle'])->name("{$basename}.SyncTitle");

                Route::get('{' . $prefix . '}/shop/add', [$class, 'addShop'])->name("{$basename}.AddShop");
                Route::post('{' . $prefix . '}/shop/add', [$class, 'storeShop'])->name("{$basename}.StoreShop");
                Route::get('{' . $prefix . '}/shop/{shop_id}/edit', [$class, 'editShop'])->name("{$basename}.EditShop");
                Route::put('{' . $prefix . '}/shop/{shop_id}/edit', [$class, 'updateShop'])->name("{$basename}.UpdateShop");
                Route::delete('{' . $prefix . '}/shop/{shop_id}', [$class, 'deleteShop'])->name("{$basename}.DeleteShop");

                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // 関連商品
            $prefix = 'related_product';
            Route::group(['prefix' => $prefix], function () use ($prefix) {
                $basename = 'Admin.MasterData.RelatedProduct';
                $class = Admin\MasterData\GameRelatedProductController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/link_title', [$class, 'linkTitle'])->name("{$basename}.LinkTitle");
                Route::post('{' . $prefix . '}/link_title', [$class, 'syncTitle'])->name("{$basename}.SyncTitle");
                Route::get('{' . $prefix . '}/link_media_mix', [$class, 'linkMediaMix'])->name("{$basename}.LinkMediaMix");
                Route::post('{' . $prefix . '}/link_media_mix', [$class, 'syncMediaMix'])->name("{$basename}.SyncMediaMix");
                Route::get('{' . $prefix . '}/shop/add', [$class, 'addShop'])->name("{$basename}.AddShop");
                Route::post('{' . $prefix . '}/shop/add', [$class, 'storeShop'])->name("{$basename}.StoreShop");
                Route::get('{' . $prefix . '}/shop/{shop_id}/edit', [$class, 'editShop'])->name("{$basename}.EditShop");
                Route::put('{' . $prefix . '}/shop/{shop_id}/edit', [$class, 'updateShop'])->name("{$basename}.UpdateShop");
                Route::delete('{' . $prefix . '}/shop/{shop_id}', [$class, 'deleteShop'])->name("{$basename}.DeleteShop");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // メディアミックス
            $prefix = 'media_mix';
            Route::group(['prefix' => $prefix], function () use ($prefix) {
                $basename = 'Admin.MasterData.MediaMix';
                $class = Admin\MasterData\GameMediaMixController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/link_related_product', [$class, 'linkRelatedProduct'])->name("{$basename}.LinkRelatedProduct");
                Route::post('{' . $prefix . '}/link_related_product', [$class, 'syncRelatedProduct'])->name("{$basename}.SyncRelatedProduct");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });
        });
    });
});


$class = HgnController::class;
Route::get('', [$class, 'index'])->name('HGN');
Route::get('privacy', [$class, 'privacyPolicy'])->name('PrivacyPolicy');

// マスター
Route::group(['prefix' => 'game'], function () {
    $class = \App\Http\Controllers\GameController::class;
    // ホラーゲームネットワーク
    Route::get('/', [$class, 'horrorGameNetwork'])->name('Game.HorrorGameNetwork');
    // フランチャイズ詳細ネットワーク
    Route::get('/franchise/{franchise}', [$class, 'franchiseDetailNetwork'])->name('Game.FranchiseDetailNetwork');
    // フランチャイズネットワーク
    Route::get('/franchise', [$class, 'franchiseNetwork'])->name('Game.FranchiseNetwork');
    // タイトルネットワーク
    Route::get('/title/{title}', [$class, 'titleNetwork'])->name('Game.TitleNetwork');
    // パッケージネットワーク
    Route::get('/package/{pkg}', [$class, 'packageNetwork'])->name('Game.PackageNetwork');

    // メーカー詳細ネットワーク
    Route::get('/maker/{maker}', [$class, 'makerDetailNetwork'])->name('Game.MakerDetailNetwork');
    // メーカーネットワーク
    Route::get('/maker', [$class, 'makerNetwork'])->name('Game.MakerNetwork');
    // プラットフォーム詳細ネットワーク
    Route::get('/platform/{platform}', [$class, 'platformDetailNetwork'])->name('Game.PlatformDetailNetwork');
    // プラットフォームネットワーク
    Route::get('/platform', [$class, 'platformNetwork'])->name('Game.PlatformNetwork');
});
