<style>
    #platform-table th {
        width: 150px;
    }
</style>

<table class="table">
    <tr>
        <th>ショップ</th>
        <td>
            @if ($model->id)
                {{ $model->shop()->name() }}
                <input type="hidden" name="shop_id" id="shop_id" value="{{ $model->shop_id }}">
            @else
                @include ('management.common.form.select', [
                    'name' => 'shop_id',
                    'list' => \Hgs3\Enums\Game\Shop::selectList(),
                    'value' => \Hgs3\Enums\Game\Shop::Amazon->value,
                    'options' => ['required']
                ])
            @endif
        </td>
    </tr>
    <tr id="asin">
        <th>ASIN</th>
        <td>
            @include ('management.common.form.input', ['name' => 'param1', 'options' => ['required']])
        </td>
    </tr>
    <tr>
        <th>ショップURL</th>
        <td>
            @include ('management.common.form.input', ['name' => 'shop_url', 'options' => ['required']])
        </td>
    </tr>
    <tr>
        <th>画像(小)</th>
        <td>
            <div class="input-group mb-3">
                {{ Form::text('small_image_url', old('small_image_url', $model->small_image_url),
                    ['id' => 'small_image_url', 'class' => 'form-control' . invalid($errors, 'small_image_url'), 'autocomplete' => 'off']) }}
                <button class="btn btn-outline-secondary" type="button" onclick="removeATag('#small_image_url')">aタグ除去</button>
            </div>
            @if ($errors->has('small_image_url'))
                <div class="invalid-feedback">{{$errors->first('small_image_url')}}</div>
            @endif
        </td>
    </tr>
    <tr>
        <th>画像(中)</th>
        <td>
            <div class="input-group mb-3">
                {{ Form::text('medium_image_url', old('medium_image_url', $model->medium_image_url),
                    ['id' => 'medium_image_url', 'class' => 'form-control' . invalid($errors, 'medium_image_url'), 'autocomplete' => 'off']) }}
                <button class="btn btn-outline-secondary" type="button" onclick="removeATag('#medium_image_url')">aタグ除去</button>
            </div>
            @if ($errors->has('medium_image_url'))
                <div class="invalid-feedback">{{$errors->first('medium_image_url')}}</div>
            @endif
        </td>
    </tr>
    <tr>
        <th>画像(大)</th>
        <td>
            <div class="input-group mb-3">
                {{ Form::text('large_image_url', old('large_image_url', $model->medium_image_url),
                    ['id' => 'large_image_url', 'class' => 'form-control' . invalid($errors, 'large_image_url'), 'autocomplete' => 'off']) }}
                <button class="btn btn-outline-secondary" type="button" onclick="removeATag('#large_image_url')">aタグ除去</button>
            </div>
            @if ($errors->has('large_image_url'))
                <div class="invalid-feedback">{{$errors->first('large_image_url')}}</div>
            @endif
        </td>
    </tr>
    <tr>
        <th>リリース日(数値)</th>
        <td>
            @include ('management.common.form.input', ['name' => 'release_int', 'type' => 'number', 'options' => ['required', 'max' => 99999999, 'min' => 0]])
        </td>
    </tr>
    <tr>
        <th>R指定</th>
        <td>
            @include ('management.common.form.select', ['name' => 'rated_r', 'list' => \Hgs3\Enums\RatedR::selectList()])
        </td>
    </tr>
</table>

@section('js')
    <script>
        const AMAZON = {{ \Hgs3\Enums\Game\Shop::Amazon->value }};

        $(()=>{
            $("#shop_id").select2();

            changeShop();

            $("#shop_id").change(()=>{
                changeShop();
            });
        });


        function changeShop()
        {
            let shopId = $('#shop_id').val();

            if (shopId == AMAZON) {
                $('#asin').show();
                $('#param1').attr('required');
            } else {
                $('#asin').hide();
                $('#param1').removeAttr('required');
            }
        }

        function removeATag(target)
        {
            let tag = $(target).val();
            if (tag.length > 0) {
                tag = tag.replace(/<a.+?>/, '');
                tag = tag.replace('</a>', '');

                $(target).val(tag);
            }
        }
    </script>
@endsection
