@if ($model->ogp !== null || !empty($model->description))
    <div class="header-node-content header-fade-mask">
        @include('common.ogp')

        @if ($model->ogp !== null && $model->use_ogp_description == 1)
            @include('common.ogp_description')
        @else
            @include('common.description')
        @endif
    </div>
@endif
