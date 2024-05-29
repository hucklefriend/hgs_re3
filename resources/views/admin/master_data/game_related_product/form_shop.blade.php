<table class="table admin-form-table">
    <tr>
        <th>ショップ</th>
        <td>
            @if ($model->exists)
                {{ $model->shop()->name() }}
                <input type="hidden" name="shop_id" id="shop_id" value="{{ $model->shop_id }}">
            @else
                @include ('admin.common.form.select', ['name' => 'shop_id', 'list' => \App\Enums\Game\Shop::selectList()])
            @endif
        </td>
    </tr>
    <tr>
        <th>URL</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'url', 'options' => ['required']])
        </td>
    </tr>
    <tr>
        <th>パラメーター1</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'param1'])
        </td>
    </tr>
    <tr>
        <th>パラメーター2</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'param2'])
        </td>
    </tr>
    <tr>
        <th>パラメーター3</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'param3'])
        </td>
    </tr>
</table>
