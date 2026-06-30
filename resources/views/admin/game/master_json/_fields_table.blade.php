@if (!empty($fields))
    <table class="table table-sm table-bordered mb-2">
        <thead>
            <tr>
                <th style="width:40px"></th>
                <th>項目</th>
                <th>変更前</th>
                <th>変更後</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($fields as $f)
                <tr>
                    <td class="text-center">
                        <input type="checkbox" name="{{ $checkboxName }}[]" value="{{ $f['key'] }}" checked>
                    </td>
                    <td>{{ $f['label'] }}</td>
                    <td class="text-muted">{{ $f['before'] }}</td>
                    <td>{{ $f['after'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endif
