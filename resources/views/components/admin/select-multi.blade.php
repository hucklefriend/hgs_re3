<select {{ $attributes->class(['form-control multiple-select2'])->merge(['id' => $name, 'name' => $name]) }} multiple>
    @foreach ($list as $key => $value)
        <option value="{{ $key }}" @selected(in_array($key, old($name, $selected)))>{{ $value }}</option>
    @endforeach
</select>
@error($name)
<div class="invalid-feedback">{{ $message }}</div>
@enderror
