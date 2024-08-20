<select {{ $attributes->class(['form-control', 'default-select2', 'is-invalid' => $hasError])->merge(['id' => $name, 'name' => $name])->except('list') }}>
    @foreach ($list as $key => $val)
        @if (is_array($val))
            <optgroup label="{{ $key }}">
                @foreach ($val as $k => $v)
                    <option value="{{ $k }}" @selected(old($name, $selected) == $k)>{{ $v }}</option>
                @endforeach
            </optgroup>
        @else
            <option value="{{ $key }}" @selected(old($name, $selected) == $key)>{{ $val }}</option>
        @endif
    @endforeach
</select>
@error($name)
<div class="invalid-feedback">{{ $message }}</div>
@enderror
