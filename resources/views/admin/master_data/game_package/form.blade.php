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
            @include ('admin.common.form.select', ['name' => 'maker_id', 'list' => \Hgs3\Models\Orm\GameMaker::getHashBy('name')])
        </td>
    </tr>
    <tr>
        <th>プラットフォーム</th>
        <td>
            @include ('admin.common.form.select', ['name' => 'platform_id', 'list' => \Hgs3\Models\Orm\GamePlatform::getSelectList()])
        </td>
    </tr>
    <tr>
        <th>リリース日</th>
        <td>
            <div class="input-group mb-3">
                {{ Form::text('release_at', old('release_at', $model->release_at),
                    ['id' => 'release_at', 'class' => 'form-control' . invalid($errors, 'release_at'), 'autocomplete' => 'off', 'required']) }}
                <button class="btn btn-outline-secondary" type="button" id="release_at_convert">/から</button>
            </div>
            @if ($errors->has('release_at'))
                <div class="invalid-feedback">{{$errors->first('release_at')}}</div>
            @endif
        </td>
    </tr>
    <tr>
        <th>リリース日(数値)</th>
        <td>
            <div class="input-group mb-3">
                {{ Form::number('release_int', old('release_int', $model->release_int),
                    ['id' => 'release_int', 'class' => 'form-control' . invalid($errors, 'release_int'), 'autocomplete' => 'off', 'required', 'max' => 99999999, 'min' => 0]) }}
                <button class="btn btn-outline-secondary" type="button" id="release_int_convert">リリース日から</button>
            </div>
            @if ($errors->has('release_int'))
                <div class="invalid-feedback">{{$errors->first('release_int')}}</div>
            @endif
        </td>
    </tr>
    <tr>
        <th>R指定</th>
        <td>
            @include ('admin.common.form.select', ['name' => 'rated_r', 'list' => \Hgs3\Enums\RatedR::selectList()])
        </td>
    </tr>
</table>

@section('js')
    <script>
        $(()=>{
            $("#maker_id").select2();
            $("#hard_id").select2();
            $("#platform_id").select2();

            $('#release_at_convert').click(() => {
                let txt = $('#release_at').val();

                let arr = txt.split('/');
                let val = parseInt(arr[0]).toString();
                val += '年';
                if (arr[1]) {
                    val += parseInt(arr[1]).toString();
                }
                val += '月';
                if (arr[1]) {
                    val += parseInt(arr[2]).toString();
                }
                val += '日';

                $('#release_at').val(val);
            });

            $('#release_int_convert').click(() => {
                let txt = $('#release_at').val();

                let arr = txt.split('年');
                let year = '';
                let month = '';
                let day = '';

                if (arr.length == 2) {
                    year = arr[0];
                    arr = arr[1].split('月');
                    if (arr.length == 2) {
                        month = zeroPadding(parseInt(arr[0]));
                        day = zeroPadding(parseInt(arr[1]));
                    }
                }

                $('#release_int').val(year + month + day);
            });
        });

        function zeroPadding(num)
        {
            if (num < 10) {
                num = '0' + num.toString();
            } else {
                num = num.toString();
            }

            return num;
        }
    </script>
@endsection
