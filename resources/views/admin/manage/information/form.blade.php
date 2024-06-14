<table class="table admin-form-table" id="franchise-table">
    @if ($model->exists)
        <tr>
            <th>ID</th>
            <td>{{ $model->id }}</td>
        </tr>
    @endif
    <tr>
        <th>掲題</th>
        <td>
            @include ('admin.common.form.textarea', ['name' => 'head', 'options' => ['required']])
        </td>
    </tr>
    <tr>
        <th>本文</th>
        <td>
            @include ('admin.common.form.textarea', ['name' => 'body', 'options' => ['required']])
        </td>
    </tr>
    <tr>
        <th>優先度</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'priority', 'type' => 'number', 'options' => ['required', 'min' => 1, 'max' => 999]])
        </td>
    </tr>
    <tr>
        <th>掲載開始日時</th>
        <td>
            @include ('admin.common.form.datetime_local', ['name' => 'open_at', 'options' => ['required']])
        </td>
    </tr>
    <tr>
        <th>掲載終了日時</th>
        <td>
            @include ('admin.common.form.datetime_local', ['name' => 'close_at', 'options' => ['required']])
        </td>
    </tr>
</table>
