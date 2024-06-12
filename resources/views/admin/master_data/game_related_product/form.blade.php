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
            @include ('admin.common.form.input', ['name' => 'name', 'options' => ['required', 'maxlength' => 200]])
        </td>
    </tr>
    <tr>
        <th>ノード表示用の名前</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'node_name', 'options' => ['required', 'maxlength' => 200]])
        </td>
    </tr>
    <tr>
        <th>レーティング</th>
        <td>
            @include ('admin.common.form.select_enum', ['name' => 'rating', 'list' => App\Enums\Rating::selectList()])
        </td>
    </tr>
    <tr>
        <th>小画像URL</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'img_s_url', 'options' => ['maxlength' => 250]])
        </td>
    </tr>
    <tr>
        <th>中画像URL</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'img_m_url', 'options' => ['maxlength' => 250]])
        </td>
    </tr>
        <tr>
            <th>説明文</th>
            <td>
                @include ('admin.common.form.textarea', ['name' => 'description'])
            </td>
        </tr>
        <tr>
            <th>説明文の引用元</th>
            <td>
                @include ('admin.common.form.description_source', ['name' => 'description_source'])
            </td>
        </tr>
</table>

