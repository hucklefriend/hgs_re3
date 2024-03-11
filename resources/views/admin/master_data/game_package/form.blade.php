<table class="table admin-form-table" id="platform-table">
    <tr>
        <th>名前</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'name', 'options' => ['required', 'maxlength' => 100]])
        </td>
    </tr>
    <tr>
        <th>略称</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'acronym', 'options' => ['required', 'maxlength' => 100]])
        </td>
    </tr>
    <tr>
        <th>メーカー</th>
        <td>
            @include ('admin.common.form.select_game_maker', ['name' => 'game_maker_id', 'value' => $model->game_maker_id, 'withBlank' => true])
        </td>
    </tr>
    @if ($isAdd)
        <tr>
            <th>プラットフォーム</th>
            <td>
                @include ('admin.common.form.select_game_platform_multi', ['name' => 'game_platform_ids[]'])
            </td>
        </tr>
    @else
        <tr>
            <th>プラットフォーム</th>
            <td>
                @include ('admin.common.form.select_game_platform', ['name' => 'game_platform_id', 'value' => $model->game_platform_id])
            </td>
        </tr>
    @endif
    <tr>
        <th>リリース日</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'release_at', 'options' => ['required', 'maxlength' => 100]])
        </td>
    </tr>
    <tr>
        <th>R指定</th>
        <td>
            @include ('admin.common.form.select', ['name' => 'rated_r', 'list' => App\Enums\RatedR::selectList()])
        </td>
    </tr>
</table>

@section('js')
    <script>
        $(()=> {
            $(".default-select2").select2();
            $(".multiple-select2").select2();
        });
    </script>
@endsection
