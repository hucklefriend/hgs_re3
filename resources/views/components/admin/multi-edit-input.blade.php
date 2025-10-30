<input value="{{ old($name, $model->$columnName) }}" {{ $attributes->class(['form-control', 'is-invalid' => $hasError])
->merge(['type' => 'text', 'id' => $name, 'name' => $name]) }} autocomplete="off">
@error($name)
<div class="invalid-feedback">{{ $message }}</div>
@enderror
