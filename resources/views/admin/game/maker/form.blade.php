<style>
    #maker-table th {
        width: 150px;
    }
</style>
@include ('admin.all_errors')
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
            <x-admin.input name="name" :model="$model" required maxlength="100" />
        </td>
    </tr>
    <tr>
        <th>key</th>
        <td>
            <x-admin.input name="key" :model="$model" required maxlength="50" />
        </td>
    </tr>
    <tr>
        <th>ノード表示用の名前</th>
        <td>
            <x-admin.textarea name="node_name" :model="$model" required maxlength="200" />
        </td>
    </tr>
    <tr>
        <th>レーティング</th>
        <td>
            <x-admin.select-enum name="rating" :model="$model" :list="App\Enums\Rating::selectList()" />
        </td>
    </tr>
    <tr>
        <th>種別</th>
        <td>
            <x-admin.select-enum name="type" :model="$model" :list="\App\Enums\GameMakerType::selectList()" required />
        </td>
    </tr>
    <tr>
        <th>俗称</th>
        <td>
            <x-admin.textarea name="synonymsStr" :model="$model" />
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
    <tr>
        <th>関連メーカー</th>
        <td>
            <x-admin.select-game-maker name="related_game_maker_id" :model="$model" />
        </td>
    </tr>
</table>
