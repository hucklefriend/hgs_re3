{{ Form::datetimeLocal($name, old($name, $model->$name), array_merge(['id' => $name, 'class' => 'form-control w-auto' . invalid($errors, $name), 'autocomplete' => 'off'], $options ?? [])) }}
@if ($errors->has($name))
    <div class="invalid-feedback">{{$errors->first($name)}}</div>
@endif
