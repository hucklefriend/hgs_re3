<blockquote class="description">
    {!! nl2br(e($model->ogp->description)); !!}
    <footer>
        — <cite><a href="{{ $model->ogp->url }}" target="_blank">{{ $model->ogp->title ?? $model->ogp->url }}</a>(OGP)</cite>
    </footer>
</blockquote>
