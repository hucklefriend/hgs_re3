@include ('admin.all_errors')
<table class="table admin-form-table" id="package-table">
    <tr>
        <th>名前</th>
        <td>
            <x-admin.input name="name" :model="$model" required maxlength="100" />
        </td>
    </tr>
    <tr>
        <th>略称</th>
        <td>
            <x-admin.input name="acronym" :model="$model" required maxlength="100" />
        </td>
    </tr>
    <tr>
        <th>ノード表示用の名前</th>
        <td>
            <x-admin.textarea name="node_name" :model="$model" required maxlength="200" />
            <x-admin.node-input-support />
        </td>
    </tr>
    <tr>
        <th>メーカー</th>
        <td>
            <x-admin.select-game-maker-multi name="game_maker_ids[]" :selected="$model->makerIds()" :model="$model"  />
        </td>
    </tr>
    @if ($isAdd)
        <tr>
            <th>プラットフォーム</th>
            <td>
                <x-admin.select-game-platform-multi name="game_platform_ids[]" :model="$model" />
            </td>
        </tr>
    @else
        <tr>
            <th>プラットフォーム</th>
            <td>
                <x-admin.select-game-platform name="game_platform_id" :model="$model" />
            </td>
        </tr>
    @endif
    <tr>
        <th>リリース日</th>
        <td>
            <x-admin.input name="release_at" :model="$model" required maxlength="100" />
        </td>
    </tr>
    <tr>
        <th>レーティング</th>
        <td>
            <x-admin.select-enum name="rating" :model="$model" :list="App\Enums\Rating::selectList()" />
        </td>
    </tr>
    <tr>
        <th>画像表示ショップ</th>
        <td>
            <x-admin.select name="img_shop_id" :model="$model" :list="$model->getSelectShopList()" />
        </td>
    </tr>
    <tr>
        <th>デフォルト画像</th>
        <td>
            <x-admin.select-enum name="default_img_type" :model="$model" :list="App\Enums\ProductDefaultImage::selectList()" />
        </td>
    </tr>
</table>

