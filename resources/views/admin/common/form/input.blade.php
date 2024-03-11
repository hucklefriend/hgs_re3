@php $type ??= 'text'; @endphp
{{ Form::$type($name, old($name, $model->$name), array_merge(['id' => $name, 'class' => 'form-control' . invalid($errors, $name), 'autocomplete' => 'off'], $options ?? [])) }}
@if ($errors->has($name))
    <div class="invalid-feedback">{{$errors->first($name)}}</div>
@endif