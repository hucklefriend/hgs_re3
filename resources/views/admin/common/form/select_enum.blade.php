{{ Form::select($name, $list, old($name, $model->$name->value), array_merge(['id' => $name, 'class' => 'form-control' . invalid($errors, $name)], $options ?? [])) }}
@if ($errors->has($name))
    <div class="invalid-feedback">{{$errors->first($name)}}</div>
@endif
