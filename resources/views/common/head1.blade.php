@if ($model->ogp !== null || !empty($model->description))
    @include('common.ogp')

    @if ($model->ogp !== null && $model->use_ogp_description == 1)
        @include('common.ogp_description')
    @else
        @include('common.description')
    @endif
@endif
