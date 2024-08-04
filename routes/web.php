<?php

use App\Http\Controllers\HgnController;
use Illuminate\Support\Facades\App;
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

if (App::environment('production')) {
    Route::get('', [HgnController::class, 'entrance'])->name('Entrance');
    return;
}



use App\Http\Controllers\Admin;
// 管理用
Route::group(['prefix' => 'admin'], function () {
    // ログイン系
    Route::get('login', [Admin\AdminController::class, 'login'])->name('Admin.Login');
    Route::post('auth', [Admin\AdminController::class, 'auth'])->name('Admin.Auth');
    Route::get('logout', [Admin\AdminController::class, 'logout'])->name('Admin.Logout');

    // ここからは認証が必要
    Route::middleware (['admin', 'auth:admin'])->group(function () {
        // 管理トップ
        Route::get('', [Admin\AdminController::class, 'top'])->name('Admin.Dashboard');

        // 運営
        Route::group(['prefix' => 'manage'], function () {
            // お知らせ
            Route::resource('information', Admin\Manage\InformationController::class)->names([
                'index'   => 'Admin.Manage.Information',
                'create'  => 'Admin.Manage.Information.Create',
                'store'   => 'Admin.Manage.Information.Store',
                'show'    => 'Admin.Manage.Information.Show',
                'edit'    => 'Admin.Manage.Information.Edit',
                'update'  => 'Admin.Manage.Information.Update',
                'destroy' => 'Admin.Manage.Information.Destroy',
            ]);
        });

        // マスター
        Route::group(['prefix' => 'master'], function () {
            // メーカー
            $prefix = 'maker';
            Route::group(['prefix' => 'maker'], function () use ($prefix) {
                $basename = 'Admin.Game.Maker';
                $class = Admin\Game\GameMakerController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('edit_multi', [$class, 'editMulti'])->name("{$basename}.EditMulti");
                Route::put('edit_multi', [$class, 'updateMulti'])->name("{$basename}.UpdateMulti");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/link_package', [$class, 'linkPackage'])->name("{$basename}.LinkPackage");
                Route::post('{' . $prefix . '}/link_package', [$class, 'syncPackage'])->name("{$basename}.SyncPackage");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // プラットフォーム
            $prefix = 'platform';
            Route::group(['prefix' => 'platform'], function () use ($prefix) {
                $basename = 'Admin.Game.Platform';
                $class = Admin\Game\GamePlatformController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('edit_multi', [$class, 'editMulti'])->name("{$basename}.EditMulti");
                Route::put('edit_multi', [$class, 'updateMulti'])->name("{$basename}.UpdateMulti");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
                Route::get('{' . $prefix . '}/link_related_product', [$class, 'linkRelatedProduct'])->name("{$basename}.LinkRelatedProduct");
                Route::post('{' . $prefix . '}/link_related_product', [$class, 'syncRelatedProduct'])->name("{$basename}.SyncRelatedProduct");
            });

            // フランチャイズ
            $prefix = 'franchise';
            Route::group(['prefix' => 'franchise'], function () use ($prefix) {
                $basename = 'Admin.Game.Franchise';
                $class = Admin\Game\GameFranchiseController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('edit_multi', [$class, 'editMulti'])->name("{$basename}.EditMulti");
                Route::put('edit_multi', [$class, 'updateMulti'])->name("{$basename}.UpdateMulti");
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
                $basename = 'Admin.Game.Series';
                $class = Admin\Game\GameSeriesController::class;
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
                $basename = 'Admin.Game.Title';
                $class = Admin\Game\GameTitleController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('edit_multi', [$class, 'editMulti'])->name("{$basename}.EditMulti");
                Route::put('edit_multi', [$class, 'updateMulti'])->name("{$basename}.UpdateMulti");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/link_franchise', [$class, 'linkFranchise'])->name("{$basename}.LinkFranchise");
                Route::post('{' . $prefix . '}/link_franchise', [$class, 'syncFranchise'])->name("{$basename}.SyncFranchise");
                Route::get('{' . $prefix . '}/link_series', [$class, 'linkSeries'])->name("{$basename}.LinkSeries");
                Route::post('{' . $prefix . '}/link_series', [$class, 'syncSeries'])->name("{$basename}.SyncSeries");
                Route::get('{' . $prefix . '}/link_package_group', [$class, 'linkPackageGroup'])->name("{$basename}.LinkPackageGroup");
                Route::post('{' . $prefix . '}/link_package_group', [$class, 'syncPackageGroup'])->name("{$basename}.SyncPackageGroup");
                Route::get('{' . $prefix . '}/link_package', [$class, 'linkPackage'])->name("{$basename}.LinkPackage");
                Route::post('{' . $prefix . '}/link_package', [$class, 'syncPackage'])->name("{$basename}.SyncPackage");
                Route::get('{' . $prefix . '}/edit_package_multi', [$class, 'editPackageMulti'])->name("{$basename}.EditPackageMulti");
                Route::put('{' . $prefix . '}/edit_package_multi', [$class, 'updatePackageMulti'])->name("{$basename}.UpdatePackageMulti");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // パッケージグループ
            $prefix = 'package_group';
            Route::group(['prefix' => $prefix], function () use ($prefix) {
                $basename = 'Admin.Game.PackageGroup';
                $class = Admin\Game\GamePackageGroupController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/link_package', [$class, 'linkPackage'])->name("{$basename}.LinkPackage");
                Route::post('{' . $prefix . '}/link_package', [$class, 'syncPackage'])->name("{$basename}.SyncPackage");
                Route::get('{' . $prefix . '}/link_title', [$class, 'linkTitle'])->name("{$basename}.LinkTitle");
                Route::post('{' . $prefix . '}/link_title', [$class, 'syncTitle'])->name("{$basename}.SyncTitle");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // パッケージ
            $prefix = 'package';
            Route::group(['prefix' => $prefix], function () use ($prefix) {
                $basename = 'Admin.Game.Package';
                $class = Admin\Game\GamePackageController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('edit_multi', [$class, 'editMulti'])->name("{$basename}.EditMulti");
                Route::put('edit_multi', [$class, 'updateMulti'])->name("{$basename}.UpdateMulti");
                Route::get('edit_shop_multi', [$class, 'editShopMulti'])->name("{$basename}.EditShopMulti");
                Route::put('edit_shop_multi', [$class, 'updateShopMulti'])->name("{$basename}.UpdateShopMulti");

                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/copy', [$class, 'copy'])->name("{$basename}.Copy");
                Route::post('{' . $prefix . '}/copy', [$class, 'makeCopy'])->name("{$basename}.MakeCopy");
                Route::get('{' . $prefix . '}/link_maker', [$class, 'linkMaker'])->name("{$basename}.LinkMaker");
                Route::post('{' . $prefix . '}/link_maker', [$class, 'syncMaker'])->name("{$basename}.SyncMaker");
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
                $basename = 'Admin.Game.RelatedProduct';
                $class = Admin\Game\GameRelatedProductController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('edit_multi', [$class, 'editMulti'])->name("{$basename}.EditMulti");
                Route::put('edit_multi', [$class, 'updateMulti'])->name("{$basename}.UpdateMulti");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/link_platform', [$class, 'linkPlatform'])->name("{$basename}.LinkPlatform");
                Route::post('{' . $prefix . '}/link_platform', [$class, 'syncPlatform'])->name("{$basename}.SyncPlatform");
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
                $basename = 'Admin.Game.MediaMix';
                $class = Admin\Game\GameMediaMixController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('edit_multi', [$class, 'editMulti'])->name("{$basename}.EditMulti");
                Route::put('edit_multi', [$class, 'updateMulti'])->name("{$basename}.UpdateMulti");
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
Route::get('', [$class, 'entrance'])->name('Entrance');
Route::get('privacy', [$class, 'privacyPolicy'])->name('PrivacyPolicy');
Route::get('about', [$class, 'about'])->name('About');
Route::get('/info', [HgnController::class, 'infoNetwork'])->name('InfoNetwork');
Route::get('/info/{info}', [HgnController::class, 'info'])->name('Info');

// ゲームネットワーク
Route::group(['prefix' => 'game'], function () {
    $class = \App\Http\Controllers\GameController::class;
    // ホラーゲームネットワーク
    Route::get('/', [$class, 'horrorGameNetwork'])->name('Game.HorrorGameNetwork');
    // フランチャイズ詳細ネットワーク
    Route::get('/franchise/{franchiseKey}', [$class, 'franchiseDetailNetwork'])->name('Game.FranchiseDetailNetwork');
    // フランチャイズネットワーク
    Route::get('/franchise-network/{prefix?}', [$class, 'franchiseNetwork'])->name('Game.FranchiseNetwork');
    // タイトル詳細ネットワーク
    Route::get('/title/{titleKey}', [$class, 'titleDetailNetwork'])->name('Game.TitleDetailNetwork');

    // メーカー詳細ネットワーク
    Route::get('/maker/{makerKey}', [$class, 'makerDetailNetwork'])->name('Game.MakerDetailNetwork');
    // メーカーネットワーク
    Route::get('/maker-network', [$class, 'makerNetwork'])->name('Game.MakerNetwork');
    // プラットフォーム詳細ネットワーク
    Route::get('/platform/{platformKey}', [$class, 'platformDetailNetwork'])->name('Game.PlatformDetailNetwork');
    // プラットフォームネットワーク
    Route::get('/platform-network', [$class, 'platformNetwork'])->name('Game.PlatformNetwork');
    // メディアミックス詳細ネットワーク
    Route::get('/media-mix/{mediaMixKey}', [$class, 'mediaMixDetailNetwork'])->name('Game.MediaMixDetailNetwork');
});
