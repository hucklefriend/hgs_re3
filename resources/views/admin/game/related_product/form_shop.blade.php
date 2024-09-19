@include ('admin.all_errors')
<table class="table admin-form-table">
    <tr>
        <th>ショップ</th>
        <td>
            @if ($model->exists)
                {{ $model->shop()->name() }}
                <input type="hidden" name="shop_id" id="shop_id" value="{{ $model->shop_id }}">
            @else
                <x-admin.select-enum name="shop_id" :model="$model" :list="App\Enums\Shop::selectList($relatedProduct->default_img_type, $excludeShopList)" />
            @endif
        </td>
    </tr>
    <tr>
        <th>URL</th>
        <td>
            <x-admin.input name="url" :model="$model" required maxlength="250" />
        </td>
    </tr>
    <tr>
        <th>画像タグ</th>
        <td>
            <x-admin.textarea name="img_tag" :model="$model" /><br>
            <div class="form-check">
                <input type="checkbox" name="use_img_tag" id="use_img_tag" value="1" class="form-check-input">
                <label class="form-check-label" for="use_img_tag">
                    <small>画像タグを使用する</small>
                </label>
            </div>
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
</table>
