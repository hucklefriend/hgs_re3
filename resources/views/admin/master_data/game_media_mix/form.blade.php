<table class="table admin-form-table" id="series-table">
    @if ($model->exists)
        <tr>
            <th>ID</th>
            <td>{{ $model->id }}</td>
        </tr>
    @endif
    <tr>
        <th>種別</th>
        <td>
            @include ('admin.common.form.select_enum', ['name' => 'type', 'list' => App\Enums\MediaMixType::selectList()])
        </td>
    </tr>
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
        <th>H1ノード表示用の名前</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'h1_node_name', 'options' => ['required', 'maxlength' => 200]])
        </td>
    </tr>
    <tr>
        <th>フランチャイズ</th>
        <td>
            @include ('admin.common.form.select', ['name' => 'game_franchise_id', 'list' => $franchises, 'selected' => $model->franchise_id])
        </td>
    </tr>
    <tr>
        <th>グループNo</th>
        <td>
            @include ('admin.common.form.input', ['type' => 'number', 'name' => 'group_no', 'options' => ['required', 'min' => 1, 'max' => 65535]])
        </td>
    </tr>
    <tr>
        <th>表示順</th>
        <td>
            @include ('admin.common.form.input', ['type' => 'number', 'name' => 'sort_order', 'options' => ['required', 'min' => 1, 'max' => 65535]])
        </td>
    </tr>
    <tr>
        <th>レーティング</th>
        <td>
            @include ('admin.common.form.select_enum', ['name' => 'rating', 'list' => App\Enums\Rating::selectList()])
        </td>
    </tr>
    <tr>
        <th>説明文</th>
        <td>
            @include ('admin.common.form.textarea', ['name' => 'explain'])
        </td>
    </tr>
    <tr>
        <th>説明文の引用元名称</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'explain_source_name', 'options' => ['maxlength' => 100]])
        </td>
    </tr>
    <tr>
        <th>説明文の引用元URL</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'explain_source_url', 'options' => ['maxlength' => 100]])
        </td>
    </tr>
</table>

