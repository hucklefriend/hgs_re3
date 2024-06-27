@include ('admin.all_errors')
<table class="table admin-form-table" id="title-table">
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
        <th>key</th>
        <td>
            <x-admin.input name="key" :model="$model" required maxlength="50" />
        </td>
    </tr>
    <tr>
        <th>よみがな</th>
        <td>
            <x-admin.input name="phonetic" :model="$model" required maxlength="200" />
        </td>
    </tr>
    <tr>
        <th>俗称</th>
        <td>
            <x-admin.textarea name="synonymsStr" :model="$model" />
        </td>
    </tr>
    <tr>
        <th>ノード表示用の名前</th>
        <td>
            <x-admin.textarea name="node_name" :model="$model" required maxlength="200" />
        </td>
    </tr>
    <tr>
        <th>H1ノード表示用の名前</th>
        <td>
            <x-admin.textarea name="h1_node_name" :model="$model" required maxlength="200" />
        </td>
    </tr>
    <tr>
        <th>ジャンル</th>
        <td>
            <x-admin.input name="genre" :model="$model" maxlength="150" />
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
    <tr>
        <th>最初のパッケージ発売日</th>
        <td>
            <x-admin.input name="first_release" :model="$model" type="number" min="0" max="99999999" />
        </td>
    </tr>
</table>

