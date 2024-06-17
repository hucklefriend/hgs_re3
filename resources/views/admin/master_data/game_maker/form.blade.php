<style>
    #maker-table th {
        width: 150px;
    }
</style>
@include ('admin.common.form.all_errors')
<table class="table" id="maker-table">
    @if ($model->exists)
        <tr>
            <th>ID</th>
            <td>{{ $model->id }}</td>
        </tr>
    @endif
    <tr>
        <th>名前</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'name', 'options' => ['required', 'maxlength' => 100]])
        </td>
    </tr>
    <tr>
        <th>key</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'key', 'options' => ['required', 'maxlength' => 50]])
        </td>
    </tr>
    <tr>
        <th>略称</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'acronym', 'options' => ['required', 'maxlength' => 100]])
        </td>
    </tr>
    <tr>
        <th>よみがな</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'phonetic', 'options' => ['required', 'maxlength' => 100]])
        </td>
    </tr>
    <tr>
        <th>ノード表示用の名前</th>
        <td>
            @include ('admin.common.form.textarea', ['name' => 'node_name', 'options' => ['required', 'maxlength' => 200]])
        </td>
    </tr>
    <tr>
        <th>H1ノード表示用の名前</th>
        <td>
            @include ('admin.common.form.textarea', ['name' => 'h1_node_name', 'options' => ['required', 'maxlength' => 200]])
        </td>
    </tr>
    <tr>
        <th>俗称</th>
        <td>
            @include ('admin.common.form.textarea', ['name' => 'synonymsStr'])
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
    <tr>
        <th>関連メーカー</th>
        <td>
            @include ('admin.common.form.select_game_maker', ['name' => 'related_game_maker_id', 'value' => $model->related_game_maker_id, 'withBlank' => true])
        </td>
    </tr>
</table>
