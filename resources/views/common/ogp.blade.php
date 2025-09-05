@if ($model->ogp !== null && !empty($model->ogp->image))
    <div class="ogp-info">
        <div style="display:flex;justify-content: center;align-items: center;">
            <a href="{{ $model->ogp->url }}" target="_blank" class="external-link">
                <img src="{{ $model->ogp->image }}" alt="{{ $model->name }}">
            </a>
        </div>

        @if ($model->use_ogp_description == 0)
            <blockquote>
                @if (!empty($model->ogp->description))
                    {!! nl2br(e($model->ogp->description)) !!}
                @endif
                <footer>
                    — <cite><a href="{{ $model->ogp->url }}" target="_blank" class="external-link">{{ $model->ogp->title ?? $model->ogp->url }}</a>(OGP)</cite>
                </footer>
            </blockquote>
        @endif
    </div>
@endif
