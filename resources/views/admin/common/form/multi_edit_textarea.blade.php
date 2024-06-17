@php
    $key = $name . '[' . $model->id . ']';
    $errorKey = $name . '.' . $model->id;
@endphp
{{ Form::textarea($key, old($key, $model->$name), ['class' => 'form-control edit-multi-textarea' . invalid($errors, $errorKey)]) }}
@error('key.1')
    <div class="invalid-feedback">{{ $errors->first('key.1') }}</div>
@enderror
