@include ('admin.all_errors')

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
            <x-admin.input name="name" :model="$model" required maxlength="150" />
        </td>
    </tr>
    <tr>
        <th>key</th>
        <td>
            <x-admin.input name="key" :model="$model" required maxlength="50" />
        </td>
    </tr>
    <tr>
        <th>よみがな</th>
        <td>
            <x-admin.input name="phonetic" :model="$model" required maxlength="150" />
        </td>
    </tr>
    <tr>
        <th>ノード表示用の名前</th>
        <td>
            <x-admin.textarea name="node_name" :model="$model" required maxlength="200" />
            <x-admin.node-input-support />
        </td>
    </tr>
    <tr>
        <th>H1ノード表示用の名前</th>
        <td>
            <x-admin.textarea name="h1_node_name" :model="$model" required maxlength="200" />
            <x-admin.node-input-support />
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
