<select {{ $attributes->class(['form-control'])->merge(['id' => $name]) }} multiple>
    @foreach ($list as $key => $value)
        <option value="{{ $key }}" @selected(in_array($key, old($name, [])))>{{ $value }}</option>
    @endforeach
</select>
@error($name)
<div class="invalid-feedback">{{ $message }}</div>
@enderror
