<blockquote class="description">
    {!! nl2br(e($model->description)); !!}
    @if ($model->description_source !== null)
        <footer>
            — <cite>{!! $model->description_source !!}</cite>
        </footer>
    @endif
</blockquote>
