<textarea name="{{ $name }}"  {{ $attributes
->class(['form-control', 'is-invalid' => $hasError])
->merge(['type' => 'text', 'id' => $name])->except('name') }} autocomplete="off">{{ old($name, $model->$name) }}</textarea><br>
<button type="button" class="btn btn-sm mr-2 btn-light description-source-tool-a">aタグ</button>
@error($name)
    <div class="invalid-feedback">{{ $message }}</div>
@enderror
