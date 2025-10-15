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

Route::get('/', [HgnController::class, 'root'])->name('Root');
if (App::environment('production')) {
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
                $class = Admin\Game\MakerController::class;
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
                $class = Admin\Game\PlatformController::class;
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
                $class = Admin\Game\FranchiseController::class;
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
                $class = Admin\Game\SeriesController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/link_title', [$class, 'linkTitle'])->name("{$basename}.LinkTitle");
                Route::post('{' . $prefix . '}/link_title', [$class, 'syncTitle'])->name("{$basename}.SyncTitle");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
                Route::get('{' . $prefix . '}/edit-net', [$class, 'editNetwork'])->name("{$basename}.EditNetwork");
                Route::post('{' . $prefix . '}/edit-net', [$class, 'saveNetwork'])->name("{$basename}.SaveNetwork");
            });

            // タイトル
            $prefix = 'title';
            Route::group(['prefix' => $prefix], function () use ($prefix) {
                $basename = 'Admin.Game.Title';
                $class = Admin\Game\TitleController::class;
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
                Route::get('{' . $prefix . '}/edit_package_group_multi', [$class, 'editPackageGroupMulti'])->name("{$basename}.EditPackageGroupMulti");
                Route::put('{' . $prefix . '}/edit_package_group_multi', [$class, 'updatePackageGroupMulti'])->name("{$basename}.UpdatePackageGroupMulti");
                Route::get('{' . $prefix . '}/edit_package_multi', [$class, 'editPackageMulti'])->name("{$basename}.EditPackageMulti");
                Route::put('{' . $prefix . '}/edit_package_multi', [$class, 'updatePackageMulti'])->name("{$basename}.UpdatePackageMulti");
                Route::get('{' . $prefix . '}/link_related_product', [$class, 'linkRelatedProduct'])->name("{$basename}.LinkRelatedProduct");
                Route::post('{' . $prefix . '}/link_related_product', [$class, 'syncRelatedProduct'])->name("{$basename}.SyncRelatedProduct");
                Route::get('{' . $prefix . '}/link_media_mix', [$class, 'linkMediaMix'])->name("{$basename}.LinkMediaMix");
                Route::post('{' . $prefix . '}/link_media_mix', [$class, 'syncMediaMix'])->name("{$basename}.SyncMediaMix");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // パッケージグループ
            $prefix = 'package_group';
            Route::group(['prefix' => $prefix], function () use ($prefix) {
                $basename = 'Admin.Game.PackageGroup';
                $class = Admin\Game\PackageGroupController::class;
                $prefix = 'packageGroup';
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/link_package', [$class, 'linkPackage'])->name("{$basename}.LinkPackage");
                Route::post('{' . $prefix . '}/link_package', [$class, 'syncPackage'])->name("{$basename}.SyncPackage");
                Route::get('{' . $prefix . '}/link_title', [$class, 'linkTitle'])->name("{$basename}.LinkTitle");
                Route::post('{' . $prefix . '}/link_title', [$class, 'syncTitle'])->name("{$basename}.SyncTitle");
                Route::get('{' . $prefix . '}/edit_package_multi', [$class, 'editPackageMulti'])->name("{$basename}.EditPackageMulti");
                Route::put('{' . $prefix . '}/update_package_multi', [$class, 'updatePackageMulti'])->name("{$basename}.UpdatePackageMulti");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // パッケージ
            $prefix = 'package';
            Route::group(['prefix' => $prefix], function () use ($prefix) {
                $basename = 'Admin.Game.Package';
                $class = Admin\Game\PackageController::class;
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
                Route::get('{' . $prefix . '}/link_package_group', [$class, 'linkPackageGroup'])->name("{$basename}.LinkPackageGroup");
                Route::post('{' . $prefix . '}/link_package_group', [$class, 'syncPackageGroup'])->name("{$basename}.SyncPackageGroup");

                Route::get('{' . $prefix . '}/shop/add', [$class, 'addShop'])->name("{$basename}.AddShop");
                Route::post('{' . $prefix . '}/shop/add', [$class, 'storeShop'])->name("{$basename}.StoreShop");
                Route::get('{' . $prefix . '}/shop/{shop_id}/edit', [$class, 'editShop'])->name("{$basename}.EditShop");
                Route::put('{' . $prefix . '}/shop/{shop_id}/edit', [$class, 'updateShop'])->name("{$basename}.UpdateShop");
                Route::delete('{' . $prefix . '}/shop/{shop_id}', [$class, 'deleteShop'])->name("{$basename}.DeleteShop");

                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // 関連商品
            $prefix = 'relatedProduct';
            Route::group(['prefix' => 'related_product'], function () use ($prefix) {
                $basename = 'Admin.Game.RelatedProduct';
                $class = Admin\Game\RelatedProductController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('edit_multi', [$class, 'editMulti'])->name("{$basename}.EditMulti");
                Route::put('edit_multi', [$class, 'updateMulti'])->name("{$basename}.UpdateMulti");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/copy', [$class, 'copy'])->name("{$basename}.Copy");
                Route::post('{' . $prefix . '}/copy', [$class, 'makeCopy'])->name("{$basename}.MakeCopy");
                Route::get('{' . $prefix . '}/link_platform', [$class, 'linkPlatform'])->name("{$basename}.LinkPlatform");
                Route::post('{' . $prefix . '}/link_platform', [$class, 'syncPlatform'])->name("{$basename}.SyncPlatform");
                Route::get('{' . $prefix . '}/link_title', [$class, 'linkTitle'])->name("{$basename}.LinkTitle");
                Route::post('{' . $prefix . '}/link_title', [$class, 'syncTitle'])->name("{$basename}.SyncTitle");
                Route::get('{' . $prefix . '}/link_media_mix', [$class, 'linkMediaMix'])->name("{$basename}.LinkMediaMix");
                Route::post('{' . $prefix . '}/link_media_mix', [$class, 'syncMediaMix'])->name("{$basename}.SyncMediaMix");
                Route::get('{' . $prefix . '}/shop/add', [$class, 'addShop'])->name("{$basename}.AddShop");
                Route::post('{' . $prefix . '}/shop/add', [$class, 'storeShop'])->name("{$basename}.StoreShop");
                Route::get('{' . $prefix . '}/shop/{shopId}/edit', [$class, 'editShop'])->name("{$basename}.EditShop");
                Route::put('{' . $prefix . '}/shop/{shopId}/edit', [$class, 'updateShop'])->name("{$basename}.UpdateShop");
                Route::delete('{' . $prefix . '}/shop/{shopId}', [$class, 'deleteShop'])->name("{$basename}.DeleteShop");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // メディアミックスグループ
            $prefix = 'media_mix_group';
            Route::group(['prefix' => $prefix], function () use ($prefix) {
                $basename = 'Admin.Game.MediaMixGroup';
                $class = Admin\Game\MediaMixGroupController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/link_media_mix', [$class, 'linkMediaMix'])->name("{$basename}.LinkMediaMix");
                Route::post('{' . $prefix . '}/link_media_mix', [$class, 'syncMediaMix'])->name("{$basename}.SyncMediaMix");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });

            // メディアミックス
            $prefix = 'media_mix';
            Route::group(['prefix' => $prefix], function () use ($prefix) {
                $basename = 'Admin.Game.MediaMix';
                $class = Admin\Game\MediaMixController::class;
                Route::get('/', [$class, 'index'])->name($basename);
                Route::get('add', [$class, 'add'])->name("{$basename}.Add");
                Route::post('add', [$class, 'store'])->name("{$basename}.Store");
                Route::get('edit_multi', [$class, 'editMulti'])->name("{$basename}.EditMulti");
                Route::put('edit_multi', [$class, 'updateMulti'])->name("{$basename}.UpdateMulti");
                Route::get('{' . $prefix . '}/edit', [$class, 'edit'])->name("{$basename}.Edit");
                Route::put('{' . $prefix . '}/edit', [$class, 'update'])->name("{$basename}.Update");
                Route::get('{' . $prefix . '}/copy', [$class, 'copy'])->name("{$basename}.Copy");
                Route::get('{' . $prefix . '}/link_media_mix_group', [$class, 'linkMediaMixGroup'])->name("{$basename}.LinkMediaMixGroup");
                Route::post('{' . $prefix . '}/link_media_mix_group', [$class, 'syncMediaMixGroup'])->name("{$basename}.SyncMediaMixGroup");
                Route::get('{' . $prefix . '}/link_related_product', [$class, 'linkRelatedProduct'])->name("{$basename}.LinkRelatedProduct");
                Route::post('{' . $prefix . '}/link_related_product', [$class, 'syncRelatedProduct'])->name("{$basename}.SyncRelatedProduct");
                Route::get('{' . $prefix . '}/link_title', [$class, 'linkTitle'])->name("{$basename}.LinkTitle");
                Route::post('{' . $prefix . '}/link_title', [$class, 'syncTitle'])->name("{$basename}.SyncTitle");
                Route::get('{' . $prefix . '}', [$class, 'detail'])->name("{$basename}.Detail");
                Route::delete('{' . $prefix . '}', [$class, 'delete'])->name("{$basename}.Delete");
            });
        });
    });
});


$class = HgnController::class;
Route::get('privacy', [$class, 'privacyPolicy'])->name('PrivacyPolicy');
Route::get('about', [$class, 'about'])->name('About');
Route::get('/info', [HgnController::class, 'infomations'])->name('Informations');
Route::get('/info/{info}', [HgnController::class, 'infomationDetail'])->name('InformationDetail');

// ゲーム
Route::group(['prefix' => 'game'], function () {
    $class = \App\Http\Controllers\GameController::class;
    // ホラーゲーム検索
    Route::get('/search', [$class, 'search'])->name('Game.Search');
    // フランチャイズ詳細
    Route::get('/franchise/{franchiseKey}', [$class, 'franchiseDetail'])->name('Game.FranchiseDetail');
    // フランチャイズ
    Route::get('/franchises/{prefix?}', [$class, 'franchises'])->name('Game.Franchises');
    // タイトル詳細
    Route::get('/title/{titleKey}', [$class, 'titleDetail'])->name('Game.TitleDetail');

    // メーカー詳細
    Route::get('/maker/{makerKey}', [$class, 'makerDetail'])->name('Game.MakerDetail');
    // メーカー
    Route::get('/maker', [$class, 'maker'])->name('Game.Maker');
    // プラットフォーム詳細
    Route::get('/platform/{platformKey}', [$class, 'platformDetail'])->name('Game.PlatformDetail');
    // プラットフォーム
    Route::get('/platform', [$class, 'platform'])->name('Game.Platform');
    // メディアミックス詳細
    Route::get('/media-mix/{mediaMixKey}', [$class, 'mediaMixDetail'])->name('Game.MediaMixDetail');
});
