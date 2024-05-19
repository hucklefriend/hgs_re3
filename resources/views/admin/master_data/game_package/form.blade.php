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
        <th>ノード表示用の名前</th>
        <td>
            @include ('admin.common.form.textarea', ['name' => 'node_name', 'options' => ['required', 'maxlength' => 200]])
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
        <th>レーティング</th>
        <td>
            @include ('admin.common.form.select_enum', ['name' => 'rating', 'list' => App\Enums\Rating::selectList()])
        </td>
    </tr>
    <tr>
        <th>パッケージ画像(小)URL</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'img_s_url', 'options' => ['maxlength' => 250]])
        </td>
    </tr>
    <tr>
        <th>パッケージ画像(中)URL</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'img_m_url', 'options' => ['maxlength' => 250]])
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
        $(()=> {
            $(".default-select2").select2();
            $(".multiple-select2").select2();
        });
    </script>
@endsection
