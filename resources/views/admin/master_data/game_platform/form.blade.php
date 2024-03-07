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
</table>

@section('js')
    <script>
        $(()=>{
            $("#game_maker_id").select2();
        });
    </script>
@endsection
