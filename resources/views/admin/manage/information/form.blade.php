@include ('admin.all_errors')

<table class="table admin-form-table" id="franchise-table">
    @if ($model->exists)
        <tr>
            <th>ID</th>
            <td>{{ $model->id }}</td>
        </tr>
    @endif
    <tr>
        <th>掲題</th>
        <td>
            <x-admin.textarea name="head" :model="$model" required />
        </td>
    </tr>
    <tr>
        <th>ヘッダテキスト</th>
        <td>
            <x-admin.textarea name="header_text" :model="$model" />
        </td>
    </tr>
    @for ($i = 1; $i <= 10; $i++)
    <tr>
        <th>サブタイトル{{ $i }}</th>
        <td>
            <input name="sub_title_{{ $i }}" type="text" value="{{ old('sub_title_' . $i, $model->{'sub_title_' . $i} ?? '') }}" class="form-control {{ $errors->has('sub_title_' . $i) ? 'is-invalid' : '' }}" id="sub_title_{{ $i }}" maxlength="255">
            @error('sub_title_' . $i)
            <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </td>
    </tr>
    <tr>
        <th>サブテキスト{{ $i }}</th>
        <td>
            <textarea name="sub_text_{{ $i }}" class="form-control {{ $errors->has('sub_text_' . $i) ? 'is-invalid' : '' }}" id="sub_text_{{ $i }}" rows="4">{{ old('sub_text_' . $i, $model->{'sub_text_' . $i} ?? '') }}</textarea>
            @error('sub_text_' . $i)
            <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </td>
    </tr>
    @endfor
    <tr>
        <th>優先度</th>
        <td>
            <x-admin.input name="priority" :model="$model" type="number" required min="1" max="999" />
        </td>
    </tr>
    <tr>
        <th>掲載開始日時</th>
        <td>
            <input name="open_at" type="datetime-local" step="60" value="{{ old('open_at', $model->open_at ? $model->open_at->format('Y-m-d\TH:i') : '') }}" class="form-control w-auto {{ $errors->has('open_at') ? 'is-invalid' : '' }}" id="open_at" autocomplete="off">
            @error('open_at')
            <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </td>
    </tr>
    <tr>
        <th>掲載終了日時</th>
        <td>
            @php
                $isNoEnd = old('no_end', $model->close_at && $model->close_at->format('Y-m-d H:i') === '2099-12-31 23:59');
            @endphp
            <div class="form-check mb-2">
                <input type="checkbox" name="no_end" value="1" class="form-check-input" id="no_end" {{ $isNoEnd ? 'checked' : '' }} autocomplete="off">
                <label class="form-check-label" for="no_end">終了なし</label>
            </div>
            <input name="close_at" type="datetime-local" step="60" value="{{ old('close_at', $model->close_at ? $model->close_at->format('Y-m-d\TH:i') : '') }}" class="form-control w-auto {{ $errors->has('close_at') ? 'is-invalid' : '' }}" id="close_at" autocomplete="off" {{ $isNoEnd ? 'disabled' : '' }}>
            @error('close_at')
            <div class="invalid-feedback">{{ $message }}</div>
            @enderror
            <script>
                document.getElementById('no_end').addEventListener('change', function() {
                    document.getElementById('close_at').disabled = this.checked;
                });
            </script>
        </td>
    </tr>
</table>
