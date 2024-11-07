@if ($model->ogp)
    <img src="{{ $model->ogp->image }}" alt="{{ $model->name }}" class="img-thumbnail" style="max-height: 200px;">
    <p>
        {{ $model->ogp->description }}
    </p>
    <p>
        <a href="{{ $model->ogp->url }}" target="_blank">{{ $model->ogp->title }}</a>
    </p>
@endif
