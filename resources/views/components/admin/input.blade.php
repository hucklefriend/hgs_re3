<input name="{{ $name }}"  value="{{ old($name, $model->$name) }}" {{ $attributes
->class(['form-control', 'is-invalid' => $hasError])
->merge(['type' => 'text', 'id' => $name])->except('name') }} autocomplete="off">
@error($name)
    <div class="invalid-feedback">{{ $message }}</div>
@enderror
