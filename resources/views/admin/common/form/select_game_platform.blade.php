@php
$nameColumn = $nameColumn ?? 'acronym';
$list = \App\Models\MasterData\GamePlatform::all(['id', $nameColumn])->pluck($nameColumn, 'id')->toArray();
if ($withBlank ?? false) {
    $list = ['' => '-'] + $list;
}
if (!isset($value)) {
    if (isset($model->$name)) {
        $value = $model->$name;
    } else {
        $value = null;
    }
}
@endphp

{{ Form::select($name, $list, old($name, $value), array_merge(['id' => $name, 'class' => 'default-select2 form-control' . invalid($errors, $name)], $options ?? [])) }}
@if ($errors->has($name))
    <div class="invalid-feedback">{{$errors->first($name)}}</div>
@endif
