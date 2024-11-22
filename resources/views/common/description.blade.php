<blockquote class="description">
    {!! nl2br($model->description); !!}
    @if ($model->description_source !== null)
        <footer>
            — <cite>{!! $model->description_source !!}</cite>
        </footer>
    @endif
</blockquote>
