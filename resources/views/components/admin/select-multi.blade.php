<select {{ $attributes->class(['form-control multiple-select2'])->merge(['id' => $name, 'name' => $name]) }} multiple>
    @foreach ($list as $key => $value)
        @if (is_array($value))
            <optgroup label="{{ $key }}">
                @foreach ($value as $k => $v)
                    <option value="{{ $k }}" @selected(in_array($k, old($name, $selected)))>{{ $v }}</option>
                @endforeach
            </optgroup>
        @else
            <option value="{{ $key }}" @selected(in_array($key, old($name, $selected)))>{{ $value }}</option>
        @endif
    @endforeach
</select>
@error($name)
<div class="invalid-feedback">{{ $message }}</div>
@enderror
