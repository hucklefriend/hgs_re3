@include ('admin.all_errors')
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
            <x-admin.select-enum name="type" :model="$model" :list="App\Enums\MediaMixType::selectList()" />
        </td>
    </tr>
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
        <th>フランチャイズ</th>
        <td>
            <x-admin.select-game-franchise name="game_franchise_id" :model="$model" />
            <p>メディアミックスグループとどちらか一方のみ設定可</p>
        </td>
    </tr>
    <tr>
        <th>メディアミックスグループ</th>
        <td>
            <x-admin.select-game-media-mix-group name="game_media_mix_group_id" :model="$model" />
            <p>フランチャイズとどちらか一方のみ設定可</p>
        </td>
    </tr>
    <tr>
        <th>表示順</th>
        <td>
            <x-admin.input name="sort_order" :model="$model" type="number" required min="1" max="65535" />
        </td>
    </tr>
    <tr>
        <th>レーティング</th>
        <td>
            <x-admin.select-enum name="rating" :model="$model" :list="App\Enums\Rating::selectList()" />
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
        <th>OG URL</th>
        <td>
            <x-admin.input type="url" name="og_url" :model="$model" />
        </td>
    </tr>
</table>

