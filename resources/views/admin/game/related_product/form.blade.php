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
        <th>テンプレート</th>
        <td>
            <div>
                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="setTemplate(1);">動画配信</button>

                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="setTemplate(21);">商品を探す</button>
            </div>
            <script>
                function setTemplate(type)
                {
                    switch (type) {
                        case 1:
                            $('#name').val($('#name').val() + ' 動画配信');
                            $('#node_name').val('動画配信');
                            $('#sort_order').val(99999999);
                            $('#default_img_type').val({{ App\Enums\ProductDefaultImage::VIDEO_STREAMING->value }}).trigger('change');
                            break;
                        case 2:
                            $('#name').val($('#name').val() + ' 動画配信(購入/レンタル)');
                            $('#node_name').val('動画配信(購入/レンタル)');
                            $('#sort_order').val(99999998);
                            $('#default_img_type').val({{ App\Enums\ProductDefaultImage::VIDEO_STREAMING->value }}).trigger('change');
                            break;
                        case 21:
                            $('#name').val('「' + $('#name').val() + '」を探す');
                            $('#node_name').val($('#name').val());
                            $('#sort_order').val(0);
                            $('#default_img_type').val({{ App\Enums\ProductDefaultImage::SEARCH->value }}).trigger('change');
                            break;
                    }
                }
            </script>
        </td>
    </tr>
    <tr>
        <th>ノード表示用の名前</th>
        <td>
            <x-admin.input name="node_name" :model="$model" required maxlength="200" />
            <x-admin.node-input-support />
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

