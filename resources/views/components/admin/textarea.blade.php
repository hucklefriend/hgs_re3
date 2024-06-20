<textarea {{ $attributes->class(['form-control', 'textarea-autosize','is-invalid' => $hasError])->merge(['id' => $name]) }} autocomplete="off">{!! old($name, $model->$name) !!}</textarea>
@error($name)
<div class="invalid-feedback">{{ $message }}</div>
@enderror
