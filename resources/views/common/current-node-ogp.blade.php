
@if ($model->ogp !== null)
    @if (!empty($model->ogp->image))
    <div class="ogp-img-container">
        <div class="ogp-img">
            <a href="{{ $model->ogp->url }}" target="_blank" class="external-link">
                <img src="{{ $model->ogp->image }}" width="{{ $model->ogp->image_width }}" height="{{ $model->ogp->image_height }}" alt="{{ $model->name }}" class="ogp-img">
            </a>
        </div>
        @if ($model->use_ogp_description == 0 || empty($model->ogp->description))
        <footer>
            — <cite><a href="{{ $model->ogp->url }}" target="_blank" class="external-link">{{ $model->ogp->title ?? $model->ogp->url }}</a></cite>
        </footer>
        @endif
    </div>
    @endif

    @if ($model->use_ogp_description == 1 && !empty($model->ogp->description))
    <blockquote class="description">
        {!! nl2br(e($model->ogp->description)) !!}
        <footer>
            — <cite><a href="{{ $model->ogp->url }}" target="_blank" class="external-link">{{ $model->ogp->title ?? $model->ogp->url }}</a></cite>
        </footer>
    </blockquote>
    @elseif (!empty($model->description))
    <blockquote class="description">
        {!! nl2br($model->description); !!}
        @if ($model->description_source !== null)
            <footer>
                — <cite>{!! $model->description_source !!}</cite>
            </footer>
        @endif
    </blockquote>
    @endif
@elseif (!empty($model->description))
<blockquote class="description">
    {!! nl2br($model->description); !!}
    @if ($model->description_source !== null)
        <footer>
            — <cite>{!! $model->description_source !!}</cite>
        </footer>
    @endif
</blockquote>
@endif
