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
        <th>小画像URL</th>
        <td>
            <x-admin.input name="img_s_url" :model="$model" maxlength="250" />
        </td>
    </tr>
    <tr>
        <th>中画像URL</th>
        <td>
            <x-admin.input name="img_m_url" :model="$model" maxlength="250" />
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
            <x-admin.textarea name="description_source" :model="$model" />
        </td>
    </tr>
</table>

