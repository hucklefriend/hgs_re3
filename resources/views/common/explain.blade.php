<blockquote>
    {!! nl2br(e($model->explain)); !!}
    @if ($model->explain_source_name !== null)
        <footer style="text-align: right;margin-top:1rem;">— <cite>
                @if ($model->explain_source_url !== null)
                    <a href="{{ $model->explain_source_url }}" target="_blank">{{ $model->explain_source_name }}</a>
                @else
                    {{ $model->explain_source_name }}
                @endif
            </cite></footer>
    @endif
</blockquote>
