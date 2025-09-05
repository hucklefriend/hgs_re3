<blockquote class="description">
    {!! nl2br(e($model->ogp->description)); !!}
    <footer>
        — <cite><a href="{{ $model->ogp->url }}" target="_blank" class="external-link">{{ $model->ogp->title ?? $model->ogp->url }}</a>(OGP)</cite>
    </footer>
</blockquote>
