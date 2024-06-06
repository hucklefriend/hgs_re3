<blockquote>
    {!! nl2br(e($model->description)); !!}
    @if ($model->description_source_name !== null)
        <footer style="text-align: right;margin-top:1rem;">— <cite>
                @if ($model->description_source_url !== null)
                    <a href="{{ $model->description_source_url }}" target="_blank">{{ $model->description_source_name }}</a>
                @else
                    {{ $model->description_source_name }}
                @endif
            </cite></footer>
    @endif
</blockquote>
