<style>
    #maker-table th {
        width: 150px;
    }
</style>
<table class="table" id="maker-table">
    @if ($model->wasRecentlyCreated)
        <tr>
            <th>ID</th>
            <td>{{ $model->id }}</td>
        </tr>
    @endif
    <tr>
        <th>名前</th>
        <td>
            @include ('management.common.form.input', ['name' => 'name', 'options' => ['required', 'maxlength' => 100]])
        </td>
    </tr>
    <tr>
        <th>略称</th>
        <td>
            @include ('management.common.form.input', ['name' => 'acronym', 'options' => ['required', 'maxlength' => 100]])
        </td>
    </tr>
    <tr>
        <th>よみがな</th>
        <td>
            @include ('management.common.form.input', ['name' => 'phonetic', 'options' => ['required', 'maxlength' => 100]])
        </td>
    </tr>
    <tr>
        <th>属性</th>
        <td>
            @include ('management.common.form.select', ['name' => 'kind', 'list' => \Hgs3\Enums\Game\Maker\Kind::selectList()])
        </td>
    </tr>
    <tr>
        <th>公式サイトURL</th>
        <td>
            @include ('management.common.form.input', ['type' => 'url', 'name' => 'url', 'options' => ['maxlength' => 300]])
        </td>
    </tr>
    <tr>
        <th>公式サイトのR指定</th>
        <td>
            @include ('management.common.form.select', ['name' => 'url_rated_r', 'list' => \Hgs3\Enums\RatedR::selectList()])
        </td>
    </tr>
</table>
