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
            @include ('admin.common.form.input', ['name' => 'name', 'options' => ['required', 'maxlength' => 200]])
        </td>
    </tr>
    <tr>
        <th>よみがな</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'phonetic', 'options' => ['required', 'maxlength' => 200]])
        </td>
    </tr>
    <tr>
        <th>よみがな(ソート用)</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'phonetic2', 'options' => ['required', 'maxlength' => 250]])
        </td>
    </tr>
    <tr>
        <th>ジャンル</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'genre', 'options' => ['maxlength' => 150]])
        </td>
    </tr>
    <tr>
        <th>シリーズ</th>
        <td>
            @include ('admin.common.form.select', ['name' => 'series_id', 'list' => $series])
        </td>
    </tr>
    <tr>
        <th>シリーズ内のソート順</th>
        <td>
            @include ('admin.common.form.input', ['type' => 'number', 'name' => 'order_in_series', 'options' => ['min' => 0, 'max' => '99999999']])
        </td>
    </tr>
    <tr>
        <th>フランチャイズ</th>
        <td>
            @include ('admin.common.form.select', ['name' => 'franchise_id', 'list' => $franchises])
        </td>
    </tr>
    <tr>
        <th>あらすじ</th>
        <td>
            @include ('admin.common.form.textarea', ['name' => 'introduction'])
        </td>
    </tr>
    <tr>
        <th>あらすじの引用元</th>
        <td>
            @include ('admin.common.form.textarea', ['name' => 'introduction_from'])
        </td>
    </tr>
    <tr>
        <th>あらすじ引用元のR指定</th>
        <td>
            @include ('admin.common.form.select', ['name' => 'introduction_from_rated_r', 'list' => \Hgs3\Enums\RatedR::selectList()])
        </td>
    </tr>
</table>

@section('js')
    <script>
        let series2Franchise = {!! json_encode($series2Franchise) !!};

        $(()=>{
            $("#franchise_id").select2();
            $("#series_id").select2();

            $("#series_id").change(function (){
                let seriesId = $(this).val();
                if (seriesId.length > 0) {
                    $("#franchise_id").val(series2Franchise[seriesId]).trigger('change');
                }
            });
        });
    </script>
@endsection
