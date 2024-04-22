<table class="table admin-form-table" id="franchise-table">
    @if ($model->exists)
        <tr>
            <th>ID</th>
            <td>{{ $model->id }}</td>
        </tr>
    @endif
    <tr>
        <th>名前</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'name', 'options' => ['required', 'maxlength' => 150]])
        </td>
    </tr>
    <tr>
        <th>よみがな</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'phonetic', 'options' => ['required', 'maxlength' => 150]])
        </td>
    </tr>
    <tr>
        <th>ノード表示用の名前</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'node_title', 'options' => ['required', 'maxlength' => 200]])
        </td>
    </tr>
</table>
