@include ('admin.all_errors')

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
            <x-admin.textarea name="head" :model="$model" required />
        </td>
    </tr>
    <tr>
        <th>本文</th>
        <td>
            <x-admin.textarea name="body" :model="$model" required />
        </td>
    </tr>
    <tr>
        <th>優先度</th>
        <td>
            <x-admin.input name="priority" :model="$model" type="number" required min="1" max="999" />
        </td>
    </tr>
    <tr>
        <th>掲載開始日時</th>
        <td>
            <x-admin.datetime name="open_at" :model="$model" required />
        </td>
    </tr>
    <tr>
        <th>掲載終了日時</th>
        <td>
            <x-admin.datetime name="close_at" :model="$model" required />
        </td>
    </tr>
</table>
