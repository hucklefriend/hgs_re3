@if ($errors->any())
    <div class="alert alert-danger mb-0">
        <ul class="mb-0">
            @foreach ($errors->keys() as $key)
                @foreach ($errors->get($key) as $error)
                    <li>{{ $key }}: {{ $error }}</li>
                @endforeach
            @endforeach
        </ul>
    </div>
@endif
