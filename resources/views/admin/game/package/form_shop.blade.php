<table class="table admin-form-table">
    <tr>
        <th>URL</th>
        <td>
            <x-admin.input name="url" :model="$model" required maxlength="250" />
        </td>
    </tr>
    <tr>
        <th>ショップ</th>
        <td>
            <x-admin.select-shop name="shop_id" :model="$model" :list="App\Enums\Shop::selectListByPackage($package)" />
        </td>
    </tr>
    <tr>
        <th>画像タグ</th>
        <td>
            <x-admin.textarea name="img_tag" :model="$model" /><br>
        </td>
    </tr>
    <tr>
        <th>OGP URL</th>
        <td>
            <x-admin.input-ogp name="ogp_url" :model="$model" />
        </td>
    </tr>
    <tr>
        <th>パラメーター1</th>
        <td>
            <x-admin.input name="param1" :model="$model" />
        </td>
    </tr>
    <tr>
        <th>パラメーター2</th>
        <td>
            <x-admin.input name="param2" :model="$model" />
        </td>
    </tr>
    <tr>
        <th>パラメーター3</th>
        <td>
            <x-admin.input name="param3" :model="$model" />
        </td>
    </tr>
</table>
