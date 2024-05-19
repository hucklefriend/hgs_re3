<style>
    #platform-table th {
        width: 150px;
    }
</style>
<table class="table" id="platform-table">
    <tr>
        <th>名前</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'name', 'options' => ['required', 'maxlength' => 200]])
        </td>
    </tr>
    <tr>
        <th>略称</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'acronym', 'options' => ['required', 'maxlength' => 30]])
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
        <th>R指定</th>
        <td>
            @include ('admin.common.form.select', ['name' => 'rated_r', 'list' => \App\Enums\RatedR::selectList()])
        </td>
    </tr>
    <tr>
        <th>メーカー</th>
        <td>
            @include ('admin.common.form.select_game_maker', ['name' => 'game_maker_id', 'value' => $model->game_maker_id, 'withBlank' => true])
        </td>
    </tr>
    <tr>
        <th>表示順</th>
        <td>
            @include ('admin.common.form.input', ['type' => 'number', 'name' => 'sort_order', 'options' => ['required', 'min' => 0]])
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

@section('js')
    <script>
        $(()=>{
            $(".default-select2").select2();
        });
    </script>
@endsection
