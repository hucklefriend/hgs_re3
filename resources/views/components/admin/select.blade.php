<select {{ $attributes->class(['form-control', 'default-select2', 'is-invalid' => $hasError])->merge(['id' => $name, 'name' => $name])->except('list') }}>
    @foreach ($list as $key => $val)
        <option value="{{ $key }}" @selected(old($name, $selected) == $key)>{{ $val }}</option>
    @endforeach
</select>
@error($name)
<div class="invalid-feedback">{{ $message }}</div>
@enderror
