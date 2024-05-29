<style>
    #maker-table th {
        width: 150px;
    }
</style>
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
