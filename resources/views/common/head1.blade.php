<section>
    <div class="node h1">
        <h1 class="head1 fade">{!! $model->h1_node_name !!}</h1>
    </div>

    @if ($model->ogp !== null || !empty($model->description))
        <div class="node">
            <div class="text-node fade">
                @include('common.ogp')

                @if ($model->ogp !== null && $model->use_ogp_description == 1)
                    @include('common.ogp_description')
                @else
                    @include('common.description')
                @endif
            </div>
        </div>
    @endif
</section>
