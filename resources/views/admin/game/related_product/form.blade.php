@include ('admin.all_errors')
<table class="table admin-form-table" id="series-table">
    @if ($model->exists)
        <tr>
            <th>ID</th>
            <td>{{ $model->id }}</td>
        </tr>
    @endif
    <tr>
        <th>名前</th>
        <td>
            <x-admin.input name="name" :model="$model" required maxlength="200" />
        </td>
    </tr>
    <tr>
        <th>ノード表示用の名前</th>
        <td>
            <x-admin.input name="node_name" :model="$model" required maxlength="200" />
        </td>
    </tr>
    <tr>
        <th>レーティング</th>
        <td>
            <x-admin.select-enum name="rating" :model="$model" :list="App\Enums\Rating::selectList()" />
        </td>
    </tr>
    <tr>
        <th>表示順</th>
        <td>
            <x-admin.input type="number" name="sort_order" :model="$model" />
            <div>
                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="setOrder(99999999);">動画配信(吹替)</button>
                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="setOrder(99999998);">動画配信(字幕)</button>
                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="setOrder(99999989);">宅配レンタル(BD)</button>
                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="setOrder(99999988);">宅配レンタル(DVD)</button>
            </div>
            <script>
                function setOrder(val)
                {
                    $('#sort_order').val(val);
                }
            </script>
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
    <tr>
        <th>説明文</th>
        <td>
            <x-admin.textarea name="description" :model="$model" />
        </td>
    </tr>
    <tr>
        <th>説明文の引用元</th>
        <td>
            <x-admin.description-source name="description_source" :model="$model" />
        </td>
    </tr>
</table>

