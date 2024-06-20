@include ('admin.all_errors')
<table class="table admin-form-table">
    <tr>
        <th>ショップ</th>
        <td>
            @if ($model->exists)
                {{ $model->shop()->name() }}
                <input type="hidden" name="shop_id" id="shop_id" value="{{ $model->shop_id }}">
            @else
                <x-admin.select-enum name="shop_id" :list="App\Enums\Shop::selectList()" />
            @endif
        </td>
    </tr>
    <tr>
        <th>URL</th>
        <td>
            <x-admin.input name="url" :model="$model" required maxlength="250" />
        </td>
    </tr>
    <tr>
        <th>パラメーター1</th>
        <td>
            <x-admin.input name="param1" :model="$model" />
        </td>
    </tr>
    <tr>
        <th>パラメーター2</th>
        <td>
            <x-admin.input name="param2" :model="$model" />
        </td>
    </tr>
</table>
