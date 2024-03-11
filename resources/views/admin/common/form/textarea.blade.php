{{ Form::textarea($name, old($name, $model->$name), array_merge(['id' => $name, 'class' => 'form-control textarea-autosize' . invalid($errors, $name)], $options ?? [])) }}
@if ($errors->has($name))
    <div class="invalid-feedback">{{$errors->first($name)}}</div>
@endif