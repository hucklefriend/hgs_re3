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
        <th>key</th>
        <td>
            @include ('admin.common.form.input', ['name' => 'key', 'options' => ['required', 'maxlength' => 50]])
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
            @include ('admin.common.form.textarea', ['name' => 'node_name', 'options' => ['required', 'maxlength' => 200]])
        </td>
    </tr>
    <tr>
        <th>H1ノード表示用の名前</th>
        <td>
            @include ('admin.common.form.textarea', ['name' => 'h1_node_name', 'options' => ['required', 'maxlength' => 200]])
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
    <tr>
        <th>最初のパッケージ発売日</th>
        <td>
            @include ('admin.common.form.input', ['type' => 'number', 'min' => 0, 'max' => '99999999', 'name' => 'first_release_int'])
        </td>
    </tr>
</table>

