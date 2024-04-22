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
        <th>俗称</th>
        <td>
            @include ('admin.common.form.textarea', ['name' => 'synonymsStr'])
        </td>
    </tr>
    <tr>
        <th>ノード表示用の名前</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'node_title', 'options' => ['required', 'maxlength' => 200]])
        </td>
    </tr>
    <tr>
        <th>ジャンル</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'genre', 'options' => ['maxlength' => 150]])
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
            @include ('admin.common.form.select', ['name' => 'introduction_from_rated_r', 'list' => \App\Enums\RatedR::selectList()])
        </td>
    </tr>
</table>

