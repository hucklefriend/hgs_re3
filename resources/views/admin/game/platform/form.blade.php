<style>
    #platform-table th {
        width: 150px;
    }
</style>
@include ('admin.all_errors')
<table class="table" id="platform-table">
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
        <th>略称</th>
        <td>
            <x-admin.input name="acronym" :model="$model" required maxlength="30" />
        </td>
    </tr>
    <tr>
        <th>ノード表示用の名前</th>
        <td>
            <x-admin.textarea name="node_name" :model="$model" required maxlength="200" />
        </td>
    </tr>
    <tr>
        <th>種別</th>
        <td>
            <x-admin.select-enum name="type" :model="$model" :list="\App\Enums\GamePlatformType::selectList()" required />
        </td>
    </tr>
    <tr>
        <th>メーカー</th>
        <td>
            <x-admin.select-game-maker name="game_maker_id" :model="$model" />
        </td>
    </tr>
    <tr>
        <th>表示順</th>
        <td>
            <x-admin.input name="sort_order" :model="$model" type="number" required min="0" />
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
</table>

