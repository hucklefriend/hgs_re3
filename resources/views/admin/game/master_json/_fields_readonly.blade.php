@if (!empty($fields))
    <ul class="mb-2 ps-4">
        @foreach ($fields as $f)
            <li>{{ $f['label'] }}: <span class="text-muted">{{ $f['before'] }}</span> → <span>{{ $f['after'] }}</span></li>
        @endforeach
    </ul>
@endif
