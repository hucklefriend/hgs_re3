<style>
    #platform-table th {
        width: 150px;
    }
</style>
<table class="table" id="platform-table">
    <tr>
        <th>名前</th>
        <td>
            @include ('management.common.form.input', ['name' => 'name', 'options' => ['required', 'maxlength' => 200]])
        </td>
    </tr>
    <tr>
        <th>略称</th>
        <td>
            @include ('management.common.form.input', ['name' => 'acronym', 'options' => ['required', 'maxlength' => 30]])
        </td>
    </tr>
    <tr>
        <th>R指定</th>
        <td>
            @include ('management.common.form.select', ['name' => 'rated_r', 'list' => \Hgs3\Enums\RatedR::selectList()])
        </td>
    </tr>
    <tr>
        <th>公式サイトURL</th>
        <td>
            @include ('management.common.form.input', ['type' => 'url', 'name' => 'url', 'options' => ['maxlength' => 300]])
        </td>
    </tr>
    <tr>
        <th>メーカー</th>
        <td>
            @include ('management.common.form.select', ['name' => 'maker_id', 'list' => $makers])
        </td>
    </tr>
    <tr>
        <th>表示順</th>
        <td>
            @include ('management.common.form.input', ['type' => 'number', 'name' => 'sort_order', 'options' => ['required', 'min' => 0]])
        </td>
    </tr>
</table>

@section('js')
    <script>
        $(()=>{
            $("#maker_id").select2();
        });
    </script>
@endsection