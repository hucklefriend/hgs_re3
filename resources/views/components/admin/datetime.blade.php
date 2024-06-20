<input name="{{ $name }}" type="datetime-local" value="{{ old($name, $model->$name) }}" {{ $attributes
->class(['form-control w-auto', 'is-invalid' => $hasError])
->merge(['id' => $name])->except('name') }} autocomplete="off">
@error($name)
<div class="invalid-feedback">{{ $message }}</div>
@enderror
